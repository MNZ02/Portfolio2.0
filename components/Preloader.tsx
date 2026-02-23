'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const [showPreloader, setShowPreloader] = useState(false);
    const particleCount = 46;

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

            gsap.set('.bh-loader-scene', { autoAlpha: 0, scale: 0.82, rotate: -3 });
            gsap.set('.bh-core', { scale: 0.62 });
            gsap.set('.bh-accretion', { autoAlpha: 0, scale: 0.72, rotate: 14 });
            gsap.set('.bh-distortion', { autoAlpha: 0, scale: 0.78 });
            gsap.set('.bh-lens', { autoAlpha: 0, scale: 0.7 });
            gsap.set('.bh-halo', { autoAlpha: 0, scale: 0.8 });

            particles.forEach((particle) => {
                const angle = gsap.utils.random(0, Math.PI * 2);
                const radius = gsap.utils.random(92, 226);
                const compression = gsap.utils.random(0.52, 0.72);
                const spiralDirection = Math.random() > 0.5 ? 1 : -1;
                const spiralSpan = gsap.utils.random(Math.PI * 0.75, Math.PI * 1.55) * spiralDirection;
                const arcOneAngle = angle + spiralSpan * 0.42;
                const arcTwoAngle = angle + spiralSpan * 0.9;
                const startX = Math.cos(angle) * radius;
                const startY = Math.sin(angle) * radius * compression;
                const arcOneRadius = radius * gsap.utils.random(0.66, 0.78);
                const arcTwoRadius = radius * gsap.utils.random(0.34, 0.48);
                const arcOneX = Math.cos(arcOneAngle) * arcOneRadius;
                const arcOneY = Math.sin(arcOneAngle) * arcOneRadius * compression;
                const arcTwoX = Math.cos(arcTwoAngle) * arcTwoRadius;
                const arcTwoY = Math.sin(arcTwoAngle) * arcTwoRadius * compression;

                gsap.set(particle, {
                    x: startX,
                    y: startY,
                    autoAlpha: gsap.utils.random(0.18, 0.75),
                    scale: gsap.utils.random(0.6, 1.3),
                });

                gsap.to(particle, {
                    keyframes: [
                        {
                            x: arcOneX,
                            y: arcOneY,
                            autoAlpha: gsap.utils.random(0.38, 0.82),
                            scale: gsap.utils.random(0.5, 1.1),
                            duration: gsap.utils.random(0.44, 0.62),
                            ease: 'sine.inOut',
                        },
                        {
                            x: arcTwoX,
                            y: arcTwoY,
                            autoAlpha: gsap.utils.random(0.22, 0.58),
                            scale: gsap.utils.random(0.32, 0.76),
                            duration: gsap.utils.random(0.3, 0.46),
                            ease: 'power1.in',
                        },
                        {
                            x: gsap.utils.random(-6, 6),
                            y: gsap.utils.random(-5, 5),
                            autoAlpha: 0,
                            scale: 0.16,
                            duration: gsap.utils.random(0.42, 0.58),
                            ease: 'power3.in',
                        },
                    ],
                    delay: gsap.utils.random(0, 0.34),
                    repeat: -1,
                    repeatDelay: gsap.utils.random(0.05, 0.22),
                });
            });

            gsap.to('.bh-ring', {
                rotation: '+=360',
                duration: 2.6,
                ease: 'none',
                repeat: -1,
            });

            gsap.to('.bh-ring-secondary', {
                rotation: '-=360',
                duration: 3.25,
                ease: 'none',
                repeat: -1,
            });

            gsap.to('.bh-accretion', {
                rotation: '+=360',
                duration: 4.1,
                ease: 'none',
                repeat: -1,
            });

            gsap.to('.bh-halo', {
                autoAlpha: 0.74,
                scale: 1.08,
                duration: 1.2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            tl.to('.bh-loader-scene', {
                autoAlpha: 1,
                scale: 1,
                rotate: 0,
                duration: 0.56,
                ease: 'power3.out',
            })
                .to(
                    '.bh-core',
                    {
                        scale: 1,
                        duration: 0.62,
                    },
                    '<0.08',
                )
                .to(
                    '.bh-accretion',
                    {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.68,
                        ease: 'power2.out',
                    },
                    '<',
                )
                .to(
                    '.bh-distortion',
                    {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.62,
                        ease: 'sine.out',
                    },
                    '<0.02',
                )
                .to(
                    '.bh-lens',
                    {
                        autoAlpha: 1,
                        scale: 1.06,
                        duration: 0.82,
                        ease: 'sine.inOut',
                    },
                    '<0.08',
                )
                .to(
                    '.bh-halo',
                    {
                        autoAlpha: 0.68,
                        scale: 1,
                        duration: 0.62,
                        ease: 'sine.out',
                    },
                    '<',
                )
                .to('.bh-core', {
                    scale: 0.93,
                    duration: 0.34,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: 1,
                })
                .to('.bh-loader-scene', {
                    scale: 1.045,
                    duration: 0.75,
                    ease: 'sine.inOut',
                })
                .to('.bh-backdrop', {
                    autoAlpha: 0,
                    duration: 0.55,
                    ease: 'power2.in',
                })
                .to(
                    preloaderRef.current,
                    {
                        autoAlpha: 0,
                        duration: 0.28,
                        onComplete: () => setShowPreloader(false),
                    },
                    '<0.08',
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
                    <span className="bh-halo" />
                    <span className="bh-accretion" />
                    <span className="bh-core" />
                    <span className="bh-ring" />
                    <span className="bh-ring bh-ring-secondary" />
                    <span className="bh-distortion" />
                    <span className="bh-lens" />
                </div>
            </div>
        </div>
    );
};

export default Preloader;
