'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const finePointer = window.matchMedia('(pointer: fine)');

        const evaluate = () => {
            const shouldEnable =
                !reducedMotion.matches && finePointer.matches && window.innerWidth >= 1024;

            setEnabled(shouldEnable);
            document.body.classList.toggle('custom-cursor-enabled', shouldEnable);
        };

        evaluate();

        reducedMotion.addEventListener('change', evaluate);
        finePointer.addEventListener('change', evaluate);
        window.addEventListener('resize', evaluate);

        return () => {
            reducedMotion.removeEventListener('change', evaluate);
            finePointer.removeEventListener('change', evaluate);
            window.removeEventListener('resize', evaluate);
            document.body.classList.remove('custom-cursor-enabled');
        };
    }, []);

    useGSAP(
        () => {
            if (!enabled) return;

            const handleMouseMove = (e: MouseEvent) => {
                if (!cursorRef.current) return;

                gsap.to(cursorRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.2,
                    ease: 'power2.out',
                    opacity: 1,
                });
            };

            const handleMouseDown = () => {
                if (!cursorRef.current) return;

                gsap.to(cursorRef.current, {
                    scale: 0.8,
                    duration: 0.14,
                });
            };

            const handleMouseUp = () => {
                if (!cursorRef.current) return;

                gsap.to(cursorRef.current, {
                    scale: 1,
                    duration: 0.14,
                });
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        },
        { dependencies: [enabled] },
    );

    if (!enabled) return null;

    return (
        <div
            ref={cursorRef}
            className="pointer-events-none fixed left-0 top-0 z-[60] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/80 bg-background-light/45 opacity-0 backdrop-blur-[2px]"
        />
    );
};

export default CustomCursor;
