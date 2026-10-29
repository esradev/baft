// Persian text & number manipulation utilities

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toPersianDigits(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '';
  const str = num.toString();
  return str.replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

export function toEnglishDigits(str: string): string {
  if (!str) return '';
  let res = str;
  for (let i = 0; i < 10; i++) {
    res = res.replace(new RegExp(PERSIAN_DIGITS[i], 'g'), ENGLISH_DIGITS[i]);
  }
  return res;
}

export function formatToman(amount: number | string | undefined | null, showSymbol = true): string {
  if (amount === undefined || amount === null) return '۰ تومان';
  const numeric = typeof amount === 'string' ? parseInt(toEnglishDigits(amount), 10) || 0 : amount;
  const formatted = numeric.toLocaleString('en-US');
  const persianFormatted = toPersianDigits(formatted);
  return showSymbol ? `${persianFormatted} تومان` : persianFormatted;
}

export function formatCardNumber(card: string): string {
  const clean = toEnglishDigits(card.replace(/\D/g, ''));
  const parts = clean.match(/[\s\S]{1,4}/g) || [];
  return toPersianDigits(parts.join(' - '));
}

export function formatPhoneNumber(phone: string): string {
  const clean = toEnglishDigits(phone.replace(/\D/g, ''));
  if (clean.length === 11 && clean.startsWith('09')) {
    return toPersianDigits(`${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`);
  }
  return toPersianDigits(phone);
}

// Iranian Province list
export const IRAN_PROVINCES = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'مازندران',
  'گیلان', 'خوزستان', 'البرز', 'کرمان', 'قم', 'یزد', 'هرمزگان',
  'قزوین', 'کرمانشاه', 'آذربایجان غربی', 'لرستان', 'کردستان', 'گلستان',
  'همدان', 'مرکزی', 'بوشهر', 'زنجان', 'سمنان', 'اردبیل', 'چهارمحال و بختیاری'
];

export const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new: { label: 'سفارش جدید', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' },
  confirmed: { label: 'تایید پرداخت', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800' },
  preparing: { label: 'در حال آماده‌سازی', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-200 dark:border-indigo-800' },
  shipped: { label: 'ارسال شده', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800' },
  delivered: { label: 'تحویل داده شده', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' },
  cancelled: { label: 'لغو شده', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800' },
};

export const COURIER_MAP: Record<string, { label: string; icon: string; trackPrefix: string }> = {
  post_pishtaz: { label: 'پست پیشتاز ایران', icon: '📮', trackPrefix: 'IRP-' },
  tipax: { label: 'تیپاکس (اکسپرس)', icon: '🚚', trackPrefix: 'TPX-' },
  chapar: { label: 'چاپار اکسپرس', icon: '📦', trackPrefix: 'CHP-' },
  peyk: { label: 'پیک فوری شهری', icon: '🛵', trackPrefix: 'PEYK-' },
};

export const PAYMENT_METHOD_MAP: Record<string, { label: string; badge: string }> = {
  card_to_card: { label: 'کارت به کارت', badge: '💳 کارت‌به‌کارت' },
  zarinpal: { label: 'درگاه زرین‌پال', badge: '🌐 زرین‌پال' },
  idpay: { label: 'درگاه آیدی‌پی', badge: '⚡ آیدی‌پی' },
  cash_on_delivery: { label: 'پرداخت در محل (COD)', badge: '💵 پرداخت در محل' },
};
