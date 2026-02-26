import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';

const Footer = () => {
    const normalizedEmail = GENERAL_INFO.email.toLowerCase();

    return (
        <footer className="section-divider pb-10 pt-16 md:pt-20" id="contact">
            <div className="container">
                <div className="surface-card px-6 py-10 text-center md:px-10 md:py-12">
                    <p className="eyebrow">Let&apos;s build something useful</p>
                    <h2 className="mt-4 font-sora text-4xl leading-none md:text-6xl">
                        Have a project in mind?
                    </h2>

                    <p className="mx-auto mt-4 max-w-[640px] text-muted-foreground md:text-lg">
                        {GENERAL_INFO.availability}
                    </p>

                    <a
                        href={`mailto:${normalizedEmail}`}
                        className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold lowercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
                    >
                        {normalizedEmail}
                    </a>

                    {SOCIAL_LINKS.length > 0 ? (
                        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            {SOCIAL_LINKS.map((link) => (
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={link.name}
                                    className="transition-colors hover:text-primary"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-6 text-sm text-muted-foreground">
                            Public profiles and references will be added here.
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
