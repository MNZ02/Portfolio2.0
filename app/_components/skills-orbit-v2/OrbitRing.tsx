'use client';
import { OrbitRingId, OrbitStackNode } from '@/lib/stackMapper';
import { cn } from '@/lib/utils';
import OrbitNode from './OrbitNode';

interface Props {
    ringId: OrbitRingId;
    ringLabel: string;
    diameter: number;
    ringClass: string;
    nodes: OrbitStackNode[];
    activeNodeId: string | null;
    inspectedNodeId: string | null;
    registerRingRef: (_el: HTMLDivElement | null) => void;
    registerNodeRef: (_index: number, _el: HTMLButtonElement | null) => void;
    getAccentForCategory: (
        _node: OrbitStackNode,
    ) => { base: string; active: string };
    onNodeEnter: (_node: OrbitStackNode) => void;
    onNodeLeave: () => void;
    onNodeClick: (_node: OrbitStackNode) => void;
}

const OrbitRing = ({
    ringLabel,
    diameter,
    ringClass,
    nodes,
    activeNodeId,
    inspectedNodeId,
    registerRingRef,
    registerNodeRef,
    getAccentForCategory,
    onNodeEnter,
    onNodeLeave,
    onNodeClick,
}: Props) => {
    return (
        <div
            ref={registerRingRef}
            className={cn(
                'absolute left-1/2 top-1/2 rounded-full border [transform:translate(-50%,-50%)]',
                ringClass,
            )}
            style={{
                width: diameter,
                height: diameter,
            }}
        >
            <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/45 bg-background/75 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
                {ringLabel}
            </span>

            {nodes.map((node, index) => {
                const accents = getAccentForCategory(node);
                const isActive = activeNodeId === node.id;
                const isDimmed = Boolean(inspectedNodeId) && !isActive;
                const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2;
                const radius = diameter / 2;
                const initialX = Math.cos(angle) * radius;
                const initialY = Math.sin(angle) * radius;

                return (
                    <OrbitNode
                        key={node.id}
                        ref={(el) => registerNodeRef(index, el)}
                        node={node}
                        isActive={isActive}
                        isDimmed={isDimmed}
                        initialX={initialX}
                        initialY={initialY}
                        accentClass={accents.base}
                        activeAccentClass={accents.active}
                        onEnter={() => onNodeEnter(node)}
                        onLeave={onNodeLeave}
                        onFocus={() => onNodeEnter(node)}
                        onBlur={onNodeLeave}
                        onClick={() => onNodeClick(node)}
                    />
                );
            })}
        </div>
    );
};

export default OrbitRing;
