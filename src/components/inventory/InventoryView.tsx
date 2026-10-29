import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Instagram, 
  Send, 
  CheckCircle2, 
  TrendingUp, 
  Tag,
  Percent,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { Product } from '../../types';
import { toPersianDigits, formatToman } from '../../utils/persian';

interface InventoryViewProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const categories = ['all', 'مانتو و کت', 'شومیز و بلوز', 'کیف و کفش', 'شال و روسری', 'شلوار', 'اکسسوری و زیورآلات'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || p.isLowStock;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.isLowStock).length;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            انبار و موجودی محصولات
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            کنترل دقیق موجودی بر اساس سایز و رنگ با همگام‌سازی استوری اینستاگرام و کانال تلگرام
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Inventory KPI Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">تنوع محصولات (SKU)</span>
          <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{toPersianDigits(products.length)} کالا</h3>
          <p className="text-[11px] text-slate-400 mt-1">در دسته‌بندی‌های فعال</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">موجودی کل انبار</span>
          <h3 className="mt-2 text-xl font-black text-indigo-600 dark:text-indigo-400">{toPersianDigits(totalStockCount)} عدد کالا</h3>
          <p className="text-[11px] text-slate-400 mt-1">ارزش کل: {formatToman(totalInventoryValue)}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">هشدار کسری موجودی</span>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-black text-amber-500">{toPersianDigits(lowStockCount)} کالا</h3>
            {lowStockCount > 0 && (
              <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                <AlertTriangle className="h-3 w-3" />
                کمتر از ۵ عدد
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام کالا یا کد SKU..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'همه دسته‌ها' : cat}
            </button>
          ))}

          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-semibold transition-all ${
              showLowStockOnly
                ? 'bg-amber-500 text-white shadow-xs'
                : 'border border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>فقط کسری موجودی</span>
          </button>
        </div>
      </div>

      {/* Products Catalog Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((prod) => {
          const profit = prod.price - prod.costPrice;
          const profitMargin = Math.round((profit / prod.price) * 100);

          return (
            <div
              key={prod.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-lg hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-850 dark:hover:border-indigo-700"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                    <span className="rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      {prod.category}
                    </span>
                    {prod.isLowStock && (
                      <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
                        <AlertTriangle className="h-3 w-3" />
                        کسری انبار
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-xs backdrop-blur-md dark:bg-slate-900/90 dark:text-white font-mono">
                    {prod.sku}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{prod.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Variations Matrix */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {prod.variations.map((v) => (
                      <span
                        key={v.id}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <span
                          className="h-2 w-2 rounded-full border border-slate-300"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span>{v.color} ({v.size}): <strong>{toPersianDigits(v.stock)}</strong></span>
                      </span>
                    ))}
                  </div>

                  {/* Price & Margin */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400">قیمت فروش:</span>
                      <p className="font-black text-sm text-indigo-600 dark:text-indigo-400">{formatToman(prod.price)}</p>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400">سود ناخالص:</span>
                      <p className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {toPersianDigits(profitMargin)}٪ ({formatToman(profit)})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <Instagram className="h-3 w-3 text-pink-500" />
                    استوری
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <Send className="h-3 w-3 text-sky-500 -rotate-45" />
                    کانال
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditProduct(prod)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-indigo-500" />
                    <span>ویرایش</span>
                  </button>
                  <button
                    onClick={() => onDeleteProduct(prod.id)}
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="حذف کالا"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
