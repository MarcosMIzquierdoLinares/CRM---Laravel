<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::with('school')->get();

        foreach ($courses as $course) {
            // Obtener estudiantes del mismo colegio
            $students = User::where('school_id', $course->school_id)
                ->whereHas('roles', function($query) {
                    $query->where('name', 'student');
                })->get();

            // Matricular entre 15-25 estudiantes por curso
            $enrollmentCount = rand(15, min(25, $students->count()));
            $selectedStudents = $students->random($enrollmentCount);

            foreach ($selectedStudents as $student) {
                Enrollment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'school_id' => $course->school_id,
                    'academic_year' => $course->academic_year,
                    'enrollment_date' => '2024-09-01',
                    'status' => 'active',
                ]);
            }
        }
    }
}
