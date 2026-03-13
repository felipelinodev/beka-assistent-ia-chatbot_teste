export interface Product {
  title: string;
  price: string;
  image_src: string;
  handle: string;
  link: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | Product[];
  textContent?: string; // Texto que acompanha os cards de produto (conteúdo misto)
  timestamp: number;
  audioUrl?: string; // URL do blog de áudio para exibição na UI
  imageUrl?: string; // Data URL base64 da imagem enviada pelo usuário
  buttonLabels?: string[]; // Botões de opção quando a IA faz perguntas
  status?: 'sending' | 'sent' | 'delivered' | 'seen'; // Status de entrega da mensagem
  assigneeName?: string; // Nome do agente atribuído (Chatwoot assignee)
}

export interface BekaResponse {
  Beka: string | Product[];
  ButtonLabel?: string[]; // Opções de botão retornadas pela API
}
