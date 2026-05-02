import {
  ShieldCheck, BadgeDollarSign, Wrench, AlertTriangle, CheckCircle, ShowerHead,
  Flame, Waves, Droplets, Shield, Zap, Lightbulb, Activity, BatteryCharging, Power,
  Hammer, Sparkles, Clock, Award, Users, Home, Settings, Star, Phone, Mail,
  ThumbsUp, Building2, KeyRound, HardHat, Search, PaintBucket, Plug, Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck, BadgeDollarSign, Wrench, AlertTriangle, CheckCircle, ShowerHead,
  Flame, Waves, Droplets, Shield, Zap, Lightbulb, Activity, BatteryCharging, Power,
  Hammer, Sparkles, Clock, Award, Users, Home, Settings, Star, Phone, Mail,
  ThumbsUp, Building2, KeyRound, HardHat, Search, PaintBucket, Plug, Lock,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function Icon({ name, size = 24, strokeWidth, className, style }: {
  name: string; size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties;
}) {
  const Cmp = ICON_MAP[name] || CheckCircle;
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} style={style} />;
}
