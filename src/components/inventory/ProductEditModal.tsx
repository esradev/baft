import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Product, ProductVariation } from '../../types';
import { toPersianDigits, formatToman } from '../../utils/persian';

interface ProductEditModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const isEditing = !!product;

  const [title, setTitle] = useState(product?.title || '');
  const [sku, setSku] = useState(product?.sku || `BFT-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState(product?.category || 'مانتو و کت');
  const [price, setPrice] = useState(product?.price || 650000);
  const [costPrice, setCostPrice] = useState(product?.costPrice || 320000);
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(product?.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80');

  const [variations, setVariations] = useState<ProductVariation[]>(
    product?.variations || [
      { id: 'v1', size: 'سایز ۱ (۳۶-۳۸)', color: 'کرم نسکافه‌ای', colorHex: '#d7c4b7', stock: 5 },
      { id: 'v2', size: 'سایز ۲ (۴۰-۴۲)', color: 'مشکی', colorHex: '#1e293b', stock: 4 }
    ]
  );

  const categories = ['مانتو و کت', 'شومیز و بلوز', 'کیف و کفش', 'شال و روسری', 'شلوار', 'اکسسوری و زیورآلات'];

  const sampleImages = [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
  ];

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        id: `v-${Date.now()}`,
        size: 'فری‌سایز',
        color: 'رنگ جدید',
        colorHex: '#6366f1',
        stock: 5,
      }
    ]);
  };

  const handleRemoveVariation = (idx: number) => {
    if (variations.length > 1) {
      setVariations(variations.filter((_, i) => i !== idx));
    }
  };

  const totalStock = variations.reduce((sum, v) => sum + v.stock, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const updated: Product = {
      id: product?.id || `prod-${Date.now()}`,
      title,
      sku,
      category,
      price: Number(price),
      costPrice: Number(costPrice),
      stock: totalStock,
      isLowStock: totalStock <= 4,
      images: [imageUrl],
      variations,
      soldCount: product?.soldCount || 0,
      rating: product?.rating || 5.0,
      instagramSynced: true,
      telegramSynced: true,
      description: description || 'توضیحات و مشخصات کالا در استوری و پست اینستاگرام ثبت گردید.',
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              {isEditing ? 'ویرایش اطلاعات محصول' : 'افزودن محصول جدید به انبار بافت'}
            </h3>
            <p className="text-xs text-slate-400">تنوع رنگ، سایز، قیمت و موجودی کالا را تنظیم کنید</p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان محصول *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مانتو لینن ژاکارد بهاره"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">دسته‌بندی</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">قیمت فروش (تومان)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-num"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">قیمت خرید / تمام‌شده (تومان)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-num"
              />
            </div>
          </div>

          {/* Product Image URL & Quick Picker */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">آدرس تصویر کالا</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dir-ltr text-right dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] text-slate-400">تصاویر نمونه:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {sampleImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="نمونه"
                    onClick={() => setImageUrl(img)}
                    className={`h-8 w-8 rounded-lg object-cover cursor-pointer transition-all ${
                      imageUrl === img ? 'ring-2 ring-indigo-600 scale-105' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Variations Table */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-800 dark:text-slate-200">تنوع رنگ، سایز و موجودی (مجموع: {toPersianDigits(totalStock)} عدد)</span>
              <button
                type="button"
                onClick={handleAddVariation}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>افزودن تنوع جدید</span>
              </button>
            </div>

            <div className="space-y-2">
              {variations.map((v, idx) => (
                <div key={v.id || idx} className="flex items-center gap-2 rounded-xl bg-white p-2 border border-slate-200 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                  <input
                    type="text"
                    value={v.size}
                    onChange={(e) => {
                      const copy = [...variations];
                      copy[idx].size = e.target.value;
                      setVariations(copy);
                    }}
                    placeholder="سایز (مثلا ۳۸)"
                    className="w-28 rounded-lg border border-slate-200 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-850 dark:text-white"
                  />

                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => {
                      const copy = [...variations];
                      copy[idx].color = e.target.value;
                      setVariations(copy);
                    }}
                    placeholder="نام رنگ (مثلا کرم)"
                    className="flex-1 rounded-lg border border-slate-200 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-850 dark:text-white"
                  />

                  <input
                    type="color"
                    value={v.colorHex}
                    onChange={(e) => {
                      const copy = [...variations];
                      copy[idx].colorHex = e.target.value;
                      setVariations(copy);
                    }}
                    className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    title="انتخاب رنگ"
                  />

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">تعداد:</span>
                    <input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => {
                        const copy = [...variations];
                        copy[idx].stock = Number(e.target.value);
                        setVariations(copy);
                      }}
                      className="w-16 rounded-lg border border-slate-200 p-1.5 text-center font-bold dark:border-slate-700 dark:bg-slate-850 dark:text-white font-num"
                    />
                  </div>

                  {variations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariation(idx)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">توضیحات و کپشن اینستاگرام</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات جنس پارچه، قد، نحوه شستشو..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>ذخیره اطلاعات محصول</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
