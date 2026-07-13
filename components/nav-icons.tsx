'use client';

import {
  LayoutDashboard,
  Building2,
  Hospital,
  Users,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Settings,
  CalendarDays,
  Stethoscope,
  ClipboardList,
  FileText,
  ClipboardPenLine,
  Pill,
  ListTodo,
  MessageSquare,
  GraduationCap,
  FolderSearch,
  FileCheck2,
  AlertTriangle,
  DollarSign,
  BadgeCheck,
  ReceiptText,
  UserCheck,
  FolderOpen,
  Receipt,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps the string icon names used in lib/mockData.ts nav items to their Lucide
 * components. Keeping this in one place means mockData stays free of JSX imports.
 */
export const navIcons: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Hospital,
  Users,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Settings,
  CalendarDays,
  Stethoscope,
  ClipboardList,
  FileText,
  ClipboardPenLine,
  Pill,
  ListTodo,
  MessageSquare,
  GraduationCap,
  FolderSearch,
  FileCheck2,
  AlertTriangle,
  DollarSign,
  BadgeCheck,
  ReceiptText,
  UserCheck,
  FolderOpen,
  Receipt,
  Wallet,
};

export function getNavIcon(name: string): LucideIcon {
  return navIcons[name] ?? LayoutDashboard;
}
