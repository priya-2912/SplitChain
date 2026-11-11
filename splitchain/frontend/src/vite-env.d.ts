/// <reference types="vite/client" />

declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
    className?: string;
  }
  export type LucideIcon = ComponentType<LucideProps>;

  export const ArrowRight: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const LockKeyhole: LucideIcon;
  export const Wallet: LucideIcon;
  export const Users: LucideIcon;
  export const Receipt: LucideIcon;
  export const Scale: LucideIcon;
  export const Blocks: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ArrowLeftRight: LucideIcon;
  export const Plus: LucideIcon;
  export const LoaderCircle: LucideIcon;
}
