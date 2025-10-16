<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        $schools = [
            [
                'name' => 'IES San Juan',
                'full_name' => 'Instituto de Educación Secundaria San Juan',
                'address' => 'Calle Mayor, 123, 28001 Madrid',
                'phone' => '+34 91 123 45 67',
                'email' => 'info@iessanjuan.edu',
                'has_primary' => false,
                'has_eso' => true,
                'has_bachillerato' => true,
                'has_fp' => true,
                'max_students' => 800,
                'website' => 'https://www.iessanjuan.edu',
            ],
            [
                'name' => 'Colegio San José',
                'full_name' => 'Colegio Concertado San José de la Montaña',
                'address' => 'Avenida de la Paz, 45, 08001 Barcelona',
                'phone' => '+34 93 234 56 78',
                'email' => 'secretaria@colegiosanjose.edu',
                'has_primary' => true,
                'has_eso' => true,
                'has_bachillerato' => true,
                'has_fp' => false,
                'max_students' => 600,
                'website' => 'https://www.colegiosanjose.edu',
            ],
            [
                'name' => 'IES García Lorca',
                'full_name' => 'Instituto de Educación Secundaria Federico García Lorca',
                'address' => 'Plaza de España, 8, 41004 Sevilla',
                'phone' => '+34 95 345 67 89',
                'email' => 'administracion@iesgarciagarcia.edu',
                'has_primary' => false,
                'has_eso' => true,
                'has_bachillerato' => true,
                'has_fp' => false,
                'max_students' => 700,
                'website' => 'https://www.iesgarciagarcia.edu',
            ],
        ];

        foreach ($schools as $schoolData) {
            School::create($schoolData);
        }
    }
}
