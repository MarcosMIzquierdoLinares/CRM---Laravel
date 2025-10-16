<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'full_name',
        'address',
        'phone',
        'email',
        'logo',
        'has_primary',
        'has_eso',
        'has_bachillerato',
        'has_fp',
        'max_students',
        'website',
    ];

    protected $casts = [
        'has_primary' => 'boolean',
        'has_eso' => 'boolean',
        'has_bachillerato' => 'boolean',
        'has_fp' => 'boolean',
    ];

    // Relaciones
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
