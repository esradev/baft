import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Truck, 
  CreditCard, 
  Send, 
  Instagram, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FileText,
  Share2,
  Barcode
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { toPersianDigits, formatToman, STATUS_MAP, COURIER_MAP, PAYMENT_METHOD_MAP, formatPhoneNumber } from '../../utils/persian';

interface OrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, status: 'paid' | 'pending' | 'review_needed') => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onUpdatePaymentStatus,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [smsSent, setSmsSent] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  if (!order) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3500);
  };

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
  const courierInfo = COURIER_MAP[order.courier] || COURIER_MAP.post_pishtaz;

  const allStatuses: { key: OrderStatus; label: string }[] = [
    { key: 'new', label: 'ثبت شده' },
    { key: 'confirmed', label: 'تایید پرداخت' },
    { key: 'preparing', label: 'در حال بسته‌بندی' },
    { key: 'shipped', label: 'ارسال شده' },
    { key: 'delivered', label: 'تحویل داده شده' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl transition-all dark:bg-slate-900 overflow-y-auto">
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-black text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              ب
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-num text-lg font-black text-slate-900 dark:text-white">{order.orderNumber}</h3>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-400">ثبت در {order.createdAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              title="چاپ فاکتور و برچسب پستی"
            >
              <Printer className="h-4 w-4" />
              <span>چاپ فاکتور</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="space-y-6 p-6">
          {/* Status Progression Bar */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-850">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">مراحل پردازش سفارش</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">تغییر سریع وضعیت</span>
            </div>

            <div className="flex items-center justify-between gap-1 overflow-x-auto">
              {allStatuses.map((st, idx) => {
                const isPassed = allStatuses.findIndex(s => s.key === order.status) >= idx;
                const isCurrent = order.status === st.key;
                return (
                  <button
                    key={st.key}
                    onClick={() => onUpdateStatus(order.id, st.key)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-xl p-2 text-center transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : isPassed
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                        : 'bg-white text-slate-400 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-500'
                    }`}
                  >
                    <span className="text-[10px]">{toPersianDigits(idx + 1)}</span>
                    <span className="text-[11px] whitespace-nowrap">{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer & Address Information Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold dark:bg-purple-950 dark:text-purple-300">
                  {order.customerName.charAt(0)}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{order.customerName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{order.socialHandle}</p>
                </div>
              </div>

              {order.channel === 'instagram' ? (
                <span className="flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
                  <Instagram className="h-3.5 w-3.5" />
                  دایرکت اینستاگرام
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                  <Send className="h-3.5 w-3.5 -rotate-45" />
                  ربات تلگرام
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  شماره تماس:
                </span>
                <span className="font-num font-bold text-slate-800 dark:text-slate-200">
                  {formatPhoneNumber(order.phone)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                  آدرس پستی:
                </span>
                <div className="text-left font-medium text-slate-800 dark:text-slate-200">
                  <p>{order.address}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-num">کد پستی ۱۰ رقمی: {toPersianDigits(order.postalCode)}</p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => copyToClipboard(`${order.customerName}\n${order.phone}\n${order.address}\nکدپستی: ${order.postalCode}`, 'address')}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copiedText === 'address' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText === 'address' ? 'کپی شد!' : 'کپی مشخصات پستی'}</span>
                </button>

                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Phone className="h-3.5 w-3.5 text-indigo-500" />
                  <span>تماس</span>
                </a>
              </div>
            </div>
          </div>

          {/* Ordered Products Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-3">اقلام سفارش</h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-12 w-12 rounded-xl object-cover shadow-xs"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">{item.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        رنگ: {item.color || 'پیش‌فرض'} • سایز: {item.size || 'استاندارد'} • تعداد: {toPersianDigits(item.quantity)} عدد
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {formatToman(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>جمع اقلام:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{formatToman(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>هزینه ارسال ({courierInfo.label}):</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{formatToman(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-rose-500">
                  <span>تخفیف ویژه:</span>
                  <span className="font-medium">-{formatToman(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-2 font-black text-sm text-slate-900 dark:border-slate-800 dark:text-white">
                <span>مبلغ نهایی پرداختی:</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatToman(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Bank Slip Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-500" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">وضعیت پرداخت و فیش بانکی</h4>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {PAYMENT_METHOD_MAP[order.paymentMethod]?.badge || 'کارت به کارت'}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {order.bankRefNumber && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">شماره ارجاع / پیگیری بانکی:</span>
                  <span className="font-num font-bold text-slate-800 dark:text-slate-200">{order.bankRefNumber}</span>
                </div>
              )}

              {/* Payment Slip Image Preview */}
              {order.paymentSlipUrl && (
                <div className="rounded-xl border border-slate-200 p-2 dark:border-slate-750">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">تصویر فیش واریز مشتری:</span>
                    <a
                      href={order.paymentSlipUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      مشاهده تصویر کامل
                    </a>
                  </div>
                  <img
                    src={order.paymentSlipUrl}
                    alt="فیش واریز"
                    className="max-h-48 w-full rounded-lg object-contain bg-slate-900/5 dark:bg-slate-900/60 p-1"
                  />
                </div>
              )}

              {/* Verify Payment Button */}
              {order.paymentStatus !== 'paid' ? (
                <button
                  onClick={() => onUpdatePaymentStatus(order.id, 'paid')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>تایید قطعی واریزی و فیش بانکی</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>پرداخت این سفارش با موفقیت تایید شده است</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping & Courier Tracking Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-purple-500" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">اطلاعات ارسال و بارکد رهگیری</h4>
              </div>
              <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                {courierInfo.icon} {courierInfo.label}
              </span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              {order.trackingNumber ? (
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">کد رهگیری ۲۴ رقمی پست / تیپاکس:</span>
                    <button
                      onClick={() => copyToClipboard(order.trackingNumber || '', 'tracking')}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      {copiedText === 'tracking' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedText === 'tracking' ? 'کپی شد' : 'کپی کد'}</span>
                    </button>
                  </div>
                  <p className="mt-1 font-num text-sm font-black text-slate-900 dark:text-white tracking-widest text-center py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-750">
                    {order.trackingNumber}
                  </p>

                  <button
                    onClick={handleSendSms}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5 -rotate-45" />
                    <span>{smsSent ? 'پیامک رهگیری با موفقیت ارسال شد ✨' : 'ارسال پیامک کد رهگیری به خریدار'}</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-3 text-center dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">کد رهگیری پستی هنوز ثبت نشده است.</p>
                  <button
                    onClick={() => {
                      const randomTrack = `29817400${Math.floor(10000000 + Math.random() * 90000000)}`;
                      order.trackingNumber = randomTrack;
                      onUpdateStatus(order.id, 'shipped');
                    }}
                    className="mt-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    تولید خودکار بارکد پست پیشتاز
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Printable Official Invoice Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl text-slate-900 dark:bg-slate-900 dark:text-white">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-base">فاکتور رسمی و برچسب پستی بافت</h3>
                <button onClick={() => setShowPrintModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Invoice Preview */}
              <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-xs dark:border-slate-750 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="font-black text-sm">فروشگاه آنلاین بافت</h4>
                    <p className="text-slate-400">فاکتور فروش کالا</p>
                  </div>
                  <div className="text-left font-num">
                    <p>شماره: {order.orderNumber}</p>
                    <p>تاریخ: {order.createdAt}</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">گیرنده: </span>
                    <strong>{order.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">تلفن: </span>
                    <strong className="font-num">{order.phone}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">نشانی: </span>
                    <span>{order.address}</span>
                  </div>
                </div>

                <div className="mt-4 border-t pt-2">
                  <div className="flex justify-between font-bold text-sm">
                    <span>مبلغ کل پرداختی:</span>
                    <span className="text-indigo-600">{formatToman(order.grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    window.print();
                    setShowPrintModal(false);
                  }}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 flex items-center justify-center gap-1.5"
                >
                  <Printer className="h-4 w-4" />
                  <span>ارسال به چاپگر (Print)</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
