'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import BlackHoleScene, { type SceneQuality } from '@/components/preloader/BlackHoleScene';

gsap.registerPlugin(useGSAP);

const FREEZE_ON_PRELOADER = false;

const BOOT_LINES = [
    'aligning singularity lensing field',
    'verifying RBAC, JWT, and SSO controls',
    'warming secure portfolio route graph',
    'syncing Psigenei and Mobipay delivery context',
];

type NavigatorWithMemory = Navigator & {
    deviceMemory?: number;
};

const pickSceneQuality = (): SceneQuality => {
    const pointerCoarse = window.matchMedia('(pointer: coarse)').matches;
    const phoneViewport = window.matchMedia('(max-width: 640px)').matches;
    const compactViewport = window.matchMedia('(max-width: 980px)').matches;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const isMobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;

    if (
        pointerCoarse ||
        phoneViewport ||
        isMobileUA ||
        memory <= 4 ||
        cores <= 4 ||
        devicePixelRatio >= 2.6
    ) {
        return 'low';
    }

    if (!compactViewport && !pointerCoarse && memory >= 8 && cores >= 10 && devicePixelRatio <= 2.1) {
        return 'high';
    }

    return 'medium';
};

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const collapseProgressRef = useRef(0);
    const qualityDebounceRef = useRef<number | null>(null);

    const [showPreloader, setShowPreloader] = useState(false);
    const [sceneQuality, setSceneQuality] = useState<SceneQuality>('medium');
    const [isCoarsePointer, setIsCoarsePointer] = useState(true);
    const [isPhoneViewport, setIsPhoneViewport] = useState(false);
    const [isCompactHeight, setIsCompactHeight] = useState(false);

    const interactive = !isCoarsePointer && sceneQuality !== 'low';
    const visibleBootLines = useMemo(() => {
        if (isPhoneViewport && isCompactHeight) return BOOT_LINES.slice(0, 2);
        if (isPhoneViewport) return BOOT_LINES.slice(0, 3);
        return BOOT_LINES;
    }, [isCompactHeight, isPhoneViewport]);

    const handlePerformanceDip = useCallback(() => {
        if (qualityDebounceRef.current !== null) return;

        qualityDebounceRef.current = window.setTimeout(() => {
            qualityDebounceRef.current = null;
        }, 1500);

        setSceneQuality((currentQuality) => {
            if (currentQuality === 'high') return 'medium';
            if (currentQuality === 'medium') return 'low';
            return currentQuality;
        });
    }, []);

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

        const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const updateViewportState = () => {
            setIsPhoneViewport(window.matchMedia('(max-width: 640px)').matches);
            setIsCompactHeight(window.matchMedia('(max-height: 760px)').matches);
        };

        setSceneQuality(pickSceneQuality());
        setIsCoarsePointer(coarsePointer);
        updateViewportState();

        window.addEventListener('resize', updateViewportState, { passive: true });
        window.sessionStorage.setItem('portfolio-preloader', '1');
        setShowPreloader(true);

        return () => {
            window.removeEventListener('resize', updateViewportState);
        };
    }, []);

    useEffect(
        () => () => {
            if (qualityDebounceRef.current !== null) {
                window.clearTimeout(qualityDebounceRef.current);
            }
        },
        [],
    );

    useEffect(() => {
        if (!showPreloader || FREEZE_ON_PRELOADER) return;

        const maxVisibleMs = isPhoneViewport ? 7000 : 8200;
        const forceHideTimer = window.setTimeout(() => {
            setShowPreloader(false);
        }, maxVisibleMs);

        return () => window.clearTimeout(forceHideTimer);
    }, [isPhoneViewport, showPreloader]);

    useGSAP(
        () => {
            if (!showPreloader || !preloaderRef.current) return;

            collapseProgressRef.current = 0;

            const isPhone = window.matchMedia('(max-width: 640px)').matches;
            const compactHeight = window.matchMedia('(max-height: 760px)').matches;
            const sceneZoom = isPhone ? (compactHeight ? 1.12 : 1.2) : 1.42;

            const tl = gsap.timeline({
                defaults: {
                    ease: 'power3.out',
                    force3D: true,
                },
            });

            const collapseState = { value: 0 };

            gsap.set('.pl-scene-wrap', { autoAlpha: 0, scale: 0.94, filter: 'blur(12px)' });
            gsap.set('.pl-vignette', { autoAlpha: 0.35 });
            gsap.set('.pl-overlay-content', { autoAlpha: 0, y: 20, filter: 'blur(8px)' });
            gsap.set('.pl-headline', { autoAlpha: 0, y: 14, filter: 'blur(6px)' });
            gsap.set('.pl-terminal-line', { autoAlpha: 0, y: 8, filter: 'blur(7px)' });
            gsap.set('.pl-signal-dot', { autoAlpha: 0.25, scale: 0.72 });

            tl.to(
                '.pl-scene-wrap',
                {
                    autoAlpha: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.35,
                    ease: 'expo.out',
                },
                0,
            )
                .to(
                    '.pl-vignette',
                    {
                        autoAlpha: 1,
                        duration: 1.25,
                        ease: 'sine.out',
                    },
                    0.2,
                )
                .to(
                    '.pl-overlay-content',
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.9,
                    },
                    0.72,
                )
                .to(
                    '.pl-headline',
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.8,
                    },
                    0.96,
                );

            visibleBootLines.forEach((line, index) => {
                tl.to(
                    `.pl-line-${index}`,
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.66,
                    },
                    1.36 + index * 0.56,
                ).to(
                    `.pl-line-${index}`,
                    {
                        autoAlpha: 0,
                        y: -9,
                        filter: 'blur(8px)',
                        duration: 0.48,
                    },
                    1.36 + index * 0.56 + 1.34,
                );
            });

            tl.to(
                '.pl-signal-dot',
                {
                    autoAlpha: 0.95,
                    scale: 1,
                    duration: 0.32,
                    stagger: 0.11,
                    repeat: 5,
                    yoyo: true,
                    ease: 'sine.inOut',
                },
                1.22,
            );

            if (FREEZE_ON_PRELOADER) return;

            tl.to(
                '.pl-overlay-content',
                {
                    autoAlpha: 0,
                    scale: 0.75,
                    y: -14,
                    filter: 'blur(10px)',
                    duration: 1,
                    ease: 'power4.in',
                },
                5.45,
            )
                .to(
                    collapseState,
                    {
                        value: 1,
                        duration: 1.72,
                        ease: 'power4.in',
                        onUpdate: () => {
                            collapseProgressRef.current = collapseState.value;
                        },
                    },
                    5.5,
                )
                .to(
                    '.pl-scene-wrap',
                    {
                        scale: sceneZoom,
                        filter: 'blur(2px)',
                        duration: 1.62,
                        ease: 'power4.in',
                    },
                    5.58,
                )
                .to(
                    preloaderRef.current,
                    {
                        autoAlpha: 0,
                        duration: 0.9,
                        onComplete: () => setShowPreloader(false),
                    },
                    6.86,
                );

            return () => {
                collapseProgressRef.current = 0;
            };
        },
        { scope: preloaderRef, dependencies: [showPreloader, visibleBootLines] },
    );

    if (!showPreloader) return null;

    return (
        <div className="pl-preloader fixed inset-0 z-[70] overflow-hidden bg-black" ref={preloaderRef}>
            <div className="pl-scene-wrap absolute inset-0">
                <BlackHoleScene
                    quality={sceneQuality}
                    collapseRef={collapseProgressRef}
                    interactive={interactive}
                    onPerformanceDip={handlePerformanceDip}
                />
                <div className="pl-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,3,10,0.32)_42%,rgba(0,0,0,0.86)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(90,233,255,0.18),transparent_44%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_56%,rgba(120,96,255,0.2),transparent_52%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(188,236,255,0.08),transparent_34%)]" />
            </div>

            <div className="pl-overlay-content pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-2 pb-[max(env(safe-area-inset-bottom),0.65rem)] pt-[max(env(safe-area-inset-top),0.65rem)] will-change-transform sm:px-4">
                <div className="flex w-full max-w-[620px] flex-col items-center rounded-2xl border border-cyan-100/15 bg-[linear-gradient(150deg,rgba(3,8,21,0.7),rgba(3,7,18,0.46))] px-3 py-4 text-center shadow-[0_12px_56px_rgba(0,12,26,0.64)] backdrop-blur-[10px] xs:px-5 sm:px-6 sm:py-7">
                    <p className="pl-headline text-[9px] uppercase tracking-[0.2em] text-cyan-100/85 sm:text-xs sm:tracking-[0.24em]">
                        signature system boot
                    </p>

                    <h2 className="pl-headline mt-2.5 font-anton text-[clamp(1.55rem,9vw,4.4rem)] leading-[0.92] tracking-[0.04em] text-white drop-shadow-[0_0_24px_rgba(173,232,255,0.4)] sm:mt-3 sm:tracking-[0.05em]">
                        Calibrating Singularity
                    </h2>

                    <p className="pl-headline mt-2.5 max-w-[510px] text-[10px] uppercase tracking-[0.11em] text-cyan-100/80 sm:mt-3 sm:text-[13px] sm:tracking-[0.13em] md:text-sm">
                        preparing secure modules and portfolio routes
                    </p>

                    <div className="relative mt-3.5 h-9 w-full overflow-hidden sm:mt-5 sm:h-10">
                        {visibleBootLines.map((line, index) => (
                            <p
                                key={line}
                                className={`pl-terminal-line pl-line-${index} absolute inset-0 flex items-center justify-center px-2 text-[8px] font-medium uppercase tracking-[0.1em] text-cyan-100/90 sm:text-[11px] sm:tracking-[0.16em] md:text-xs`}
                            >
                                {line}
                            </p>
                        ))}
                    </div>

                    <div className="mt-3.5 flex items-center gap-2 sm:mt-5">
                        <span className="pl-signal-dot h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(79,227,255,0.9)]" />
                        <span className="pl-signal-dot h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.8)]" />
                        <span className="pl-signal-dot h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.85)]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
