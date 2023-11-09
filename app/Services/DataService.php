<?php

namespace App\Services;

use App\Models\Bisemanas\Bisemana;

class DataService
{

    public function getBisemana(String $anoId) {
        
       return  Bisemana::where('ano_id', $anoId)->get();

    }


}
