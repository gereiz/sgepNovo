<?php

namespace App\Services\Financeiro;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Financeiro\CentroCusto;
use Svg\Tag\Rect;

class CaixaService
{

    // Centros de custo

    public function getCentrosCusto()
    {
        return CentroCusto::all();
    }

    public function getCentroCusto($id)
    {
        return CentroCusto::find($id);
    }

    public function createCentroCusto(Request $request)
    {
        $centro_custo = $request->nome;
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $centroCusto = new CentroCusto();
        $centroCusto->centro_custo = $centro_custo;

        $centroCusto->save();

        return response()->json($centroCusto, 201);
    }

    public function updateCentroCusto(Request $request)
    {
        $id = $request->id;
        $centro_custo = $request->centro_custo;


        $centroCusto = CentroCusto::find($id);
        $centroCusto->centro_custo = $centro_custo;

        $centroCusto->save();

        return response()->json($centroCusto, 200);
    }

    public function deleteCentroCusto(Request $request)
    {
        $id = $request['centroCusto']['id'];
        $centroCusto = CentroCusto::find($id);
        $centroCusto->delete();

        return response()->json(null, 204);
    }



}
