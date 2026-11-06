"use client";

import Script from "next/script";
import { motion, Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/directus";

declare global {
    interface Window {
        instgrm?: {
            Embeds?: {
                process: () => void;
            };
        };
    }
}

type FeedType = "all" | "reel" | "photo";

type FeedItem = {
    id: string;
    type: Exclude<FeedType, "all">;
    title: string;
    description: {
        ru: string;
        en: string;
        az: string;
    };
    url: string;
    category: {
        ru: string;
        en: string;
        az: string;
    };
    featured?: boolean;
};

type ActivityFeedPageClientProps = {
    lang: Lang;
};

const copy = {
    ru: {
        eyebrow: "BESMILE / АКТИВНОСТЬ / INSTAGRAM",
        title: "ЛЕНТА АКТИВНОСТИ",
        intro:
            "Клинические кейсы, эстетика улыбки, экспертные материалы врачей и атмосфера BeSmile — в единой премиальной ленте, которая продолжает визуальный язык бренда.",
        all: "Все",
        reels: "Reels",
        photos: "Фото",
        featured: "Главная публикация",
        latest: "Новые публикации и reels",
        curated: "Отобранные материалы",
        watchOnInstagram: "Открыть в Instagram",
        stats1: "Формат",
        stats1Value: "Reels + Posts",
        stats2: "Темы",
        stats2Value: "Кейсы / Экспертность",
        stats3: "Подход",
        stats3Value: "Эстетика + клиника",
        sectionTitle: "Новые публикации и reels",
        empty: "Скоро здесь появятся новые публикации.",
        reel: "Reel",
        photo: "Фото",
    },
    en: {
        eyebrow: "BESMILE / ACTIVITY / INSTAGRAM",
        title: "ACTIVITY FEED",
        intro:
            "Clinical cases, smile aesthetics, expert insights from our doctors, and the atmosphere of BeSmile — brought together in one premium feed that extends the visual language of the brand.",
        all: "All",
        reels: "Reels",
        photos: "Photos",
        featured: "Featured post",
        latest: "Latest posts and reels",
        curated: "Curated materials",
        watchOnInstagram: "Open on Instagram",
        stats1: "Format",
        stats1Value: "Reels + Posts",
        stats2: "Topics",
        stats2Value: "Cases / Expertise",
        stats3: "Approach",
        stats3Value: "Aesthetics + clinical care",
        sectionTitle: "Latest posts and reels",
        empty: "New publications will appear here soon.",
        reel: "Reel",
        photo: "Photo",
    },
    az: {
        eyebrow: "BESMILE / AKTİVLİK / INSTAGRAM",
        title: "AKTİVLİK LENTİ",
        intro:
            "Klinik hallar, gülüş estetikası, həkimlərimizin ekspert materialları və BeSmile atmosferi — brendin vizual dilini davam etdirən vahid premium lentdə birləşdirilir.",
        all: "Hamısı",
        reels: "Reels",
        photos: "Fotolar",
        featured: "Əsas paylaşım",
        latest: "Son postlar və reels",
        curated: "Seçilmiş materiallar",
        watchOnInstagram: "Instagram-da aç",
        stats1: "Format",
        stats1Value: "Reels + Postlar",
        stats2: "Mövzular",
        stats2Value: "Hallar / Ekspertlik",
        stats3: "Yanaşma",
        stats3Value: "Estetika + klinika",
        sectionTitle: "Son postlar və reels",
        empty: "Yeni paylaşımlar tezliklə burada görünəcək.",
        reel: "Reel",
        photo: "Foto",
    },
} as const;

const feedItems: FeedItem[] = [

    {
        id: "1",
        type: "photo",
        title: "Diş implantasiyası",
        description: {
            ru: "Восстановление утраченных зубов с помощью дентальных имплантов и керамических коронок.",
            en: "Restoration of missing teeth using modern dental implants and ceramic crowns.",
            az: "Müasir diş implantları və keramika tacları vasitəsilə itirilmiş dişlərin bərpası.",
        },
        url: "https://www.instagram.com/p/DVeRa86DBzn/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
        category: {
            ru: "Имплантация зубов",
            en: "Dental Implantation",
            az: "Diş implantasiyası",
        },
    },
    {
        id: "2",
        type: "photo",
        title: "Zirkon Estetikası",
        description: {
            ru: "Полное обновление улыбки с цирконием. Естественно и точно.",
            en: "Full smile makeover with zirconia. Natural and precise.",
            az: "Zirkonla tam gülüş yenilənməsi. Təbii və dəqiq.",
        },
        url: "https://www.instagram.com/p/DSxbeE1jHBC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        category: {
            ru: "Эстетика с цирконием",
            en: "Zirconia Smile",
            az: "Zirkon Estetikası",
        },
    },
    {
        id: "3",
        type: "photo",
        title: "Yeni gülüş. Yeni güvən",
        description: {
            ru: "Функция и эстетика восстановлены на имплантах. Надёжно и точно.",
            en: "Function and aesthetics restored on implants. Reliable and precise.",
            az: "İmplantlar üzərində funksiya və estetika bərpa olundu. Etibarlı və dəqiq.",
        },
        url: "https://www.instagram.com/p/DTDh3_0jOqL/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        category: {
            ru: "Полное восстановление на имплантах",
            en: "Full Implant Restoration",
            az: "İmplant üzərində tam bərpa",
        },
    },
    {
        id: "4",
        type: "reel",
        title: "İlk diş müayinəsi",
        description: {
            ru: "Первый осмотр — после появления первого зуба. И обязательно до 1 года. Ранний визит помогает предотвратить проблемы и сформировать правильный уход с детства.",
            en: "The first check-up — after the first tooth appears. And обязательно before age one. Early visits help prevent issues and build healthy habits from the start.",
            az: "İlk müayinə — ilk diş çıxdıqdan sonra. Və mütləq 1 yaşa qədər. Erkən müayinə gələcək problemlərin qarşısını alır və düzgün vərdişlər formalaşdırır.",
        },
        url: "https://www.instagram.com/reel/DU_XGNViLQp/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        category: {
            ru: "Когда первый визит к стоматологу?",
            en: "First dental visit?",
            az: "İlk diş müayinəsi nə zaman?",
        },
    },
    {
        id: "5",
        type: "reel",
        title: "Düzgün gülüşə yol",
        description: {
            ru: "Брекеты — это не быстрый результат, а продуманный процесс. С каждым месяцем улыбка становится ровнее, гармоничнее и увереннее. Точность, контроль и терпение приводят к результату, который остаётся на годы.",
            en: "Braces are not a quick fix, but a carefully planned process. With each month, the smile becomes straighter, more balanced, and more confident. Precision, consistency, and patience lead to results that last for years.",
            az: "Breket müalicəsi sürətli deyil, planlı bir prosesdir. Hər ay gülüş daha düz, daha balanslı və daha güvənli olur. Dəqiqlik, nəzarət və səbr uzunmüddətli nəticə verir.",
        },
        url: "https://www.instagram.com/reel/DTh1nh9jCBA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        category: {
            ru: "Путь к ровной улыбке",
            en: "The Path to a Perfect Smile",
            az: "Düzgün gülüşə yol",
        },
    },
     {
        id: "6  ",
        type: "reel",
        title: "Gülüş transformasiyası",
        description: {
            ru: "Трансформация улыбки с акцентом на эстетику, пропорции и итоговый визуальный результат.",
            en: "A smile transformation focused on aesthetics, harmony, and the final visual outcome.",
            az: "Estetika, proporsiya və yekun vizual nəticəyə fokuslanan gülüş transformasiyası.",
        },
        url: "https://www.instagram.com/reel/DV1cPNAjATG/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
        category: {
            ru: "Трансформация улыбки",
            en: "Smile transformation",
            az: "Gülüş transformasiyası",
        },
    },
];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    }),
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function FeedFilter({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "rounded-full px-4 py-3 text-[11px] uppercase tracking-[0.22em] transition-all duration-300",
                active
                    ? "bg-[#111111] text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
                    : "bg-white/70 text-black/52 hover:bg-white hover:text-black/75"
            )}
        >
            {children}
        </button>
    );
}

