import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Users,
  Boxes,
  Truck,
  Sparkles,
  HelpCircle,
  Palette,
  Instagram,
  Send,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persian';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  unreadCount: number;
  newOrdersCount: number;
  lowStockCount: number;
  instagramHandle: string;
  telegramChannel: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount,
  newOrdersCount,
  lowStockCount,
  instagramHandle,
  telegramChannel
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'داشبورد اصلی',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'orders',
      label: 'مدیریت سفارش‌ها',
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? { text: toPersianDigits(newOrdersCount), color: 'bg-amber-500 text-white' } : null,
    },
    {
      id: 'inbox',
      label: 'پیام‌ها و دایرکت',
      icon: MessageSquare,
      badge: unreadCount > 0 ? { text: toPersianDigits(unreadCount), color: 'bg-rose-500 text-white' } : null,
    },
    {
      id: 'customers',
      label: 'بانک اطلاعات مشتریان (CRM)',
      icon: Users,
      badge: null,
    },
    {
      id: 'inventory',
      label: 'انبار و محصولات',
      icon: Boxes,
      badge: lowStockCount > 0 ? { text: toPersianDigits(lowStockCount), color: 'bg-amber-500/90 text-white' } : null,
    },
    {
      id: 'shipping',
      label: 'ارسال و لجستیک (پست/تیپاکس)',
      icon: Truck,
      badge: null,
    },
    {
      id: 'ai-scanner',
      label: 'اسکن هوشمند فیش (AI)',
      icon: Sparkles,
      badge: { text: 'هوشمند', color: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' },
      highlight: true
    },
    {
      id: 'onboarding',
      label: 'راهنمای راه‌اندازی فروشگاه',
      icon: HelpCircle,
      badge: null,
    },
    {
      id: 'design-system',
      label: 'سیستم طراحی و پالت رنگ',
      icon: Palette,
      badge: null,
    },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col justify-between border-l border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900 z-20 shrink-0">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/30">
            <span className="font-extrabold text-xl tracking-tight">ب</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">بـافـت</h1>
              <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Baft OS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">سامانه مدیریت تجارت اجتماعی</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1 text-sm font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all text-right ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-bold dark:bg-indigo-600'
                    : item.highlight
                    ? 'bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span className="text-xs md:text-sm">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : item.badge.color
                    }`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Connected Channels Widget */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">کانال‌های فعال</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            همگام
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-xs dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 text-white">
                <Instagram className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px] truncate max-w-[100px] dir-ltr text-right">
                @{instagramHandle}
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-xs dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500 text-white">
                <Send className="h-3.5 w-3.5 -rotate-45" />
              </div>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px] truncate max-w-[100px] dir-ltr text-right">
                @{telegramChannel}
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>
    </aside>
  );
};
