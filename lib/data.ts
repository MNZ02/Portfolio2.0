import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'abdulminhaz2@gmail.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Abdul, I am reaching out to you because...',

    oldPortfolio: '',
    upworkProfile: 'mailto:abdulminhaz2@gmail.com',
};

export const SOCIAL_LINKS = [];

export const MY_STACK = {
    frontend: [
        {
            name: 'JavaScript',
            icon: '/logo/js.png',
        },
        {
            name: 'TypeScript',
            icon: '/logo/ts.png',
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
            name: 'GSAP',
            icon: '/logo/gsap.png',
        },
        {
            name: 'Framer Motion',
            icon: '/logo/framer-motion.png',
        },
        {
            name: 'Sass',
            icon: '/logo/sass.png',
        },
        {
            name: 'Bootstrap',
            icon: '/logo/bootstrap.svg',
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
    ],
    database: [
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
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
        title: 'Psigenei',
        slug: 'psigenei',
        liveUrl: '',
        year: 2026,
        description:
            'An AI-based exam generation engine with a taxonomy-driven structure and a rule engine that produces valid, high-fidelity papers under data constraints.',
        role: `Status: In Progress<br/>
        <ul>
            <li>Master taxonomy (stream → subject → topic → subtopic)</li>
            <li>Canonical name mapping for UI and database consistency</li>
            <li>JSON-based rule engine with constraint validation</li>
            <li>Fidelity engine with partial-availability fallback</li>
            <li>Redistribution logic within topic scope</li>
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
        title: 'OpenClaw Gateway',
        slug: 'openclaw-gateway',
        techStack: [
            'VPS',
            'Oracle Cloud',
            'Node.js',
            'SSH',
            'Service Monitoring',
        ],
        thumbnail: '/projects/thumbnail/epikcart.jpg',
        longThumbnail: '/projects/long/epikcart.jpg',
        images: [
            '/projects/images/epikcart-1.png',
            '/projects/images/epikcart-2.png',
        ],
        liveUrl: '',
        year: 2025,
        description:
            'A server-controlled AI gateway system focused on secure access, runtime stability, and service continuity.',
        role: `Status: Completed<br/>
        <ul>
            <li>VPS deployment and Oracle Cloud setup</li>
            <li>SSH key management and secure access</li>
            <li>Resolved NVM vs system Node runtime conflicts</li>
            <li>Gateway service monitoring and log debugging</li>
        </ul>`,
    },
    {
        title: 'Portfolio Website',
        slug: 'portfolio-website',
        techStack: ['Next.js', 'React', 'Tailwind CSS'],
        thumbnail: '/projects/thumbnail/devLinks.jpg',
        longThumbnail: '/projects/long/devLinks.jpg',
        images: [
            '/projects/images/devLinks-1.png',
            '/projects/images/devLinks-2.png',
        ],
        liveUrl: '',
        year: 2026,
        description:
            'A personal portfolio with a clean UI system, responsive layout, and structured content sections.',
        role: `
        <ul>
            <li>Clean, scalable UI structure</li>
            <li>Responsive layout system</li>
            <li>Sidebar + header toggle logic</li>
            <li>Animation-aware UI polish</li>
        </ul>`,
    },
];

export const MY_EXPERIENCE = [];
