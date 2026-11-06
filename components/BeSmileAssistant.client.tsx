"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Message = {
    id: string;
    role: "assistant" | "user";
    content: string;
};

type Props = {
    lang?: "ru" | "en" | "az";
};

const quickPromptsByLang = {
    ru: ["Сколько стоят виниры?", "Кто делает имплантацию?"],
    en: ["How much do veneers cost?", "Who does implantation?"],
    az: ["Vinirlərin qiyməti nə qədərdir?", "İmplantasiya ilə kim məşğul olur?"],
};

const copyByLang = {
    ru: {
        eyebrow: "BeSmile Concierge",
        title: "AI Concierge",
        subtitle: "Услуги, врачи, цены и запись.",
        placeholder: "Напишите ваш вопрос...",
        opening:
            "Здравствуйте. Я concierge-ассистент BeSmile. Помогу с услугами, врачами, ценами и записью.",
        send: "Отправить",
        thinking: "Ассистент печатает...",
        openLabel: "AI Concierge",
        fallback: "Извините, произошла ошибка. Попробуйте еще раз.",
    },
    en: {
        eyebrow: "BeSmile Concierge",
        title: "AI Concierge",
        subtitle: "Services, doctors, prices, and booking.",
        placeholder: "Type your question...",
        opening:
            "Hello. I am the BeSmile concierge assistant. I can help with services, doctors, prices, and booking.",
        send: "Send",
        thinking: "Assistant is typing...",
        openLabel: "AI Concierge",
        fallback: "Sorry, something went wrong. Please try again.",
    },
    az: {
        eyebrow: "BeSmile Concierge",
        title: "AI Concierge",
        subtitle: "Xidmətlər, həkimlər, qiymətlər və qeydiyyat.",
        placeholder: "Sualınızı yazın...",
        opening:
            "Salam. Mən BeSmile concierge köməkçisiyəm. Xidmətlər, həkimlər, qiymətlər və qeydiyyatla bağlı kömək edə bilərəm.",
        send: "Göndər",
        thinking: "Köməkçi yazır...",
        openLabel: "AI Concierge",
        fallback: "Üzr istəyirəm, xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
    },
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function BeSmileAssistant({ lang = "ru" }: Props) {
    const copy = copyByLang[lang] ?? copyByLang.ru;
    const quickPrompts = quickPromptsByLang[lang] ?? quickPromptsByLang.ru;

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: copy.opening,
        },
    ]);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isLoading, isOpen]);

    const canSend = useMemo(
        () => input.trim().length > 0 && !isLoading,
        [input, isLoading]
    );

    async function sendMessage(rawText?: string) {
        const text = (rawText ?? input).trim();
        if (!text || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        const nextMessages = [...messages, userMessage];

        setMessages(nextMessages);
        setInput("");
        setIsLoading(true);

        try {
            const historyForApi = nextMessages.slice(-12).map((message) => ({
                role: message.role,
                content: message.content,
            }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                    history: historyForApi,
                }),
            });

            let data: any = null;

            try {
                data = await response.json();
            } catch {
                data = null;
            }

            const answer =
                response.ok &&
                    typeof data?.answer === "string" &&
                    data.answer.trim().length > 0
                    ? data.answer.trim()
                    : copy.fallback;

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: answer,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            const fallbackMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: copy.fallback,
            };

            setMessages((prev) => [...prev, fallbackMessage]);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <div className="fixed bottom-6 left-6 z-[60]">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={cn(
                        "group relative overflow-hidden rounded-full border border-white/60 bg-white/72 px-3.5 py-3 transition-all duration-300",
                        "shadow-[0_20px_80px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_24px_90px_rgba(0,0,0,0.11)]"
                    )}
                    aria-label="Open BeSmile Assistant"
                >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.74),rgba(255,255,255,0.42))]" />
                    <div className="pointer-events-none absolute -left-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-[#d9c7a2]/35 blur-2xl transition-transform duration-500 group-hover:translate-x-2" />
                    <div className="relative flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-[#111111] text-white shadow-[0_12px_28px_rgba(17,17,17,0.16)]">
                            <span className="text-[10px] tracking-[0.22em]">AI</span>
                        </div>

                        <div className="text-left">
                            <div className="text-[9px] uppercase tracking-[0.30em] text-black/42">
                                {copy.eyebrow}
                            </div>
                            <div className="text-[13px] font-medium text-[#111111]">
                                {copy.openLabel}
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <div
                className={cn(
                    "fixed bottom-24 left-6 z-[60] w-[calc(100vw-32px)] max-w-[390px] transition-all duration-300",
                    isOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-4 opacity-0"
                )}
            >
                <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/68 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.80),rgba(255,255,255,0.48))]" />
                    <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#d9c7a2]/25 blur-3xl" />
                    <div className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#ede3d0]/65 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:74px_74px]" />

                    <div className="relative border-b border-black/5 px-5 pb-4 pt-5">
                        <div className="mb-2 flex items-start justify-between gap-4">
                            <div>
                                <div className="mb-2 text-[9px] uppercase tracking-[0.30em] text-black/42">
                                    {copy.eyebrow}
                                </div>
                                <h3 className="max-w-[220px] text-[22px] font-light leading-[1.02] tracking-[-0.035em] text-[#111111]">
                                    {copy.title}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/72 text-black/58 transition hover:bg-white/90 hover:text-black"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="max-w-[280px] text-[13px] leading-6 text-black/60">
                            {copy.subtitle}
                        </p>
                    </div>

                    <div
                        ref={scrollRef}
                        className="relative max-h-[360px] overflow-y-auto px-4 py-4"
                        style={{ scrollbarWidth: "thin" }}
                    >
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "max-w-[86%] rounded-[22px] px-4 py-3 text-[13px] leading-6 shadow-[0_12px_32px_rgba(0,0,0,0.035)]",
                                        message.role === "assistant"
                                            ? "border border-white/72 bg-white/82 text-[#111111]"
                                            : "ml-auto border border-[#111111]/8 bg-[#111111] px-4 py-2.5 text-white"
                                    )}
                                >
                                    {message.content}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="max-w-[86%] rounded-[22px] border border-white/72 bg-white/82 px-4 py-3 text-[13px] text-black/50 shadow-[0_12px_32px_rgba(0,0,0,0.035)]">
                                    {copy.thinking}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative border-t border-black/5 px-4 pb-4 pt-4">
                        <div className="mb-3 flex flex-wrap gap-2">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => sendMessage(prompt)}
                                    className="rounded-full border border-white/72 bg-white/78 px-3 py-2 text-[11px] text-black/68 transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-end gap-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={copy.placeholder}
                                rows={1}
                                className="min-h-[50px] flex-1 resize-none rounded-[20px] border border-white/72 bg-white/82 px-4 py-3 text-[13px] text-[#111111] outline-none placeholder:text-black/32"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        void sendMessage();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => sendMessage()}
                                disabled={!canSend}
                                className={cn(
                                    "h-[50px] rounded-full px-4 text-[13px] transition",
                                    canSend
                                        ? "bg-[#111111] text-white shadow-[0_16px_36px_rgba(17,17,17,0.16)] hover:-translate-y-0.5"
                                        : "cursor-not-allowed bg-black/10 text-black/38"
                                )}
                            >
                                {copy.send}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}