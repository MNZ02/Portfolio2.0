'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const ArrowAnimation = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const arrow1Ref = useRef<SVGPathElement>(null);
    const arrow2Ref = useRef<SVGPathElement>(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        const evaluate = () => {
            setEnabled(!reducedMotion.matches && window.innerWidth >= 1024);
        };

        evaluate();

        reducedMotion.addEventListener('change', evaluate);
        window.addEventListener('resize', evaluate);

        return () => {
            reducedMotion.removeEventListener('change', evaluate);
            window.removeEventListener('resize', evaluate);
        };
    }, []);

    useGSAP(
        () => {
            if (!enabled || !svgRef.current || !arrow1Ref.current || !arrow2Ref.current) {
                return;
            }

            gsap.set(svgRef.current, { autoAlpha: 0, y: 0 });

            [arrow1Ref.current, arrow2Ref.current].forEach((path) => {
                gsap.set(path, {
                    strokeDasharray: path.getTotalLength(),
                    strokeDashoffset: path.getTotalLength(),
                });
            });

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });

            tl.to(svgRef.current, { autoAlpha: 1, duration: 0.2 })
                .to(
                    [arrow1Ref.current, arrow2Ref.current],
                    {
                        strokeDashoffset: 0,
                        duration: 1.1,
                        ease: 'power2.out',
                    },
                    '<',
                )
                .to(svgRef.current, {
                    y: 92,
                    autoAlpha: 0,
                    duration: 0.8,
                    ease: 'power1.in',
                });

            return () => {
                tl.kill();
            };
        },
        { dependencies: [enabled] },
    );

    if (!enabled) return null;

    return (
        <svg
            width="336"
            height="102"
            viewBox="0 0 376 111"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute bottom-8 left-1/2 z-0 hidden -translate-x-1/2 lg:block"
            ref={svgRef}
            aria-hidden
        >
            <path
                d="M1 1V39.9286L188 110V70.6822L1 1Z"
                stroke="hsl(var(--border))"
                ref={arrow1Ref}
            />
            <path
                d="M375 1V39.9286L188 110V70.6822L375 1Z"
                stroke="hsl(var(--border))"
                ref={arrow2Ref}
            />
        </svg>
    );
};

export default ArrowAnimation;
