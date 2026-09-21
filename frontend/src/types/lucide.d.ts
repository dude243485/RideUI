declare module 'lucide-react' {
  import * as React from 'react';
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
  }
  export type Icon = React.FC<IconProps>;

  export const ChevronRight: Icon;
  export const Loader2: Icon;
  export const CheckCircle2: Icon;
  export const XCircle: Icon;
  export const WifiOff: Icon;
  export const MapPin: Icon;
  export const ArrowRight: Icon;
  export const ArrowDown: Icon;
  export const AlertCircle: Icon;
  export const Phone: Icon;
  export const X: Icon;
  export const Star: Icon;
  export const Clock: Icon;
  export const Shield: Icon;
  export const ShieldCheck: Icon;
  export const Check: Icon;
  export const ThumbsUp: Icon;
  export const ThumbsDown: Icon;
  export const Bell: Icon;
  export const Compass: Icon;
  export const Navigation: Icon;
  export const RefreshCw: Icon;
  export const UserCheck: Icon;

  const icons: { [key: string]: Icon };
  export default icons;
}
