export type OrbitRingId = 1 | 2 | 3;

export type OrbitStackCategory =
    | 'Frontend'
    | 'Backend'
    | 'Database'
    | 'DevOps'
    | 'Tools'
    | 'Design';

export type OrbitStackLevel = 'Advanced' | 'Proficient' | 'Intermediate';

export interface StackSourceItem {
    name: string;
    icon: string;
}

export type StackSource = Record<string, StackSourceItem[]>;

export interface OrbitStackNode {
    id: string;
    name: string;
    icon: string;
    sourceGroup: string;
    category: OrbitStackCategory;
    ring: OrbitRingId;
    level: OrbitStackLevel;
    description: string;
}

const DEVOPS_NAMES = new Set(['Docker', 'AWS', 'Oracle', 'DigitalOcean']);
const DESIGN_NAMES = new Set([
    'Tailwind CSS',
    'Sass',
    'Bootstrap',
    'GSAP',
    'Framer Motion',
]);

const LEVEL_MAP: Record<string, OrbitStackLevel> = {
    JavaScript: 'Advanced',
    TypeScript: 'Advanced',
    React: 'Advanced',
    'Next.js': 'Advanced',
    Redux: 'Proficient',
    'Tailwind CSS': 'Advanced',
    GSAP: 'Proficient',
    'Framer Motion': 'Proficient',
    Sass: 'Proficient',
    Bootstrap: 'Proficient',
    'Node.js': 'Advanced',
    'Express.js': 'Proficient',
    MySQL: 'Proficient',
    PostgreSQL: 'Advanced',
    MongoDB: 'Proficient',
    Prisma: 'Proficient',
    Git: 'Advanced',
    Docker: 'Proficient',
    AWS: 'Proficient',
    Oracle: 'Intermediate',
    DigitalOcean: 'Proficient',
};

const DESCRIPTION_MAP: Record<string, string> = {
    JavaScript: 'Dynamic frontend logic and browser-driven product behavior.',
    TypeScript: 'Safer APIs and maintainable large-scale frontend/backend code.',
    React: 'Component architecture for reusable and scalable interfaces.',
    'Next.js': 'SSR, routing, and performance-focused full-stack delivery.',
    Redux: 'Predictable state workflows for complex UI behavior.',
    'Tailwind CSS': 'Rapid, consistent design systems with utility-first styling.',
    GSAP: 'Precision motion and scroll narratives for premium interfaces.',
    'Framer Motion': 'Expressive UI micro-interactions and transitions.',
    Sass: 'Structured styling with reusable variables and mixins.',
    Bootstrap: 'Fast UI scaffolding for pragmatic component delivery.',
    'Node.js': 'High-throughput backend services and API orchestration.',
    'Express.js': 'Clean server route architecture for application backends.',
    MySQL: 'Reliable relational data modeling and transactional queries.',
    PostgreSQL: 'Robust relational architecture with advanced query support.',
    MongoDB: 'Flexible document storage for iterative feature domains.',
    Prisma: 'Type-safe data access and migration-friendly schema workflows.',
    Git: 'Versioned collaboration and clean release workflows.',
    Docker: 'Portable runtime environments and deployment consistency.',
    AWS: 'Scalable cloud infrastructure and service-level reliability.',
    Oracle: 'Cloud hosting and VM-level deployment management.',
    DigitalOcean: 'Lean VPS-based deployments with direct infrastructure control.',
};

const slugify = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const resolveCategory = (
    sourceGroup: string,
    name: string,
): OrbitStackCategory => {
    if (DEVOPS_NAMES.has(name)) {
        return 'DevOps';
    }
    if (DESIGN_NAMES.has(name)) {
        return 'Design';
    }

    if (sourceGroup === 'frontend') return 'Frontend';
    if (sourceGroup === 'backend') return 'Backend';
    if (sourceGroup === 'database') return 'Database';
    return 'Tools';
};

const categoryToRing = (category: OrbitStackCategory): OrbitRingId => {
    if (category === 'Frontend' || category === 'Backend') return 1;
    if (category === 'Database' || category === 'DevOps') return 2;
    return 3;
};

export const mapStackToOrbitNodes = (
    source: StackSource,
): {
    nodes: OrbitStackNode[];
    rings: Record<OrbitRingId, OrbitStackNode[]>;
} => {
    const entries = Object.entries(source);

    const nodes = entries.flatMap(([sourceGroup, items]) =>
        (Array.isArray(items) ? items : []).map((item) => {
            const category = resolveCategory(sourceGroup, item.name);
            return {
                id: slugify(item.name),
                name: item.name,
                icon: item.icon,
                sourceGroup,
                category,
                ring: categoryToRing(category),
                level: LEVEL_MAP[item.name] ?? 'Proficient',
                description:
                    DESCRIPTION_MAP[item.name] ??
                    'Production-ready tooling used across shipped products.',
            } satisfies OrbitStackNode;
        }),
    );

    return {
        nodes,
        rings: {
            1: nodes.filter((node) => node.ring === 1),
            2: nodes.filter((node) => node.ring === 2),
            3: nodes.filter((node) => node.ring === 3),
        },
    };
};

