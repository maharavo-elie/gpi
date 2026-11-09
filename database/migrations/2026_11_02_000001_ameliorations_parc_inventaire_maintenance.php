<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Configuration matérielle complète de chaque machine : ces valeurs
        // sont propres à l'unciation (un lot peut mélanger des disques),
        // elles restent donc sur la fiche équipement et non sur le modèle.
        Schema::table('equipements', function (Blueprint $table) {
            $table->string('processeur', 150)->nullable()->after('designation');
            $table->string('ram', 100)->nullable()->after('processeur');
            $table->string('disque', 150)->nullable()->after('ram');
        });

        // Nouveaux statuts demandés pour les interventions : « succès », « hors
        // service », « en attente de pièce ». Les anciennes valeurs
        // (demandee, planifiee, terminee, annulee) sont conservées pour ne pas
        // invalider les enregistrements existants.
        Schema::table('maintenances', function (Blueprint $table) {
            $table->enum('statut', [
                'demandee', 'planifiee', 'en_cours', 'en_attente_piece',
                'terminee', 'succes', 'hors_service', 'annulee',
            ])->default('demandee')->change();

            $table->enum('mode_intervention', ['interne', 'externe'])
                ->nullable()
                ->after('technicien');
        });
    }

    public function down(): void
    {
        Schema::table('maintenances', function (Blueprint $table) {
            $table->dropColumn('mode_intervention');
            $table->enum('statut', ['demandee', 'planifiee', 'en_cours', 'terminee', 'annulee'])
                ->default('demandee')->change();
        });

        Schema::table('equipements', function (Blueprint $table) {
            $table->dropColumn(['processeur', 'ram', 'disque']);
        });
    }
};
