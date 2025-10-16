<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'surname',
        'name_user',
        'email',
        'phone',
        'password',
        'school_id',
        'photo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relaciones con School
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    // Relaciones académicas
    public function coursesAsTeacher()
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    public function coursesAsCoordinator()
    {
        return $this->hasMany(Course::class, 'coord_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function coursesAsStudent()
    {
        return $this->belongsToMany(Course::class, 'enrollments', 'user_id', 'course_id')
                    ->withPivot('academic_year', 'enrollment_date', 'status')
                    ->withTimestamps();
    }

    public function subjectsAsTeacher()
    {
        return $this->hasMany(Subject::class, 'teacher_id');
    }

    public function gradesAsStudent()
    {
        return $this->hasMany(Grade::class);
    }

    // Scopes
    public function scopeBySchool($query, $schoolId)
    {
        return $query->where('school_id', $schoolId);
    }

}
