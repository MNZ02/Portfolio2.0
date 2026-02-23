'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

import BlackHoleScene, { type SceneQuality } from '@/components/preloader/BlackHoleScene';

gsap.registerPlugin(useGSAP);

const FREEZE_ON_PRELOADER = false;

const BOOT_LINES = [
    'initializing interface kernel',
    'loading component registry',
    'hydrating project data streams',
    'verifying route graph',
];

const PROGRESS_RING_LENGTH = 251.2;

type NavigatorWithMemory = Navigator & {
    deviceMemory?: number;
};

const pickSceneQuality = (): SceneQuality => {
    const pointerCoarse = window.matchMedia('(pointer: coarse)').matches;
    const smallViewport = window.matchMedia('(max-width: 840px)').matches;

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;

    if (pointerCoarse || smallViewport || memory <= 4 || cores <= 4) {
        return 'low';
    }

    if (!pointerCoarse && memory >= 8 && cores >= 10) {
        return 'high';
    }

    return 'medium';
};

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLSpanElement>(null);
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

        setSceneQuality(pickSceneQuality());
        setInteractive(!window.matchMedia('(pointer: coarse)').matches);

        window.sessionStorage.setItem('portfolio-preloader', '1');
        setShowPreloader(true);
    }, []);

    useEffect(() => {
        if (!showPreloader || FREEZE_ON_PRELOADER) return;

        const forceHideTimer = window.setTimeout(() => {
            setShowPreloader(false);
        }, 8500);

        return () => window.clearTimeout(forceHideTimer);
    }, [showPreloader]);

    useGSAP(
        () => {
            if (!showPreloader || !preloaderRef.current) return;

            collapseProgressRef.current = 0;

            const tl = gsap.timeline({
                defaults: {
                    ease: 'power3.out',
                },
            });

            const progress = { value: 0 };
            const collapseState = { value: 0 };

            gsap.set('.pl-scene-wrap', { autoAlpha: 0, scale: 0.92, filter: 'blur(16px)' });
            gsap.set('.pl-vignette', { autoAlpha: 0.35 });
            gsap.set('.pl-overlay-content', { autoAlpha: 0, y: 20, filter: 'blur(10px)' });
            gsap.set('.pl-terminal-line', { autoAlpha: 0, y: 10, filter: 'blur(10px)' });
            gsap.set('.pl-progress-ring-circle', { strokeDashoffset: PROGRESS_RING_LENGTH });

            tl.to(
                '.pl-scene-wrap',
                {
                    autoAlpha: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.5,
                    ease: 'expo.out',
                },
                0
            )
                .to(
                    '.pl-vignette',
                    {
                        autoAlpha: 1,
                        duration: 1.4,
                        ease: 'sine.out',
                    },
                    0.25
                )
                .to(
                    '.pl-overlay-content',
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 1,
                    },
                    0.8
                );

            BOOT_LINES.forEach((line, index) => {
                tl.to(
                    `.pl-line-${index}`,
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.8,
                    },
                    1.3 + index * 0.62
                ).to(
                    `.pl-line-${index}`,
                    {
                        autoAlpha: 0,
                        y: -10,
                        filter: 'blur(10px)',
                        duration: 0.6,
                    },
                    1.3 + index * 0.62 + 1.76
                );
            });

            tl.to(
                progress,
                {
                    value: 100,
                    duration: 5,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        if (!progressRef.current) return;

                        const value = Math.round(progress.value);
                        progressRef.current.textContent = `${value}%`;
                        const offset = PROGRESS_RING_LENGTH - (value / 100) * PROGRESS_RING_LENGTH;
                        gsap.set('.pl-progress-ring-circle', { strokeDashoffset: offset });
                    },
                },
                1.2
            );

            if (FREEZE_ON_PRELOADER) return;

            tl.to(
                '.pl-overlay-content',
                {
                    autoAlpha: 0,
                    scale: 0.72,
                    y: -14,
                    filter: 'blur(8px)',
                    duration: 1.1,
                    ease: 'power4.in',
                },
                6.3
            )
                .to(
                    collapseState,
                    {
                        value: 1,
                        duration: 1.85,
                        ease: 'power4.in',
                        onUpdate: () => {
                            collapseProgressRef.current = collapseState.value;
                        },
                    },
                    6.35
                )
                .to(
                    '.pl-scene-wrap',
                    {
                        scale: 1.48,
                        filter: 'blur(2px)',
                        duration: 1.7,
                        ease: 'power4.in',
                    },
                    6.45
                )
                .to(
                    preloaderRef.current,
                    {
                        autoAlpha: 0,
                        duration: 0.95,
                        onComplete: () => setShowPreloader(false),
                    },
                    7.8
                );

            return () => {
                collapseProgressRef.current = 0;
            };
        },
        { scope: preloaderRef, dependencies: [showPreloader] }
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
                <div className="pl-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.26)_42%,rgba(0,0,0,0.82)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,rgba(42,204,255,0.16),transparent_44%)]" />
            </div>

            <div className="pl-overlay-content pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
                <div className="flex w-full max-w-[520px] flex-col items-center text-center">
                    <div className="relative mb-3 h-10 w-full">
                        {BOOT_LINES.map((line, index) => (
                            <p
                                key={line}
                                className={`pl-terminal-line pl-line-${index} absolute inset-0 flex items-center justify-center text-[10px] font-medium uppercase tracking-[0.26em] text-primary/85 md:text-xs`}
                            >
                                {line}
                            </p>
                        ))}
                    </div>

                    <div className="relative flex h-[210px] w-[210px] items-center justify-center md:h-[250px] md:w-[250px]">
                        <svg className="absolute h-full w-full -rotate-90">
                            <circle
                                className="pl-progress-ring-circle text-primary/85"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="transparent"
                                r="40"
                                cx="50%"
                                cy="50%"
                                strokeLinecap="round"
                                style={{
                                    transform: 'scale(2.47)',
                                    transformOrigin: 'center',
                                    strokeDasharray: `${PROGRESS_RING_LENGTH}`,
                                    filter: 'drop-shadow(0 0 9px hsl(var(--primary)))',
                                }}
                            />
                        </svg>

                        <div className="relative z-10 flex flex-col items-center">
                            <span
                                ref={progressRef}
                                className="text-4xl tracking-tight text-white drop-shadow-[0_0_11px_rgba(255,255,255,0.45)] md:text-5xl"
                            >
                                000%
                            </span>
                            <div className="mt-3 h-px w-14 bg-primary/45" />
                            <p className="mt-1 text-[9px] uppercase tracking-[0.4em] text-primary/55">
                                system.link
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
