<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\School;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $schools = School::all();

        foreach ($schools as $school) {
            // Crear un admin por colegio
            $admin = User::create([
                'name' => 'Admin',
                'surname' => $school->name,
                'name_user' => 'admin_' . strtolower(str_replace(' ', '', $school->name)),
                'email' => 'admin@' . strtolower(str_replace(' ', '', $school->name)) . '.edu',
                'phone' => $school->phone,
                'password' => Hash::make('password123'),
                'school_id' => $school->id,
                'photo' => 'default-avatar.jpg',
            ]);
            $admin->assignRole('admin');

            // Crear coordinadores
            $coordinators = User::factory(2)->create([
                'school_id' => $school->id,
                'password' => Hash::make('password123'),
            ]);
            foreach ($coordinators as $coordinator) {
                $coordinator->assignRole('coordinator');
            }

            // Crear profesores
            $teachers = User::factory(8)->create([
                'school_id' => $school->id,
                'password' => Hash::make('password123'),
            ]);
            foreach ($teachers as $teacher) {
                $teacher->assignRole('teacher');
            }

            // Crear estudiantes
            $students = User::factory(30)->create([
                'school_id' => $school->id,
                'password' => Hash::make('password123'),
            ]);
            foreach ($students as $student) {
                $student->assignRole('student');
            }
        }

        // Crear usuarios específicos para testing con emails fijos
        $firstSchool = School::first();
        
        if ($firstSchool) {
            // Usuario coordinador para testing
            $coordinator = User::firstOrCreate(
                ['email' => 'coordinador@test.com'],
                [
                    'name' => 'Coordinador',
                    'surname' => 'Test',
                    'name_user' => 'coord_test',
                    'email' => 'coordinador@test.com',
                    'phone' => '+34 93 234 56 78',
                    'password' => Hash::make('password123'),
                    'school_id' => $firstSchool->id,
                    'photo' => 'default-avatar.jpg',
                ]
            );
            $coordinator->assignRole('coordinator');

            // Usuario profesor para testing
            $teacher = User::firstOrCreate(
                ['email' => 'profesor@test.com'],
                [
                    'name' => 'Profesor',
                    'surname' => 'Test',
                    'name_user' => 'teacher_test',
                    'email' => 'profesor@test.com',
                    'phone' => '+34 95 345 67 89',
                    'password' => Hash::make('password123'),
                    'school_id' => $firstSchool->id,
                    'photo' => 'default-avatar.jpg',
                ]
            );
            $teacher->assignRole('teacher');

            // Usuario estudiante para testing
            $student = User::firstOrCreate(
                ['email' => 'estudiante@test.com'],
                [
                    'name' => 'Estudiante',
                    'surname' => 'Test',
                    'name_user' => 'student_test',
                    'email' => 'estudiante@test.com',
                    'phone' => '+34 600 000 000',
                    'password' => Hash::make('password123'),
                    'school_id' => $firstSchool->id,
                    'photo' => 'default-avatar.jpg',
                ]
            );
            $student->assignRole('student');
        }
    }
}