<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Estudiante
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->integer('evaluation'); // 1, 2, 3 (trimestres)
            $table->decimal('grade', 5, 2); // Nota de 0 a 10
            $table->text('comments')->nullable();
            $table->date('grade_date');
            $table->timestamps();
            $table->softDeletes();
            
            // Un estudiante no puede tener dos notas en la misma evaluación de la misma asignatura
            $table->unique(['user_id', 'subject_id', 'evaluation'], 'unique_grade_evaluation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
