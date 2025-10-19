<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Permisos para Users
        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);

        // Permisos para Schools
        Permission::create(['name' => 'view schools']);
        Permission::create(['name' => 'create schools']);
        Permission::create(['name' => 'edit schools']);
        Permission::create(['name' => 'delete schools']);

        // Permisos para Courses
        Permission::create(['name' => 'view courses']);
        Permission::create(['name' => 'create courses']);
        Permission::create(['name' => 'edit courses']);
        Permission::create(['name' => 'delete courses']);
        Permission::create(['name' => 'enroll students']);

        // Permisos para Subjects
        Permission::create(['name' => 'view subjects']);
        Permission::create(['name' => 'create subjects']);
        Permission::create(['name' => 'edit subjects']);
        Permission::create(['name' => 'delete subjects']);
        Permission::create(['name' => 'assign teacher']);

        // Permisos para Grades
        Permission::create(['name' => 'view grades']);
        Permission::create(['name' => 'create grades']);
        Permission::create(['name' => 'edit grades']);
        Permission::create(['name' => 'delete grades']);
        Permission::create(['name' => 'view own grades']);

        // Permisos para Enrollments
        Permission::create(['name' => 'view enrollments']);
        Permission::create(['name' => 'create enrollments']);
        Permission::create(['name' => 'edit enrollments']);
        Permission::create(['name' => 'delete enrollments']);

        // Permisos para Reportes
        Permission::create(['name' => 'create reports']);
        Permission::create(['name' => 'view reports']);

        // Permisos administrativos
        Permission::create(['name' => 'manage roles']);
        Permission::create(['name' => 'manage permissions']);
        Permission::create(['name' => 'view dashboard']);
        Permission::create(['name' => 'export data']);
    }
}
