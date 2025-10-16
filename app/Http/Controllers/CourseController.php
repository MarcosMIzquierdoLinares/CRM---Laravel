<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with(['school', 'teacher', 'coordinator', 'subjects']);

        // Si no es admin, solo mostrar cursos del mismo colegio
        if (!$request->user()->hasRole('admin')) {
            $query->where('school_id', $request->user()->school_id);
        }

        // Filtros
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->has('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->has('coord_id')) {
            $query->where('coord_id', $request->coord_id);
        }

        $courses = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'academic_year' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'teacher_id' => 'required|exists:users,id',
            'coord_id' => 'required|exists:users,id',
            'school_id' => 'required|exists:schools,id',
            'status' => 'required|in:active,inactive,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Si no es admin, solo puede crear cursos en su colegio
        if (!$request->user()->hasRole('admin') && $request->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para crear cursos en otros colegios'
            ], 403);
        }

        $course = Course::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Curso creado exitosamente',
            'data' => $course->load(['school', 'teacher', 'coordinator'])
        ], 201);
    }

    public function show(Course $course)
    {
        // Si no es admin, solo puede ver cursos de su colegio
        if (!request()->user()->hasRole('admin') && $course->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver este curso'
            ], 403);
        }

        $course->load(['school', 'teacher', 'coordinator', 'subjects', 'enrollments.user', 'students']);

        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    public function update(Request $request, Course $course)
    {
        // Si no es admin, solo puede editar cursos de su colegio
        if (!$request->user()->hasRole('admin') && $course->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para editar este curso'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'academic_year' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'teacher_id' => 'required|exists:users,id',
            'coord_id' => 'required|exists:users,id',
            'school_id' => 'required|exists:schools,id',
            'status' => 'required|in:active,inactive,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        $course->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Curso actualizado exitosamente',
            'data' => $course->load(['school', 'teacher', 'coordinator'])
        ]);
    }

    public function destroy(Course $course)
    {
        // Si no es admin, solo puede eliminar cursos de su colegio
        if (!request()->user()->hasRole('admin') && $course->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este curso'
            ], 403);
        }

        // Verificar si tiene estudiantes matriculados
        if ($course->enrollments()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el curso porque tiene estudiantes matriculados'
            ], 422);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Curso eliminado exitosamente'
        ]);
    }
}