<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Report::with(['teacher:id,name,surname', 'coordinator:id,name,surname', 'school:id,name'])
            ->orderBy('date', 'desc');

        if ($user->hasRole('teacher')) {
            $query->where('teacher_id', $user->id);
        } elseif ($user->hasRole('coordinator')) {
            $query->where('school_id', $user->school_id);
        } elseif (!$user->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para consultar los reportes.',
            ], 403);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->to);
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['teacher', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Solo los profesores o administradores pueden crear reportes.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'class_progress' => 'required|string',
            'student_participation' => 'nullable|string',
            'incidents' => 'nullable|string',
            'next_activities' => 'nullable|string',
            'date' => 'required|date',
            'priority' => 'required|in:low,normal,high,urgent',
            'teacher_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $teacherId = $user->hasRole('teacher') ? $user->id : ($request->teacher_id ?? $user->id);

        $report = Report::create([
            'teacher_id' => $teacherId,
            'coordinator_id' => $request->coordinator_id,
            'school_id' => $user->school_id,
            'title' => $request->title,
            'class_progress' => $request->class_progress,
            'student_participation' => $request->student_participation,
            'incidents' => $request->incidents,
            'next_activities' => $request->next_activities,
            'date' => $request->date,
            'priority' => $request->priority,
            'status' => 'unread',
        ]);

        $this->notifyCoordinators($report);

        return response()->json([
            'success' => true,
            'message' => 'Reporte creado correctamente.',
            'data' => $report->load(['teacher', 'coordinator', 'school']),
        ], 201);
    }

    public function show(Report $report, Request $request)
    {
        $user = $request->user();

        if (
            !$user->hasRole('admin') &&
            $report->school_id !== $user->school_id &&
            $report->teacher_id !== $user->id
        ) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver este reporte.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $report->load(['teacher', 'coordinator', 'school']),
        ]);
    }

    public function markAsRead(Request $request, Report $report)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['admin', 'coordinator'])) {
            return response()->json([
                'success' => false,
                'message' => 'Solo coordinadores o administradores pueden marcar reportes como leídos.',
            ], 403);
        }

        if ($user->hasRole('coordinator') && $report->school_id !== $user->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes gestionar reportes de otro centro.',
            ], 403);
        }

        $report->update([
            'status' => 'read',
            'coordinator_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reporte marcado como leído.',
            'data' => $report->fresh(['teacher', 'coordinator', 'school']),
        ]);
    }

    public function destroy(Request $request, Report $report)
    {
        $user = $request->user();

        if (
            !$user->hasRole('admin') &&
            $report->teacher_id !== $user->id
        ) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminar este reporte.',
            ], 403);
        }

        $report->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reporte eliminado correctamente.',
        ]);
    }

    private function notifyCoordinators(Report $report): void
    {
        $coordinators = User::whereHas('roles', fn ($q) => $q->where('name', 'coordinator'))
            ->where('school_id', $report->school_id)
            ->get();

        foreach ($coordinators as $coordinator) {
            Notification::create([
                'user_id' => $coordinator->id,
                'type' => 'report',
                'title' => 'Nuevo reporte diario',
                'message' => "{$report->teacher->name} {$report->teacher->surname} ha enviado un reporte.",
                'data' => [
                    'report_id' => $report->id,
                    'priority' => $report->priority,
                ],
            ]);
        }
    }
}

