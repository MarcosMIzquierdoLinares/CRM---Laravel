<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\EnrollmentController;

// Rutas públicas de autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas protegidas con JWT
Route::middleware(['jwt.auth'])->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // Rutas de Schools (solo admin)
    Route::middleware(['permission:view schools'])->group(function () {
        Route::apiResource('schools', SchoolController::class);
    });

    // Rutas de Users
    Route::middleware(['permission:view users'])->group(function () {
        Route::apiResource('users', UserController::class);
    });

    // Rutas de Courses
    Route::middleware(['permission:view courses'])->group(function () {
        Route::apiResource('courses', CourseController::class);
        Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'enrollStudent']);
        Route::delete('/courses/{course}/unenroll/{user}', [EnrollmentController::class, 'unenrollStudent']);
    });

    // Rutas de Subjects
    Route::middleware(['permission:view subjects'])->group(function () {
        Route::apiResource('subjects', SubjectController::class);
        Route::post('/subjects/{subject}/assign-teacher', [SubjectController::class, 'assignTeacher']);
    });

    // Rutas de Grades
    Route::middleware(['permission:view grades'])->group(function () {
        Route::apiResource('grades', GradeController::class);
        Route::get('/grades/student/{user}', [GradeController::class, 'getStudentGrades']);
        Route::get('/grades/subject/{subject}', [GradeController::class, 'getSubjectGrades']);
    });

    // Rutas de Enrollments
    Route::middleware(['permission:view enrollments'])->group(function () {
        Route::apiResource('enrollments', EnrollmentController::class);
        Route::get('/enrollments/course/{course}', [EnrollmentController::class, 'getCourseEnrollments']);
        Route::get('/enrollments/student/{user}', [EnrollmentController::class, 'getStudentEnrollments']);
    });

    // Rutas especiales para estudiantes (solo sus propios datos)
    Route::middleware(['permission:view own grades'])->group(function () {
        Route::get('/my-grades', [GradeController::class, 'getMyGrades']);
        Route::get('/my-courses', [EnrollmentController::class, 'getMyCourses']);
    });
});
