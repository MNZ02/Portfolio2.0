import Link from 'next/link';
import React, { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { Variant } from '@/types';
import { cn } from '@/lib/utils';

const Child = ({ icon }: any) => (
    <span className="flex items-center justify-center gap-3">
        <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        {!icon && 'Processing...'}
    </span>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
    as?: 'link' | 'button';
    loading?: boolean;
    icon?: boolean;
    children: ReactNode | ReactNode[];
    className?: string;
    variant?: Variant;
} & (ComponentProps<typeof Link> | ButtonProps);

const Button = ({
    loading,
    variant,
    className,
    children,
    as = 'link',
    icon = false,
    ...rest
}: Props) => {
    const variantClasses = {
        primary:
            'bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:ring-primary/45',
        secondary:
            'bg-secondary text-secondary-foreground hover:bg-secondary/88 focus-visible:ring-secondary/45',
        success:
            'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500/40',
        warning:
            'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500/40',
        danger:
            'bg-destructive text-destructive-foreground hover:bg-destructive/80 focus-visible:ring-destructive/45',
        info: 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500/40',
        light: 'bg-background-light text-foreground hover:bg-background-light/70 focus-visible:ring-border/45',
        dark: 'bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-foreground/35',
        link: 'text-foreground hover:text-primary focus-visible:ring-primary/40',
        'no-color': '',
    }[variant || 'primary'];

    const iconClasses = cn(
        'inline-flex min-w-9 aspect-square items-center justify-center rounded-md p-0 text-xl',
        variantClasses,
    );

    const buttonClasses = cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-transparent px-7 text-sm font-semibold uppercase tracking-[0.15em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variantClasses,
        {
            [iconClasses]: icon,
            'rounded-none border-none px-0 text-base tracking-[0.12em]':
                variant === 'link',
        },
        className,
    );

    if (as === 'link') {
        const props = rest as ComponentProps<typeof Link>;

        if (props.target === '_blank') {
            return (
                <a
                    className={buttonClasses}
                    {...props}
                    href={props.href.toString() || '#'}
                >
                    <span>{loading ? <Child icon={icon} /> : children}</span>
                </a>
            );
        }

        return (
            <Link className={buttonClasses} {...props} href={props.href || '#'}>
                <span>{loading ? <Child icon={icon} /> : children}</span>
            </Link>
        );
    }

    const props = rest as ButtonProps;

    return (
        <button className={buttonClasses} {...props}>
            <span>{loading ? <Child icon={icon} /> : children}</span>
        </button>
    );
};

export default Button;
