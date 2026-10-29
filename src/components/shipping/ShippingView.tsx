import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Calculator, 
  Printer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  ShieldCheck, 
  ArrowRightLeft,
  ExternalLink,
  Barcode,
  Navigation
} from 'lucide-react';
import { mockShippingRates } from '../../data/mockData';
import { IRAN_PROVINCES, toPersianDigits, formatToman, COURIER_MAP } from '../../utils/persian';

export const ShippingView: React.FC = () => {
  // Calculator State
  const [destProvince, setDestProvince] = useState('اصفهان');
  const [packageWeight, setPackageWeight] = useState(500); // grams
  const [insuredValue, setInsuredValue] = useState(1000000); // Tomans
  const [withPackaging, setWithPackaging] = useState(true);

  // Tracking Search State
  const [trackingInput, setTrackingInput] = useState('298174009182374619028374');
  const [searchedTracking, setSearchedTracking] = useState<string | null>('298174009182374619028374');

  // Rate calculation
  const foundRate = mockShippingRates.find(r => r.province === destProvince) || {
    province: destProvince,
    cities: [destProvince],
    pishtazCost: 55000,
    tipaxCost: 78000,
    estimatedDays: '۲ الی ۳ روز کاری'
  };

  const weightFactor = Math.max(1, packageWeight / 500);
  const packagingFee = withPackaging ? 10000 : 0;
  const pishtazTotal = Math.round(foundRate.pishtazCost * (1 + (weightFactor - 1) * 0.4) + packagingFee);
  const tipaxTotal = Math.round(foundRate.tipaxCost * (1 + (weightFactor - 1) * 0.3) + packagingFee);
  const chaparTotal = Math.round(tipaxTotal * 0.95);

  const trackingSteps = [
    { title: 'تحویل مرسوله به باجه پستی مبدا (تهران)', date: '۱۴ آبان - ساعت ۱۰:۳۰', done: true },
    { title: 'ورود به مرکز مکانیزه مبادلات پستی چهارراه لشکر', date: '۱۴ آبان - ساعت ۱۵:۱۵', done: true },
    { title: 'توزیع به خط سیر استان گیلان (رشت)', date: '۱۵ آبان - ساعت ۰۴:۰۰', done: true },
    { title: 'ورود به باجه توزیع پست رشت و تحویل به نامه‌رسان', date: '۱۵ آبان - ساعت ۰۹:۴۵', done: true },
    { title: 'تحویل نهایی به گیرنده محترم (نیلوفر کریمی)', date: '۱۵ آبان - ساعت ۱۲:۲۰', done: true, final: true }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            مرکز ارسال و خدمات لجستیک
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            اتصال مستقیم به سامانه پست پیشتاز ایران، تیپاکس و چاپار با محاسبه دقیق هزینه و رهگیری آنلاین
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700"
        >
          <Printer className="h-4 w-4" />
          <span>چاپ گروهی بارکدهای پستی امروز</span>
        </button>
      </div>

      {/* Couriers Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📮</span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              متصل به وب‌سرویس
            </span>
          </div>
          <h3 className="mt-2 text-sm font-black text-slate-900 dark:text-white">شرکت ملی پست ایران</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">پیشتاز سراسری • صدور بارکد ۲۴ رقمی</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🚚</span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              فعال (پس‌کرایه)
            </span>
          </div>
          <h3 className="mt-2 text-sm font-black text-slate-900 dark:text-white">تیپاکس اکسپرس (Tipax)</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">تحویل درب منزل • جمع‌آوری از درب فروشگاه</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📦</span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              پشتیبانی می‌شود
            </span>
          </div>
          <h3 className="mt-2 text-sm font-black text-slate-900 dark:text-white">چاپار (Chapar)</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">بسته‌های سنگین و حجیم</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🛵</span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
              تحویل ۲ ساعته
            </span>
          </div>
          <h3 className="mt-2 text-sm font-black text-slate-900 dark:text-white">پیک فوری درون‌شهری</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">مخصوص شهر تهران و مراکز استان</p>
        </div>
      </div>

      {/* Main Grid: Live Shipping Calculator & Tracking Lookup */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Shipping Rate Calculator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-950 dark:text-indigo-300">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">محاسبه‌گر آنلاین کرایه و تعرفه پست</h3>
              <p className="text-xs text-slate-400">محاسبه دقیق هزینه ارسال به تفکیک استان و وزن مرسوله</p>
            </div>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">استان مبدا فروشگاه</label>
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 font-medium">
                  تهران (مرکز توزیع)
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">استان مقصد خریدار</label>
                <select
                  value={destProvince}
                  onChange={(e) => setDestProvince(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {IRAN_PROVINCES.map((pr) => (
                    <option key={pr} value={pr}>{pr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">وزن تقریبی بسته (گرم)</label>
                <input
                  type="number"
                  step={100}
                  min={100}
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-num"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ارزش ریالی مرسوله (تومان)</label>
                <input
                  type="number"
                  step={100000}
                  value={insuredValue}
                  onChange={(e) => setInsuredValue(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-num"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={withPackaging}
                onChange={(e) => setWithPackaging(e.target.checked)}
                className="rounded-md text-indigo-600"
              />
              <span className="text-slate-700 dark:text-slate-300">محاسبه هزینه کارتن استاندارد و لفاف‌بندی پستی (+۱۰,۰۰۰ تومان)</span>
            </label>

            {/* Calculated Rates Breakdown */}
            <div className="mt-4 space-y-2 rounded-2xl bg-indigo-50/70 p-4 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">📮</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">پست پیشتاز ایران</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">زمان تحویل: {foundRate.estimatedDays}</p>
                  </div>
                </div>
                <span className="font-black text-sm text-indigo-700 dark:text-indigo-300">{formatToman(pishtazTotal)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-indigo-200/50 pt-2 dark:border-indigo-900">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚚</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">تیپاکس اکسپرس (درب منزل)</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">زمان تحویل: ۱ الی ۲ روز کاری</p>
                  </div>
                </div>
                <span className="font-black text-sm text-slate-900 dark:text-white">{formatToman(tipaxTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Postal Tracking Lookup Tool */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold dark:bg-purple-950 dark:text-purple-300">
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">سامانه رهگیری مرسولات پست و تیپاکس</h3>
              <p className="text-xs text-slate-400">استعلام زنده وضعیت بسته مشتری</p>
            </div>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="کد ۲۴ رقمی رهگیری پست یا شماره تیپاکس..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-num"
              />
              <button
                onClick={() => setSearchedTracking(trackingInput)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              >
                رهگیری
              </button>
            </div>

            {searchedTracking && (
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-3 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">وضعیت فعلی: تحویل داده شده</span>
                  <span className="font-num text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">{searchedTracking}</span>
                </div>

                <div className="relative pl-4 space-y-3 before:absolute before:right-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900">
                  {trackingSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 mr-4">
                      <span className={`absolute -right-6 flex h-4 w-4 items-center justify-center rounded-full text-white text-[9px] ${
                        step.final ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}>
                        ✓
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{step.title}</p>
                        <p className="text-[10px] text-slate-400 font-num mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
