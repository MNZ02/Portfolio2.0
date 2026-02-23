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

        const forceHideTimer = window.setTimeout(() => {
            setShowPreloader(false);
        }, 8500);

        return () => window.clearTimeout(forceHideTimer);
    }, [showPreloader]);

    useGSAP(
        () => {
            if (!showPreloader || !preloaderRef.current) return;

            const tl = gsap.timeline({
                defaults: {
                    ease: 'power3.out',
                },
            });

            const progress = { value: 0 };

            // Reset initial states
            gsap.set('.pl-black-hole', { scale: 0.5, autoAlpha: 0 });
            gsap.set('.pl-star', { autoAlpha: 0, scale: 0 });
            gsap.set('.pl-terminal-line', { autoAlpha: 0, y: 10, filter: 'blur(10px)' });
            gsap.set('.pl-progress-ring-circle', { strokeDashoffset: 251.2 });

            // Background Star Animation
            tl.to('.pl-star', {
                autoAlpha: (i) => Math.random() * 0.7 + 0.3,
                scale: (i) => Math.random() * 1.5 + 0.5,
                duration: 2,
                stagger: {
                    amount: 1.5,
                    from: "center"
                }
            }, 0);

            // Black Hole Appears
            tl.to('.pl-black-hole', {
                scale: 1,
                autoAlpha: 1,
                duration: 2.5,
                ease: 'expo.out'
            }, 0.5);

            // Terminal lines stagger in and out
            BOOT_LINES.forEach((line, index) => {
                tl.to(`.pl-line-${index}`, {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                }, 1.5 + index * 0.6)
                .to(`.pl-line-${index}`, {
                    autoAlpha: 0,
                    y: -10,
                    filter: 'blur(10px)',
                    duration: 0.6,
                }, 1.5 + index * 0.6 + 1.8);
            });

            // Progress Ring & Percentage
            tl.to(
                progress,
                {
                    value: 100,
                    duration: 5,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        if (!progressRef.current) return;
                        const val = Math.round(progress.value);
                        progressRef.current.textContent = `${val}%`;
                        const offset = 251.2 - (val / 100) * 251.2;
                        gsap.set('.pl-progress-ring-circle', { strokeDashoffset: offset });
                    },
                },
                1.5
            );

            // Pulsing effect
            gsap.to('.pl-black-hole-core', {
                scale: 1.05,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Rotation
            gsap.to('.pl-accretion-disk', {
                rotate: 360,
                duration: 15,
                repeat: -1,
                ease: 'none'
            });

            if (FREEZE_ON_PRELOADER) return;

            // Transition: Sucking effect then expansion
            tl.to('.pl-terminal-content, .pl-stars-container', {
                scale: 0.1,
                autoAlpha: 0,
                duration: 1.4,
                ease: 'power4.in'
            }, 6.5)
            .to('.pl-black-hole', {
                scale: 50,
                duration: 1.8,
                ease: 'power4.in',
            }, 6.8)
            .to(preloaderRef.current, {
                autoAlpha: 0,
                duration: 1,
                onComplete: () => setShowPreloader(false)
            }, 8);
        },
        { scope: preloaderRef, dependencies: [showPreloader] }
    );

    if (!showPreloader) return null;

    const stars = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 0.5,
    }));

    return (
        <div className="pl-preloader fixed inset-0 z-[70] bg-[#000] overflow-hidden" ref={preloaderRef}>
            {/* Star Background */}
            <div className="pl-stars-container absolute inset-0 pointer-events-none">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="pl-star absolute bg-white rounded-full"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            boxShadow: '0 0 8px rgba(255,255,255,0.6)'
                        }}
                    />
                ))}
            </div>

            {/* Black Hole Center */}
            <div className="relative h-full flex flex-col items-center justify-center">
                <div className="pl-black-hole relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
                    
                    {/* Accretion Disk / Event Horizon Glow */}
                    <div className="pl-accretion-disk absolute inset-0 rounded-full border-[1px] border-primary/30 blur-[2px]" />
                    <div className="pl-accretion-disk absolute -inset-6 rounded-full border-[1px] border-primary/10 blur-[4px]" />
                    
                    {/* Gravitational Lensing Effect (Glow) */}
                    <div className="absolute inset-0 rounded-full bg-primary/5 blur-[60px]" />
                    <div className="absolute inset-10 rounded-full bg-primary/10 blur-[40px]" />

                    {/* The Singularity */}
                    <div className="pl-black-hole-core relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-black shadow-[0_0_50px_10px_hsl(var(--primary)/0.4),_inset_0_0_40px_hsl(var(--primary)/0.2)] z-10 border border-primary/20" />

                    {/* Progress Ring */}
                    <svg className="absolute w-52 h-52 md:w-60 md:h-60 -rotate-90 z-20 pointer-events-none">
                        <circle
                            className="pl-progress-ring-circle text-primary"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            r="40"
                            cx="50%"
                            cy="50%"
                            strokeLinecap="round"
                            style={{
                                transform: 'scale(2.45)',
                                transformOrigin: 'center',
                                strokeDasharray: '251.2',
                                filter: 'drop-shadow(0 0 8px hsl(var(--primary)))'
                            }}
                        />
                    </svg>

                    {/* Terminal Content */}
                    <div className="pl-terminal-content absolute z-30 flex flex-col items-center text-center w-full px-8">
                        <div className="h-10 mb-2 relative w-full">
                            {BOOT_LINES.map((line, i) => (
                                <p key={i} className={`pl-terminal-line pl-line-${i} text-[10px] md:text-xs text-primary/90 uppercase tracking-[0.25em] font-medium absolute inset-0 flex items-center justify-center`}>
                                    {line}
                                </p>
                            ))}
                        </div>
                        <span ref={progressRef} className="text-3xl md:text-4xl font-mono text-white tracking-tighter mt-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            000%
                        </span>
                        <div className="w-12 h-[1px] bg-primary/40 mt-3 mb-1" />
                        <p className="text-[9px] uppercase tracking-[0.4em] text-primary/50">system.link</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
