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
    }
}