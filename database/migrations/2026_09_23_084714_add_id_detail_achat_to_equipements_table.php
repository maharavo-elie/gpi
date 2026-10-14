<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Chaque équipement pointe vers sa ligne d'achat d'origine (detail_achats) :
     * la traçabilité financière devient exacte même pour les lots de plusieurs
     * unités, contrairement à detail_achats.id_equipement qui ne retenait que
     * la dernière unité créée.
     */
    public function up(): void
    {
        Schema::table('equipements', function (Blueprint $table) {
            $table->foreignId('id_detail_achat')
                ->nullable()
                ->after('id_fournisseur')
                ->constrained('detail_achats', 'id_detail_achat')
                ->nullOnDelete();

            $table->index('id_detail_achat');
        });
    }

    public function down(): void
    {
        Schema::table('equipements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_detail_achat');
            $table->dropIndex(['id_detail_achat']);
        });
    }
};
