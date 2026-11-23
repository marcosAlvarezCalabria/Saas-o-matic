import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';

export type IconSize = 16 | 18 | 20 | 24;

interface IconProps extends Omit<ComponentProps<LucideIcon>, 'aria-hidden' | 'size'> {
  icon: LucideIcon;
  size?: IconSize;
  decorative?: boolean;
}

export function Icon({
  icon: LucideIconComponent,
  size = 20,
  decorative = true,
  ...props
}: IconProps) {
  return (
    <LucideIconComponent
      aria-hidden={decorative ? 'true' : undefined}
      size={size}
      {...props}
    />
  );
}
