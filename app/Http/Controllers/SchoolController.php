<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $query = School::query();

        // Filtros
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('has_primary')) {
            $query->where('has_primary', $request->has_primary);
        }

        if ($request->has('has_eso')) {
            $query->where('has_eso', $request->has_eso);
        }

        if ($request->has('has_bachillerato')) {
            $query->where('has_bachillerato', $request->has_bachillerato);
        }

        if ($request->has('has_fp')) {
            $query->where('has_fp', $request->has_fp);
        }

        $schools = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $schools
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:schools,email',
            'logo' => 'nullable|string',
            'has_primary' => 'boolean',
            'has_eso' => 'boolean',
            'has_bachillerato' => 'boolean',
            'has_fp' => 'boolean',
            'max_students' => 'nullable|integer|min:0',
            'website' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        $school = School::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Colegio creado exitosamente',
            'data' => $school
        ], 201);
    }

    public function show(School $school)
    {
        $school->load(['users', 'courses', 'subjects']);

        return response()->json([
            'success' => true,
            'data' => $school
        ]);
    }

    public function update(Request $request, School $school)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:schools,email,' . $school->id,
            'logo' => 'nullable|string',
            'has_primary' => 'boolean',
            'has_eso' => 'boolean',
            'has_bachillerato' => 'boolean',
            'has_fp' => 'boolean',
            'max_students' => 'nullable|integer|min:0',
            'website' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        $school->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Colegio actualizado exitosamente',
            'data' => $school
        ]);
    }

    public function destroy(School $school)
    {
        // Verificar si tiene usuarios asociados
        if ($school->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el colegio porque tiene usuarios asociados'
            ], 422);
        }

        $school->delete();

        return response()->json([
            'success' => true,
            'message' => 'Colegio eliminado exitosamente'
        ]);
    }
}