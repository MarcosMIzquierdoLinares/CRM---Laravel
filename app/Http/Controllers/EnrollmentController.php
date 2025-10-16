<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Enrollment::with(['user', 'course', 'school']);

        // Si no es admin, solo mostrar matrículas del mismo colegio
        if (!$request->user()->hasRole('admin')) {
            $query->where('school_id', $request->user()->school_id);
        }

        // Filtros
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->orderBy('enrollment_date', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $enrollments
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'school_id' => 'required|exists:schools,id',
            'academic_year' => 'required|string|max:255',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:active,inactive,transferred,graduated',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Si no es admin, solo puede crear matrículas en su colegio
        if (!$request->user()->hasRole('admin') && $request->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para crear matrículas en otros colegios'
            ], 403);
        }

        // Verificar que el usuario sea un estudiante
        $user = User::find($request->user_id);
        if (!$user->hasRole('student')) {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden matricular estudiantes'
            ], 422);
        }

        // Verificar que el usuario y el curso pertenezcan al mismo colegio
        $course = Course::find($request->course_id);
        if ($user->school_id !== $course->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'El estudiante y el curso deben pertenecer al mismo colegio'
            ], 422);
        }

        $enrollment = Enrollment::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Matrícula creada exitosamente',
            'data' => $enrollment->load(['user', 'course', 'school'])
        ], 201);
    }

    public function show(Enrollment $enrollment)
    {
        // Si no es admin, solo puede ver matrículas de su colegio
        if (!request()->user()->hasRole('admin') && $enrollment->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver esta matrícula'
            ], 403);
        }

        $enrollment->load(['user', 'course', 'school']);

        return response()->json([
            'success' => true,
            'data' => $enrollment
        ]);
    }

    public function update(Request $request, Enrollment $enrollment)
    {
        // Si no es admin, solo puede editar matrículas de su colegio
        if (!$request->user()->hasRole('admin') && $enrollment->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para editar esta matrícula'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'school_id' => 'required|exists:schools,id',
            'academic_year' => 'required|string|max:255',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:active,inactive,transferred,graduated',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        $enrollment->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Matrícula actualizada exitosamente',
            'data' => $enrollment->load(['user', 'course', 'school'])
        ]);
    }

    public function destroy(Enrollment $enrollment)
    {
        // Si no es admin, solo puede eliminar matrículas de su colegio
        if (!request()->user()->hasRole('admin') && $enrollment->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar esta matrícula'
            ], 403);
        }

        $enrollment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Matrícula eliminada exitosamente'
        ]);
    }

    public function enrollStudent(Request $request, Course $course)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'academic_year' => 'required|string|max:255',
            'enrollment_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar que el usuario sea un estudiante
        $user = User::find($request->user_id);
        if (!$user->hasRole('student')) {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden matricular estudiantes'
            ], 422);
        }

        // Verificar que el usuario y el curso pertenezcan al mismo colegio
        if ($user->school_id !== $course->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'El estudiante y el curso deben pertenecer al mismo colegio'
            ], 422);
        }

        // Verificar que no esté ya matriculado
        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('academic_year', $request->academic_year)
            ->first();

        if ($existingEnrollment) {
            return response()->json([
                'success' => false,
                'message' => 'El estudiante ya está matriculado en este curso para este año académico'
            ], 422);
        }

        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'school_id' => $course->school_id,
            'academic_year' => $request->academic_year,
            'enrollment_date' => $request->enrollment_date,
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Estudiante matriculado exitosamente',
            'data' => $enrollment->load(['user', 'course'])
        ], 201);
    }

    public function unenrollStudent(Course $course, User $user)
    {
        // Verificar que existe la matrícula
        $enrollment = Enrollment::where('course_id', $course->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'El estudiante no está matriculado en este curso'
            ], 404);
        }

        $enrollment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Estudiante desmatriculado exitosamente'
        ]);
    }

    public function getCourseEnrollments(Course $course)
    {
        // Si no es admin, solo puede ver matrículas de su colegio
        if (!request()->user()->hasRole('admin') && $course->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver las matrículas de este curso'
            ], 403);
        }

        $enrollments = Enrollment::where('course_id', $course->id)
            ->with(['user'])
            ->orderBy('enrollment_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $enrollments
        ]);
    }

    public function getStudentEnrollments(User $user)
    {
        // Si no es admin, solo puede ver matrículas de su colegio
        if (!request()->user()->hasRole('admin') && $user->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver las matrículas de este estudiante'
            ], 403);
        }

        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course'])
            ->orderBy('enrollment_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $enrollments
        ]);
    }

    public function getMyCourses(Request $request)
    {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->with(['course'])
            ->where('status', 'active')
            ->orderBy('enrollment_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $enrollments
        ]);
    }
}