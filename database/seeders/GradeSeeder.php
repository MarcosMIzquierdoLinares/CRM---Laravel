<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Grade;
use App\Models\Subject;
use App\Models\User;
use App\Models\Enrollment;

class GradeSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener todas las asignaturas
        $subjects = Subject::with('course')->get();

        foreach ($subjects as $subject) {
            // Obtener estudiantes matriculados en el curso de esta asignatura
            $enrollments = Enrollment::where('course_id', $subject->course_id)
                ->where('status', 'active')
                ->get();

            // Crear calificaciones para algunos estudiantes (no todos tienen notas aún)
            $studentsWithGrades = $enrollments->random(rand(10, min(20, $enrollments->count())));

            foreach ($studentsWithGrades as $enrollment) {
                $student = $enrollment->user;
                
                // Crear calificaciones para las 3 evaluaciones
                for ($evaluation = 1; $evaluation <= 3; $evaluation++) {
                    // Solo crear nota si no existe ya
                    $existingGrade = Grade::where('user_id', $student->id)
                        ->where('subject_id', $subject->id)
                        ->where('evaluation', $evaluation)
                        ->exists();

                    if (!$existingGrade) {
                        Grade::create([
                            'user_id' => $student->id,
                            'subject_id' => $subject->id,
                            'school_id' => $subject->school_id,
                            'evaluation' => $evaluation,
                            'grade' => $this->generateRealisticGrade(),
                            'comments' => $this->generateComment(),
                            'grade_date' => $this->getGradeDate($evaluation),
                        ]);
                    }
                }
            }
        }
    }

    private function generateRealisticGrade(): float
    {
        // Generar notas más realistas (distribución normal)
        $grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $weights = [5, 5, 8, 10, 12, 15, 15, 12, 10, 5, 3]; // Más probabilidad de notas medias
        
        // Crear array con pesos
        $weightedGrades = [];
        foreach ($grades as $index => $grade) {
            for ($i = 0; $i < $weights[$index]; $i++) {
                $weightedGrades[] = $grade;
            }
        }
        
        return $weightedGrades[array_rand($weightedGrades)];
    }

    private function generateComment(): ?string
    {
        $comments = [
            'Trabajo satisfactorio',
            'Buen rendimiento',
            'Necesita mejorar',
            'Excelente trabajo',
            'Participación activa',
            'Requiere más esfuerzo',
            'Muy buen nivel',
            null, // Sin comentario
        ];

        return $comments[array_rand($comments)];
    }

    private function getGradeDate(int $evaluation): string
    {
        $dates = [
            1 => '2024-12-20', // Final del primer trimestre
            2 => '2025-03-20', // Final del segundo trimestre  
            3 => '2025-06-15', // Final del tercer trimestre
        ];

        return $dates[$evaluation];
    }
}