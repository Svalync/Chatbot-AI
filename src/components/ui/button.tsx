import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex gap-2.5 items-center justify-center whitespace-nowrap text-sm rounded-sm font-medium transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-fit leading-normal tracking-wider font-inter text-primary-foreground',
  {
    variants: {
      variant: {
        default: 'bg-primary shadow hover:bg-transparent hover:text-primary border-primary border',
        primary: 'bg-secondary shadow hover:bg-transparent hover:text-secondary border-secondary border ',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        primaryOutline: 'border border-primary text-primary bg-background hover:text-white hover:border-primary hover:bg-primary ',
        outline: 'border border-black/30 text-secondary-foreground bg-background hover:text-primary hover:border-primary ',
        secondary: 'hover:bg-primary hover:text-primary-foreground text-secondary-foreground font-normal bg-transparent',
        secondaryOutline: 'bg-transparent rounded-none hover:bg-secondary text-secondary border-secondary hover:text-white border ',
        ghost: 'text-secondary hover:bg-secondary/30 rounded-none',
        link: 'text-primary underline text-sm leading-none',
      },
      size: {
        default: 'px-3 py-2.5',
        small: 'px-3 py-1.5 text-sm font-semibold',
        lg: 'px-3 py-2.5 md:py-[15px] md:px-[23px] md:text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
