import React from 'react';
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Asterisk, Award,
  Briefcase, Calendar, Camera, Check, Circle, Code2, Compass, Download,
  ExternalLink, Eye, FileText, Filter, Folder, FolderOpen, Globe, Heart,
  Layers, Link, Mail, MapPin, Menu, MessageCircle, Music, Palette, Play,
  Plus, Search, Settings, Share2, Shield, Sparkles, Star, Tag, Terminal,
  Trash2, Upload, User, Video, X, Zap,
} from 'lucide-react';

export const PORTFOLIO_ICON_OPTIONS = [
  'Activity','ArrowDown','ArrowLeft','ArrowRight','ArrowUp','Asterisk','Award',
  'Briefcase','Calendar','Camera','Check','Circle','Code2','Compass','Download',
  'ExternalLink','Eye','FileText','Filter','Folder','FolderOpen','Globe','Heart',
  'Layers','Link','Mail','MapPin','Menu','MessageCircle','Music','Palette','Play',
  'Plus','Search','Settings','Share2','Shield','Sparkles','Star','Tag','Terminal',
  'Trash2','Upload','User','Video','X','Zap',
] as const;

const ICONS: Record<string, React.ComponentType<{ className?: string; size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>> = {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Asterisk, Award, Briefcase,
  Calendar, Camera, Check, Circle, Code2, Compass, Download, ExternalLink, Eye,
  FileText, Filter, Folder, FolderOpen, Globe, Heart, Layers, Link, Mail, MapPin,
  Menu, MessageCircle, Music, Palette, Play, Plus, Search, Settings, Share2, Shield,
  Sparkles, Star, Tag, Terminal, Trash2, Upload, User, Video, X, Zap,
};

interface PortfolioIconProps {
  name?: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const PortfolioIcon: React.FC<PortfolioIconProps> = ({ name = 'Sparkles', className, size, strokeWidth }) => {
  const Icon = ICONS[name] || ICONS.Sparkles;
  return <Icon className={className} size={size} strokeWidth={strokeWidth} aria-hidden={true} />;
};

export function getPortfolioIcon(name?: string) {
  return ICONS[name || 'Sparkles'] || ICONS.Sparkles;
}
