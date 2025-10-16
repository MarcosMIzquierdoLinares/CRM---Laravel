<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use App\Models\School;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $schools = School::all();

        foreach ($schools as $school) {
            // Obtener coordinadores y profesores del colegio
            $coordinators = User::where('school_id', $school->id)
                ->whereHas('roles', function($query) {
                    $query->where('name', 'coordinator');
                })->get();

            $teachers = User::where('school_id', $school->id)
                ->whereHas('roles', function($query) {
                    $query->where('name', 'teacher');
                })->get();

            $academicYear = '2024-2025';
            $coursesData = [];

            // Crear cursos según el tipo de colegio
            if ($school->has_eso) {
                $esoCourses = [
                    '1º ESO A', '1º ESO B', '2º ESO A', '2º ESO B',
                    '3º ESO A', '3º ESO B', '4º ESO A', '4º ESO B'
                ];

                foreach ($esoCourses as $index => $courseName) {
                    $coursesData[] = [
                        'name' => $courseName,
                        'description' => "Curso de {$courseName} - {$school->name}",
                        'location' => $school->name . ' - Aula ' . ($index + 1),
                        'academic_year' => $academicYear,
                        'start_date' => '2024-09-15',
                        'end_date' => '2025-06-20',
                        'teacher_id' => $teachers->random()->id,
                        'coord_id' => $coordinators->random()->id,
                        'school_id' => $school->id,
                        'status' => 'active',
                    ];
                }
            }

            if ($school->has_bachillerato) {
                $bachCourses = [
                    '1º Bachillerato A - Ciencias',
                    '1º Bachillerato B - Humanidades',
                    '2º Bachillerato A - Ciencias',
                    '2º Bachillerato B - Humanidades'
                ];

                foreach ($bachCourses as $index => $courseName) {
                    $coursesData[] = [
                        'name' => $courseName,
                        'description' => "Curso de {$courseName} - {$school->name}",
                        'location' => $school->name . ' - Aula ' . (21 + $index),
                        'academic_year' => $academicYear,
                        'start_date' => '2024-09-15',
                        'end_date' => '2025-06-20',
                        'teacher_id' => $teachers->random()->id,
                        'coord_id' => $coordinators->random()->id,
                        'school_id' => $school->id,
                        'status' => 'active',
                    ];
                }
            }

            if ($school->has_fp) {
                $fpCourses = [
                    '1º Grado Medio - Informática',
                    '2º Grado Medio - Informática',
                    '1º Grado Superior - Desarrollo Web',
                    '2º Grado Superior - Desarrollo Web'
                ];

                foreach ($fpCourses as $index => $courseName) {
                    $coursesData[] = [
                        'name' => $courseName,
                        'description' => "Curso de {$courseName} - {$school->name}",
                        'location' => $school->name . ' - Laboratorio ' . ($index + 1),
                        'academic_year' => $academicYear,
                        'start_date' => '2024-09-15',
                        'end_date' => '2025-06-20',
                        'teacher_id' => $teachers->random()->id,
                        'coord_id' => $coordinators->random()->id,
                        'school_id' => $school->id,
                        'status' => 'active',
                    ];
                }
            }

            // Crear los cursos
            foreach ($coursesData as $courseData) {
                Course::create($courseData);
            }
        }
    }
}