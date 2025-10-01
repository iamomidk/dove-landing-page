import { type FC, useEffect, useRef, useState } from "react";

export const VideoSection: FC = () => {
    const [open, setOpen] = useState(false);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const prefersReducedMotion =
        typeof window !== "undefined"
            ? window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
            : false;

    const openDialog = () => setOpen(true);
    const close = () => setOpen(false);

    // Refs
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const openerBtnRef = useRef<HTMLButtonElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Lock background scroll when open
    useEffect(() => {
        const original = document.body.style.overflow;
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = original;
        return () => { document.body.style.overflow = original; };
    }, [open]);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // Focus trap + restore focus to opener on close
    useEffect(() => {
        if (!open) return;

        const root = dialogRef.current;
        if (!root) return;

        const getFocusable = () =>
            Array.from(
                root.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

        const focusables = getFocusable();
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        first?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const current = document.activeElement as HTMLElement | null;
            if (!current) { e.preventDefault(); first?.focus(); return; }
            if (!root.contains(current)) return;

            if (!e.shiftKey && current === last) { e.preventDefault(); first?.focus(); }
            else if (e.shiftKey && current === first) { e.preventDefault(); last?.focus(); }
        };

        root.addEventListener("keydown", onKeyDown);
        return () => {
            root.removeEventListener("keydown", onKeyDown);
            openerBtnRef.current?.focus();
        };
    }, [open]);

    // Fetch a pre-signed URL from the server when dialog opens
    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        setLoading(true);
        setSignedUrl(null);

        const params = new URLSearchParams({ key: "input.mp4" }); // change object key if needed
        fetch(`https://dove-backend.liara.run/api/video-url?${params.toString()}`)
            .then(async (r) => {
                if (!r.ok) throw new Error("failed to get signed url");
                return r.json();
            })
            .then((data) => {
                if (!cancelled) setSignedUrl(data.url as string);
            })
            .catch(() => {
                if (!cancelled) setSignedUrl(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [open]);

    // Pause and release src when closing
    useEffect(() => {
        if (open) return;
        const v = videoRef.current;
        try {
            if (v) {
                v.pause();
                v.removeAttribute("src");
                v.load();
            }
        } catch {}
        setSignedUrl(null);
    }, [open]);

    const poster = "/videos/poster.jpg"; // optional; replace with your poster

    return (
        <section id="video" className="scroll-section">
            {/* Cover image + Play button */}
            <div className="relative w-full">
                <img
                    src="/cover.jpg"
                    alt="تصویر محصولات داو"
                    className="w-full max-h-[100vh] object-contain sm:object-cover"
                    loading="lazy"
                />

                <button
                    ref={openerBtnRef}
                    type="button"
                    onClick={openDialog}
                    className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-[#003366] text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003366] flex items-center justify-center bg-center"
                    aria-label="پخش ویدیو"
                    aria-haspopup="dialog"
                    aria-controls="dove-video-dialog"
                    style={{ aspectRatio: "1 / 1" }}
                >
                    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden="true">
                        <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.15" />
                        <path d="M9 7l8 5-8 5V7z" fill="currentColor" />
                    </svg>
                </button>
            </div>

            {/* Dialog */}
            {open && (
                <div
                    id="dove-video-dialog"
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dove-video-title"
                    aria-describedby="dove-video-desc"
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80" />

                    {/* Dialog content */}
                    <div className="relative z-10 w-full h-full">
                        <h2 id="dove-video-title" className="sr-only">ویدیو داو</h2>
                        <p id="dove-video-desc" className="sr-only">پخش ویدیو در پنجره تمام‌صفحه.</p>

                        {signedUrl ? (
                            <video
                                ref={videoRef}
                                className="w-full h-full bg-black"
                                playsInline
                                muted
                                controls
                                autoPlay={!prefersReducedMotion}
                                poster={poster}
                                preload="metadata"
                                src={signedUrl}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                {loading ? "در حال دریافت ویدیو…" : "خطا در بارگذاری ویدیو"}
                            </div>
                        )}

                        {/* Close button (overlay) */}
                        <button
                            type="button"
                            onClick={close}
                            className="absolute top-4 right-4 h-12 w-12 rounded-full bg-[#003366] text-white flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white mt-16"
                            aria-label="بستن ویدیو"
                        >
                            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                <path
                                    d="M18 6L6 18M6 6l12 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
