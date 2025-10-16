<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::with(['school', 'course', 'teacher']);

        // Si no es admin, solo mostrar asignaturas del mismo colegio
        if (!$request->user()->hasRole('admin')) {
            $query->where('school_id', $request->user()->school_id);
        }

        // Filtros
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $subjects = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $subjects
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'required|exists:users,id',
            'school_id' => 'required|exists:schools,id',
            'hours_per_week' => 'required|integer|min:0|max:40',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Si no es admin, solo puede crear asignaturas en su colegio
        if (!$request->user()->hasRole('admin') && $request->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para crear asignaturas en otros colegios'
            ], 403);
        }

        $subject = Subject::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Asignatura creada exitosamente',
            'data' => $subject->load(['school', 'course', 'teacher'])
        ], 201);
    }

    public function show(Subject $subject)
    {
        // Si no es admin, solo puede ver asignaturas de su colegio
        if (!request()->user()->hasRole('admin') && $subject->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver esta asignatura'
            ], 403);
        }

        $subject->load(['school', 'course', 'teacher', 'grades.user']);

        return response()->json([
            'success' => true,
            'data' => $subject
        ]);
    }

    public function update(Request $request, Subject $subject)
    {
        // Si no es admin, solo puede editar asignaturas de su colegio
        if (!$request->user()->hasRole('admin') && $subject->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para editar esta asignatura'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'required|exists:users,id',
            'school_id' => 'required|exists:schools,id',
            'hours_per_week' => 'required|integer|min:0|max:40',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        $subject->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Asignatura actualizada exitosamente',
            'data' => $subject->load(['school', 'course', 'teacher'])
        ]);
    }

    public function destroy(Subject $subject)
    {
        // Si no es admin, solo puede eliminar asignaturas de su colegio
        if (!request()->user()->hasRole('admin') && $subject->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar esta asignatura'
            ], 403);
        }

        // Verificar si tiene calificaciones
        if ($subject->grades()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar la asignatura porque tiene calificaciones registradas'
            ], 422);
        }

        $subject->delete();

        return response()->json([
            'success' => true,
            'message' => 'Asignatura eliminada exitosamente'
        ]);
    }

    public function assignTeacher(Request $request, Subject $subject)
    {
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar que el profesor tenga el rol correcto
        $teacher = User::find($request->teacher_id);
        if (!$teacher->hasRole('teacher')) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario seleccionado no es un profesor'
            ], 422);
        }

        $subject->update(['teacher_id' => $request->teacher_id]);

        return response()->json([
            'success' => true,
            'message' => 'Profesor asignado exitosamente',
            'data' => $subject->load(['teacher'])
        ]);
    }
}