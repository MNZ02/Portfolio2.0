'use client';
import React, { useEffect, useRef } from 'react';

const ScrollProgressIndicator = () => {
    const scrollBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollBarRef.current) return;

            const { scrollHeight, clientHeight } = document.documentElement;
            const scrollableHeight = Math.max(scrollHeight - clientHeight, 1);
            const scrollY = window.scrollY;
            const scrollProgress = Math.min(scrollY / scrollableHeight, 1);

            scrollBarRef.current.style.transform = `scaleY(${scrollProgress})`;
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed right-5 top-1/2 z-40 hidden h-[100px] w-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-background-light/85 lg:block">
            <div
                className="h-full w-full origin-top scale-y-0 rounded-full bg-primary/85"
                ref={scrollBarRef}
            ></div>
        </div>
    );
};

export default ScrollProgressIndicator;
