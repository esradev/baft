import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon, 
  Instagram, 
  Send, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  Truck, 
  Printer, 
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Order, OrderStatus, ChannelType } from '../../types';
import { toPersianDigits, formatToman, STATUS_MAP, COURIER_MAP } from '../../utils/persian';

interface OrdersViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onOpenNewOrder: () => void;
  onOpenAiScanner: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onSelectOrder,
  onOpenNewOrder,
  onOpenAiScanner,
  onUpdateOrderStatus,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'all' | ChannelType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>('all');

  const kanbanColumns: { status: OrderStatus; title: string; color: string; bg: string }[] = [
    { status: 'new', title: 'سفارش جدید', color: 'border-amber-400 text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { status: 'confirmed', title: 'تایید پرداخت', color: 'border-blue-400 text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
    { status: 'preparing', title: 'در حال بسته‌بندی', color: 'border-indigo-400 text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
    { status: 'shipped', title: 'ارسال شده (پست/تیپاکس)', color: 'border-purple-400 text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
    { status: 'delivered', title: 'تحویل داده شده', color: 'border-emerald-400 text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel = selectedChannel === 'all' || order.channel === selectedChannel;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'new': return 'confirmed';
      case 'confirmed': return 'preparing';
      case 'preparing': return 'shipped';
      case 'shipped': return 'delivered';
      default: return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            مدیریت سفارش‌ها
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            پیگیری مراحل سفارش از دریافت فیش واریزی تا ارسال با پست و تیپاکس
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAiScanner}
            className="flex items-center gap-1.5 rounded-xl bg-purple-50 border border-purple-200 px-3 py-2 text-xs font-bold text-purple-700 shadow-xs hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
          >
            <Sparkles className="h-4 w-4 text-purple-600 animate-spin-slow" />
            <span>اسکن فیش با هوش مصنوعی</span>
          </button>

          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>ثبت سفارش جدید</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو با نام مشتری، شماره فاکتور، تلفن یا آدرس..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Channel Filter */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setSelectedChannel('all')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                selectedChannel === 'all' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              همه کانال‌ها
            </button>
            <button
              onClick={() => setSelectedChannel('instagram')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all ${
                selectedChannel === 'instagram' ? 'bg-white text-pink-600 shadow-xs dark:bg-slate-700 dark:text-pink-400' : 'text-slate-500 hover:text-pink-600'
              }`}
            >
              <Instagram className="h-3 w-3" />
              اینستاگرام
            </button>
            <button
              onClick={() => setSelectedChannel('telegram')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all ${
                selectedChannel === 'telegram' ? 'bg-white text-sky-600 shadow-xs dark:bg-slate-700 dark:text-sky-400' : 'text-slate-500 hover:text-sky-600'
              }`}
            >
              <Send className="h-3 w-3 -rotate-45" />
              تلگرام
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="نمای ستونی کانبان"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">برد کانبان</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="نمای جدولی و لیست"
            >
              <ListIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">لیست جدول</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-start overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const columnOrders = filteredOrders.filter((o) => o.status === col.status);
            return (
              <div
                key={col.status}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-850/60 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.bg.replace('/10', '')}`} />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{col.title}</h3>
                  </div>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-700 shadow-xs dark:bg-slate-800 dark:text-slate-300">
                    {toPersianDigits(columnOrders.length)}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1">
                  {columnOrders.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-4 text-center dark:border-slate-800">
                      <p className="text-[11px] text-slate-400">سفارشی در این وضعیت نیست</p>
                    </div>
                  ) : (
                    columnOrders.map((order) => {
                      const courierInfo = COURIER_MAP[order.courier] || COURIER_MAP.post_pishtaz;
                      const nextStatus = getNextStatus(order.status);
                      return (
                        <div
                          key={order.id}
                          className="group relative rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-all hover:shadow-md hover:border-indigo-300 dark:border-slate-750 dark:bg-slate-800 dark:hover:border-indigo-700 cursor-pointer"
                          onClick={() => onSelectOrder(order)}
                        >
                          {/* Card Top */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-num font-bold text-indigo-600 dark:text-indigo-400">
                              {order.orderNumber}
                            </span>
                            {order.channel === 'instagram' ? (
                              <span className="flex items-center gap-1 rounded-md bg-pink-50 px-1.5 py-0.5 text-[10px] font-semibold text-pink-600 dark:bg-pink-950/50 dark:text-pink-400">
                                <Instagram className="h-2.5 w-2.5" />
                                {order.socialHandle}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                                <Send className="h-2.5 w-2.5 -rotate-45" />
                                {order.socialHandle}
                              </span>
                            )}
                          </div>

                          {/* Customer Name & City */}
                          <div className="mt-2">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{order.customerName}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <span>{order.province}، {order.city}</span>
                            </p>
                          </div>

                          {/* Items Snapshot */}
                          <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-750">
                            <img
                              src={order.items[0]?.image}
                              alt={order.items[0]?.title}
                              className="h-9 w-9 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate">
                                {order.items[0]?.title}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {order.items[0]?.color} • {order.items[0]?.size} {order.items.length > 1 && `(+${toPersianDigits(order.items.length - 1)})`}
                              </p>
                            </div>
                          </div>

                          {/* Price & Courier */}
                          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs dark:border-slate-750">
                            <span className="font-black text-slate-900 dark:text-white">
                              {formatToman(order.grandTotal)}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                              {courierInfo.icon} {courierInfo.label.split(' ')[0]}
                            </span>
                          </div>

                          {/* Advance Status Button */}
                          {nextStatus && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateOrderStatus(order.id, nextStatus);
                              }}
                              className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/60 py-1.5 text-[11px] font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                            >
                              <span>انتقال به مرحله بعد</span>
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="p-3.5 font-bold">شماره سفارش</th>
                  <th className="p-3.5 font-bold">مشتری</th>
                  <th className="p-3.5 font-bold">کانال</th>
                  <th className="p-3.5 font-bold">محصولات</th>
                  <th className="p-3.5 font-bold">روش ارسال</th>
                  <th className="p-3.5 font-bold">مبلغ کل</th>
                  <th className="p-3.5 font-bold">وضعیت</th>
                  <th className="p-3.5 font-bold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
                  const courierInfo = COURIER_MAP[order.courier] || COURIER_MAP.post_pishtaz;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <td className="p-3.5 font-bold font-num text-indigo-600 dark:text-indigo-400">
                        {order.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{order.customerName}</p>
                        <p className="text-[11px] text-slate-400">{order.phone}</p>
                      </td>
                      <td className="p-3.5">
                        {order.channel === 'instagram' ? (
                          <span className="inline-flex items-center gap-1 text-pink-600 font-semibold">
                            <Instagram className="h-3.5 w-3.5" />
                            دایرکت
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sky-600 font-semibold">
                            <Send className="h-3.5 w-3.5 -rotate-45" />
                            تلگرام
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-800 dark:text-slate-200">
                          {order.items[0]?.title} {order.items.length > 1 && `(+${toPersianDigits(order.items.length - 1)})`}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {courierInfo.icon} {courierInfo.label}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {formatToman(order.grandTotal)}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOrder(order);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700"
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
      )}
    </div>
  );
};
