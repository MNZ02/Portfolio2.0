import { IProject } from '@/types';

interface ISocialLink {
    name: string;
    url: string;
}

export interface IExperience {
    title: string;
    company: string;
    duration: string;
    summary: string;
    highlights: string[];
}

export interface IHeroTerminalPanel {
    title: string;
    prompt: string;
    output: string[];
    status?: 'ok' | 'warn';
}

export const GENERAL_INFO = {
    email: 'abdulminhaz2@gmail.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Abdul, I am reaching out to you because...',

    oldPortfolio: '',
    upworkProfile: 'mailto:abdulminhaz2@gmail.com',
    ctaLabel: 'Discuss a Product Build',
    availability:
        'Open to full-time, contract, and product engineering engagements in 2026.',
};

export const SOCIAL_LINKS: ISocialLink[] = [];

export const HERO_TERMINAL_PANELS: IHeroTerminalPanel[] = [
    {
        title: 'Security Gate',
        prompt: 'authctl verify --rbac --jwt --sso',
        status: 'ok',
        output: [
            'RBAC matrix loaded',
            'JWT rotation healthy',
            'SSO handoff checks passed',
            'Audit log: synchronized',
        ],
    },
    {
        title: 'Gov Platform Sync',
        prompt: 'deploy gov-suite --services registration,job-mela,skill-courses',
        status: 'ok',
        output: [
            'Public Registration: online',
            'Job Mela: online',
            'Skill Courses: online',
            'Shared session gateway: stable',
        ],
    },
    {
        title: 'Impact Feed',
        prompt: 'watch delivery --projects psigenei,mobipay',
        status: 'ok',
        output: [
            'Psigenei: rule engine active',
            'Mobipay: transaction flow stable',
            'incident_rate: low',
            'release_status: green',
        ],
    },
];

export const CORE_EXPERTISE = [
    'Security-first API design',
    'RBAC and JWT auth flows',
    'SSO integration architecture',
    'Government workflow platforms',
    'Next.js and React frontends',
    'Node.js and MongoDB backends',
];

