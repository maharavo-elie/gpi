<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Contexte de la demande, saisi à l'ouverture du ticket.
            $table->string('motif', 200)->nullable()->after('titre');
            $table->text('etat_probleme_avant')->nullable()->after('description');
            $table->foreignId('id_etat_appareil_avant')->nullable()->after('etat_probleme_avant')
                ->constrained('etat_equipements', 'id_etat')->nullOnDelete();

            // Périmètre concerné : service / direction / centre (site).
            $table->foreignId('id_direction')->nullable()->after('id_agent')
                ->constrained('directions', 'id_direction')->nullOnDelete();
            $table->foreignId('id_service')->nullable()->after('id_direction')
                ->constrained('services', 'id_service')->nullOnDelete();
            $table->foreignId('id_site')->nullable()->after('id_service')
                ->constrained('sites', 'id_site')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_site');
            $table->dropConstrainedForeignId('id_service');
            $table->dropConstrainedForeignId('id_direction');
            $table->dropConstrainedForeignId('id_etat_appareil_avant');
            $table->dropColumn(['motif', 'etat_probleme_avant']);
        });
    }
};