function EmbedCard({
    item,
    lang,
    large = false,
    delay = 0,
}: {
    item: FeedItem;
    lang: Lang;
    large?: boolean;
    delay?: number;
}) {
    const t = copy[lang];

    return (
        <motion.article
            custom={delay}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className={cn(
                "group relative overflow-hidden rounded-[32px] border border-white/65 bg-white/62 backdrop-blur-xl",
                "shadow-[0_20px_80px_rgba(0,0,0,0.08)] transition-all duration-500",
                "hover:-translate-y-1 hover:shadow-[0_28px_100px_rgba(0,0,0,0.10)]"
            )}
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-8 top-0 h-28 w-28 rounded-full bg-white/70 blur-3xl" />
                <div className="absolute -right-8 bottom-0 h-36 w-36 rounded-full bg-[#d9c7a2]/20 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.26),rgba(255,255,255,0.06))]" />
            </div>

            <div className="relative border-b border-black/8 px-6 py-5 sm:px-7">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.26em] text-black/42">
                            {item.category[lang]}
                        </div>

                        <h3
                            className={cn(
                                "mt-2 max-w-[18ch] text-balance font-[300] leading-[1.04] tracking-[-0.035em] text-[#111111]",
                                large ? "text-[30px] sm:text-[40px]" : "text-[24px] sm:text-[30px]"
                            )}
                        >
                            {item.title}
                        </h3>
                    </div>

                    <div className="shrink-0 rounded-full border border-black/10 bg-white/72 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-black/50">
                        {item.type === "reel" ? t.reel : t.photo}
                    </div>
                </div>
            </div>

            <div className="relative px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                <div className="rounded-[26px] border border-white/70 bg-[#fcfbf8]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="overflow-hidden rounded-[22px] border border-black/6 bg-white">
                        <blockquote
                            className="instagram-media !m-0 !min-w-0 !max-w-none"
                            data-instgrm-permalink={item.url}
                            data-instgrm-version="14"
                            style={{
                                background: "#fff",
                                border: 0,
                                borderRadius: 0,
                                boxShadow: "none",
                                margin: 0,
                                width: "100%",
                                minWidth: "100%",
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="relative border-t border-black/8 px-6 py-5 sm:px-7">
                <p className="text-[14px] leading-7 text-black/64 sm:text-[15px]">
                    {item.description[lang]}
                </p>
            </div>
        </motion.article>
    );
}

export default function ActivityFeedPageClient({
    lang,
}: ActivityFeedPageClientProps) {
    const t = copy[lang];
    const [activeTab, setActiveTab] = useState<FeedType>("all");

    const filteredItems = useMemo(() => {
        if (activeTab === "all") return feedItems;
        return feedItems.filter((item) => item.type === activeTab);
    }, [activeTab]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.instgrm?.Embeds?.process?.();
        }, 180);

        return () => clearTimeout(timeout);
    }, [filteredItems]);

    const featuredItem =
        filteredItems.find((item) => item.featured) ?? filteredItems[0] ?? null;

    const remainingItems = filteredItems;

    return (
        <>
            <Script
                src="https://www.instagram.com/embed.js"
                strategy="lazyOnload"
                onLoad={() => window.instgrm?.Embeds?.process?.()}
            />

            <div className="relative min-h-screen overflow-hidden bg-[#f8f6f1] text-[#111111]">
                <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,227,208,0.95),transparent_28%),radial-gradient(circle_at_top_right,rgba(201,174,123,0.18),transparent_24%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.92),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.52),rgba(255,255,255,0.14))]" />

                <div className="pointer-events-none absolute -left-16 top-[-20px] h-[300px] w-[300px] rounded-full bg-[#d9c7a2]/28 blur-3xl sm:h-[380px] sm:w-[380px]" />
                <div className="pointer-events-none absolute right-[-40px] top-[60px] h-[280px] w-[280px] rounded-full bg-[#c9ae7b]/18 blur-3xl sm:h-[360px] sm:w-[360px]" />
                <div className="pointer-events-none absolute bottom-[-80px] left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-white/80 blur-3xl sm:h-[420px] sm:w-[420px]" />

                <section className="relative mx-auto max-w-[1600px] px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden rounded-[36px] border border-white/65 bg-white/56 px-6 py-7 shadow-[0_24px_90px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:px-8 sm:py-8 lg:px-10 lg:py-10"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))]" />

                        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-10">
                            <div className="max-w-[860px]">
                                <div className="inline-flex items-center rounded-full border border-black/10 bg-white/72 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-black/50">
                                    {t.eyebrow}
                                </div>

                                <h1 className="mt-6 max-w-[10ch] text-balance text-[42px] font-[300] leading-[0.92] tracking-[0.08em] text-[#111111] sm:text-[64px] lg:text-[92px]">
                                    {t.title}
                                </h1>

                                <p className="mt-6 max-w-[720px] text-[15px] leading-8 text-black/65 sm:text-[17px] sm:leading-8">
                                    {t.intro}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                                {[
                                    [t.stats1, t.stats1Value],
                                    [t.stats2, t.stats2Value],
                                    [t.stats3, t.stats3Value],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-[24px] border border-white/70 bg-white/66 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl"
                                    >
                                        <div className="text-[10px] uppercase tracking-[0.24em] text-black/40">
                                            {label}
                                        </div>
                                        <div className="mt-2 text-[16px] font-[300] leading-6 text-[#111111]">
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative mt-8 border-t border-black/8 pt-5">
                            <div className="flex flex-wrap gap-2">
                                <FeedFilter active={activeTab === "all"} onClick={() => setActiveTab("all")}>
                                    {t.all}
                                </FeedFilter>
                                <FeedFilter active={activeTab === "reel"} onClick={() => setActiveTab("reel")}>
                                    {t.reels}
                                </FeedFilter>
                                <FeedFilter active={activeTab === "photo"} onClick={() => setActiveTab("photo")}>
                                    {t.photos}
                                </FeedFilter>
                            </div>
                        </div>
                    </motion.div>
                </section>



                <section className="relative mx-auto max-w-[1600px] px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pb-32">
                    <div className="mb-8 flex items-center gap-4 sm:mb-10">
                        <span className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                            {t.sectionTitle}
                        </span>
                        <div className="h-px flex-1 bg-black/10" />
                    </div>

                    {remainingItems.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {remainingItems.map((item, index) => (
                                <EmbedCard
                                    key={item.id}
                                    item={item}
                                    lang={lang}
                                    delay={0.04 * index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[34px] border border-white/70 bg-white/55 px-8 py-16 text-center backdrop-blur-xl shadow-[0_24px_90px_rgba(0,0,0,0.07)]">
                            <p className="text-[16px] text-black/60">{t.empty}</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}