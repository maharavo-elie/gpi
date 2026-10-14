<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Le formulaire Sites et les règles de validation acceptent adresse,
 * telephone et email, mais ces colonnes n'existaient pas en base :
 * les valeurs saisies étaient silencieusement perdues (absentes du
 * $fillable). On les ajoute, toutes facultatives.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->string('adresse', 255)->nullable()->after('ville');
            $table->string('telephone', 30)->nullable()->after('adresse');
            $table->string('email', 150)->nullable()->after('telephone');
        });
    }

    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn(['adresse', 'telephone', 'email']);
        });
    }
};
