<?php

namespace Tests\Unit;

use App\Services\AssistantService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AssistantServiceTest extends TestCase
{
    public function test_la_reponse_du_fournisseur_est_extraite_avec_le_contexte_gpi(): void
    {
        config()->set('services.assistant', [
            'key' => 'test-key',
            'base_url' => 'https://api.mistral.ai/v1',
            'model' => 'mistral-small-latest',
        ]);

        Http::preventStrayRequests();
        Http::fake([
            'api.mistral.ai/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Ouvrez le menu Tickets.']],
                ],
            ]),
        ]);

        $reponse = (new AssistantService())->repondre(
            'Comment créer un ticket ?',
            [],
            '/tickets',
            ['admin'],
        );

        $this->assertSame('Ouvrez le menu Tickets.', $reponse);

        Http::assertSent(function ($request) {
            $messages = $request['messages'];

            return $request->url() === 'https://api.mistral.ai/v1/chat/completions'
                && $request->hasHeader('Authorization', 'Bearer test-key')
                && $messages[0]['role'] === 'system'
                && str_contains($messages[0]['content'], 'administrateur (écriture complète)')
                && str_contains($messages[0]['content'], 'Tickets d’assistance')
                && $messages[1] === ['role' => 'user', 'content' => 'Comment créer un ticket ?'];
        });
    }

    public function test_une_cle_absente_bloque_l_appel_au_fournisseur(): void
    {
        config()->set('services.assistant.key', null);

        $this->expectException(\RuntimeException::class);

        (new AssistantService())->repondre('Bonjour');
    }

    public function test_reponse_locale_couvre_les_questions_frequentes(): void
    {
        $reponse = (new AssistantService())->repondreLocalement(
            'Comment créer un ticket ?',
            '/tickets',
            ['utilisateur'],
        );

        $this->assertStringContainsString('Maintenance > Tickets', $reponse);
        $this->assertStringContainsString('Nouveau ticket', $reponse);
    }

    public function test_reponse_locale_respecte_les_droits(): void
    {
        $reponse = (new AssistantService())->repondreLocalement(
            'Comment ajouter un équipement ?',
            '/equipements',
            ['utilisateur'],
        );

        $this->assertStringContainsString('réservé', $reponse);
    }
}
