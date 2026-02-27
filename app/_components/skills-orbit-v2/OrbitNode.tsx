'use client';
import { OrbitStackNode } from '@/lib/stackMapper';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface Props {
    node: OrbitStackNode;
    isActive: boolean;
    isDimmed: boolean;
    initialX: number;
    initialY: number;
    accentClass: string;
    activeAccentClass: string;
    onEnter: () => void;
    onLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onClick: () => void;
}

const OrbitNode = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            node,
            isActive,
            isDimmed,
            initialX,
            initialY,
            accentClass,
            activeAccentClass,
            onEnter,
            onLeave,
            onFocus,
            onBlur,
            onClick,
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                type="button"
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={onClick}
                className={cn(
                    'absolute left-1/2 top-1/2 z-[2] h-12 w-12 rounded-2xl p-0 transition-all duration-300 [transform:translate3d(var(--tx),var(--ty),0)_translate(-50%,-50%)_scale(var(--node-scale))] will-change-transform',
                    isActive && 'z-[8]',
                    isDimmed && 'z-[1] blur-[1px]',
                )}
                style={
                    {
                        '--tx': `${initialX}px`,
                        '--ty': `${initialY}px`,
                        '--node-scale': 1,
                        opacity: 1,
                    } as React.CSSProperties
                }
                aria-label={`${node.name} ${node.category}`}
            >
                <span
                    className={cn(
                        'flex h-full w-full items-center justify-center rounded-2xl border border-border/45 bg-[hsl(var(--surface-1)/0.82)] backdrop-blur-[2px] transition-all duration-300',
                        accentClass,
                        isActive && activeAccentClass,
                        !isActive && 'shadow-[0_4px_12px_hsl(var(--background)/0.22)]',
                    )}
                >
                    <Image
                        src={node.icon}
                        alt={node.name}
                        width={22}
                        height={22}
                        className="h-5 w-5 object-contain"
                    />
                </span>
            </button>
        );
    },
);

OrbitNode.displayName = 'OrbitNode';

export default OrbitNode;
