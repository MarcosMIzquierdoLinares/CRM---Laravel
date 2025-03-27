<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([ // admin con datos sin ser aleatorios para utilizar siempre los mismos
            'name' => 'Benito',
            'surname' => 'Flores',
            'name_user' => 'BeniFloqui',
            'email' => 'benieladmin@gmail.com',
            'email_verified_at' => now(), 
            'phone' => '666666666',// Puede ser nulo
            'password' => '123456789',
            'role_id' => Role::where('role', 'admin')->first()->id,
            'photo' => 'url',// Puede ser nulo
        ]);   
        
        $roles = [ // array asociativo para pasarle al factory el número de tipos de rol que vamos a crear
            'member' => 3,
            'teacher' => 3,
            'coordinator' => 3,
            'student' => 3,
        ];
        
        foreach ($roles as $nameRole => $count) { // En vez de hacer 4 lineas de código, utilizo un bucle para crear 4 factorys de los diferentes tipos de rol
            User::factory($count)->create([
                'role_id' => Role::where('role', $nameRole)->first()->id,
            ]);
        }
        
    }
}
