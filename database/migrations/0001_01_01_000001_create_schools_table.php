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
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre corto o iniciales
            $table->string('full_name'); // Nombre completo del colegio
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->string('logo')->nullable();
            $table->boolean('has_primary')->default(false);
            $table->boolean('has_eso')->default(false);
            $table->boolean('has_bachillerato')->default(false);
            $table->boolean('has_fp')->default(false);
            $table->integer('max_students')->nullable();
            $table->string('website')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
