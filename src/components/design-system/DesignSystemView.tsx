import React from 'react';
import { 
  Palette, 
  Layers, 
  Sparkles, 
  Check, 
  Copy, 
  Instagram, 
  Send, 
  Truck, 
  CreditCard,
  ShoppingBag,
  Bell,
  Heart
} from 'lucide-react';
import { toPersianDigits, formatToman } from '../../utils/persian';

export const DesignSystemView: React.FC = () => {
  const colorTokens = [
    { name: 'Primary Purple (بافت)', hex: '#6366f1', role: 'دکمه‌های اصلی، برندینگ و نقاط تعاملی', bg: 'bg-indigo-600' },
    { name: 'Secondary Violet', hex: '#9333ea', role: 'ویژگی‌های هوش مصنوعی، المان‌های پرمیوم', bg: 'bg-purple-600' },
    { name: 'Warm Coral / Rose', hex: '#f43f5e', role: 'کانال اینستاگرام، هشدارها و تخفیف‌ها', bg: 'bg-rose-500' },
    { name: 'Sky / Telegram Teal', hex: '#0284c7', role: 'کانال تلگرام، وضعیت‌های در حال بررسی', bg: 'bg-sky-600' },
    { name: 'Emerald Success', hex: '#10b981', role: 'تایید واریزی، فیش‌های بانکی معتبر', bg: 'bg-emerald-500' },
    { name: 'Amber Warning', hex: '#f59e0b', role: 'کسری موجودی انبار، سفارش‌های جدید', bg: 'bg-amber-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 font-extrabold text-2xl">
            ب
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black">سیستم طراحی و هویت بصری «بافت» (Baft Design System)</h2>
            <p className="mt-1 text-xs text-slate-300">
              طراحی اختصاصی برای مرچنت‌ها و فروشندگان آنلاین ایرانی با پشتیبانی کامل از زبان فارسی و چینش راست‌به‌چپ (RTL)
            </p>
          </div>
        </div>
      </div>

      {/* Brand Concept Explanation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span>مفهوم نام «بـافـت» (Baft Concept)</span>
        </h3>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          کلمه <strong>«بافت»</strong> نمادی از گره‌خوردن و پیوند تاروپود کسب‌وکارهای اجتماعی (Social Commerce) است؛ اتصال بی‌وقفه میان فروشنده، خریدار در شبکه‌های اجتماعی (اینستاگرام و تلگرام)، سامانه‌های بانکی (کارت‌به‌کارت و درگاه) و ناوگان لجستیک و ارسال پستی ایران.
        </p>
      </div>

      {/* Color Palette Tokens */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">پالت رنگ و توکن‌های بصری (Color Tokens)</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((c, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <div className={`h-10 w-10 shrink-0 rounded-xl ${c.bg} shadow-xs`} />
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</h4>
                <p className="text-[10px] font-mono text-slate-400">{c.hex}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Persian Typography */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">تایپوگرافی و فونت فارسی وزیرمتن (Vazirmatn)</h3>
        <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <p className="text-2xl font-black text-slate-900 dark:text-white">تیتر بزرگ: مدیریت هوشمند سفارش‌ها و فیش‌های بانکی</p>
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">زیرتیتر: همگام‌سازی لحظه‌ای موجودی کالا در اینستاگرام و تلگرام</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            متن عادی: سامانه بافت با بهره‌گیری از هوش مصنوعی پیشرفته Gemini، امکان استخراج خودکار آدرس و فیش واریزی را از اسکرین‌شات دایرکت فراهم می‌کند.
          </p>
          <p className="text-sm font-num font-bold text-indigo-600 dark:text-indigo-400">
            اعداد فارسی: ۱۲۳,۴۵۶,۷۸۹ تومان | شناسه پیگیری: ۸۹۲۳۷۴
          </p>
        </div>
      </div>

      {/* UI Component Showcase */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">نمونه کامپوننت‌ها و نشان‌ها (Badges & Chips)</h3>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            سفارش جدید
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            تایید پرداخت
          </span>
          <span className="rounded-full bg-purple-50 px-3 py-1 font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            ارسال با پست پیشتاز
          </span>
          <span className="rounded-full bg-pink-50 px-3 py-1 font-bold text-pink-700 dark:bg-pink-950 dark:text-pink-300">
            اینستاگرام دایرکت
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1 font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            کانال تلگرام
          </span>
        </div>
      </div>
    </div>
  );
};
