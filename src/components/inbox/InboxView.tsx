import React, { useState } from 'react';
import { 
  Instagram, 
  Send, 
  Search, 
  Sparkles, 
  CreditCard, 
  Truck, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Image as ImageIcon, 
  Paperclip, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Copy, 
  Check, 
  ShoppingBag,
  ExternalLink,
  Smile,
  Mic
} from 'lucide-react';
import { Conversation, ChatMessage, Order, Customer } from '../../types';
import { toPersianDigits, formatToman, formatPhoneNumber } from '../../utils/persian';

interface InboxViewProps {
  conversations: Conversation[];
  customers: Customer[];
  onSendMessage: (conversationId: string, text: string) => void;
  onConvertChatToOrder: (conv: Conversation) => void;
  onOpenAiScanner: () => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  conversations,
  customers,
  onSendMessage,
  onConvertChatToOrder,
  onOpenAiScanner,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<'all' | 'instagram' | 'telegram'>('all');
  const [aiReplies, setAiReplies] = useState<string[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeCustomer = customers.find((c) => c.socialHandle === activeConversation?.socialHandle || c.name === activeConversation?.customerName);

  const quickTemplates = [
    {
      title: 'شماره کارت و شبا',
      text: 'شماره کارت جهت واریز:\n۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸\nبه نام زهرا کاظمی (بانک ملی)\nلطفاً پس از واریز عکس فیش را ارسال بفرمایید 🌸',
    },
    {
      title: 'هزینه و زمان ارسال',
      text: 'ارسال با پست پیشتاز به سراسر کشور (۵۵ تومان - ۲ الی ۴ روز کاری) و با تیپاکس به صورت پس‌کرایه انجام می‌شود 📮',
    },
    {
      title: 'فرم ثبت آدرس',
      text: 'برای ثبت سفارش لطفاً موارد زیر را ارسال کنید:\n۱. نام و نام‌خانوادگی\n۲. شماره تماس\n۳. آدرس دقیق و استان\n۴. کد پستی ۱۰ رقمی',
    },
    {
      title: 'تخفیف مشتری وفادار',
      text: 'سلام عزیزم! به عنوان همراه همیشگی بافت، کد تخفیف ۱۰٪ اختصاصی شما: BAFTVIP 💖',
    },
  ];

  const handleGenerateAiReply = async () => {
    if (!activeConversation) return;
    setIsGeneratingAi(true);
    try {
      const lastMsg = activeConversation.messages[activeConversation.messages.length - 1]?.text || '';
      const res = await fetch('/api/gemini/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerMessage: lastMsg,
          customerName: activeConversation.customerName,
        }),
      });
      const data = await res.json();
      if (data.success && data.replies) {
        setAiReplies(data.replies);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeConversation) return;
    onSendMessage(activeConversation.id, replyText);
    setReplyText('');
    setAiReplies([]);
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.socialHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = filterChannel === 'all' || c.channel === filterChannel;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="flex h-[calc(100vh-130px)] rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-850">
      {/* 1. Conversations List (Right Column in RTL) */}
      <div className="flex w-80 shrink-0 flex-col border-l border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
        {/* Search & Channel Tabs */}
        <div className="p-3 border-b border-slate-200/80 space-y-2.5 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در گفتگوها..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pr-8 pl-3 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilterChannel('all')}
              className={`flex-1 rounded-lg py-1 transition-all ${
                filterChannel === 'all' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setFilterChannel('instagram')}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1 transition-all ${
                filterChannel === 'instagram' ? 'bg-white text-pink-600 shadow-xs dark:bg-slate-700 dark:text-pink-400' : 'text-slate-500'
              }`}
            >
              <Instagram className="h-3 w-3" />
              دایرکت
            </button>
            <button
              onClick={() => setFilterChannel('telegram')}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1 transition-all ${
                filterChannel === 'telegram' ? 'bg-white text-sky-600 shadow-xs dark:bg-slate-700 dark:text-sky-400' : 'text-slate-500'
              }`}
            >
              <Send className="h-3 w-3 -rotate-45" />
              تلگرام
            </button>
          </div>
        </div>

        {/* List of Chats */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConversation?.id;
            return (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedConvId(conv.id);
                  setAiReplies([]);
                }}
                className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-r-4 border-indigo-600'
                    : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.avatarUrl}
                    alt={conv.customerName}
                    className="h-10 w-10 rounded-full object-cover shadow-xs"
                  />
                  <span className="absolute -bottom-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-xs dark:bg-slate-800">
                    {conv.channel === 'instagram' ? (
                      <Instagram className="h-2.5 w-2.5 text-pink-600" />
                    ) : (
                      <Send className="h-2.5 w-2.5 text-sky-500 -rotate-45" />
                    )}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{conv.customerName}</h4>
                    <span className="text-[10px] text-slate-400 font-num">{conv.lastMessageTime}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {conv.lastMessage}
                  </p>

                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="rounded-md bg-slate-200/60 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {conv.tags[0] || 'دایرکت'}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                        {toPersianDigits(conv.unreadCount)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Chat Thread (Middle Column) */}
      <div className="flex flex-1 flex-col bg-white dark:bg-slate-850">
        {/* Chat Top Header */}
        {activeConversation && (
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.avatarUrl}
                alt={activeConversation.customerName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{activeConversation.customerName}</h3>
                  <span className="text-xs text-slate-400 dir-ltr font-mono">{activeConversation.socialHandle}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    آنلاین
                  </span>
                  <span>•</span>
                  <span>{activeConversation.channel === 'instagram' ? 'اینستاگرام دایرکت' : 'تلگرام چت'}</span>
                </div>
              </div>
            </div>

            {/* Top Right Action: Convert Chat to Order */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onConvertChatToOrder(activeConversation)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95"
                title="استخراج خودکار سفارش و آدرس از چت و ثبت در سیستم"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>تبدیل گفتگو به سفارش</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40 dark:bg-slate-900/40">
          {activeConversation?.messages.map((msg) => {
            const isMerchant = msg.sender === 'merchant';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMerchant ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                    isMerchant
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  {/* Media / Receipt Preview if any */}
                  {msg.mediaUrl && (
                    <div className="mb-2 overflow-hidden rounded-xl border border-white/20">
                      <img
                        src={msg.mediaUrl}
                        alt="فیش پیوست"
                        className="max-h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Payment Slip Badge */}
                  {msg.isReceipt && msg.receiptData && (
                    <div className="mb-2 rounded-xl bg-amber-50 p-2 text-[11px] text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                      <p className="font-bold">✨ فیش پرداخت بانکی پیوست شده:</p>
                      <p>مبلغ: {formatToman(msg.receiptData.amount)} ({msg.receiptData.bank})</p>
                      <p>کد پیگیری: {msg.receiptData.refCode}</p>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="mt-1 px-1 text-[10px] text-slate-400 font-num">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* AI Suggested Persian Replies Carousel */}
        {aiReplies.length > 0 && (
          <div className="border-t border-purple-100 bg-purple-50/60 p-3 dark:border-purple-950 dark:bg-purple-950/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-spin-slow" />
              <span>پاسخ‌های پیشنهادی هوش مصنوعی بافت (Gemini):</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {aiReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => setReplyText(reply)}
                  className="flex-1 min-w-[220px] rounded-xl bg-white p-2.5 text-right text-xs text-slate-700 shadow-xs border border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 dark:bg-slate-800 dark:border-purple-800 dark:text-slate-200"
                >
                  <p className="line-clamp-2 leading-relaxed">{reply}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Templates Drawer */}
        {showQuickReplies && (
          <div className="border-t border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>پاسخ‌های آماده فروشگاه</span>
              <button onClick={() => setShowQuickReplies(false)} className="text-slate-400 hover:text-slate-600">
                بستن
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickTemplates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setReplyText(tpl.text);
                    setShowQuickReplies(false);
                  }}
                  className="rounded-xl border border-slate-200 bg-white p-2 text-right text-xs text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 shadow-xs"
                >
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">{tpl.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tpl.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Box */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-850">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleGenerateAiReply}
              disabled={isGeneratingAi}
              className="flex items-center gap-1 rounded-xl bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
            >
              <Sparkles className="h-3 w-3 text-purple-600 animate-spin-slow" />
              <span>{isGeneratingAi ? 'در حال تولید پاسخ...' : 'پیشنهاد پاسخ با هوش مصنوعی (AI)'}</span>
            </button>

            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <FileText className="h-3 w-3" />
              <span>پاسخ‌های آماده</span>
            </button>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="پاسخ خود را بنویسید (یا از پیشنهادهای هوشمند استفاده کنید)..."
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4 -rotate-45" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Customer CRM Mini-Sidebar (Left Column in RTL) */}
      {activeCustomer && (
        <div className="hidden lg:flex w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-900/30 overflow-y-auto space-y-4">
          <div className="text-center">
            <img
              src={activeCustomer.avatarUrl}
              alt={activeCustomer.name}
              className="mx-auto h-16 w-16 rounded-full object-cover shadow-md"
            />
            <h3 className="mt-2 font-bold text-sm text-slate-900 dark:text-white">{activeCustomer.name}</h3>
            <p className="text-xs text-slate-400 dir-ltr">{activeCustomer.socialHandle}</p>
            <span className="mt-1.5 inline-block rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {activeCustomer.tier === 'vip' ? '🌟 مشتری وفادار (VIP)' : 'مشتری عادی'}
            </span>
          </div>

          {/* Spend & Orders summary */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-3 shadow-xs dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750 text-center">
            <div>
              <p className="text-[10px] text-slate-400">مجموع خرید</p>
              <p className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">{formatToman(activeCustomer.totalSpent)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">تعداد سفارش</p>
              <p className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">{toPersianDigits(activeCustomer.ordersCount)} بار</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-2xl bg-white p-3 shadow-xs dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-num font-bold">{formatPhoneNumber(activeCustomer.phone)}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-tight">{activeCustomer.province}، {activeCustomer.address}</span>
            </div>
          </div>

          {/* Notes & Preferences */}
          <div className="rounded-2xl bg-white p-3 shadow-xs dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750">
            <p className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-2">یادداشت‌های اختصاصی:</p>
            <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              {activeCustomer.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-indigo-500">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
