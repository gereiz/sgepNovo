<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\DataService;

class DataController extends Controller
{

    public function __construct() {
        $this->middleware('auth');
    }


    public function getBs(Request $request) {

        $dataService = new DataService();

        return $dataService->getBisemana($request->anoId);

    }
}
