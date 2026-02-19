'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { MoveUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import Link from 'next/link';

const MENU_LINKS = [
    {
        name: 'Home',
        url: '/',
    },
    {
        name: 'About',
        url: '/#about-me',
    },
    {
        name: 'Stack',
        url: '/#my-stack',
    },
    {
        name: 'Experience',
        url: '/#my-experience',
    },
    {
        name: 'Projects',
        url: '/#selected-projects',
    },
    {
        name: 'Contact',
        url: '/#contact',
    },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <header className="sticky top-0 z-[45]">
                <div className="container pt-4">
                    <div className="surface-card relative flex h-14 items-center px-4 md:px-5">
                        <Link
                            href="/#banner"
                            className="font-anton text-lg leading-none tracking-[0.18em] text-foreground"
                        >
                            MINHAZ.DEV
                        </Link>

                        <a
                            href={`mailto:${GENERAL_INFO.email}`}
                            className="ml-auto mr-3 hidden rounded-full border border-border/80 px-4 py-2 text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-primary/70 hover:text-primary md:inline-flex"
                        >
                            {GENERAL_INFO.ctaLabel || 'Start a Project'}
                        </a>

                        <button
                            className="group relative ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background-light/60 transition-colors hover:border-primary/70 md:ml-0"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span
                                className={cn(
                                    'absolute h-0.5 w-4 rounded-full bg-foreground transition-all duration-300',
                                    {
                                        'translate-y-0 rotate-45': isMenuOpen,
                                        '-translate-y-1.5': !isMenuOpen,
                                    },
                                )}
                            ></span>
                            <span
                                className={cn(
                                    'absolute h-0.5 w-4 rounded-full bg-foreground transition-all duration-300',
                                    {
                                        'translate-y-0 -rotate-45': isMenuOpen,
                                        'translate-y-1.5': !isMenuOpen,
                                    },
                                )}
                            ></span>
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={cn(
                    'fixed inset-0 z-[42] bg-black/60 backdrop-blur-[2px] transition-all duration-200',
                    {
                        'invisible opacity-0 pointer-events-none': !isMenuOpen,
                    },
                )}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            <aside
                className={cn(
                    'fixed right-0 top-0 z-[43] flex h-[100dvh] w-[430px] max-w-[calc(100vw-2.5rem)] translate-x-full flex-col border-l border-border/70 bg-[hsl(var(--surface-1)/0.97)] p-7 shadow-2xl shadow-black/35 transition-transform duration-500 md:p-9',
                    {
                        'translate-x-0': isMenuOpen,
                    },
                )}
            >
                <p className="eyebrow mb-8">Navigation</p>

                <nav>
                    <ul className="space-y-2">
                        {MENU_LINKS.map((link) => (
                            <li key={link.name}>
                                <button
                                    onClick={() => {
                                        router.push(link.url);
                                        setIsMenuOpen(false);
                                    }}
                                    className="group flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-3 text-left font-medium transition-colors hover:border-border/80 hover:bg-background-light/60"
                                >
                                    <span className="text-lg">{link.name}</span>
                                    <MoveUpRight
                                        size={16}
                                        className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-10 space-y-5">
                    <div>
                        <p className="eyebrow mb-3">Social links</p>
                        {SOCIAL_LINKS.length ? (
                            <ul className="space-y-2">
                                {SOCIAL_LINKS.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            {link.name}
                                            <MoveUpRight size={14} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="rounded-xl border border-border/70 bg-background-light/55 px-4 py-3 text-sm text-muted-foreground">
                                Social profiles will be added soon.
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-border/70 bg-background-light/55 p-4">
                        <p className="eyebrow mb-2">Get in touch</p>
                        <a
                            href={`mailto:${GENERAL_INFO.email}`}
                            className="inline-flex text-base text-foreground transition-colors hover:text-primary"
                        >
                            {GENERAL_INFO.email}
                        </a>
                        <p className="mt-3 text-sm text-muted-foreground">
                            {GENERAL_INFO.availability}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-border/70 py-2.5 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/70 hover:text-primary"
                >
                    Close
                </button>
            </aside>
        </>
    );
};

export default Navbar;
