import { IProject } from '@/types';

interface ISocialLink {
    name: string;
    url: string;
}

interface IExperience {
    title: string;
    company: string;
    duration: string;
    description?: string;
    liveUrl?: string;
    isFreelance?: boolean;
    isInternship?: boolean;
    isTrainee?: boolean;
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
    ctaLabel: 'Start a Project',
    availability: 'Available for freelance and contract work in 2026.',
};

export const SOCIAL_LINKS: ISocialLink[] = [
    {
        name: 'GitHub',
        url: 'https://github.com/mnz02',
    },
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/mnz02',
    },
];

export const HERO_TERMINAL_PANELS: IHeroTerminalPanel[] = [
    {
        title: 'Build Check',
        prompt: 'npm run build',
        status: 'ok',
        output: [
            '▲ Next.js 15.2.8',
            '✓ Compiled successfully',
            '✓ Generating static pages (10/10)',
            'Route /projects/[slug] prerendered',
        ],
    },
    {
        title: 'Deploy Health',
        prompt: "ssh deploy@openclaw 'systemctl status gateway --no-pager'",
        status: 'ok',
        output: [
            '● gateway.service - OpenClaw API Gateway',
            'Active: active (running)',
            'Memory: 162.4M | CPU: 2.3%',
            'Health endpoint: 200 OK',
        ],
    },
    {
        title: 'Runtime Monitor',
        prompt: 'node scripts/monitor.js --env=prod',
        status: 'ok',
        output: [
            'queue_depth=0',
            'p95_latency=138ms',
            'error_rate=0.2%',
            'uptime=99.97%',
        ],
    },
];

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
        status: 'in-progress',
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
        status: 'completed',
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
        status: 'completed',
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

export const MY_EXPERIENCE: IExperience[] = [
    {
        title: 'Full Stack Developer',
        company: 'Psigenei (Remote)',
        duration: 'Jan 2026 – Present',
        liveUrl: 'https://psigenei-zeta.vercel.app',
        isFreelance: true,
        description: `<ul>
            <li>Engineered AI-driven exam generation systems with complex taxonomy and rule-based logic</li>
            <li>Architected scalable data models for multi-tenant course management and content delivery</li>
            <li>Optimized high-traffic server-side workflows in Next.js for enterprise-scale reliability</li>
        </ul>`,
    },
    {
        title: 'Full Stack Developer',
        company: 'EmikoFit (Remote)',
        duration: 'Oct 2025 – Present',
        liveUrl: 'https://emikoapp.com',
        isFreelance: true,
        description: `<ul>
            <li>Engineered a full-stack fitness app (React, TypeScript, Express, MongoDB) with protected user/admin routes and JWT-based authentication</li>
            <li>Implemented a metabolic “debt/amortization” system that computes daily calorie targets, logs intake/workouts, and awards gamified rewards</li>
            <li>Built adaptive workout playlist APIs (Journey/Custom/Debt modes) with day-based muscle scheduling and automatic game/meditation insertion</li>
            <li>Integrated MediaPipe pose detection to drive live exercise sessions with rep counting, orientation checks, and calorie-per-rep estimation</li>
            <li>Developed an AI nutrition workflow (triage → chemistry → commit) including express single-food mode and USDA search integration</li>
        </ul>`,
    },
    {
        title: 'Front End Developer',
        company: 'Cognitive Tech (Onsite)',
        duration: 'Jun 2025 – Present',
        liveUrl: 'https://skillmissionassam.org',
        description: `<ul>
            <li>Developed and maintained 3 Assam government projects: Public Registration, Job Mela, Skill Courses</li>
            <li>Built secure signup/login flows with RBAC for candidates, mobilizers, and companies</li>
            <li>Implemented dashboards and profiles for candidates and companies (job applications + course enrollments)</li>
            <li>Integrated SSO for consistent sessions across all 3 platforms</li>
        </ul>`,
    },
    {
        title: 'Full Stack Developer',
        company: 'Psigenei (Remote)',
        duration: 'Feb 2025 – Apr 2025',
        liveUrl: 'https://psigenei-zeta.vercel.app',
        isFreelance: true,
        description: `<ul>
            <li>Migrated exam logic to Next.js server-side for better security and maintainability (1,000+ users)</li>
            <li>Secured APIs with Zod validation + sanitization to prevent injection attacks</li>
            <li>Built CRUD endpoints for courses/videos and integrated Razorpay payments</li>
            <li>Built admin dashboard with RBAC + JWT for 500+ users; media via Cloudinary</li>
            <li>Optimized state management with Zustand + React Query, reducing API calls by 30%</li>
        </ul>`,
    },
    {
        title: 'Front End Developer',
        company: 'Mobipay Securiservices (Remote)',
        duration: 'Oct 2024 – Jan 2025',
        isTrainee: true,
        description: `<ul>
            <li>Designed React UI for Bank of Baroda app used by 500K+ Jio feature-phone users</li>
            <li>Integrated BBPS and VPA APIs for QR payments; reduced transaction errors by 15%</li>
            <li>Built custom QR scanning without dependencies</li>
            <li>Optimized navigation/assets; improved load times by 20%</li>
        </ul>`,
    },
    {
        title: 'Full Stack Developer',
        company: 'Levicent (Remote)',
        duration: 'Jun 2024 – Oct 2024',
        isInternship: true,
        description: `<ul>
            <li>Developed TypeScript-based Express.js + MongoDB backend for LMS (100+ users)</li>
            <li>Implemented secure APIs with JWT authentication</li>
        </ul>`,
    },
    {
        title: 'Full Stack Developer',
        company: 'Brandon Infotech (Remote)',
        duration: 'May 2024 – Jun 2024',
        isInternship: true,
        description: `<ul>
            <li>Built MERN-based invoice system</li>
            <li>Streamlined billing workflow for 100+ invoices by 30%</li>
        </ul>`,
    },
];
