'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const [showPreloader, setShowPreloader] = useState(false);

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

            const tl = gsap.timeline({
                defaults: {
                    ease: 'power2.inOut',
                },
            });

            tl.from('.name-text span', {
                y: '100%',
                stagger: 0.028,
                duration: 0.18,
            })
                .to('.name-text span', {
                    autoAlpha: 0,
                    duration: 0.2,
                    delay: 0.22,
                })
                .to(
                    '.preloader-item',
                    {
                        y: '-100%',
                        duration: 0.35,
                        stagger: 0.05,
                    },
                    '<0.06',
                )
                .to(
                    preloaderRef.current,
                    {
                        autoAlpha: 0,
                        duration: 0.2,
                        onComplete: () => setShowPreloader(false),
                    },
                    '<0.1',
                );
        },
        { scope: preloaderRef, dependencies: [showPreloader] },
    );

    if (!showPreloader) return null;

    return (
        <div className="fixed inset-0 z-[70] flex" ref={preloaderRef}>
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="preloader-item h-full w-[12.5%] bg-background"
                ></div>
            ))}

            <p className="name-text absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 overflow-hidden text-[13vw] font-anton leading-none text-foreground md:text-[140px]">
                {'MINHAZ.DEV'.split('').map((char, index) => (
                    <span key={`${char}-${index}`} className="inline-block">
                        {char}
                    </span>
                ))}
            </p>
        </div>
    );
};

export default Preloader;
