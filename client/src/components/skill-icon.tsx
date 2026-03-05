import {
  BookOpen, GraduationCap, Globe, Moon, Crown,
  Dumbbell, Wind, Layers, Bike, Mountain,
  PenLine, Palette, Music, Camera, Scissors,
  MessageCircle, BookHeart, Heart,
  Leaf, Flower2, Compass
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  BookOpen, GraduationCap, Globe, Moon, Crown,
  Dumbbell, Wind, Layers, Bike, Mountain,
  PenLine, Palette, Music, Camera, Scissors,
  MessageCircle, BookHeart, Heart,
  Leaf, Flower2, Compass,
};

interface SkillIconProps {
  iconName: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SkillIcon({ iconName, size = 18, className, style }: SkillIconProps) {
  const Icon = ICON_MAP[iconName] || BookOpen;
  return <Icon size={size} className={className} style={style} />;
}
