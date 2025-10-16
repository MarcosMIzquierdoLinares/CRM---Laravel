<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Crear roles
        $admin = Role::create(['name' => 'admin']);
        $coordinator = Role::create(['name' => 'coordinator']);
        $teacher = Role::create(['name' => 'teacher']);
        $student = Role::create(['name' => 'student']);

        // Asignar permisos al rol ADMIN (todos los permisos)
        $admin->givePermissionTo(Permission::all());

        // Asignar permisos al rol COORDINATOR
        $coordinator->givePermissionTo([
            'view users',
            'create users',
            'edit users',
            'view courses',
            'create courses',
            'edit courses',
            'delete courses',
            'enroll students',
            'view subjects',
            'create subjects',
            'edit subjects',
            'delete subjects',
            'assign teacher',
            'view grades',
            'view enrollments',
            'create enrollments',
            'edit enrollments',
            'delete enrollments',
            'view dashboard',
        ]);

        // Asignar permisos al rol TEACHER
        $teacher->givePermissionTo([
            'view users',
            'view courses',
            'view subjects',
            'view grades',
            'create grades',
            'edit grades',
            'view enrollments',
            'view dashboard',
        ]);

        // Asignar permisos al rol STUDENT
        $student->givePermissionTo([
            'view own grades',
            'view dashboard',
        ]);
    }
}
