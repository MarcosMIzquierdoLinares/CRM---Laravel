<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['admin', 'member', 'teacher', 'coordinator', 'student'];

        foreach ($roles as $roll) {
            Role::create(['role' => $roll]);
        }
    }
}
