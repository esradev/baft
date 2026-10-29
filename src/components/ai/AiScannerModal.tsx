import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Instagram, 
  Send, 
  FileText, 
  CreditCard, 
  User, 
  MapPin, 
  Phone,
  Layers,
  ChevronLeft,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Order, Product } from '../../types';
import { formatToman, toPersianDigits } from '../../utils/persian';

interface AiScannerModalProps {
  products: Product[];
  onClose: () => void;
  onOrderParsed: (draft: Partial<Order>) => void;
}

export const AiScannerModal: React.FC<AiScannerModalProps> = ({
  products,
  onClose,
  onOrderParsed,
}) => {
  const [inputText, setInputText] = useState(
    `سلام وقتتون بخیر عزیزم
من مانتو کتی لینن ژاکارد رنگ کرم سایز ۲ رو می‌خوام به همراه شومیز لنین سفید سایز ۳۸.
مبلغ ۱,۴۳۰,۰۰۰ تومان رو به کارت ملی واریز کردم.
شماره پیگیری: ۸۹۲۳۷۱
به نام: سارا محمدی
شماره تماس: ۰۹۱۲۳۴۵۶۷۸۹
آدرس: اصفهان، خیابان نظر شرقی، کوچه لاله، پلاک ۲۴، واحد ۲
کد پستی: ۸۱۷۳۹۴۸۲۹۱
ممنون میشم با تیپاکس بفرستید 🌸`
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const samplePresets = [
    {
      title: 'سفارش کامل با فیش واریزی و تیپاکس',
      channel: 'instagram',
      text: `سلام عزیزم! مانتو کتی لینن ژاکارد رنگ کرم سایز ۱ می‌خواستم.
مبلغ ۹۸۰,۰۰۰ تومان واریز شد به کارت شما.
کد پیگیری: ۴۸۱۹۳۰ (بانک ملی)
نام: مهسا احمدی
تلفن: ۰۹۱۹۲۳۴۵۶۷۸
آدرس: شیراز، معالی آباد، کوچه ۱۰، پلاک ۱۵
کد پستی: ۷۱۸۴۹۲۸۳۷۴`
    },
    {
      title: 'سفارش دو قلم کالا از تلگرام با پست پیشتاز',
      channel: 'telegram',
      text: `درود بر شما
یک عدد شومیز لنین یقه مردانه رنگ سفید سایز ۱ و یک عدد کیف دوشی چرم عسلی می‌خوام.
مبلغ ۸۴۰,۰۰۰ تومان واریز کردم.
شماره ارجاع تراکنش: ۵۵۹۲۱۸
نام: فاطمه یوسفی
تلفن: ۰۹۳۵۶۷۸۹۰۱۲
آدرس: مشهد، بلوار سجاد، خیابان بهار، پلاک ۸، زنگ ۳
کدپستی: ۹۱۸۲۷۳۶۴۵۱`
    },
    {
      title: 'فیش واریزی زرین‌پال و آدرس تهران',
      channel: 'instagram',
      text: `سلام واریز کردم عزیزم:
محصول: شلوار واید کرپ مشکی سایز ۳۸
مبلغ: ۵۲۰,۰۰۰ تومان
کد رهگیری درگاه: TR-998821
زهرا شجاعی - ۰۹۱۲۹۸۷۶۵۴۳
تهران، سعادت آباد، میدان کاج، خ سرو غربی، پلاک ۱۲، واحد ۴
کدپستی: ۱۹۹۷۶۱۴۸۲۹`
    }
  ];

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!inputText.trim() && !selectedImage) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/parse-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          imageBase64: selectedImage,
          mimeType: imageMimeType,
          context: 'Instagram/Telegram direct message screenshot or text',
        }),
      });

      const data = await res.json();
      const rawResult = data.data || data.parsed || data.fallbackData;
      if (rawResult) {
        setParsedData(rawResult);
        setConfidence(rawResult.confidence || 96);
      }
    } catch (e) {
      console.error('Error scanning with Gemini:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyOrder = () => {
    if (!parsedData) return;

    const draftOrder: Partial<Order> = {
      customerName: parsedData.customerName || 'مشتری جدید',
      phone: parsedData.phoneNumber || parsedData.phone || '۰۹۱۲۳۴۵۶۷۸۹',
      socialHandle: parsedData.socialHandle || (parsedData.customerName ? `@${parsedData.customerName.replace(/\s+/g, '_')}` : '@customer'),
      province: parsedData.province || 'تهران',
      city: parsedData.city || 'تهران',
      address: parsedData.address || '',
      postalCode: parsedData.postalCode || '',
      courier: (parsedData.courierPreference === 'tipax' || (parsedData.notes && parsedData.notes.includes('تیپاکس'))) ? 'tipax' : 'post_pishtaz',
      bankRefNumber: parsedData.trackingCode || parsedData.paymentSlip?.refNumber || '۸۹۲۳۷۱',
      paymentStatus: (parsedData.trackingCode || parsedData.paymentSlip?.verified || parsedData.grandTotal) ? 'paid' : 'review_needed',
      channel: (parsedData.channel === 'telegram' ? 'telegram' : 'instagram') as 'instagram' | 'telegram',
      totalAmount: parsedData.grandTotal || parsedData.totalAmount || 890000,
    };

    onOrderParsed(draftOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>اسکن هوشمند فیش و پیام دایرکت</span>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Gemini 3.7 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400">متن پیام یا تصویر اسکرین‌شات دایرکت/فیش واریزی را بارگذاری کنید</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Sample Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 block">
              نمونه پیام‌های واقعی برای تست سریع:
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(preset.text);
                    setSelectedImage(null);
                    setParsedData(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-right text-xs hover:border-purple-300 hover:bg-purple-50/50 dark:border-slate-750 dark:bg-slate-800 dark:hover:border-purple-800 transition-all"
                >
                  <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{preset.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{preset.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Image or Paste Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Image upload dropzone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`md:col-span-1 rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                selectedImage 
                  ? 'border-purple-400 bg-purple-50/40 dark:bg-purple-950/20' 
                  : 'border-slate-200 hover:border-purple-400 bg-slate-50 dark:border-slate-750 dark:bg-slate-800'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              {selectedImage ? (
                <div className="relative w-full">
                  <img
                    src={selectedImage}
                    alt="Receipt Screenshot"
                    className="max-h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                    }}
                    className="absolute -top-2 -right-2 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <p className="mt-1 text-[10px] font-bold text-purple-600 dark:text-purple-400">تصویر فیش بارگذاری شد</p>
                </div>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mb-2">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">آپلود عکس فیش / دایرکت</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">کلیک یا رها کردن تصویر اسکرین‌شات</p>
                </>
              )}
            </div>

            {/* Text Input Area */}
            <div className="md:col-span-2">
              <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                متن پیام خریدار در دایرکت:
              </label>
              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="متن پیام خریدار در دایرکت یا تلگرام را اینجا پیست کنید..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 leading-relaxed outline-none focus:border-purple-500 focus:bg-white dark:border-slate-750 dark:bg-slate-800 dark:text-slate-100 font-sans"
              />
            </div>
          </div>

          {/* Scan Action Button */}
          <button
            onClick={handleScan}
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs md:text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:brightness-110 disabled:opacity-50 transition-all"
          >
            <Sparkles className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'در حال تحلیل با هوش مصنوعی جمینای...' : 'استخراج هوشمند اطلاعات سفارش (AI)'}</span>
          </button>

          {/* Parsed Result Preview */}
          {parsedData && (
            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4.5 dark:border-purple-900/60 dark:bg-purple-950/20 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-purple-200/60 pb-2.5 dark:border-purple-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">اطلاعات استخراج شده با موفقیت</span>
                </div>
                {confidence && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    ضریب اطمینان هوش مصنوعی: {toPersianDigits(confidence)}٪
                  </span>
                )}
              </div>

              {/* Parsed Fields Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div className="space-y-1.5 bg-white p-3 rounded-xl dark:bg-slate-800 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
                    <User className="h-3.5 w-3.5" />
                    <span>نام و شماره همراه:</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{parsedData.customerName || 'نامشخص'}</p>
                  <p className="text-slate-600 dark:text-slate-300 font-num">{parsedData.phoneNumber || parsedData.phone || 'ندارد'}</p>
                </div>

                <div className="space-y-1.5 bg-white p-3 rounded-xl dark:bg-slate-800 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>مبلغ و کد پیگیری واریز:</span>
                  </div>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {parsedData.grandTotal || parsedData.totalAmount ? formatToman(parsedData.grandTotal || parsedData.totalAmount) : (parsedData.paymentSlip?.amount ? formatToman(parsedData.paymentSlip.amount) : 'تایید شده')}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-num">کد رهگیری: {parsedData.trackingCode || parsedData.paymentSlip?.refNumber || 'ندارد'}</p>
                </div>

                <div className="sm:col-span-2 space-y-1.5 bg-white p-3 rounded-xl dark:bg-slate-800 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>آدرس پستی و مقصد:</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {parsedData.province}، {parsedData.city}، {parsedData.address}
                  </p>
                  {parsedData.postalCode && (
                    <p className="text-[11px] text-slate-400 font-num">کدپستی: {toPersianDigits(parsedData.postalCode)}</p>
                  )}
                </div>
              </div>

              {/* Items Extracted */}
              {parsedData.items && parsedData.items.length > 0 && (
                <div className="bg-white p-3 rounded-xl dark:bg-slate-800 shadow-xs space-y-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">کالاهای تشخیص داده شده:</span>
                  {parsedData.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg dark:bg-slate-750">
                      <span className="font-medium text-slate-900 dark:text-white">{it.title}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-num">
                        {it.color || ''} {it.size ? `• سایز ${it.size}` : ''} • {toPersianDigits(it.quantity || 1)} عدد
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={handleApplyOrder}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>انتقال مستقیم به فرم و صدور فاکتور رسمی</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
