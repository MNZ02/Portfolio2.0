'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

import BlackHoleScene, { type SceneQuality } from '@/components/preloader/BlackHoleScene';

gsap.registerPlugin(useGSAP);

const FREEZE_ON_PRELOADER = false;

const BOOT_LINES = [
    'stabilizing event horizon',
    'syncing RBAC and JWT policies',
    'handshaking SSO and service gateways',
    'loading Psigenei and Mobipay contexts',
];

type NavigatorWithMemory = Navigator & {
    deviceMemory?: number;
};

const pickSceneQuality = (): SceneQuality => {
    const pointerCoarse = window.matchMedia('(pointer: coarse)').matches;
    const phoneViewport = window.matchMedia('(max-width: 640px)').matches;

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;

    if (pointerCoarse || phoneViewport || memory <= 4 || cores <= 4) {
        return 'low';
    }

    if (!pointerCoarse && memory >= 8 && cores >= 10) {
        return 'high';
    }

    return 'medium';
};

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const collapseProgressRef = useRef(0);

    const [showPreloader, setShowPreloader] = useState(false);
    const [sceneQuality, setSceneQuality] = useState<SceneQuality>('medium');
    const [interactive, setInteractive] = useState(true);

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

        setSceneQuality(pickSceneQuality());
        setInteractive(!coarsePointer);

        window.sessionStorage.setItem('portfolio-preloader', '1');
        setShowPreloader(true);
    }, []);

    useEffect(() => {
        if (!showPreloader || FREEZE_ON_PRELOADER) return;

        const forceHideTimer = window.setTimeout(() => {
            setShowPreloader(false);
        }, 8200);

        return () => window.clearTimeout(forceHideTimer);
    }, [showPreloader]);

    useGSAP(
        () => {
            if (!showPreloader || !preloaderRef.current) return;

            collapseProgressRef.current = 0;

            const isPhone = window.matchMedia('(max-width: 640px)').matches;
            const sceneZoom = isPhone ? 1.26 : 1.46;

            const tl = gsap.timeline({
                defaults: {
                    ease: 'power3.out',
                },
            });

            const collapseState = { value: 0 };

            gsap.set('.pl-scene-wrap', { autoAlpha: 0, scale: 0.9, filter: 'blur(16px)' });
            gsap.set('.pl-vignette', { autoAlpha: 0.35 });
            gsap.set('.pl-overlay-content', { autoAlpha: 0, y: 18, filter: 'blur(10px)' });
            gsap.set('.pl-headline', { autoAlpha: 0, y: 16, filter: 'blur(8px)' });
            gsap.set('.pl-terminal-line', { autoAlpha: 0, y: 9, filter: 'blur(10px)' });
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

            BOOT_LINES.forEach((line, index) => {
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
        { scope: preloaderRef, dependencies: [showPreloader] },
    );

    if (!showPreloader) return null;

    return (
        <div className="pl-preloader fixed inset-0 z-[70] overflow-hidden bg-black" ref={preloaderRef}>
            <div className="pl-scene-wrap absolute inset-0">
                <BlackHoleScene
                    quality={sceneQuality}
                    collapseRef={collapseProgressRef}
                    interactive={interactive}
                />
                <div className="pl-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,3,10,0.32)_42%,rgba(0,0,0,0.86)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(91,222,255,0.12),transparent_42%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_54%,rgba(122,92,255,0.18),transparent_48%)]" />
            </div>

            <div className="pl-overlay-content pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
                <div className="flex w-full max-w-[560px] flex-col items-center text-center">
                    <p className="pl-headline text-[10px] uppercase tracking-[0.32em] text-cyan-200/80 sm:text-xs">
                        signature system boot
                    </p>

                    <h2 className="pl-headline mt-3 text-3xl leading-none text-white drop-shadow-[0_0_18px_rgba(178,236,255,0.32)] sm:text-4xl md:text-5xl">
                        Calibrating Singularity
                    </h2>

                    <p className="pl-headline mt-3 max-w-[420px] text-[11px] uppercase tracking-[0.18em] text-cyan-100/70 sm:text-xs md:text-sm">
                        preparing secure modules and portfolio routes
                    </p>

                    <div className="relative mt-5 h-9 w-full">
                        {BOOT_LINES.map((line, index) => (
                            <p
                                key={line}
                                className={`pl-terminal-line pl-line-${index} absolute inset-0 flex items-center justify-center text-[9px] font-medium uppercase tracking-[0.24em] text-cyan-100/85 sm:text-[10px] md:text-xs`}
                            >
                                {line}
                            </p>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 sm:mt-5">
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
