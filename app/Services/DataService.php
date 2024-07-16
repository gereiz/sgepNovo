<?php

namespace App\Services;

use App\Models\Bisemanas\Bisemana;


class DataService
{

    public function getBisemanas(Int $anoId) {
        
       return  Bisemana::where('ano_id', $anoId)->get();

    }

    public function getBisemana(Int $id) {
        
        return Bisemana::find($id);

    }





}
