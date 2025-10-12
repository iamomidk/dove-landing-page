import {type FC, useEffect, useRef, useState} from "react";

const API_BASE = "https://dove-backend.liara.run";
const SIGNED_DEFAULT_EXPIRES = 600; // seconds

export const VideoSection: FC = () => {
    const [open, setOpen] = useState(false);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errText, setErrText] = useState<string | null>(null);

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
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // Focus trap + restore focus
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
            if (!current) {
                e.preventDefault();
                first?.focus();
                return;
            }
            if (!root.contains(current)) return;

            if (!e.shiftKey && current === last) {
                e.preventDefault();
                first?.focus();
            } else if (e.shiftKey && current === first) {
                e.preventDefault();
                last?.focus();
            }
        };

        root.addEventListener("keydown", onKeyDown);
        return () => {
            root.removeEventListener("keydown", onKeyDown);
            openerBtnRef.current?.focus();
        };
    }, [open]);

    // Fetch signed URL (with static fallback)
    useEffect(() => {
        if (!open) return;
        let cancelled = false;

        const fetchVideoUrl = async () => {
            setLoading(true);
            setSignedUrl(null);
            setErrText(null);

            // change this key if your object is elsewhere in the bucket
            const s3Key = "input.mp4";
            const encodedKey = encodeURIComponent(s3Key);

            try {
                // Signed URL
                const u = new URL(`${API_BASE}/api/video-url/signed/${encodedKey}`);
                u.searchParams.set("expires", String(SIGNED_DEFAULT_EXPIRES));
                u.searchParams.set("disposition", "inline");
                u.searchParams.set("filename", s3Key.split("/").pop() || "video.mp4");

                const r = await fetch(u.toString());
                const data = await r.json().catch(() => ({}));
                if (!r.ok || data?.ok === false || !data?.url) {
                    throw new Error(data?.error || "خطا در دریافت لینک امن ویدیو");
                }
                if (!cancelled) {
                    setSignedUrl(String(data.url));
                }
            } catch (e: any) {
                // Fallback to static (unsigned) URL
                try {
                    const file = s3Key.split("/").pop() || "video.mp4";
                    const r2 = await fetch(`${API_BASE}/api/video-url/static/${encodeURIComponent(file)}`);
                    const data2 = await r2.json().catch(() => ({}));
                    if (!r2.ok || data2?.ok === false || !data2?.url) {
                        throw new Error(data2?.error || "خطا در دریافت لینک ویدیو");
                    }
                    if (!cancelled) {
                        setSignedUrl(String(data2.url));
                    }
                } catch (e2: any) {
                    if (!cancelled) {
                        setErrText(e2?.message || "خطا در بارگذاری ویدیو");
                        setSignedUrl(null);
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchVideoUrl();
        return () => {
            cancelled = true;
        };
    }, [open]);

    // Pause & cleanup on close
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
        setErrText(null);
    }, [open]);

    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const bgImage = isDesktop ? "/cover-desktop.webp" : "/cover-mobile.webp";

    return (
        <section
            id="video"
            className="scroll-section relative flex justify-center items-center bg-cover bg-center bg-no-repeat min-h-[100svh]"
            style={{backgroundImage: `url('${bgImage}')`}}
        >
            {/* Play Button */}
            <button
                ref={openerBtnRef}
                type="button"
                onClick={openDialog}
                className="absolute md:static m-auto h-20 w-20 rounded-full bg-[#003366] text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003366] flex items-center justify-center"
                aria-label="پخش ویدیو"
                aria-haspopup="dialog"
                aria-controls="dove-video-dialog"
                style={{aspectRatio: "1 / 1"}}
            >
                <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden="true">
                    <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.15" />
                    <path d="M9 7l8 5-8 5V7z" fill="currentColor" />
                </svg>
            </button>

            {/* Dialog */}
            {open && (
                <div
                    id="dove-video-dialog"
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dove-video-title"
                    aria-describedby="dove-video-desc"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) close();
                    }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80" />

                    {/* Video Container */}
                    <div className="relative z-10 w-full max-w-5xl h-[60vh] md:h-[80vh] bg-black rounded-md overflow-hidden flex items-center justify-center">
                        <h2 id="dove-video-title" className="sr-only">
                            ویدیو داو
                        </h2>
                        <p id="dove-video-desc" className="sr-only">
                            پخش ویدیو در پنجره تمام‌صفحه.
                        </p>

                        {signedUrl ? (
                            <video
                                ref={videoRef}
                                className="w-full h-full object-contain"
                                playsInline
                                controls
                                autoPlay={!prefersReducedMotion}
                                preload="metadata"
                                src={signedUrl}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                {loading ? "در حال دریافت ویدیو…" : (errText || "خطا در بارگذاری ویدیو")}
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={close}
                            className="absolute top-4 right-4 h-12 w-12 text-white flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white rounded-full bg-black/50"
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
