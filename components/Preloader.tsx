'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const [showPreloader, setShowPreloader] = useState(false);
    const particleCount = 34;

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const seenPreloader = window.sessionStorage.getItem('portfolio-preloader') === '1';

        if (reducedMotion || seenPreloader) {
            return;
        }

        window.sessionStorage.setItem('portfolio-preloader', '1');
        setShowPreloader(true);
    }, []);

    useGSAP(
        () => {
            if (!showPreloader || !preloaderRef.current) return;

            const particles = gsap.utils.toArray<HTMLElement>('.bh-particle');

            const tl = gsap.timeline({
                defaults: {
                    ease: 'power2.out',
                },
            });

            gsap.set('.bh-loader-scene', { autoAlpha: 0, scale: 0.85 });
            gsap.set('.bh-core', { scale: 0.7 });
            gsap.set('.bh-lens', { autoAlpha: 0, scale: 0.75 });

            particles.forEach((particle) => {
                const angle = gsap.utils.random(0, Math.PI * 2);
                const radius = gsap.utils.random(88, 215);
                const startX = Math.cos(angle) * radius;
                const startY = Math.sin(angle) * radius;

                gsap.set(particle, {
                    x: startX,
                    y: startY,
                    autoAlpha: gsap.utils.random(0.18, 0.75),
                    scale: gsap.utils.random(0.6, 1.3),
                });

                gsap.to(particle, {
                    x: 0,
                    y: 0,
                    autoAlpha: 0,
                    scale: 0.2,
                    duration: gsap.utils.random(0.92, 1.35),
                    delay: gsap.utils.random(0, 0.34),
                    ease: 'power2.in',
                    repeat: 1,
                    repeatDelay: gsap.utils.random(0.08, 0.24),
                    repeatRefresh: true,
                });
            });

            tl.to('.bh-loader-scene', {
                autoAlpha: 1,
                scale: 1,
                duration: 0.42,
                ease: 'power3.out',
            })
                .to(
                    '.bh-core',
                    {
                        scale: 1,
                        duration: 0.45,
                    },
                    '<0.06',
                )
                .to(
                    '.bh-ring',
                    {
                        rotation: 190,
                        duration: 0.95,
                        ease: 'none',
                    },
                    '<',
                )
                .to(
                    '.bh-ring-secondary',
                    {
                        rotation: -230,
                        duration: 1.15,
                        ease: 'none',
                    },
                    '<',
                )
                .to(
                    '.bh-lens',
                    {
                        autoAlpha: 1,
                        scale: 1.08,
                        duration: 0.9,
                        ease: 'sine.inOut',
                    },
                    '<',
                )
                .to('.bh-loader-scene', {
                    scale: 1.05,
                    duration: 0.35,
                    ease: 'sine.inOut',
                })
                .to('.bh-backdrop', {
                    autoAlpha: 0,
                    duration: 0.45,
                    ease: 'power2.in',
                })
                .to(
                    preloaderRef.current,
                    {
                        autoAlpha: 0,
                        duration: 0.25,
                        onComplete: () => setShowPreloader(false),
                    },
                    '<0.1',
                );
        },
        { scope: preloaderRef, dependencies: [showPreloader] },
    );

    if (!showPreloader) return null;

    return (
        <div className="bh-preloader fixed inset-0 z-[70]" ref={preloaderRef}>
            <div className="bh-backdrop absolute inset-0" />

            <div className="bh-loader-scene absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 md:h-[320px] md:w-[320px]">
                <div className="bh-particle-layer" aria-hidden>
                    {Array.from({ length: particleCount }).map((_, index) => (
                        <span className="bh-particle" key={`bh-particle-${index}`} />
                    ))}
                </div>

                <div className="bh-core-wrap" aria-hidden>
                    <span className="bh-core" />
                    <span className="bh-ring" />
                    <span className="bh-ring bh-ring-secondary" />
                    <span className="bh-lens" />
                </div>
            </div>
        </div>
    );
};

export default Preloader;
