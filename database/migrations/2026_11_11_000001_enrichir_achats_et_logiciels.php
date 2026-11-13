<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Appréciation d'un achat : note de 1 à 5 étoiles + commentaire libre.
        Schema::table('achats', function (Blueprint $table) {
            $table->unsignedTinyInteger('appreciation')->nullable()->after('montant_total');
            $table->text('appreciation_commentaire')->nullable()->after('appreciation');
        });

        // Fiche logiciel enrichie : capacité, dates d'acquisition, vendeur et
        // conditions contractuelles (CGU / CGV).
        Schema::table('logiciels', function (Blueprint $table) {
            $table->unsignedInteger('nb_utilisateurs_max')->nullable()->after('editeur');
            $table->date('date_acquisition')->nullable()->after('nb_utilisateurs_max');
            $table->date('date_acquisition_licence')->nullable()->after('date_acquisition');
            $table->foreignId('id_fournisseur')->nullable()->after('date_acquisition_licence')
                ->constrained('fournisseurs', 'id_fournisseur')->nullOnDelete();
            $table->text('cgu')->nullable()->after('description');
            $table->text('cgv')->nullable()->after('cgu');
        });
    }

    public function down(): void
    {
        Schema::table('logiciels', function (Blueprint $table) {
            $table->dropForeign(['id_fournisseur']);
            $table->dropColumn([
                'nb_utilisateurs_max', 'date_acquisition', 'date_acquisition_licence',
                'id_fournisseur', 'cgu', 'cgv',
            ]);
        });

        Schema::table('achats', function (Blueprint $table) {
            $table->dropColumn(['appreciation', 'appreciation_commentaire']);
        });
    }
};
