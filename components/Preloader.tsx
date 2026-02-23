'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const FREEZE_ON_PRELOADER = false;

const BOOT_LINES = [
    'initializing interface kernel',
    'loading component registry',
    'hydrating project data streams',
    'verifying route graph',
];

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLSpanElement>(null);
    const [showPreloader, setShowPreloader] = useState(false);

    useEffect(() => {
        if (FREEZE_ON_PRELOADER) {
            setShowPreloader(true);
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const seenPreloader = window.sessionStorage.getItem('portfolio-preloader') === '1';

        if (reducedMotion || seenPreloader) {
            return;
        }

        window.sessionStorage.setItem('portfolio-preloader', '1');
        setShowPreloader(true);
    }, []);

    useEffect(() => {
        if (!showPreloader || FREEZE_ON_PRELOADER) return;

        // Failsafe: never let the loader block the app if an animation is interrupted.
        const forceHideTimer = window.setTimeout(() => {
            setShowPreloader(false);
        }, 4200);

        return () => window.clearTimeout(forceHideTimer);
    }, [showPreloader]);

    useGSAP(
        () => {
            if (!showPreloader || !preloaderRef.current) return;

            const tl = gsap.timeline({
                defaults: {
                    ease: 'power2.out',
                },
            });

            const progress = { value: 0 };

            gsap.set('.pl-shell', { autoAlpha: 0, y: 16, scale: 0.985 });
            gsap.set('.pl-line', { autoAlpha: 0, y: 7 });
            gsap.set('.pl-progress-fill', { scaleX: 0, transformOrigin: 'left center' });
            gsap.set('.pl-led', { autoAlpha: 0.7 });

            gsap.to('.pl-led', {
                autoAlpha: 1,
                duration: 0.85,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                stagger: 0.12,
            });

            gsap.to('.pl-cursor', {
                autoAlpha: 0,
                duration: 0.46,
                ease: 'none',
                repeat: -1,
                yoyo: true,
            });

            gsap.to('.pl-grid', {
                backgroundPosition: '120px 120px',
                duration: 7,
                ease: 'none',
                repeat: -1,
            });

            tl.to('.pl-shell', {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.46,
                ease: 'power3.out',
            })
                .to(
                    '.pl-line',
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.26,
                        stagger: 0.1,
                        ease: 'power2.out',
                    },
                    '<0.06',
                )
                .to(
                    '.pl-progress-fill',
                    {
                        scaleX: 1,
                        duration: 1.6,
                        ease: 'power1.inOut',
                    },
                    '<0.04',
                )
                .to(
                    progress,
                    {
                        value: 100,
                        duration: 1.6,
                        ease: 'none',
                        onUpdate: () => {
                            if (!progressRef.current) return;
                            const value = Math.round(progress.value).toString().padStart(3, '0');
                            progressRef.current.textContent = `${value}%`;
                        },
                    },
                    '<',
                )
                .to(
                    '.pl-status-ready',
                    {
                        color: 'hsl(184, 93%, 44%)',
                        duration: 0.22,
                    },
                    '-=0.22',
                );

            if (FREEZE_ON_PRELOADER) {
                tl.to('.pl-shell', {
                    scale: 1.008,
                    duration: 1,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                });
                return;
            }

            tl.to({}, { duration: 0.16 })
                .to('.pl-backdrop, .pl-grid', {
                    autoAlpha: 0,
                    duration: 0.32,
                    ease: 'power2.in',
                })
                .to(
                    '.pl-shell',
                    {
                        autoAlpha: 0,
                        y: -10,
                        duration: 0.32,
                        ease: 'power2.in',
                    },
                    '<0.04',
                )
                .to(
                    preloaderRef.current,
                    {
                        autoAlpha: 0,
                        duration: 0.2,
                        onComplete: () => setShowPreloader(false),
                    },
                    '<0.08',
                );
        },
        { scope: preloaderRef, dependencies: [showPreloader] },
    );

    if (!showPreloader) return null;

    return (
        <div className="pl-preloader fixed inset-0 z-[70]" ref={preloaderRef}>
            <div className="pl-backdrop absolute inset-0" />
            <div className="pl-grid absolute inset-0" />

            <div className="pl-shell absolute left-1/2 top-1/2 w-[min(90vw,460px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--surface-1)/0.88)] shadow-[0_24px_80px_hsl(220_50%_2%_/_0.62)] backdrop-blur-md">
                <div className="pl-header flex items-center gap-2 border-b border-border/70 px-4 py-3">
                    <span className="pl-led h-2.5 w-2.5 rounded-full bg-primary/80" />
                    <span className="pl-led h-2.5 w-2.5 rounded-full bg-primary/55" />
                    <span className="pl-led h-2.5 w-2.5 rounded-full bg-primary/35" />
                    <p className="ml-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">portfolio.boot</p>
                </div>

                <div className="pl-body space-y-2 px-4 py-4 font-mono">
                    {BOOT_LINES.map((line) => (
                        <p className="pl-line text-[12px] text-foreground/84" key={line}>
                            <span className="pl-prompt mr-2 text-primary/90">&gt;</span>
                            {line}
                        </p>
                    ))}

                    <div className="pl-line mt-2 flex items-center justify-between gap-4 text-[12px] text-foreground/85">
                        <p>
                            <span className="pl-prompt mr-2 text-primary/90">$</span>
                            compiling app shell
                        </p>
                        <span className="pl-progress-value text-primary/90" ref={progressRef}>
                            000%
                        </span>
                    </div>

                    <div className="pl-line pl-progress-track h-1.5 overflow-hidden rounded-full bg-[hsl(var(--primary)/0.14)]">
                        <span className="pl-progress-fill block h-full w-full rounded-full" />
                    </div>

                    <p className="pl-line pl-status-ready text-[12px] text-foreground/82">
                        <span className="pl-prompt mr-2 text-primary/90">$</span>
                        launching portfolio
                        <span className="pl-cursor ml-1 text-primary/90">_</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
