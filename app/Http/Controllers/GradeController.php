<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\User;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $query = Grade::with(['user', 'subject', 'school']);

        // Si no es admin, solo mostrar calificaciones del mismo colegio
        if (!$request->user()->hasRole('admin')) {
            $query->where('school_id', $request->user()->school_id);
        }

        // Si es profesor, solo mostrar calificaciones de sus asignaturas
        if ($request->user()->hasRole('teacher')) {
            $subjectIds = $request->user()->subjectsAsTeacher()->pluck('id');
            $query->whereIn('subject_id', $subjectIds);
        }

        // Si es estudiante, solo mostrar sus propias calificaciones
        if ($request->user()->hasRole('student')) {
            $query->where('user_id', $request->user()->id);
        }

        // Filtros
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('evaluation')) {
            $query->where('evaluation', $request->evaluation);
        }

        if ($request->has('academic_year')) {
            $query->whereHas('subject.course', function ($q) use ($request) {
                $q->where('academic_year', $request->academic_year);
            });
        }

        $grades = $query->orderBy('grade_date', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $grades
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'school_id' => 'required|exists:schools,id',
            'evaluation' => 'required|integer|in:1,2,3',
            'grade' => 'required|numeric|min:0|max:10',
            'comments' => 'nullable|string',
            'grade_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Si no es admin, solo puede crear calificaciones en su colegio
        if (!$request->user()->hasRole('admin') && $request->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para crear calificaciones en otros colegios'
            ], 403);
        }

        // Si es profesor, verificar que la asignatura sea suya
        if ($request->user()->hasRole('teacher')) {
            $subject = Subject::find($request->subject_id);
            if ($subject->teacher_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para calificar esta asignatura'
                ], 403);
            }
        }

        $grade = Grade::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Calificación creada exitosamente',
            'data' => $grade->load(['user', 'subject', 'school'])
        ], 201);
    }

    public function show(Grade $grade)
    {
        // Si no es admin, solo puede ver calificaciones de su colegio
        if (!request()->user()->hasRole('admin') && $grade->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver esta calificación'
            ], 403);
        }

        // Si es estudiante, solo puede ver sus propias calificaciones
        if (request()->user()->hasRole('student') && $grade->user_id !== request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver esta calificación'
            ], 403);
        }

        $grade->load(['user', 'subject.course', 'school']);

        return response()->json([
            'success' => true,
            'data' => $grade
        ]);
    }

    public function update(Request $request, Grade $grade)
    {
        // Si no es admin, solo puede editar calificaciones de su colegio
        if (!$request->user()->hasRole('admin') && $grade->school_id !== $request->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para editar esta calificación'
            ], 403);
        }

        // Si es profesor, verificar que la asignatura sea suya
        if ($request->user()->hasRole('teacher')) {
            $subject = Subject::find($grade->subject_id);
            if ($subject->teacher_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para editar esta calificación'
                ], 403);
            }
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'school_id' => 'required|exists:schools,id',
            'evaluation' => 'required|integer|in:1,2,3',
            'grade' => 'required|numeric|min:0|max:10',
            'comments' => 'nullable|string',
            'grade_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        $grade->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Calificación actualizada exitosamente',
            'data' => $grade->load(['user', 'subject', 'school'])
        ]);
    }

    public function destroy(Grade $grade)
    {
        // Si no es admin, solo puede eliminar calificaciones de su colegio
        if (!request()->user()->hasRole('admin') && $grade->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar esta calificación'
            ], 403);
        }

        // Si es profesor, verificar que la asignatura sea suya
        if (request()->user()->hasRole('teacher')) {
            $subject = Subject::find($grade->subject_id);
            if ($subject->teacher_id !== request()->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para eliminar esta calificación'
                ], 403);
            }
        }

        $grade->delete();

        return response()->json([
            'success' => true,
            'message' => 'Calificación eliminada exitosamente'
        ]);
    }

    public function getStudentGrades(User $user)
    {
        // Si no es admin, solo puede ver calificaciones de su colegio
        if (!request()->user()->hasRole('admin') && $user->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver las calificaciones de este estudiante'
            ], 403);
        }

        $grades = Grade::where('user_id', $user->id)
            ->with(['subject.course'])
            ->orderBy('evaluation')
            ->orderBy('subject_id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $grades
        ]);
    }

    public function getSubjectGrades(Subject $subject)
    {
        // Si no es admin, solo puede ver calificaciones de su colegio
        if (!request()->user()->hasRole('admin') && $subject->school_id !== request()->user()->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver las calificaciones de esta asignatura'
            ], 403);
        }

        // Si es profesor, verificar que la asignatura sea suya
        if (request()->user()->hasRole('teacher') && $subject->teacher_id !== request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver las calificaciones de esta asignatura'
            ], 403);
        }

        $grades = Grade::where('subject_id', $subject->id)
            ->with(['user'])
            ->orderBy('evaluation')
            ->orderBy('user_id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $grades
        ]);
    }

    public function getMyGrades(Request $request)
    {
        $grades = Grade::where('user_id', $request->user()->id)
            ->with(['subject.course'])
            ->orderBy('evaluation')
            ->orderBy('subject_id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $grades
        ]);
    }
}