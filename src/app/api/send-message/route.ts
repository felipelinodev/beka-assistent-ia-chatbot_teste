import { NextRequest, NextResponse } from 'next/server';

// Endpoint do webhook beka_website_assistent
const BEKA_WEBHOOK_URL = 'https://n8n.usebrk.com.br/webhook/beka_website_assistent';

/**
 * Proxy para enviar mensagens (com ou sem imagem) para o webhook beka_website_assistent.
 * Evita problemas de CORS ao fazer a chamada do lado do servidor.
 *
 * Payload esperado:
 * {
 *   "message": "texto da mensagem",
 *   "contact_id": 123,
 *   "store": "AGRO",
 *   "url": "https://...",
 *   "image": "data:image/png;base64,..." // opcional
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, contact_id, store, url, image } = body;

        console.log('[SendMessage] Recebido:', {
            message,
            contact_id,
            store,
            url,
            hasImage: !!image,
            imageSizeKb: image ? Math.round(image.length / 1024) : 0,
        });

        if (!contact_id) {
            return NextResponse.json(
                { success: false, error: 'contact_id não fornecido' },
                { status: 400 }
            );
        }

        const payload: Record<string, unknown> = {
            message: message || '',
            contact_id,
            store,
            url,
        };

        if (image) {
            payload.image = image;
        }

        const webhookResponse = await fetch(BEKA_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        let webhookData = {};
        try {
            webhookData = await webhookResponse.json();
        } catch {
            const textResponse = await webhookResponse.text();
            console.log('[SendMessage] Resposta do webhook (texto):', textResponse);
            webhookData = { raw: textResponse };
        }

        console.log('[SendMessage] Resposta do webhook:', {
            status: webhookResponse.status,
            data: webhookData,
        });

        return NextResponse.json({
            success: webhookResponse.ok,
            message: 'Mensagem enviada',
            webhookResponse: webhookData,
        });
    } catch (error) {
        console.error('[SendMessage] Erro ao enviar mensagem:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao enviar mensagem' },
            { status: 500 }
        );
    }
}
