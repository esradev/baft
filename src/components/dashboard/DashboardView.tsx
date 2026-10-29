import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight, 
  Plus, 
  Truck, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  Instagram,
  Send,
  Eye,
  CreditCard,
  Package,
  Layers
} from 'lucide-react';
import { Order, Product, Conversation } from '../../types';
import { toPersianDigits, formatToman, STATUS_MAP } from '../../utils/persian';

interface DashboardViewProps {
  orders: Order[];
  products: Product[];
  conversations: Conversation[];
  onOpenNewOrder: () => void;
  onOpenAiScanner: () => void;
  onSelectOrder: (order: Order) => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  products,
  conversations,
  onOpenNewOrder,
  onOpenAiScanner,
  onSelectOrder,
  onNavigate,
}) => {
  const [salesTimeframe, setSalesTimeframe] = useState<'7d' | '30d'>('7d');
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<{
    headline: string;
    summary: string;
    actionableTips: string[];
    customerTrend: string;
  }>({
    headline: "رشد ۲۸٪ سفارش‌های دایرکت اینستاگرام در هفته جاری",
    summary: "بیشترین نرخ تبدیل مربوط به مشتریان دایرکت اینستاگرام با پاسخگویی زیر ۱۵ دقیقه بوده است. ۶۴٪ سفارش‌ها با پرداخت کارت‌به‌کارت ثبت شده‌اند.",
    actionableTips: [
      "محصول «مانتو کتی لینن ژاکارد» به عنوان پرفروش‌ترین کالا شناخته شد؛ شارژ مجدد قبل از پنجشنبه پیشنهاد می‌شود.",
      "با صدور خودکار بارکد پست و تیپاکس، زمان پردازش سفارش را به نصف کاهش دهید.",
      "ارسال پیامک کد رهگیری پستی به مشتریان باعث کاهش ۷۰ درصدی پیام‌های پیگیری شده است."
    ],
    customerTrend: "مشتریان وفادار (VIP) سهم ۴۱ درصدی از کل فروش این هفته را تشکیل داده‌اند."
  });

  const generateLiveInsight = async () => {
    setAiInsightLoading(true);
    try {
      const res = await fetch('/api/gemini/sales-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalSales: '۴,۲۷۰,۰۰۰ تومان',
          totalOrders: orders.length,
          topProducts: products.slice(0, 3).map(p => p.title),
        })
      });
      const data = await res.json();
      if (data.success && data.insight) {
        setAiInsight(data.insight);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiInsightLoading(false);
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' || o.paymentStatus === 'review_needed' ? o.grandTotal : 0), 0);
  const unreadDMs = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'confirmed').length;

  const weeklySalesData = [
    { day: 'شنبه', instagram: 650000, telegram: 320000, total: 970000, height: 60 },
    { day: '۱شنبه', instagram: 820000, telegram: 290000, total: 1110000, height: 75 },
    { day: '۲شنبه', instagram: 950000, telegram: 480000, total: 1430000, height: 95 },
    { day: '۳شنبه', instagram: 580000, telegram: 220000, total: 800000, height: 50 },
    { day: '۴شنبه', instagram: 1200000, telegram: 550000, total: 1750000, height: 100 },
    { day: '۵شنبه', instagram: 1050000, telegram: 410000, total: 1460000, height: 88 },
    { day: 'جمعه', instagram: 420000, telegram: 190000, total: 610000, height: 40 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-l from-indigo-600 via-purple-600 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-500/15 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              دوشنبه ۱۵ آبان ۱۴۰۲
            </span>
            <span className="flex items-center gap-1 text-xs text-indigo-200">
              <Clock className="h-3.5 w-3.5" />
              ساعت ۱۴:۳۵
            </span>
          </div>
          <h2 className="mt-2 text-xl md:text-2xl font-black">
            سلام زهرا عزیز، به پیشخوان مدیریت «بافت» خوش آمدید 🌸
          </h2>
          <p className="mt-1 text-xs md:text-sm text-indigo-100 max-w-xl">
            امروز <span className="font-bold underline">{toPersianDigits(3)} پیام جدید</span> در دایرکت و <span className="font-bold underline">{toPersianDigits(pendingOrders)} سفارش در انتظار پردازش</span> دارید.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAiScanner}
            className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs md:text-sm font-bold text-indigo-700 shadow-md transition-all hover:scale-105 hover:bg-indigo-50 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-purple-600 animate-spin-slow" />
            <span>اسکن هوشمند فیش بانکی</span>
          </button>
          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 rounded-2xl bg-indigo-500/40 border border-white/30 px-3.5 py-2.5 text-xs md:text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-indigo-500/60"
          >
            <Plus className="h-4 w-4" />
            <span>ثبت دستی سفارش</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">مجموع فروش این هفته</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {formatToman(totalSales)}
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+{toPersianDigits(24)}٪ رشد نسبت به هفته قبل</span>
            </div>
          </div>
        </div>

        {/* Orders Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">سفارش‌های کل</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(orders.length)} سفارش
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-amber-500">{toPersianDigits(pendingOrders)} مورد</span>
              <span>در انتظار ارسال و بسته‌بندی</span>
            </div>
          </div>
        </div>

        {/* Unread Chats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">پیام‌های دایرکت و تلگرام</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(unreadDMs)} پیام جدید
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>میانگین پاسخگویی: ۸ دقیقه</span>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">مشتریان فعال (CRM)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(48)} خریدار
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-semibold">
              <span>{toPersianDigits(12)} نفر مشتری VIP با خرید مجدد</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sales Chart + AI Insight */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Trend Chart (2 Cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                روند فروش روزانه و کانال‌های ورودی
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تفکیک درآمد دایرکت اینستاگرام و کانال/ربات تلگرام
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-500"></span>
                  اینستاگرام (۶۸٪)
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500"></span>
                  تلگرام (۳۲٪)
                </span>
              </div>
              <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  onClick={() => setSalesTimeframe('7d')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    salesTimeframe === '7d' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  ۷ روز
                </button>
                <button
                  onClick={() => setSalesTimeframe('30d')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    salesTimeframe === '30d' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  ۳۰ روز
                </button>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6 flex h-52 items-end justify-between gap-3 px-2">
            {weeklySalesData.map((item, idx) => (
              <div key={idx} className="group flex flex-1 flex-col items-center gap-2">
                {/* Tooltip on Hover */}
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatToman(item.total, false)}
                </div>

                <div className="flex w-full max-w-[42px] flex-col overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800" style={{ height: `${item.height * 1.5}px` }}>
                  <div 
                    className="w-full bg-gradient-to-t from-pink-500 to-rose-400 transition-all hover:brightness-110" 
                    style={{ height: `${(item.instagram / item.total) * 100}%` }}
                    title={`اینستاگرام: ${formatToman(item.instagram)}`}
                  />
                  <div 
                    className="w-full bg-gradient-to-t from-sky-500 to-indigo-400 transition-all hover:brightness-110" 
                    style={{ height: `${(item.telegram / item.total) * 100}%` }}
                    title={`تلگرام: ${formatToman(item.telegram)}`}
                  />
                </div>

                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>میانگین مبلغ هر سفارش: <strong className="text-slate-800 dark:text-slate-200">۸۷۰,۰۰۰ تومان</strong></span>
            <span>بیشترین فروش: <strong className="text-indigo-600 dark:text-indigo-400">چهارشنبه (۱,۷۵۰,۰۰۰ تومان)</strong></span>
          </div>
        </div>

        {/* AI Business Insights Card (1 Col) */}
        <div className="flex flex-col justify-between rounded-2xl border border-purple-200/70 bg-gradient-to-b from-purple-50/50 via-white to-indigo-50/30 p-5 shadow-xs dark:border-purple-900/40 dark:bg-slate-850 dark:from-slate-850 dark:to-slate-850">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/25">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">دستیار رشد هوشمند بافت</h3>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">تحلیل هوش مصنوعی Gemini</p>
                </div>
              </div>
              <button
                onClick={generateLiveInsight}
                disabled={aiInsightLoading}
                className="rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-xs font-semibold text-purple-700 shadow-xs hover:bg-purple-50 dark:border-purple-800 dark:bg-slate-800 dark:text-purple-300"
              >
                {aiInsightLoading ? 'در حال تحلیل...' : 'به‌روزرسانی'}
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-white/80 p-3.5 border border-purple-100 shadow-xs dark:bg-slate-800 dark:border-slate-750">
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {aiInsight.headline}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {aiInsight.summary}
              </p>
            </div>

            <div className="mt-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">پیشنهادات عملی برای افزایش فروش:</span>
              {aiInsight.actionableTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-white/60 p-2 text-xs text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-100 dark:border-slate-750">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {toPersianDigits(i + 1)}
                  </span>
                  <p className="text-[11px] leading-tight">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-indigo-50/80 p-2.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
            💡 {aiInsight.customerTrend}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders (2 Cols) & Top Selling Products (1 Col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders Feed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">سفارش‌های اخیر</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">آخرین درخواست‌های ثبت شده از شبکه‌های اجتماعی</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>مشاهده همه در برد کانبان</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                  <th className="pb-2.5 font-semibold">شناسه و مشتری</th>
                  <th className="pb-2.5 font-semibold">کانال</th>
                  <th className="pb-2.5 font-semibold">محصولات</th>
                  <th className="pb-2.5 font-semibold">مبلغ کل</th>
                  <th className="pb-2.5 font-semibold">وضعیت</th>
                  <th className="pb-2.5 font-semibold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.slice(0, 4).map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
                  return (
                    <tr key={order.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {order.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{order.customerName}</p>
                            <p className="text-[11px] text-slate-400 font-num">{order.orderNumber}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        {order.channel === 'instagram' ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-pink-50 px-2 py-0.5 text-[11px] font-semibold text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
                            <Instagram className="h-3 w-3" />
                            دایرکت
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                            <Send className="h-3 w-3 -rotate-45" />
                            تلگرام
                          </span>
                        )}
                      </td>

                      <td className="py-3">
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px] inline-block">
                          {order.items[0]?.title} {order.items.length > 1 && `(+${toPersianDigits(order.items.length - 1)} دیگر)`}
                        </span>
                      </td>

                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {formatToman(order.grandTotal)}
                      </td>

                      <td className="py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3 text-center">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700"
                          title="مشاهده فاکتور و جزییات"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">پرفروش‌ترین کالاها</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">موجودی و تیراژ فروش</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              مدیریت انبار
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-12 w-12 rounded-xl object-cover shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{product.title}</h4>
                    <p className="text-[11px] text-slate-400">{product.category}</p>
                    <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{formatToman(product.price)}</p>
                  </div>
                </div>

                <div className="text-left">
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {toPersianDigits(product.soldCount)} فروش
                  </span>
                  <p className={`mt-1 text-[10px] font-semibold ${product.isLowStock ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                    موجودی: {toPersianDigits(product.stock)} عدد
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