export const MY_STACK = {
    frontend: [
        {
            name: 'TypeScript',
            icon: '/logo/ts.png',
        },
        {
            name: 'JavaScript',
            icon: '/logo/js.png',
        },
        {
            name: 'React',
            icon: '/logo/react.png',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.png',
        },
        {
            name: 'Redux',
            icon: '/logo/redux.png',
        },
        {
            name: 'Tailwind CSS',
            icon: '/logo/tailwind.png',
        },
        {
            name: 'Framer Motion',
            icon: '/logo/framer-motion.png',
        },
        {
            name: 'GSAP',
            icon: '/logo/gsap.png',
        },
    ],
    backend: [
        {
            name: 'Node.js',
            icon: '/logo/node.png',
        },
        {
            name: 'Express.js',
            icon: '/logo/express.png',
        },
        {
            name: 'NestJS',
            icon: '/logo/nest.svg',
        },
    ],
    database: [
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'Prisma',
            icon: '/logo/prisma.png',
        },
    ],
    tools: [
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
        {
            name: 'GitHub',
            icon: '/logo/github.png',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'Government Services Suite',
        slug: 'government-services-suite',
        liveUrl: '',
        year: 2025,
        status: 'completed',
        description:
            'Delivered integrated government portals for Public Registration, Job Mela, and Skill Courses with shared security and operational workflows.',
        role: `<ul>
            <li>Designed shared backend services with Node.js and MongoDB for three public programs</li>
            <li>Implemented SSO-aware session handling across registration and service modules</li>
            <li>Built RBAC-based admin flows for approvals, tracking, and content operations</li>
            <li>Reduced manual coordination by standardizing APIs and validation rules</li>
        </ul>`,
        techStack: [
            'Node.js',
            'MongoDB',
            'React',
            'RBAC',
            'SSO',
        ],
        thumbnail: '/projects/thumbnail/devLinks.jpg',
        longThumbnail: '/projects/long/devLinks.jpg',
        images: [
            '/projects/images/devLinks-1.png',
            '/projects/images/devLinks-2.png',
            '/projects/images/devLinks-3.png',
        ],
    },
    {
        title: 'Mobipay Platform Delivery',
        slug: 'mobipay-platform-delivery',
        status: 'completed',
        techStack: [
            'Node.js',
            'JWT',
            'React',
            'Monitoring',
            'Security',
        ],
        thumbnail: '/projects/thumbnail/epikcart.jpg',
        longThumbnail: '/projects/long/epikcart.jpg',
        images: [
            '/projects/images/epikcart-1.png',
            '/projects/images/epikcart-2.png',
            '/projects/images/epikcart-3.png',
        ],
        liveUrl: '',
        year: 2024,
        description:
            'Improved a fintech delivery track by hardening authentication paths and stabilizing transaction operations for cross-team releases.',
        role: `<ul>
            <li>Strengthened token and access boundaries using JWT-based verification patterns</li>
            <li>Supported transaction reliability improvements and incident response workflows</li>
            <li>Delivered internal dashboards in Next.js and React for faster operational visibility</li>
            <li>Partnered across product and engineering teams to accelerate release cycles</li>
        </ul>`,
    },
    {
        title: 'Psigenei',
        slug: 'psigenei',
        liveUrl: '',
        year: 2026,
        status: 'in-progress',
        description:
            'Building an AI exam-generation platform with strict taxonomy control, rule validation, and predictable output quality for education workflows.',
        role: `<ul>
            <li>Defined taxonomy architecture (stream to subtopic) for deterministic content mapping</li>
            <li>Built a JSON rule engine with validation guards and constrained paper composition</li>
            <li>Implemented fallback and redistribution logic to preserve coverage quality under data limits</li>
            <li>Focused on production-safe backend behavior for real usage constraints</li>
        </ul>`,
        techStack: [
            'Node.js',
            'PostgreSQL',
            'System Design',
            'Rule Engine',
            'AI Workflows',
        ],
        thumbnail: '/projects/thumbnail/mti-electronics.webp',
        longThumbnail: '/projects/long/mti-electronics.webp',
        images: [
            '/projects/images/mti-electronics-1.webp',
            '/projects/images/mti-electronics-2.webp',
        ],
    },
    {
        title: 'SSO and Access Control Foundation',
        slug: 'sso-access-control-foundation',
        status: 'completed',
        techStack: [
            'SSO',
            'RBAC',
            'JWT',
            'Node.js',
            'Next.js',
        ],
        thumbnail: '/projects/thumbnail/property-pro.jpg',
        longThumbnail: '/projects/long/property-pro.jpg',
        images: [
            '/projects/images/property-pro-1.png',
            '/projects/images/property-pro-2.png',
            '/projects/images/property-pro-3.png',
        ],
        liveUrl: '',
        year: 2025,
        description:
            'Established a reusable identity and authorization base for multi-product teams with secure handoff and role-aware access boundaries.',
        role: `<ul>
            <li>Designed SSO integration contracts for shared login and session continuity</li>
            <li>Implemented RBAC policy layers to separate admin, operator, and end-user capabilities</li>
            <li>Added JWT verification middleware and audit-ready access checks</li>
            <li>Created reusable auth modules to reduce repeated implementation work</li>
        </ul>`,
    },
];

export const MY_EXPERIENCE: IExperience[] = [
    {
        title: 'Full-Stack Product Engineer',
        company: 'Psigenei',
        duration: '2025 - Present',
        summary:
            'Leading architecture for a rule-driven AI assessment platform, translating curriculum constraints into production-safe backend behavior and deterministic outputs.',
        highlights: [
            'Designed taxonomy, rule-validation, and fallback logic to keep generated papers structurally correct.',
            'Converted ambiguous academic requirements into deterministic Node.js workflows and data contracts.',
            'Aligned product logic, release plans, and data modeling for predictable iteration velocity.',
        ],
    },
    {
        title: 'Full-Stack Engineer (Contract)',
        company: 'Government Digital Programs',
        duration: '2024 - 2025',
        summary:
            'Delivered citizen-facing systems including Public Registration, Job Mela, and Skill Courses with shared identity, access control, and service workflows.',
        highlights: [
            'Implemented SSO-oriented service flows across multiple government products and admin surfaces.',
            'Built Node.js and MongoDB APIs with role-aware permissions and audit-friendly operations.',
            'Improved delivery consistency through shared validation, reusable modules, and stable release contracts.',
        ],
    },
    {
        title: 'Backend and Product Engineer',
        company: 'Mobipay',
        duration: '2023 - 2024',
        summary:
            'Contributed to secure transaction workflows, monitoring, and cross-functional delivery in a fintech environment with reliability focus.',
        highlights: [
            'Strengthened auth handling with JWT-centric security controls.',
            'Supported operational stability by improving incident visibility and backend safeguards.',
            'Shipped Next.js and React operational surfaces tied to live backend services.',
        ],
    },
];
