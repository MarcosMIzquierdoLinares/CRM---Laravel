<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Grade;
use App\Models\School;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('admin');
        $schoolId = $user->school_id;

        if (!$isAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Solo los administradores pueden consultar las estadísticas globales.',
            ], 403);
        }

        $userQuery = User::query();
        $courseQuery = Course::query();
        $subjectQuery = Subject::query();
        $gradeQuery = Grade::query();

        $roleCounts = collect(['admin', 'coordinator', 'teacher', 'student'])
            ->mapWithKeys(function ($role) use ($userQuery) {
                return [
                    $role => (clone $userQuery)->whereHas('roles', fn ($q) => $q->where('name', $role))->count()
                ];
            });

        $courseStatus = Course::select('status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $avgGrade = (clone $gradeQuery)->avg('grade');

        $schoolStats = School::withCount(['users', 'courses', 'subjects'])->get();

        $schools = $schoolStats->map(function (School $school) {
            return [
                'id' => $school->id,
                'name' => $school->name,
                'full_name' => $school->full_name,
                'users' => $school->users_count,
                'courses' => $school->courses_count,
                'subjects' => $school->subjects_count,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'totals' => [
                    'users' => $userQuery->count(),
                    'courses' => $courseQuery->count(),
                    'subjects' => $subjectQuery->count(),
                    'grades' => $gradeQuery->count(),
                    'avg_grade' => round($avgGrade, 2),
                ],
                'roles' => $roleCounts,
                'courses' => [
                    'active' => $courseStatus->get('active', 0),
                    'inactive' => $courseStatus->get('inactive', 0),
                    'completed' => $courseStatus->get('completed', 0),
                ],
                'schools' => $schools,
                'generated_at' => now()->toDateTimeString(),
            ],
        ]);
    }
}

