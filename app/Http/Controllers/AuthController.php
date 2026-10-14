<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $field = filter_var($credentials['email'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = Utilisateur::with('agent.service', 'roles')
            ->where($field, $credentials['email'])
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Identifiants incorrects.',
            ]);
        }

        if (! $user->actif) {
            throw ValidationException::withMessages([
                'email' => 'Ce compte est désactivé. Contactez le SIT.',
            ]);
        }

        $user->forceFill(['dernier_connexion' => now()])->save();

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(
            $request->user()->load('agent.service.direction', 'roles')
        );
    }

    /**
     * Profil connecté avec toutes ses relations (vue).
     */
    public function profil(Request $request)
    {
        return response()->json(
            $request->user()->load('agent.service.direction', 'roles')
        );
    }

    /**
     * Modification de son propre profil : username, email et téléphone de
     * l'agent rattaché (les autres champs viennent du référentiel agents).
     */
    public function updateProfil(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'username' => ['required', 'string', 'max:50', Rule::unique('utilisateurs', 'username')->ignore($user->id_utilisateur, 'id_utilisateur')],
            'email' => ['required', 'email', 'max:100', Rule::unique('utilisateurs', 'email')->ignore($user->id_utilisateur, 'id_utilisateur')],
            'telephone' => ['nullable', 'string', 'max:30'],
        ], [
            'username.required' => "Le nom d'utilisateur est requis.",
            'username.unique' => "Ce nom d'utilisateur est déjà utilisé.",
            'email.required' => 'Email requis.',
            'email.email' => 'Adresse email invalide.',
            'email.unique' => 'Cet email est déjà utilisé par un autre compte.',
            'telephone.max' => 'Téléphone trop long.',
        ]);

        $user->update([
            'username' => $data['username'],
            'email' => $data['email'],
        ]);

        if ($user->agent && array_key_exists('telephone', $data)) {
            $user->agent->update(['telephone' => $data['telephone']]);
        }

        return response()->json(
            $user->fresh()->load('agent.service.direction', 'roles')
        );
    }

    /**
     * Changement de son propre mot de passe (mot de passe actuel requis).
     */
    public function updateMotDePasse(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'mot_de_passe' => ['required', 'string'],
            'nouveau' => ['required', 'string', 'min:8'],
            'confirmation' => ['required', 'string', 'same:nouveau'],
        ], [
            'mot_de_passe.required' => 'Le mot de passe actuel est requis.',
            'nouveau.required' => 'Le nouveau mot de passe est requis.',
            'nouveau.min' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
            'confirmation.required' => 'La confirmation est requise.',
            'confirmation.same' => 'La confirmation ne correspond pas au nouveau mot de passe.',
        ]);

        if (! Hash::check($data['mot_de_passe'], $user->password)) {
            throw ValidationException::withMessages([
                'mot_de_passe' => 'Le mot de passe actuel est incorrect.',
            ]);
        }

        $user->forceFill(['password' => $data['nouveau']])->save();

        // Invalide les autres sessions : seuls le token courant reste valable.
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json(['message' => 'Mot de passe modifié.']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté']);
    }
}
