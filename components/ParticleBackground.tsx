'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const PARTICLE_COUNT = 28;

const ParticleBackground = () => {
    const particlesRef = useRef<Array<HTMLDivElement | null>>([]);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const coarsePointer = window.matchMedia('(pointer: coarse)');

        const evaluate = () => {
            const shouldEnable =
                !reducedMotion.matches &&
                !coarsePointer.matches &&
                window.innerWidth >= 1024;

            setEnabled(shouldEnable);
        };

        evaluate();

        reducedMotion.addEventListener('change', evaluate);
        coarsePointer.addEventListener('change', evaluate);
        window.addEventListener('resize', evaluate);

        return () => {
            reducedMotion.removeEventListener('change', evaluate);
            coarsePointer.removeEventListener('change', evaluate);
            window.removeEventListener('resize', evaluate);
        };
    }, []);

    useGSAP(
        () => {
            if (!enabled) return;

            particlesRef.current.forEach((particle) => {
                if (!particle) return;

                gsap.killTweensOf(particle);

                gsap.set(particle, {
                    width: gsap.utils.random(2, 5),
                    height: gsap.utils.random(2, 5),
                    opacity: gsap.utils.random(0.18, 0.45),
                    left: gsap.utils.random(0, window.innerWidth),
                    top: gsap.utils.random(-120, window.innerHeight),
                });

                gsap.to(particle, {
                    y: window.innerHeight + 160,
                    x: `+=${gsap.utils.random(-22, 22)}`,
                    duration: gsap.utils.random(14, 26),
                    ease: 'none',
                    repeat: -1,
                    delay: gsap.utils.random(0, 5),
                });
            });

            return () => {
                particlesRef.current.forEach((particle) => {
                    if (!particle) return;

                    gsap.killTweensOf(particle);
                });
            };
        },
        { dependencies: [enabled] },
    );

    if (!enabled) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-70">
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        particlesRef.current[i] = el;
                    }}
                    className="absolute rounded-full bg-primary/50 blur-[1px]"
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
