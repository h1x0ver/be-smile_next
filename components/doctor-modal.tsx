'use client';

import { X } from 'lucide-react';
import {
  memo,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,

} from 'react';
import { createPortal } from 'react-dom';
import { directusImage, retryImageOnce } from "@/lib/directusImage";

type SlideDoctor = {
  id: string | number;
  imageId: string;
  imagePosition: string;
  name: string;
  role: string;
  shortDescription: string;
  fullDescription: string;
  plainDescription: string;
  number: string;
};

type CopyType = {
  close: string;
  modalLabel: string;
  specialization: string;
  profile: string;
  expert: string;
  sideLabel: string;
};

const cardBaseStyle: CSSProperties = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  contain: 'layout paint style',
};

export const DoctorModal = memo(function DoctorModal({
  selectedDoctor,
  isMobile,
  lowEndMode,
  copy,
  onClose,
}: {
  selectedDoctor: SlideDoctor;
  isMobile: boolean;
  lowEndMode: boolean;
  copy: CopyType;
  onClose: () => void;
}) {

  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const closeTimer = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
      dialog.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  const requestClose = () => {
    if (closeTimer.current !== null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 180);
  };

  const overlayBlurClass = lowEndMode ? 'backdrop-blur-[2px]' : 'backdrop-blur-sm';
  const modalBlurClass = lowEndMode ? 'backdrop-blur-lg' : 'backdrop-blur-xl';

  return createPortal(
        <dialog
          ref={dialogRef}
          aria-modal="true"
          aria-labelledby={titleId}
          onCancel={(event) => { event.preventDefault(); requestClose(); }}
          data-closing={closing || undefined}
          className="bs-doctor-dialog fixed inset-0 z-[9999] m-0 h-[100dvh] w-screen max-h-none max-w-none border-0 bg-transparent p-0 text-inherit backdrop:bg-transparent"
        >
          <button
            type="button"
            aria-label={copy.close}
            className={`bs-doctor-backdrop absolute inset-0 bg-black/48 ${overlayBlurClass}`}
            onClick={requestClose}
          />

          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5 lg:p-8" onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }}>
            <div
              
              className={[
                'bs-doctor-panel relative flex h-[min(920px,100dvh-24px)] w-full max-w-[1280px] flex-col overflow-hidden rounded-[28px] border border-white/20 bg-[rgba(248,246,241,0.86)]',
                'sm:h-[min(860px,100dvh-40px)] sm:rounded-[34px] lg:h-[min(820px,100dvh-64px)] lg:rounded-[36px]',
                lowEndMode
                  ? 'shadow-[0_28px_80px_rgba(0,0,0,0.24)]'
                  : 'shadow-[0_40px_140px_rgba(0,0,0,0.30)]',
                modalBlurClass,
              ].join(' ')}
              style={cardBaseStyle}
            >
              <div className="pointer-events-none absolute inset-0">
                {!lowEndMode && (
                  <>
                    <div className="absolute left-[-8%] top-[-10%] h-[240px] w-[240px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.18),transparent)] scale-[1.6]" />
                    <div className="absolute right-[-6%] top-[12%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(176,139,87,0.105),transparent)] scale-[1.6]" />
                    <div className="absolute bottom-[-10%] left-[30%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />
                  </>
                )}

                <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_36%),linear-gradient(to_bottom,rgba(255,255,255,0.32),transparent_24%,rgba(255,255,255,0.24))]" />
              </div>

              <div className="relative grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
                <div

                  className="relative h-[42svh] min-h-[320px] sm:h-[420px] lg:h-full"
                >
                  <img
                    src={directusImage(selectedDoctor.imageId, 1200, 82)}
                    onError={retryImageOnce}
                    alt={selectedDoctor.name}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: isMobile ? '50% 18%' : selectedDoctor.imagePosition,
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                    }}
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.54)_0%,rgba(17,17,17,0.08)_42%,transparent_100%)]" />

                  <div

                    className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-sm sm:left-6 sm:top-6"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/78">
                      {copy.modalLabel}
                    </span>
                  </div>

                  <div

                    className={[
                      'absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/15 bg-black/24 p-4 sm:bottom-6 sm:left-6 sm:right-6 sm:p-5',
                      lowEndMode
                        ? 'shadow-[0_14px_34px_rgba(0,0,0,0.16)] backdrop-blur-sm'
                        : 'shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-md',
                    ].join(' ')}
                  >
                    <div className="text-[11px] uppercase tracking-[0.28em] text-white/58">
                      {selectedDoctor.role}
                    </div>
                    <div className="mt-2 text-[26px] font-[300] uppercase leading-[1.02] tracking-[0.05em] text-white sm:text-[34px] lg:text-[40px]">
                      {selectedDoctor.name}
                    </div>
                  </div>
                </div>

                <div

                  className="relative flex min-h-0 flex-col"
                >
                  <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/8 px-5 py-5 sm:px-7 lg:px-8">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-black/45">
                        {copy.sideLabel}
                      </div>
                      <div id={titleId} className="mt-2 text-[24px] font-[300] uppercase leading-none tracking-[0.06em] text-[#111111] sm:text-[30px] lg:text-[34px]">
                        {selectedDoctor.name}
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={copy.close}
                    onClick={requestClose}

                      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black/70 backdrop-blur-md transition-colors duration-300 hover:bg-[#111111] hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-7 sm:pb-7 lg:px-8 lg:pb-8">
                    <div

                      className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      <div
                        className={[
                          'rounded-[24px] border border-white/60 bg-white/55 px-4 py-4',
                          lowEndMode
                            ? 'shadow-[0_10px_26px_rgba(0,0,0,0.035)] backdrop-blur-sm'
                            : 'shadow-[0_14px_40px_rgba(0,0,0,0.04)] backdrop-blur-md',
                        ].join(' ')}
                      >
                        <div className="text-[10px] uppercase tracking-[0.28em] text-black/45">
                          {copy.specialization}
                        </div>
                        <div className="mt-2 text-[17px] font-[300] uppercase tracking-[0.05em] text-[#111111] sm:text-[18px]">
                          {selectedDoctor.role}
                        </div>
                      </div>

                      <div
                        className={[
                          'rounded-[24px] border border-white/60 bg-white/55 px-4 py-4',
                          lowEndMode
                            ? 'shadow-[0_10px_26px_rgba(0,0,0,0.035)] backdrop-blur-sm'
                            : 'shadow-[0_14px_40px_rgba(0,0,0,0.04)] backdrop-blur-md',
                        ].join(' ')}
                      >
                        <div className="text-[10px] uppercase tracking-[0.28em] text-black/45">
                          {copy.profile}
                        </div>
                        <div className="mt-2 text-[17px] font-[300] uppercase tracking-[0.05em] text-[#111111] sm:text-[18px]">
                          {copy.expert}
                        </div>
                      </div>
                    </div>

                    <div

                      className={[
                        'rounded-[28px] border border-white/60 bg-white/58 p-5 sm:p-6',
                        lowEndMode
                          ? 'shadow-[0_14px_34px_rgba(0,0,0,0.04)] backdrop-blur-sm'
                          : 'shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-md',
                      ].join(' ')}
                    >
                      <div className="mb-5 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.18),rgba(17,17,17,0.04),transparent)]" />

                      {selectedDoctor.fullDescription?.trim() ? (
                        <div
                          className="prose prose-sm max-w-none text-black/72 prose-headings:font-light prose-headings:tracking-[0.04em] prose-headings:text-[#111111] prose-p:leading-8 prose-p:text-black/72 prose-strong:font-medium prose-strong:text-[#111111] prose-li:text-black/72"
                          dangerouslySetInnerHTML={{ __html: selectedDoctor.fullDescription }}
                        />
                      ) : (
                        <p className="text-[15px] leading-8 text-black/72">
                          {selectedDoctor.plainDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>,
    document.body
  );
});

DoctorModal.displayName = 'DoctorModal';
