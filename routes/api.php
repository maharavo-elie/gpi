<?php

use App\Http\Controllers\AchatController;
use App\Http\Controllers\AffectationController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CorbeilleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EquipementController;
use App\Http\Controllers\InventaireController;
use App\Http\Controllers\LogicielController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RapportController;
use App\Http\Controllers\ReferentielController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/profil', [AuthController::class, 'profil']);
    Route::patch('/profil', [AuthController::class, 'updateProfil']);
    Route::put('/profil/mot-de-passe', [AuthController::class, 'updateMotDePasse']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'stats']);
    Route::get('/inventaire-details', [InventaireController::class, 'details']);

    // Centre de notifications : fil personnel de l'utilisateur connecté.
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('notifications/tout-lire', [NotificationController::class, 'toutMarquerLire']);
    Route::patch('notifications/{id}/lire', [NotificationController::class, 'lire']);

    /*
     * Rôles :
     *  - admin, gestionnaire_parc            → écriture sur tout le parc et les référentiels
     *  - technicien                          → tickets, maintenances, installations logicielles
     *  - utilisateur                         → lecture seule (+ commentaires de tickets)
     */
    $ecriture = 'role:admin,gestionnaire_parc';
    $intervention = 'role:admin,gestionnaire_parc,technicien';

    Route::get('/referentiel', [ReferentielController::class, 'index']);
    Route::get('/referentiel/{type}', [ReferentielController::class, 'liste']);
    Route::middleware($ecriture)->group(function () {
        Route::post('/referentiel/{type}', [ReferentielController::class, 'store']);
        Route::put('/referentiel/{type}/{id}', [ReferentielController::class, 'update']);
        Route::delete('/referentiel/{type}/{id}', [ReferentielController::class, 'destroy']);
    });

    Route::apiResource('equipements', EquipementController::class)->only(['index', 'show']);
    Route::apiResource('equipements', EquipementController::class)->except(['index', 'show'])->middleware($ecriture);

    Route::apiResource('agents', AgentController::class)->only(['index', 'show']);
    Route::apiResource('agents', AgentController::class)->except(['index', 'show'])->middleware($ecriture);

    // Tout utilisateur authentifié peut déclarer un ticket (une « demande ») ;
    // sa modification et sa suppression restent réservées aux intervenants.
    Route::apiResource('tickets', TicketController::class)->only(['index', 'show', 'store']);
    Route::apiResource('tickets', TicketController::class)->except(['index', 'show', 'store'])->middleware($intervention);
    Route::post('tickets/{id}/commentaires', [TicketController::class, 'comment']);

    Route::apiResource('affectations', AffectationController::class)->only(['index', 'show']);
    Route::apiResource('affectations', AffectationController::class)->except(['index', 'show'])->middleware($ecriture);
    Route::post('affectations/{id}/restitution', [AffectationController::class, 'restitution'])->middleware($ecriture);

    Route::apiResource('achats', AchatController::class)->only(['index', 'show']);
    Route::apiResource('achats', AchatController::class)->except(['index', 'show'])->middleware($ecriture);

    Route::apiResource('maintenances', MaintenanceController::class)->only(['index', 'show']);
    Route::apiResource('maintenances', MaintenanceController::class)->except(['index', 'show'])->middleware($intervention);

    Route::apiResource('logiciels', LogicielController::class)->only(['index', 'show']);
    Route::apiResource('logiciels', LogicielController::class)->except(['index', 'show'])->middleware($ecriture);
    Route::middleware($intervention)->group(function () {
        Route::post('installations', [LogicielController::class, 'installer']);
        Route::post('logiciels/{id}/desinstaller/{equipement}', [LogicielController::class, 'desinstaller']);
    });

    // Rapports & historiques
    Route::get('/rapports/synthese', [RapportController::class, 'synthese']);
    Route::get('/rapports/mouvements', [RapportController::class, 'mouvements']);
    Route::get('/rapports/journal', [RapportController::class, 'journal']);
    Route::get('/rapports/equipement/{equipement}', [RapportController::class, 'equipement']);
    Route::get('/rapports/export', [RapportController::class, 'export']);

    // Purge de l'historique (admin et gestionnaire de parc uniquement)
    Route::middleware($ecriture)->group(function () {
        Route::delete('/rapports/mouvements/{mouvement}', [RapportController::class, 'supprimerMouvement']);
        Route::delete('/rapports/mouvements', [RapportController::class, 'purgerMouvements']);
        Route::delete('/rapports/journal/{journal}', [RapportController::class, 'supprimerJournal']);
        Route::delete('/rapports/journal', [RapportController::class, 'purgerJournal']);
    });

    // Corbeille : éléments supprimés (equipements, agents) — restauration ou
    // suppression définitive, réservées à l'écriture (admin, gestionnaire_parc).
    Route::get('/corbeille', [CorbeilleController::class, 'index']);
    Route::middleware($ecriture)->group(function () {
        Route::put('/corbeille/{section}/{id}/restaurer', [CorbeilleController::class, 'restaurer']);
        Route::delete('/corbeille/{section}/{id}', [CorbeilleController::class, 'supprimerDefinitivement']);
        Route::delete('/corbeille/{section}', [CorbeilleController::class, 'viderSection']);
    });

    // Exports PDF officiels (en-tête DGSR, pagination, visa)
    Route::get('/rapports/pdf/synthese', [RapportController::class, 'pdfSynthese']);
    Route::get('/rapports/pdf/mouvements', [RapportController::class, 'pdfMouvements']);
    Route::get('/rapports/pdf/journal', [RapportController::class, 'pdfJournal']);
    Route::get('/rapports/pdf/equipement/{equipement}', [RapportController::class, 'pdfEquipement']);
    Route::get('/rapports/pdf/ressource/{nom}', [RapportController::class, 'pdfRessource']);
});
