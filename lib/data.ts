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
        {
            name: 'Oracle',
            icon: '/logo/oracle.webp',
        },
        {
            name: 'DigitalOcean',
            icon: '/logo/digitalocean.png',
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
            'A contract-driven test creation engine with deterministic runtime binding, strict taxonomy safety, and phased rollout controls for production-grade exam workflows.',
        role: `Status: In Progress<br/>
        <ul>
            <li>Designed contract-first runtime resolver for exam artifacts with normalization and deterministic config/runtime hashes</li>
            <li>Built strict API contract boundary for test creation with explicit invalid-request, unsupported-exam, and disabled-state semantics</li>
            <li>Executed Clean Slate rollout (logical disable + hard cleanup migration) to retire unstable legacy generation paths safely</li>
            <li>Implemented deterministic allocator with exam-scoped rebalance policy to prevent type-shortage failures when total inventory is sufficient</li>
            <li>Delivered runtime session integrity controls (back-block, terminate-on-leave, re-entry denial) with terminate endpoint support</li>
            <li>Roadmap in progress: explicit difficulty distribution config and staged enablement of full-test/template generation flows</li>
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
        thumbnail: '',
        longThumbnail: '',
        images: [],
        liveUrl: '',
        year: 2026,
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
    {
        title: 'Emiko App',
        slug: 'emiko-app-uiux',
        status: 'completed',
        techStack: [
            'UI/UX Design',
            'Responsive Design',
            'Landing Page Design',
        ],
        thumbnail: '/projects/thumbnail/resume-roaster.jpg',
        longThumbnail: '/projects/long/resume-roaster.jpg',
        images: [
            '/projects/images/resume-roaster-1.png',
            '/projects/images/resume-roaster-2.png',
        ],
        liveUrl: 'https://emikoapp.netlify.app',
        year: 2026,
        description:
            'A modern marketing website focused on conversion-driven layout, readable hierarchy, and polished mobile-first UI patterns.',
        role: `<ul>
            <li>Designed complete UI flow and visual hierarchy</li>
            <li>Prioritized CTA clarity and section-level conversion design</li>
            <li>Refined responsive behavior for mobile and tablet breakpoints</li>
        </ul>`,
    },
    {
        title: 'Amarnath Construction',
        slug: 'amarnath-construction-uiux',
        status: 'completed',
        techStack: ['UI/UX Design', 'Information Architecture', 'Web Design'],
        thumbnail: '/projects/images/amarnath-construction.png',
        longThumbnail: '/projects/images/amarnath-construction.png',
        images: ['/projects/images/amarnath-construction.png'],
        liveUrl: 'https://amarnathconstruction.in',
        year: 2025,
        description:
            'A business website redesign centered on trust signals, clear service discovery, and structured content for lead generation.',
        role: `<ul>
            <li>Structured service pages for faster user decision-making</li>
            <li>Improved trust and brand clarity using consistent visual components</li>
            <li>Optimized page sections for inquiry-first user journeys</li>
        </ul>`,
    },
    {
        title: 'KA Design',
        slug: 'ka-design-uiux',
        status: 'completed',
        techStack: ['UI/UX Design', 'Brand Web Design', 'Responsive Layout'],
        thumbnail: '/projects/images/ka-design.png',
        longThumbnail: '/projects/images/ka-design.png',
        images: ['/projects/images/ka-design.png'],
        liveUrl: 'https://ka-design.vercel.app',
        year: 2025,
        description:
            'A brand-forward portfolio website with clean typography, balanced spacing, and a curated visual narrative.',
        role: `<ul>
            <li>Created a cohesive visual system for brand consistency</li>
            <li>Designed section sequencing for stronger storytelling flow</li>
            <li>Built responsive layouts to preserve aesthetics across devices</li>
        </ul>`,
    },
    {
        title: 'Educare Guidance',
        slug: 'educare-guidance-uiux',
        status: 'completed',
        techStack: ['UI/UX Design', 'EdTech UX', 'Content-first Design'],
        thumbnail: '/projects/images/guidanceeducare.png',
        longThumbnail: '/projects/images/guidanceeducare.png',
        images: ['/projects/images/guidanceeducare.png'],
        liveUrl: 'https://guidanceeducare.in/',
        year: 2025,
        description:
            'An education-focused website designed for fast information scanning, clear guidance pathways, and parent/student readability.',
        role: `<ul>
            <li>Simplified navigation for courses, services, and contact paths</li>
            <li>Designed content blocks for high readability and quick scanning</li>
            <li>Aligned visual hierarchy with counseling conversion goals</li>
        </ul>`,
    },
    {
        title: 'Mr Biologist',
        slug: 'mr-biologist-uiux',
        status: 'completed',
        techStack: ['UI/UX Design', 'Education Web Design', 'Visual Design'],
        thumbnail: '/projects/images/mrbiologist.png',
        longThumbnail: '/projects/images/mrbiologist.png',
        images: ['/projects/images/mrbiologist.png'],
        liveUrl: 'https://mrbiologist.vercel.app',
        year: 2025,
        description:
            'A subject-centric educational site focused on approachable design language, structured learning content, and mobile usability.',
        role: `<ul>
            <li>Crafted an education-first interface with accessible visual hierarchy</li>
            <li>Organized subject content for frictionless exploration</li>
            <li>Improved mobile reading flow for long-form educational sections</li>
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
            <li>Engineered contract-first test architecture (exam-config + syllabus-map) with deterministic hashing and taxonomy snapshot versioning</li>
            <li>Hardened create-test APIs (400/422/410) and shipped feature-flagged rollout for topic-test generation with controlled blast radius</li>
            <li>Built deterministic syllabus/question-bank compilers with strict CSV validation, canonical taxonomy matching, and idempotent import behavior</li>
            <li>Implemented allocator-based DB selection with exam-specific type-quota rebalance and fallback telemetry in allocation metadata</li>
            <li>Delivered local runtime/session lifecycle APIs and anti-bypass session integrity guardrails for active tests</li>
            <li>Added broad automated test coverage across runtime resolver, route contracts, local runtime reads, and allocator behavior</li>
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
            <li>Built and maintained a multi-app Assam public services platform covering Public Registration, Skill Courses, Job Mela, Job Board, and Recruitment workflows</li>
            <li>Implemented secure identity-verified onboarding (OTP + Aadhaar OTP + eKYC) with role-based access for Candidate, Employer, and Mela Admin journeys</li>
            <li>Delivered end-to-end employment lifecycle features including job posting, applications, shortlisting/rejection, interview scheduling, and candidate profile/resume workflows</li>
            <li>Standardized shared architecture with reusable UI/auth/state modules across apps, improving consistency and delivery speed</li>
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
