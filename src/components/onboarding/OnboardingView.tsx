import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Instagram, 
  Send, 
  CreditCard, 
  Truck, 
  Boxes, 
  ArrowLeft, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  Store,
  Check
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persian';

export const OnboardingView: React.FC = () => {
  const [steps, setSteps] = useState([
    {
      id: 1,
      title: 'اتصال پیج فروشگاه اینستاگرام',
      desc: 'دریافت خودکار دایرکت‌ها، کامنت‌ها و پیام‌های استوری',
      icon: Instagram,
      color: 'from-pink-500 to-rose-600',
      completed: true,
      buttonText: 'متصل به @baft.boutique',
      detail: 'دسترسی دایرکت و پیام‌های پیج متصل شد.'
    },
    {
      id: 2,
      title: 'اتصال کانال یا ربات تلگرام',
      desc: 'همگام‌سازی کاتالوگ محصولات با کانال و ربات فروش',
      icon: Send,
      color: 'from-sky-500 to-blue-600',
      completed: true,
      buttonText: 'متصل به @baft_shop_channel',
      detail: 'وب‌هوک تلگرام با موفقیت تنظیم شد.'
    },
    {
      id: 3,
      title: 'تعریف شماره کارت و شبای بانکی فروشگاه',
      desc: 'جهت ارسال خودکار در پاسخ‌های آماده دایرکت به مشتریان',
      icon: CreditCard,
      color: 'from-emerald-500 to-teal-600',
      completed: true,
      buttonText: 'شماره کارت ۶۰۳۷... ثبت شد',
      detail: 'کارت بانک ملی به نام زهرا کاظمی تایید شد.'
    },
    {
      id: 4,
      title: 'تنظیمات ارسال و شرکت‌های پستی',
      desc: 'اتصال به سامانه وب‌سرویس پست پیشتاز و تیپاکس اکسپرس',
      icon: Truck,
      color: 'from-purple-500 to-indigo-600',
      completed: false,
      buttonText: 'تکمیل تنظیمات باجه پستی',
      detail: 'تعرفه‌های پایه سراسر کشور فعال هستند.'
    },
    {
      id: 5,
      title: 'ثبت اولین محصولات در انبار بافت',
      desc: 'تعریف کدهای SKU، جدول سایزبندی، تنوع رنگ و قیمت تمام‌شده',
      icon: Boxes,
      color: 'from-amber-500 to-orange-600',
      completed: true,
      buttonText: '۶ محصول ثبت شد',
      detail: 'محصولات با انبار و کاتالوگ همگام هستند.'
    },
  ]);

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const toggleStep = (id: number) => {
    setSteps(steps.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-l from-indigo-600 via-purple-600 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-500/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
              گام به گام تا هوشمندسازی کامل فروشگاه
            </span>
            <h2 className="mt-2 text-xl md:text-2xl font-black">
              راهنمای راه‌اندازی و اتصال کامل «بافت»
            </h2>
            <p className="mt-1 text-xs md:text-sm text-indigo-100">
              با تکمیل این مراحل، تمام فرایندهای پاسخگویی به مشتریان، ثبت فیش، کنترل انبار و ارسال پستی به صورت نیمه‌خودکار انجام خواهد شد.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shrink-0">
            <span className="text-2xl md:text-3xl font-black font-num">{toPersianDigits(progressPercent)}٪</span>
            <span className="text-xs text-indigo-100 font-semibold mt-1">تکمیل شده</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3.5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`rounded-2xl border bg-white p-5 shadow-xs transition-all dark:bg-slate-850 ${
                step.completed
                  ? 'border-slate-200 dark:border-slate-800'
                  : 'border-indigo-300 ring-2 ring-indigo-500/10 dark:border-indigo-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${step.color} text-white shadow-md`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{step.title}</h3>
                      {step.completed && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check className="h-3 w-3" />
                          تکمیل شده
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                    <p className="mt-1 text-[11px] text-slate-400 font-medium">{step.detail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      step.completed
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700'
                    }`}
                  >
                    {step.buttonText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Tips for Online Merchants */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 dark:border-purple-900/50 dark:bg-slate-850">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span>توصیه‌های کلیدی برای فروش بیشتر در اینستاگرام و تلگرام</span>
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="rounded-xl bg-white p-3 shadow-xs dark:bg-slate-800 border border-purple-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">⚡ سرعت پاسخگویی دایرکت</h4>
            <p className="leading-relaxed">۸۵٪ خریدها زمانی ثبت می‌شوند که زیر ۱۵ دقیقه به استعلام قیمت مشتری پاسخ داده شود.</p>
          </div>

          <div className="rounded-xl bg-white p-3 shadow-xs dark:bg-slate-800 border border-purple-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">📦 شفافیت هزینه پست و تیپاکس</h4>
            <p className="leading-relaxed">اعلام کرایه ثابت یا پس‌کرایه مشخص در ابتدای مکالمه، انصراف از خرید را تا ۴۰٪ کاهش می‌دهد.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
