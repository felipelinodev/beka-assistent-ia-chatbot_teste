import { NextRequest, NextResponse } from 'next/server';

// Endpoint para persistir mensagens das conversas
const PERSIST_MESSAGE_URL = 'https://n8n.usebrk.com.br/webhook/persistir-conversations-messages-chatwoot';

/**
 * Endpoint para persistir mensagens das conversas no Chatwoot
 * Chamado quando o usuário envia uma mensagem no chat
 * 
 * Payload esperado:
 * {
 *   "message": "Mensagem do usuário",
 *   "contact_id": 7911,
 *   "image": "data:image/png;base64,..." // opcional
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, contact_id, store, url, image } = body;

        console.log('[PersistMessage] Recebido:', {
            message,
            contact_id,
            store,
            url,
            hasImage: !!image,
            imageSizeKb: image ? Math.round(image.length / 1024) : 0,
        });

        if ((!message || typeof message !== 'string') && !image) {
            return NextResponse.json(
                { success: false, error: 'Mensagem ou imagem é necessária' },
                { status: 400 }
            );
        }

        if (!contact_id) {
            console.warn('[PersistMessage] contact_id não fornecido');
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

        console.log('[PersistMessage] Enviando para webhook:', { message, contact_id, store, url, hasImage: !!image });

        const webhookResponse = await fetch(PERSIST_MESSAGE_URL, {
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
            console.log('[PersistMessage] Resposta do webhook (texto):', textResponse);
            webhookData = { raw: textResponse };
        }

        console.log('[PersistMessage] Resposta do webhook:', {
            status: webhookResponse.status,
            data: webhookData,
        });

        return NextResponse.json({
            success: webhookResponse.ok,
            message: 'Mensagem persistida',
            webhookResponse: webhookData,
        });

    } catch (error) {
        console.error('[PersistMessage] Erro ao persistir mensagem:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao persistir mensagem',
            },
            { status: 500 }
        );
    }
}
