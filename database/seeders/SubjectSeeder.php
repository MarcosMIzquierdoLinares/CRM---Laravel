<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;
use App\Models\Course;
use App\Models\User;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::with('school')->get();

        foreach ($courses as $course) {
            // Obtener profesores del mismo colegio
            $teachers = User::where('school_id', $course->school_id)
                ->whereHas('roles', function($query) {
                    $query->where('name', 'teacher');
                })->get();

            // Definir asignaturas según el tipo de curso
            $subjectsData = $this->getSubjectsForCourse($course->name);

            foreach ($subjectsData as $subjectData) {
                Subject::create([
                    'name' => $subjectData['name'],
                    'description' => $subjectData['description'],
                    'course_id' => $course->id,
                    'teacher_id' => $teachers->random()->id,
                    'school_id' => $course->school_id,
                    'hours_per_week' => $subjectData['hours'],
                    'status' => 'active',
                ]);
            }
        }
    }

    private function getSubjectsForCourse(string $courseName): array
    {
        if (str_contains($courseName, 'ESO')) {
            return [
                ['name' => 'Matemáticas', 'description' => 'Matemáticas de Educación Secundaria', 'hours' => 4],
                ['name' => 'Lengua Castellana y Literatura', 'description' => 'Lengua y Literatura Española', 'hours' => 4],
                ['name' => 'Inglés', 'description' => 'Lengua Extranjera: Inglés', 'hours' => 3],
                ['name' => 'Ciencias Sociales', 'description' => 'Geografía e Historia', 'hours' => 3],
                ['name' => 'Ciencias Naturales', 'description' => 'Biología y Geología', 'hours' => 3],
                ['name' => 'Educación Física', 'description' => 'Educación Física y Deportiva', 'hours' => 2],
                ['name' => 'Tecnología', 'description' => 'Tecnología, Programación y Robótica', 'hours' => 2],
                ['name' => 'Plástica', 'description' => 'Educación Plástica, Visual y Audiovisual', 'hours' => 2],
                ['name' => 'Música', 'description' => 'Música', 'hours' => 2],
                ['name' => 'Religión', 'description' => 'Religión Católica', 'hours' => 1],
            ];
        }

        if (str_contains($courseName, 'Bachillerato') && str_contains($courseName, 'Ciencias')) {
            return [
                ['name' => 'Matemáticas II', 'description' => 'Matemáticas de Bachillerato Ciencias', 'hours' => 4],
                ['name' => 'Física', 'description' => 'Física', 'hours' => 4],
                ['name' => 'Química', 'description' => 'Química', 'hours' => 4],
                ['name' => 'Biología', 'description' => 'Biología', 'hours' => 3],
                ['name' => 'Lengua Castellana y Literatura II', 'description' => 'Lengua y Literatura Española', 'hours' => 3],
                ['name' => 'Inglés II', 'description' => 'Lengua Extranjera: Inglés', 'hours' => 3],
                ['name' => 'Historia de España', 'description' => 'Historia de España', 'hours' => 2],
                ['name' => 'Educación Física', 'description' => 'Educación Física', 'hours' => 2],
            ];
        }

        if (str_contains($courseName, 'Bachillerato') && str_contains($courseName, 'Humanidades')) {
            return [
                ['name' => 'Historia del Arte', 'description' => 'Historia del Arte', 'hours' => 4],
                ['name' => 'Latín II', 'description' => 'Latín', 'hours' => 4],
                ['name' => 'Lengua Castellana y Literatura II', 'description' => 'Lengua y Literatura Española', 'hours' => 4],
                ['name' => 'Historia de España', 'description' => 'Historia de España', 'hours' => 3],
                ['name' => 'Inglés II', 'description' => 'Lengua Extranjera: Inglés', 'hours' => 3],
                ['name' => 'Filosofía', 'description' => 'Filosofía', 'hours' => 3],
                ['name' => 'Educación Física', 'description' => 'Educación Física', 'hours' => 2],
            ];
        }

        if (str_contains($courseName, 'FP')) {
            return [
                ['name' => 'Sistemas Operativos', 'description' => 'Sistemas Operativos Monopuesto', 'hours' => 4],
                ['name' => 'Bases de Datos', 'description' => 'Bases de Datos', 'hours' => 4],
                ['name' => 'Programación', 'description' => 'Programación', 'hours' => 6],
                ['name' => 'Redes Locales', 'description' => 'Redes Locales', 'hours' => 4],
                ['name' => 'Formación y Orientación Laboral', 'description' => 'FOL', 'hours' => 2],
                ['name' => 'Empresa e Iniciativa Emprendedora', 'description' => 'EIE', 'hours' => 2],
            ];
        }

        return [];
    }
}