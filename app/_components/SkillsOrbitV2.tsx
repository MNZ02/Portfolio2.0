'use client';
import { MY_STACK } from '@/lib/data';
import {
    OrbitRingId,
    OrbitStackCategory,
    OrbitStackNode,
    mapStackToOrbitNodes,
} from '@/lib/stackMapper';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import InfoPanel from './skills-orbit-v2/InfoPanel';
import OrbitRing from './skills-orbit-v2/OrbitRing';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ViewMode = 'desktop' | 'tablet' | 'mobile';

const FALLBACK_NODE: OrbitStackNode = {
    id: 'typescript',
    name: 'TypeScript',
    icon: '/logo/ts.png',
    sourceGroup: 'frontend',
    category: 'Frontend',
    ring: 1,
    level: 'Advanced',
    description: 'Safer APIs and maintainable large-scale frontend/backend code.',
};

const RING_MOTION: Record<
    OrbitRingId,
    {
        duration: number;
        direction: 1 | -1;
        radius: number;
        label: string;
        ringClass: string;
    }
> = {
    1: {
        duration: 18,
        direction: 1,
        radius: 116,
        label: 'Core Stack',
        ringClass:
            'border-primary/30 shadow-[0_0_14px_hsl(var(--primary)/0.14)]',
    },
    2: {
        duration: 32,
        direction: -1,
        radius: 168,
        label: 'Infrastructure',
        ringClass: 'border-dashed border-border/45',
    },
    3: {
        duration: 60,
        direction: 1,
        radius: 224,
        label: 'Tools & Support',
        ringClass: 'border-border/25 opacity-70',
    },
};

const CATEGORY_ACCENT: Record<
    OrbitStackCategory,
    { base: string; active: string; chip: string; count: string }
> = {
    Frontend: {
        base: 'border-cyan-300/30 bg-cyan-300/8',
        active: 'border-cyan-200/60 shadow-[0_0_16px_rgba(34,211,238,0.28)]',
        chip: 'border-cyan-300/35 bg-cyan-400/10 text-cyan-200',
        count: 'bg-cyan-400/15 text-cyan-200',
    },
    Backend: {
        base: 'border-violet-300/30 bg-violet-300/8',
        active: 'border-violet-200/60 shadow-[0_0_16px_rgba(167,139,250,0.26)]',
        chip: 'border-violet-300/35 bg-violet-400/10 text-violet-200',
        count: 'bg-violet-400/15 text-violet-200',
    },
    Database: {
        base: 'border-emerald-300/30 bg-emerald-300/8',
        active: 'border-emerald-200/60 shadow-[0_0_16px_rgba(52,211,153,0.26)]',
        chip: 'border-emerald-300/35 bg-emerald-400/10 text-emerald-200',
        count: 'bg-emerald-400/15 text-emerald-200',
    },
    DevOps: {
        base: 'border-amber-300/30 bg-amber-300/8',
        active: 'border-amber-200/60 shadow-[0_0_16px_rgba(251,191,36,0.24)]',
        chip: 'border-amber-300/35 bg-amber-400/10 text-amber-200',
        count: 'bg-amber-400/15 text-amber-200',
    },
    Tools: {
        base: 'border-slate-300/30 bg-slate-300/8',
        active: 'border-slate-200/60 shadow-[0_0_14px_rgba(203,213,225,0.24)]',
        chip: 'border-slate-300/35 bg-slate-400/10 text-slate-200',
        count: 'bg-slate-400/15 text-slate-200',
    },
    Design: {
        base: 'border-rose-300/30 bg-rose-300/8',
        active: 'border-rose-200/60 shadow-[0_0_16px_rgba(251,113,133,0.24)]',
        chip: 'border-rose-300/35 bg-rose-400/10 text-rose-200',
        count: 'bg-rose-400/15 text-rose-200',
    },
};

const CATEGORY_ORDER: OrbitStackCategory[] = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Tools',
    'Design',
];

const V2_ID = 'my-stack';

