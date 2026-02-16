'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  Anchor,
  LayoutDashboard,
  Ship,
  MapPin,
  FileText,
  Users,
  Image,
  FileCode,
  Settings,
  Mail,
  LogOut,
  ChevronDown,
  Home,
  Info,
  Phone,
  Send,
  Database,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Yachts',
    href: '/admin/yachts',
    icon: Ship,
  },
  {
    name: 'Destinations',
    href: '/admin/destinations',
    icon: MapPin,
  },
  {
    name: 'Blog Posts',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    name: 'Team',
    href: '/admin/team',
    icon: Users,
  },
  {
    name: 'Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    name: 'Pages',
    icon: FileCode,
    children: [
      { name: 'Home', href: '/admin/pages/home', icon: Home },
      { name: 'About', href: '/admin/pages/about', icon: Info },
      { name: 'Contact', href: '/admin/pages/contact', icon: Phone },
      { name: 'Yachts', href: '/admin/pages/yachts', icon: Ship },
      { name: 'Destinations', href: '/admin/pages/destinations', icon: MapPin },
      { name: 'Blog', href: '/admin/pages/blog', icon: FileText },
    ],
  },
  {
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: Mail,
  },
  {
    name: 'Newsletter',
    href: '/admin/newsletter/subscribers',
    icon: Send,
  },
  {
    name: 'Email Templates',
    href: '/admin/email-templates',
    icon: Mail,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    name: 'Backups',
    href: '/admin/backups',
    icon: Database,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Pages']);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700">
        <Anchor className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">Mediterana Yachting</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedItems.includes(item.name);
              const hasActiveChild = item.children.some((child) =>
                isActive(child.href)
              );

              return (
                <li key={item.name}>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={cn(
                      'flex items-center w-full gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                      hasActiveChild
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                              isActive(child.href)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            )}
                          >
                            <child.icon className="h-4 w-4" />
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-3">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
