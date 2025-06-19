<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['認証に失敗しました。'],
            ]);
        }

        Auth::login($user); // セッションにログイン情報を保存

        return response()->json(['user' => $user]);
    }

    public function logout(Request $request)
    {
        Auth::logout(); // セッションログアウト

        return response()->json(['message' => 'Logged out']);
    }
}