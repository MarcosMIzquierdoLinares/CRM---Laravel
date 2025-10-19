<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Subject;
use App\Models\Grade;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        $schoolId = $user->school_id;

        // Base queries filtradas por colegio si no es admin
        $userQuery = User::query();
        $courseQuery = Course::query();
        $subjectQuery = Subject::query();
        $gradeQuery = Grade::query();

        if (!$user->hasRole('admin')) {
            $userQuery->where('school_id', $schoolId);
            $courseQuery->where('school_id', $schoolId);
            $subjectQuery->where('school_id', $schoolId);
            $gradeQuery->where('school_id', $schoolId);
        }

        // Stats básicas
        $totalUsers = $userQuery->count();
        $totalCourses = $courseQuery->count();
        $totalSubjects = $subjectQuery->count();
        $totalGrades = $gradeQuery->count();

        // Stats específicas por rol
        $stats = [
            'totalUsers' => $totalUsers,
            'totalCourses' => $totalCourses,
            'totalSubjects' => $totalSubjects,
            'totalGrades' => $totalGrades,
        ];

        // Para profesores - mostrar solo sus asignaturas y calificaciones
        if ($user->hasRole('teacher')) {
            $mySubjects = Subject::where('teacher_id', $user->id)->count();
            $myGrades = Grade::whereHas('subject', function ($q) use ($user) {
                $q->where('teacher_id', $user->id);
            })->count();
            
            $stats = [
                'totalUsers' => $userQuery->whereHas('roles', function ($q) {
                    $q->where('name', 'student');
                })->count(), // Solo estudiantes de su colegio
                'totalCourses' => Course::whereHas('subjects', function ($q) use ($user) {
                    $q->where('teacher_id', $user->id);
                })->distinct()->count(),
                'totalSubjects' => $mySubjects,
                'totalGrades' => $myGrades,
            ];
        }

        // Para estudiantes - mostrar solo sus datos
        if ($user->hasRole('student')) {
            $myGrades = Grade::where('user_id', $user->id)->count();
            $myCourses = $user->enrollments()->count();
            
            $stats = [
                'totalUsers' => 1, // Solo él mismo
                'totalCourses' => $myCourses,
                'totalSubjects' => $user->enrollments()->with('course.subjects')->get()
                    ->pluck('course.subjects')->flatten()->unique('id')->count(),
                'totalGrades' => $myGrades,
            ];
        }

        // Para coordinadores - mostrar datos de su colegio pero limitados
        if ($user->hasRole('coordinator')) {
            $coordCourses = Course::where('coord_id', $user->id)->count();
            $coordStudents = $userQuery->whereHas('enrollments.course', function ($q) use ($user) {
                $q->where('coord_id', $user->id);
            })->count();
            
            $stats = [
                'totalUsers' => $coordStudents,
                'totalCourses' => $coordCourses,
                'totalSubjects' => Subject::whereHas('course', function ($q) use ($user) {
                    $q->where('coord_id', $user->id);
                })->count(),
                'totalGrades' => Grade::whereHas('subject.course', function ($q) use ($user) {
                    $q->where('coord_id', $user->id);
                })->count(),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
