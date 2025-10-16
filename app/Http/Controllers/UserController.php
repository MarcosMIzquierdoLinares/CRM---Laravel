<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['school', 'roles']);

        // Si no es admin, solo mostrar usuarios del mismo colegio
        if (!$request->user()->hasRole('admin')) {
            $query->where('school_id', $request->user()->school_id);
        }

        // Filtros
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('surname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('name_user', 'like', "%{$search}%");
            });
        }

        if ($request->has('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        $users = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'name_user' => 'required|string|max:255|unique:users,name_user',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'school_id' => 'required|exists:schools,id',
            'role' => 'required|in:admin,coordinator,teacher,student',
            'photo' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Si no es admin, solo puede crear usuarios en su colegio
        if (!$request->user()->hasRole('admin') && $request->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para crear usuarios en otros colegios'
            ], 403);
        }

        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'name_user' => $request->name_user,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'school_id' => $request->school_id,
            'photo' => $request->photo ?? 'default-avatar.jpg',
        ]);

        // Asignar rol
        $user->assignRole($request->role);

        $user->load(['school', 'roles']);

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data' => $user
        ], 201);
    }

    public function show(User $user)
    {
        // Si no es admin, solo puede ver usuarios de su colegio
        if (!request()->user()->hasRole('admin') && $user->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver este usuario'
            ], 403);
        }

        $user->load(['school', 'roles', 'enrollments.course', 'subjectsAsTeacher']);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Si no es admin, solo puede editar usuarios de su colegio
        if (!$request->user()->hasRole('admin') && $user->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para editar este usuario'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'name_user' => 'required|string|max:255|unique:users,name_user,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'school_id' => 'required|exists:schools,id',
            'role' => 'required|in:admin,coordinator,teacher,student',
            'photo' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = [
            'name' => $request->name,
            'surname' => $request->surname,
            'name_user' => $request->name_user,
            'email' => $request->email,
            'phone' => $request->phone,
            'school_id' => $request->school_id,
            'photo' => $request->photo ?? $user->photo,
        ];

        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        // Actualizar rol si es diferente
        if ($request->role && !$user->hasRole($request->role)) {
            $user->syncRoles([$request->role]);
        }

        $user->load(['school', 'roles']);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data' => $user
        ]);
    }

    public function destroy(User $user)
    {
        // Si no es admin, solo puede eliminar usuarios de su colegio
        if (!request()->user()->hasRole('admin') && $user->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este usuario'
            ], 403);
        }

        // No permitir eliminar el propio usuario
        if ($user->id === request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminar tu propia cuenta'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }
}