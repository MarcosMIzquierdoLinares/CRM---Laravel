<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rutas públicas
Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

// Rutas de la aplicación SPA
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/users', function () {
    return Inertia::render('Users/Index');
})->name('users.index');

Route::get('/courses', function () {
    return Inertia::render('Courses/Index');
})->name('courses.index');

Route::get('/subjects', function () {
    return Inertia::render('Subjects/Index');
})->name('subjects.index');

Route::get('/grades', function () {
    return Inertia::render('Grades/Index');
})->name('grades.index');

Route::get('/schools', function () {
    return Inertia::render('Schools/Index');
})->name('schools.index');

// Catch-all route para SPA
Route::get('/{any}', function () {
    return Inertia::render('Auth/Login');
})->where('any', '.*');
