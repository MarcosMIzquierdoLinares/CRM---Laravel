<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rutas públicas
Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

// Rutas de la aplicación SPA
Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/users', function () {
    return Inertia::render('Users/Index');
})->name('users.index');

Route::get('/users/create', function () {
    return Inertia::render('Users/Create');
})->name('users.create');

Route::get('/users/{user}/edit', function () {
    return Inertia::render('Users/Edit');
})->name('users.edit');

Route::get('/courses', function () {
    return Inertia::render('Courses/Index');
})->name('courses.index');

Route::get('/courses/create', function () {
    return Inertia::render('Courses/Create');
})->name('courses.create');

Route::get('/courses/{course}/edit', function () {
    return Inertia::render('Courses/Edit');
})->name('courses.edit');

Route::get('/subjects', function () {
    return Inertia::render('Subjects/Index');
})->name('subjects.index');

Route::get('/subjects/create', function () {
    return Inertia::render('Subjects/Create');
})->name('subjects.create');

Route::get('/subjects/{subject}/edit', function () {
    return Inertia::render('Subjects/Edit');
})->name('subjects.edit');

Route::get('/statistics', function () {
    return Inertia::render('Statistics');
})->name('statistics');

Route::get('/grades', function () {
    return Inertia::render('Grades/Index');
})->name('grades.index');

Route::get('/grades/create', function () {
    return Inertia::render('Grades/Create');
})->name('grades.create');

Route::get('/grades/{grade}/edit', function () {
    return Inertia::render('Grades/Edit');
})->name('grades.edit');

Route::get('/schools', function () {
    return Inertia::render('Schools/Index');
})->name('schools.index');

Route::get('/reports', function () {
    return Inertia::render('Reports/Index');
})->name('reports.index');

Route::get('/reports/create', function () {
    return Inertia::render('Reports/Create');
})->name('reports.create');

// Catch-all route para SPA
Route::get('/{any}', function () {
    return Inertia::render('Auth/Login');
})->where('any', '.*');
