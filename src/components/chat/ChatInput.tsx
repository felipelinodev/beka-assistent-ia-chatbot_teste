'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Mic, MicOff, SendHorizontal, ImagePlus, X } from 'lucide-react';

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

interface ChatInputProps {
    onSend: (message: string, audioBlob?: Blob, imageBase64?: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'pt-BR';

                recognition.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            transcript += event.results[i][0].transcript + ' ';
                        }
                    }
                    if (transcript) {
                        setInput((prev) => prev + transcript);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    stopRecording();
                };

                recognition.onend = () => {
                    if (isListening) {
                        stopRecording();
                    }
                };

                recognitionRef.current = recognition;
            }
        }
    }, []); // Removed isListening dependency to avoid re-binding loops

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Start Media Recorder
            const mediaRecorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;

            // Start Speech Recognition
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.error("Recognition start error", e);
                }
            }

            setIsListening(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Não foi possível acessar o microfone. Verifique as permissões.');
        }
    };

    const stopRecording = (): Promise<void> => {
        return new Promise((resolve) => {
            setIsListening(false);

            // Stop Speech Recognition
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore if already stopped
                }
            }

            // Stop Media Recorder
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.onstop = () => {
                    // Ensure stream tracks are stopped
                    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
                    resolve();
                };
                mediaRecorderRef.current.stop();
            } else {
                resolve();
            }
        });
    };

    const toggleListening = () => {
        if (isListening) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Image handling
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Reset input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = async () => {
        if (isListening) {
            await stopRecording();
        }

        const trimmedInput = input.trim();

        let audioBlob: Blob | undefined;
        if (audioChunksRef.current.length > 0) {
            audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            audioChunksRef.current = [];
        }

        // Allow sending if there is text OR audio OR image
        if ((trimmedInput || audioBlob || imagePreview) && !isLoading && !disabled) {
            onSend(trimmedInput, audioBlob, imagePreview || undefined);
            setInput('');
            setImagePreview(null);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-2 md:p-4 w-full flex flex-col items-center gap-2">
            {/* Image Preview */}
            {imagePreview && (
                <div className="w-full max-w-4xl px-2">
                    <div className="relative inline-block animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded-xl border-2 border-primary/30 shadow-md"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                            type="button"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* Input Bar */}
            <div className="w-full max-w-4xl bg-surface-white/90 backdrop-blur-md shadow-2xl rounded-[24px] md:rounded-[32px] p-1.5 md:p-2 flex items-end gap-2 border border-white/50 relative overflow-hidden">

                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Ouvindo..." : "Digite sua mensagem..."}
                    disabled={isLoading || disabled}
                    className={`min-h-[44px] md:min-h-[52px] max-h-[150px] md:max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 text-text-primary placeholder:text-text-secondary/50 text-sm md:text-base py-3 px-3 md:py-3.5 md:px-4 flex-1 rounded-[20px] md:rounded-[24px] ${isListening ? 'animate-pulse bg-red-50/50' : ''}`}
                    rows={1}
                />

                {/* Image Upload Button */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                />
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || disabled}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full shrink-0 transition-all duration-300 hover:bg-surface-ground mb-0.5 ${imagePreview ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-primary'}`}
                >
                    <ImagePlus className="h-5 w-5 md:h-6 md:w-6" />
                </Button>

                <Button
                    onClick={toggleListening}
                    disabled={isLoading || disabled}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full shrink-0 transition-all duration-300 hover:bg-surface-ground mb-0.5 ${isListening ? 'text-red-500 hover:text-red-600 bg-red-50' : 'text-text-secondary hover:text-primary'}`}
                >
                    {isListening ? (
                        <MicOff className="h-5 w-5 md:h-6 md:w-6" />
                    ) : (
                        <Mic className="h-5 w-5 md:h-6 md:w-6" />
                    )}
                </Button>

                <Button
                    onClick={handleSend}
                    disabled={(!input.trim() && audioChunksRef.current.length === 0 && !isListening && !imagePreview) || isLoading || disabled}
                    size="icon"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary text-white hover:bg-[#30800a] cursor-pointer shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md mb-0.5 mr-0.5"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                    ) : (
                        <SendHorizontal className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.5} />
                    )}
                    <span className="sr-only">Enviar mensagem</span>
                </Button>
            </div>
        </div>
    );
}
