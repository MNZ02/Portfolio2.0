import { GENERAL_INFO } from '@/lib/data';
import React from 'react';

const StickyEmail = () => {
    const normalizedEmail = GENERAL_INFO.email.toLowerCase();

    return (
        <div className="fixed bottom-32 left-3 z-30 hidden 2xl:block">
            <a
                href={`mailto:${normalizedEmail}`}
                className="rounded-full border border-border/70 bg-background-light/65 px-2 py-3 text-[11px] lowercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/70 hover:text-primary"
                style={{
                    textOrientation: 'mixed',
                    writingMode: 'vertical-rl',
                }}
            >
                {normalizedEmail}
            </a>
        </div>
    );
};

export default StickyEmail;