const SkillsOrbitV2 = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const shellRef = useRef<HTMLDivElement>(null);
    const coreRef = useRef<HTMLDivElement>(null);
    const coreBodyRef = useRef<HTMLDivElement>(null);
    const corePulseRingRef = useRef<HTMLSpanElement>(null);

    const [viewMode, setViewMode] = useState<ViewMode>('desktop');
    const [inspectedNodeId, setInspectedNodeId] = useState<string | null>(null);

    const ringRefs = useRef<Record<OrbitRingId, HTMLDivElement | null>>({
        1: null,
        2: null,
        3: null,
    });
    const nodeRefs = useRef<Record<OrbitRingId, Array<HTMLButtonElement | null>>>(
        {
            1: [],
            2: [],
            3: [],
        },
    );
    const orbitStateRef = useRef<
        Record<
            OrbitRingId,
            {
                phaseDeg: number;
                timeScale: number;
                targetScale: number;
            }
        >
    >({
        1: { phaseDeg: 16, timeScale: 1, targetScale: 1 },
        2: { phaseDeg: 140, timeScale: 1, targetScale: 1 },
        3: { phaseDeg: 246, timeScale: 1, targetScale: 1 },
    });
    const rafTweensRef = useRef<gsap.core.Tween[]>([]);

    const { nodes, rings } = useMemo(() => mapStackToOrbitNodes(MY_STACK), []);

    const [activeNodeId, setActiveNodeId] = useState<string>(
        nodes[0]?.id ?? FALLBACK_NODE.id,
    );

    const activeNode = useMemo(() => {
        return nodes.find((node) => node.id === activeNodeId) ?? nodes[0] ?? FALLBACK_NODE;
    }, [nodes, activeNodeId]);

    const categoryCounts = useMemo(() => {
        return nodes.reduce(
            (acc, item) => {
                acc[item.category] = (acc[item.category] ?? 0) + 1;
                return acc;
            },
            {} as Record<OrbitStackCategory, number>,
        );
    }, [nodes]);

    useEffect(() => {
        const syncViewMode = () => {
            if (window.innerWidth < 768) {
                setViewMode('mobile');
                return;
            }
            if (window.innerWidth < 1120) {
                setViewMode('tablet');
                return;
            }
            setViewMode('desktop');
        };

        syncViewMode();
        window.addEventListener('resize', syncViewMode);
        return () => window.removeEventListener('resize', syncViewMode);
    }, []);

    const getAccentForCategory = (node: OrbitStackNode) =>
        CATEGORY_ACCENT[node.category] ?? CATEGORY_ACCENT.Tools;

    const setTargetOrbitScale = (target: number) => {
        (Object.keys(orbitStateRef.current) as Array<'1' | '2' | '3'>).forEach(
            (key) => {
                const ring = Number(key) as OrbitRingId;
                orbitStateRef.current[ring].targetScale = target;
            },
        );
    };

    const inspectNode = (node: OrbitStackNode) => {
        setInspectedNodeId((prev) => (prev === node.id ? prev : node.id));
        setActiveNodeId((prev) => (prev === node.id ? prev : node.id));
        setTargetOrbitScale(0.26);
    };

    const clearInspection = () => {
        setInspectedNodeId((prev) => (prev === null ? prev : null));
        setTargetOrbitScale(1);
    };

    useGSAP(
        () => {
            if (viewMode === 'mobile') return;
            const reducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            );
            if (reducedMotion.matches) return;

            if (headingRef.current && shellRef.current) {
                gsap.from([headingRef.current, shellRef.current], {
                    y: 26,
                    autoAlpha: 0,
                    duration: 0.62,
                    stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    },
                });
            }

            const glowX = gsap.quickSetter(shellRef.current, '--glow-x');
            const glowY = gsap.quickSetter(shellRef.current, '--glow-y');

            const onPointerMove = (e: PointerEvent) => {
                const rect = shellRef.current?.getBoundingClientRect();
                if (!rect) return;
                glowX(`${e.clientX - rect.left}px`);
                glowY(`${e.clientY - rect.top}px`);
            };
            shellRef.current?.addEventListener('pointermove', onPointerMove);

            // Center "reactor core" pulse: long-duration subtle breathing.
            if (coreRef.current && coreBodyRef.current && corePulseRingRef.current) {
                rafTweensRef.current.push(
                    gsap.to(coreBodyRef.current, {
                        scale: 1.03,
                        duration: 4.8,
                        yoyo: true,
                        repeat: -1,
                        ease: 'sine.inOut',
                    }),
                );
                rafTweensRef.current.push(
                    gsap.to(coreRef.current, {
                        opacity: 0.95,
                        duration: 4.8,
                        yoyo: true,
                        repeat: -1,
                        ease: 'sine.inOut',
                    }),
                );
                rafTweensRef.current.push(
                    gsap.fromTo(
                        corePulseRingRef.current,
                        { scale: 1, opacity: 0.42 },
                        {
                            scale: 1.18,
                            opacity: 0.05,
                            duration: 9.2,
                            yoyo: true,
                            repeat: -1,
                            ease: 'sine.inOut',
                        },
                    ),
                );
            }

            let lastTime = 0;
            const speedFactor = viewMode === 'tablet' ? 0.86 : 1;
            const radiusScale = viewMode === 'tablet' ? 0.82 : 1;

            // Orbit update loop:
            // - smooth timeScale interpolation creates inertial slow/restore
            // - position computed from angle in a flat 2D circle
            // - only transform/opacity/z-index are touched per frame
            const updateOrbit = () => {
                const now = performance.now();
                if (!lastTime) {
                    lastTime = now;
                    return;
                }

                const dt = Math.min((now - lastTime) / 1000, 0.05);
                lastTime = now;

                (Object.keys(RING_MOTION) as Array<'1' | '2' | '3'>).forEach(
                    (key) => {
                        const ring = Number(key) as OrbitRingId;
                        const config = RING_MOTION[ring];
                        const state = orbitStateRef.current[ring];
                        const ringNodes = rings[ring] ?? [];
                        const refs = nodeRefs.current[ring] ?? [];

                        if (!ringNodes.length || !refs.length) return;

                        state.timeScale +=
                            (state.targetScale - state.timeScale) *
                            Math.min(1, dt * 7.2);

                        const degPerSecond =
                            (360 / config.duration) *
                            speedFactor *
                            config.direction *
                            state.timeScale;
                        state.phaseDeg =
                            (state.phaseDeg + degPerSecond * dt + 360) % 360;

                        const radius = config.radius * radiusScale;

                        ringNodes.forEach((node, index) => {
                            const button = refs[index];
                            if (!button) return;

                            const baseAngle =
                                ((index / ringNodes.length) * Math.PI * 2 +
                                    (state.phaseDeg * Math.PI) / 180) %
                                (Math.PI * 2);

                            const x = Math.cos(baseAngle) * radius;
                            const y = Math.sin(baseAngle) * radius;

                            const isActive = inspectedNodeId === node.id;
                            const isDimmed =
                                Boolean(inspectedNodeId) && !isActive;

                            const finalScale = isActive ? 1.15 : 1;
                            const finalOpacity = isDimmed ? 0.4 : 1;
                            const yWithLift = y + (isActive ? -4 : 0);

                            button.style.setProperty('--tx', `${x}px`);
                            button.style.setProperty('--ty', `${yWithLift}px`);
                            button.style.setProperty(
                                '--node-scale',
                                `${finalScale}`,
                            );
                            button.style.opacity = `${finalOpacity}`;
                            button.style.zIndex = `${isActive ? 50 : 10}`;
                        });
                    },
                );
            };

            gsap.ticker.add(updateOrbit);

            return () => {
                gsap.ticker.remove(updateOrbit);
                shellRef.current?.removeEventListener('pointermove', onPointerMove);
                rafTweensRef.current.forEach((tween) => tween.kill());
                rafTweensRef.current = [];
            };
        },
        { scope: containerRef, dependencies: [viewMode, inspectedNodeId] },
    );

    return (
        <section className="section-divider py-20 md:py-32" id={V2_ID}>
            <div className="container" ref={containerRef}>
                <div ref={headingRef}>
                    <p className="eyebrow">Tools and Platforms</p>
                    <h2 className="mt-3 max-w-[900px] font-sora text-4xl font-semibold uppercase leading-[0.92] sm:text-5xl md:text-[4.15rem]">
                        Build Engine V2
                    </h2>
                    <p className="mt-5 max-w-[760px] text-sm leading-7 text-muted-foreground md:text-base">
                        A structured orbital system for the technologies behind my
                        production workflow. Hover to inspect details and system role.
                    </p>
                </div>

                <div
                    ref={shellRef}
                    className="relative mt-10 overflow-hidden rounded-[30px] border border-border/70 bg-[hsl(var(--surface-1)/0.78)] p-5 backdrop-blur-sm md:p-8"
                    style={
                        {
                            '--glow-x': '50%',
                            '--glow-y': '46%',
                        } as React.CSSProperties
                    }
                >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_circle_at_var(--glow-x)_var(--glow-y),hsl(var(--primary)/0.14),transparent_70%)]" />

                    <div
                        className={cn(
                            'relative grid items-start gap-8',
                            viewMode === 'mobile'
                                ? 'grid-cols-1'
                                : 'lg:grid-cols-12',
                        )}
                    >
                        {viewMode === 'mobile' ? (
                            <div className="space-y-4">
                                <InfoPanel
                                    activeNode={activeNode}
                                    categoryChipClass={
                                        CATEGORY_ACCENT[activeNode.category].chip
                                    }
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    {nodes.map((node) => {
                                        const isActive = activeNode.id === node.id;
                                        const accent = CATEGORY_ACCENT[node.category];
                                        return (
                                            <button
                                                type="button"
                                                key={node.id}
                                                onClick={() => setActiveNodeId(node.id)}
                                                className={cn(
                                                    'rounded-2xl border border-border/65 bg-background/45 p-3 text-left transition-colors',
                                                    isActive && accent.chip,
                                                )}
                                            >
                                                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                                    {node.category}
                                                </p>
                                                <p className="mt-1 font-sora text-sm font-semibold text-foreground">
                                                    {node.name}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="lg:col-span-8">
                                <div className="mx-auto w-full max-w-[520px]">
                                        <div className="relative aspect-square">
                                            {(Object.keys(RING_MOTION) as Array<
                                                '1' | '2' | '3'
                                            >).map((key) => {
                                                const ring = Number(
                                                    key,
                                                ) as OrbitRingId;
                                                const cfg = RING_MOTION[ring];
                                                const diameter =
                                                    cfg.radius *
                                                    (viewMode === 'tablet'
                                                        ? 0.82
                                                        : 1) *
                                                    2;

                                                return (
                                                    <OrbitRing
                                                        key={ring}
                                                        ringId={ring}
                                                        ringLabel={cfg.label}
                                                        diameter={diameter}
                                                        ringClass={cfg.ringClass}
                                                        nodes={rings[ring] ?? []}
                                                        activeNodeId={activeNode.id}
                                                        inspectedNodeId={
                                                            inspectedNodeId
                                                        }
                                                        registerRingRef={(el) => {
                                                            ringRefs.current[ring] =
                                                                el;
                                                        }}
                                                        registerNodeRef={(
                                                            index,
                                                            el,
                                                        ) => {
                                                            nodeRefs.current[ring][
                                                                index
                                                            ] = el;
                                                        }}
                                                        getAccentForCategory={
                                                            getAccentForCategory
                                                        }
                                                        onNodeEnter={inspectNode}
                                                        onNodeLeave={
                                                            clearInspection
                                                        }
                                                    />
                                                );
                                            })}

                                            <div
                                                ref={coreRef}
                                                className="absolute left-1/2 top-1/2 z-[12] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/28 bg-[radial-gradient(circle_at_30%_28%,hsl(var(--primary)/0.3),hsl(var(--surface-1)/0.9)_62%)] p-4"
                                            >
                                                <span
                                                    ref={corePulseRingRef}
                                                    className="pointer-events-none absolute inset-0 rounded-full border border-primary/24"
                                                />
                                                <div
                                                    ref={coreBodyRef}
                                                    className="relative flex h-full flex-col items-center justify-center rounded-full border border-primary/20 bg-background/55 text-center"
                                                >
                                                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                                        Stack Core
                                                    </p>
                                                    <p className="mt-1 font-sora text-lg font-semibold uppercase leading-none text-foreground">
                                                        Build
                                                    </p>
                                                    <p className="font-sora text-lg font-semibold uppercase leading-none text-primary">
                                                        Engine
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <aside className="lg:col-span-4">
                                    <InfoPanel
                                        activeNode={activeNode}
                                        categoryChipClass={
                                            CATEGORY_ACCENT[activeNode.category].chip
                                        }
                                    />

                                    <div className="mt-4 rounded-2xl border border-border/60 bg-[hsl(var(--surface-1)/0.78)] p-5 backdrop-blur-sm md:p-6">
                                        <p className="eyebrow mb-4">
                                            Category Distribution
                                        </p>
                                        <div className="flex flex-wrap gap-2.5">
                                            {CATEGORY_ORDER.filter(
                                                (category) =>
                                                    (categoryCounts[category] ??
                                                        0) > 0,
                                            ).map((category) => {
                                                const accent =
                                                    CATEGORY_ACCENT[category];
                                                return (
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-[11px] uppercase tracking-[0.13em]',
                                                            accent.chip,
                                                        )}
                                                        key={category}
                                                    >
                                                        {category}
                                                        <span
                                                            className={cn(
                                                                'rounded-full px-2 py-0.5 text-[10px]',
                                                                accent.count,
                                                            )}
                                                        >
                                                            {
                                                                categoryCounts[
                                                                    category
                                                                ]
                                                            }
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </aside>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SkillsOrbitV2;
