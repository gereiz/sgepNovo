<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // Add the missing import statement
use Illuminate\Support\Facades\Hash; // Add the missing import statement

class UserController extends Controller
{
    // Altera a senha do usuário veriicando a senha atual e confirmando a nova senha através de um campo de confirmação
    public function alteraSenha(Request $request)
    {
        $user = User::find(auth()->user()->id);
        $currentPassword = $request->current_password;
        $newPassword = $request->new_password;
        $passwordConfirmation = $request->password_confirmation;


        if (Hash::check($currentPassword, $user->password) && $newPassword == $passwordConfirmation) {
            $user->password = bcrypt($newPassword);
            $user->save();
            return response()->json(['message' => 'Senha alterada com sucesso'], 200);
        } else {
            return response()->json(['message' => 'Senha atual incorreta'], 400);
        }
    }

    
    
    
}
