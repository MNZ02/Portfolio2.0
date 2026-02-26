'use client';
import { OrbitStackNode } from '@/lib/stackMapper';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useState } from 'react';

interface Props {
    activeNode: OrbitStackNode;
    categoryChipClass: string;
}

const InfoPanel = ({ activeNode, categoryChipClass }: Props) => {
    const panelBodyRef = React.useRef<HTMLDivElement>(null);
    const [displayNode, setDisplayNode] = useState(activeNode);

    useGSAP(
        () => {
            if (!panelBodyRef.current) return;
            if (displayNode.id === activeNode.id) return;

            const tl = gsap.timeline({
                defaults: { ease: 'power2.out' },
            });

            // Compact two-phase transition keeps panel and orbit visually connected.
            tl.to(panelBodyRef.current, {
                autoAlpha: 0,
                y: -8,
                filter: 'blur(3px)',
                duration: 0.16,
            })
                .add(() => setDisplayNode(activeNode))
                .fromTo(
                    panelBodyRef.current,
                    {
                        autoAlpha: 0,
                        y: 10,
                        filter: 'blur(3px)',
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.24,
                    },
                );

            return () => tl.kill();
        },
        { dependencies: [activeNode.id, displayNode.id] },
    );

    return (
        <article className="rounded-2xl border border-border/60 bg-[hsl(var(--surface-1)/0.8)] p-5 backdrop-blur-sm md:p-6">
            <div ref={panelBodyRef}>
                <p className="eyebrow">Focused Technology</p>
                <h3 className="mt-2 font-sora text-3xl font-semibold leading-[0.95]">
                    {displayNode.name}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                    <span
                        className={cn(
                            'rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.13em]',
                            categoryChipClass,
                        )}
                    >
                        {displayNode.category}
                    </span>
                    <span className="rounded-full border border-border/65 bg-background/55 px-3 py-1 text-[11px] uppercase tracking-[0.13em] text-foreground/90">
                        {displayNode.level}
                    </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {displayNode.description}
                </p>
            </div>
        </article>
    );
};

export default InfoPanel;

