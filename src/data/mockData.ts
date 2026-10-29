import { Order, Customer, Product, Conversation, ShippingRate, StoreSettings } from '../types';

export const initialStoreSettings: StoreSettings = {
  storeName: 'مزون بافت | Baft Maison',
  category: 'پوشاک و اکسسوری زنانه',
  instagramHandle: 'baft.maison',
  telegramChannel: 'baft_maison_shop',
  cardNumber: '6037997512345678',
  shebaNumber: 'IR820170000000123456789012',
  bankName: 'بانک ملی ایران',
  cardHolderName: 'زهرا کاظمی (بافت مزون)',
  zarinpalMerchantId: 'zarin_live_893740284',
  enablePostPishtaz: true,
  enableTipax: true,
  enablePeyk: true,
  defaultPishtazCost: 55000,
  smsTrackingNotification: true,
  isSetupCompleted: true,
};

export const mockMerchantProfile = initialStoreSettings;


export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'مانتو کتی لینن ژاکارد بهاره',
    sku: 'BFT-JK-101',
    category: 'مانتو و کت',
    price: 980000,
    costPrice: 520000,
    stock: 8,
    isLowStock: false,
    soldCount: 42,
    rating: 4.9,
    instagramSynced: true,
    telegramSynced: true,
    description: 'دوخت مزونی تمیز با پارچه ژاکارد ترک درجه یک، بدون آبرفت، سبک و خنک مناسب بهار و تابستان.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      { id: 'v1-1', size: 'سایز ۱ (۳۶-۳۸)', color: 'کرم نسکافه‌ای', colorHex: '#d7c4b7', stock: 3 },
      { id: 'v1-2', size: 'سایز ۲ (۴۰-۴۲)', color: 'مشکی کربنی', colorHex: '#1e293b', stock: 4 },
      { id: 'v1-3', size: 'سایز ۳ (۴۴-۴۶)', color: 'سبز سدری', colorHex: '#607d8b', stock: 1 }
    ]
  },
  {
    id: 'prod-2',
    title: 'شومیز حریر کریستال مجلسی',
    sku: 'BFT-SH-204',
    category: 'شومیز و بلوز',
    price: 640000,
    costPrice: 310000,
    stock: 4,
    isLowStock: true,
    soldCount: 89,
    rating: 4.8,
    instagramSynced: true,
    telegramSynced: true,
    description: 'تنخور بسیار شیک با آستین مچی دکمه‌دار مرواریدی، مناسب مهمانی و دورهمی.',
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      { id: 'v2-1', size: 'M (۳۸-۴۰)', color: 'شیری', colorHex: '#faf5ef', stock: 2 },
      { id: 'v2-2', size: 'L (۴۲-۴۴)', color: 'صورتی ملایم', colorHex: '#fbcfe8', stock: 2 }
    ]
  },
  {
    id: 'prod-3',
    title: 'کیف دستی چرم طبیعی کراس‌بادی',
    sku: 'BFT-BG-308',
    category: 'کیف و کفش',
    price: 850000,
    costPrice: 480000,
    stock: 12,
    isLowStock: false,
    soldCount: 31,
    rating: 5.0,
    instagramSynced: true,
    telegramSynced: true,
    description: 'چرم گاوی درجه یک با یراق‌آلات رنگ ثابت طلایی و بند زنجیری قابل تنظیم.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      { id: 'v3-1', size: 'تک سایز', color: 'قهوه‌ای عسلی', colorHex: '#b45309', stock: 7 },
      { id: 'v3-2', size: 'تک سایز', color: 'مشکی کلاسیک', colorHex: '#0f172a', stock: 5 }
    ]
  },
  {
    id: 'prod-4',
    title: 'شال نخی اسلپ بهاره نگین‌دار',
    sku: 'BFT-SC-410',
    category: 'شال و روسری',
    price: 320000,
    costPrice: 140000,
    stock: 19,
    isLowStock: false,
    soldCount: 114,
    rating: 4.7,
    instagramSynced: true,
    telegramSynced: true,
    description: 'قواره بزرگ ۲ در ۷۵ سانتیمتر، دور دست‌دوز، سر نمی‌خورد با نگین‌کاری حرارتی مقاوم.',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      { id: 'v4-1', size: '۲۰۰x۷۵', color: 'طوسی روشن', colorHex: '#e2e8f0', stock: 10 },
      { id: 'v4-2', size: '۲۰۰x۷۵', color: 'مشکی', colorHex: '#18181b', stock: 9 }
    ]
  },
  {
    id: 'prod-5',
    title: 'شلوار واید لینن پاکتی دمپا',
    sku: 'BFT-PT-502',
    category: 'شلوار',
    price: 590000,
    costPrice: 290000,
    stock: 3,
    isLowStock: true,
    soldCount: 65,
    rating: 4.9,
    instagramSynced: true,
    telegramSynced: false,
    description: 'کمر کشی با بند تنظیم، استایل بسیار ترند و راحت، بدون پرزدهی.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      { id: 'v5-1', size: 'فری‌سایز (۳۸ تا ۴۴)', color: 'خاکی استخوانی', colorHex: '#e7e5e4', stock: 3 }
    ]
  },
  {
    id: 'prod-6',
    title: 'ست گوشواره و گردنبند برنجی مینیمال',
    sku: 'BFT-JW-601',
    category: 'اکسسوری و زیورآلات',
    price: 290000,
    costPrice: 110000,
    stock: 15,
    isLowStock: false,
    soldCount: 50,
    rating: 4.8,
    instagramSynced: true,
    telegramSynced: true,
    description: 'آبکاری طلا ۱۸ عیار، ضد حساسیت، نگین‌های کریستالی درخشان.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      { id: 'v6-1', size: 'استاندارد', color: 'طلایی', colorHex: '#eab308', stock: 15 }
    ]
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'BFT-1048',
    customerName: 'فاطمه رضایی',
    phone: '09123456789',
    socialHandle: '@fa_rezaee',
    channel: 'instagram',
    status: 'new',
    items: [
      {
        productId: 'prod-1',
        title: 'مانتو کتی لینن ژاکارد بهاره',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
        size: 'سایز ۲ (۴۰-۴۲)',
        color: 'کرم نسکافه‌ای',
        quantity: 1,
        price: 980000
      },
      {
        productId: 'prod-4',
        title: 'شال نخی اسلپ بهاره نگین‌دار',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80',
        size: '۲۰۰x۷۵',
        color: 'طوسی روشن',
        quantity: 1,
        price: 320000
      }
    ],
    totalAmount: 1300000,
    shippingCost: 55000,
    discount: 50000,
    grandTotal: 1305000,
    paymentMethod: 'card_to_card',
    paymentStatus: 'review_needed',
    bankRefNumber: 'REF-994821',
    paymentSlipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    courier: 'post_pishtaz',
    address: 'تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۴، واحد ۶',
    city: 'تهران',
    province: 'تهران',
    postalCode: '1998765432',
    createdAt: '۱۴۰۲/۰۸/۱۵ - ۱۴:۳۰',
    updatedAt: '۱۴۰۲/۰۸/۱۵ - ۱۴:۳۰',
    notes: 'فیش واریز از بانک سامان پیوست شده، نیازمند تایید.',
    customerNote: 'لطفا تا قبل از ساعت ۵ عصر به دستم برسه چون سفر میرم.'
  },
  {
    id: 'ord-2',
    orderNumber: 'BFT-1047',
    customerName: 'مریم حسینی',
    phone: '09359876543',
    socialHandle: 'maryam_h_teleg',
    channel: 'telegram',
    status: 'confirmed',
    items: [
      {
        productId: 'prod-2',
        title: 'شومیز حریر کریستال مجلسی',
        image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80',
        size: 'M (۳۸-۴۰)',
        color: 'شیری',
        quantity: 1,
        price: 640000
      }
    ],
    totalAmount: 640000,
    shippingCost: 75000,
    discount: 0,
    grandTotal: 715000,
    paymentMethod: 'zarinpal',
    paymentStatus: 'paid',
    bankRefNumber: 'ZP-18392019',
    courier: 'tipax',
    trackingNumber: 'TPX-9821034',
    address: 'اصفهان، خیابان چهارباغ بالا، کوچه نگار، بن‌بست شقایق، پلاک ۸',
    city: 'اصفهان',
    province: 'اصفهان',
    postalCode: '8173645129',
    createdAt: '۱۴۰۲/۰۸/۱۵ - ۱۲:۱۵',
    updatedAt: '۱۴۰۲/۰۸/۱۵ - ۱۲:۳۰',
    notes: 'پرداخت آنلاین زرین‌پال تایید شد.'
  },
  {
    id: 'ord-3',
    orderNumber: 'BFT-1046',
    customerName: 'سارا احمدی',
    phone: '09171239876',
    socialHandle: '@sara_ahmadi_art',
    channel: 'instagram',
    status: 'preparing',
    items: [
      {
        productId: 'prod-3',
        title: 'کیف دستی چرم طبیعی کراس‌بادی',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
        size: 'تک سایز',
        color: 'قهوه‌ای عسلی',
        quantity: 1,
        price: 850000
      }
    ],
    totalAmount: 850000,
    shippingCost: 55000,
    discount: 0,
    grandTotal: 905000,
    paymentMethod: 'card_to_card',
    paymentStatus: 'paid',
    bankRefNumber: 'REF-772183',
    courier: 'post_pishtaz',
    address: 'شیراز، خیابان ارم، کوچه ۱۲، ساختمان رز، طبقه ۳',
    city: 'شیراز',
    province: 'فارس',
    postalCode: '7145892134',
    createdAt: '۱۴۰۲/۰۸/۱۴ - ۱۹:۴۰',
    updatedAt: '۱۴۰۲/۰۸/۱۵ - ۱۰:۰۰',
    notes: 'بسته‌بندی کادویی با روبان بنفش درخواست داده‌اند.'
  },
  {
    id: 'ord-4',
    orderNumber: 'BFT-1045',
    customerName: 'نیلوفر کریمی',
    phone: '09134445566',
    socialHandle: '@niloofar_k',
    channel: 'instagram',
    status: 'shipped',
    items: [
      {
        productId: 'prod-5',
        title: 'شلوار واید لینن پاکتی دمپا',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
        size: 'فری‌سایز (۳۸ تا ۴۴)',
        color: 'خاکی استخوانی',
        quantity: 2,
        price: 590000
      }
    ],
    totalAmount: 1180000,
    shippingCost: 55000,
    discount: 100000,
    grandTotal: 1135000,
    paymentMethod: 'card_to_card',
    paymentStatus: 'paid',
    bankRefNumber: 'REF-645391',
    courier: 'post_pishtaz',
    trackingNumber: '298174009182374619028374',
    address: 'رشت، گلسار، خیابان ۱۰۸، ساختمان پارسا، واحد ۴',
    city: 'رشت',
    province: 'گیلان',
    postalCode: '4165891230',
    createdAt: '۱۴۰۲/۰۸/۱۴ - ۱۱:۲۰',
    updatedAt: '۱۴۰۲/۰۸/۱۵ - ۰۹:۱۵',
    notes: 'بارکد پستی پیامک شد.'
  },
  {
    id: 'ord-5',
    orderNumber: 'BFT-1044',
    customerName: 'مهسا نوری',
    phone: '09129998877',
    socialHandle: 'mahsa_noori_tg',
    channel: 'telegram',
    status: 'delivered',
    items: [
      {
        productId: 'prod-6',
        title: 'ست گوشواره و گردنبند برنجی مینیمال',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
        size: 'استاندارد',
        color: 'طلایی',
        quantity: 1,
        price: 290000
      }
    ],
    totalAmount: 290000,
    shippingCost: 45000,
    discount: 0,
    grandTotal: 335000,
    paymentMethod: 'idpay',
    paymentStatus: 'paid',
    courier: 'peyk',
    trackingNumber: 'PEYK-8819',
    address: 'تهران، شهرک غرب، بلوار فرحزادی، خیابان درختی، پلاک ۱۸',
    city: 'تهران',
    province: 'تهران',
    postalCode: '1467893214',
    createdAt: '۱۴۰۲/۰۸/۱۳ - ۱۶:۱۰',
    updatedAt: '۱۴۰۲/۰۸/۱۴ - ۱۷:۳۰',
    notes: 'تحویل مشتری گردید.'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'فاطمه رضایی',
    socialHandle: '@fa_rezaee',
    channel: 'instagram',
    phone: '09123456789',
    email: 'fatemeh.rezaee@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    tier: 'vip',
    totalSpent: 4850000,
    ordersCount: 4,
    lastOrderDate: '۱۴۰۲/۰۸/۱۵',
    province: 'تهران',
    city: 'تهران',
    address: 'سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۴، واحد ۶',
    postalCode: '1998765432',
    notes: ['مشتری دائم و خوش‌حساب', 'سایز ۴۰ ترجیح میده', 'عاشق رنگ‌های نود و کرم'],
    tags: ['مشتری وفادار', 'VIP', 'تهران']
  },
  {
    id: 'cust-2',
    name: 'مریم حسینی',
    socialHandle: 'maryam_h_teleg',
    channel: 'telegram',
    phone: '09359876543',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    tier: 'regular',
    totalSpent: 2150000,
    ordersCount: 2,
    lastOrderDate: '۱۴۰۲/۰۸/۱۵',
    province: 'اصفهان',
    city: 'اصفهان',
    address: 'خیابان چهارباغ بالا، کوچه نگار، بن‌بست شقایق، پلاک ۸',
    postalCode: '8173645129',
    notes: ['فقط با تیپاکس ارسال شود.'],
    tags: ['ارسال تیپاکس', 'اصفهان']
  },
  {
    id: 'cust-3',
    name: 'سارا احمدی',
    socialHandle: '@sara_ahmadi_art',
    channel: 'instagram',
    phone: '09171239876',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    tier: 'vip',
    totalSpent: 3900000,
    ordersCount: 3,
    lastOrderDate: '۱۴۰۲/۰۸/۱۴',
    province: 'فارس',
    city: 'شیراز',
    address: 'خیابان ارم، کوچه ۱۲، ساختمان رز، طبقه ۳',
    postalCode: '7145892134',
    notes: ['همیشه بسته‌بندی کادویی درخواست میده.'],
    tags: ['VIP', 'شیراز', 'بسته‌بندی کادو']
  },
  {
    id: 'cust-4',
    name: 'نیلوفر کریمی',
    socialHandle: '@niloofar_k',
    channel: 'instagram',
    phone: '09134445566',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    tier: 'regular',
    totalSpent: 1180000,
    ordersCount: 1,
    lastOrderDate: '۱۴۰۲/۰۸/۱۴',
    province: 'گیلان',
    city: 'رشت',
    address: 'گلسار، خیابان ۱۰۸، ساختمان پارسا، واحد ۴',
    postalCode: '4165891230',
    notes: ['خرید اول از استوری تخفیف'],
    tags: ['مشتری جدید', 'شمال']
  },
  {
    id: 'cust-5',
    name: 'الناز ستوده',
    socialHandle: 'elnaz_sotoudeh',
    channel: 'telegram',
    phone: '09148887766',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    tier: 'new',
    totalSpent: 0,
    ordersCount: 0,
    lastOrderDate: '-',
    province: 'آذربایجان شرقی',
    city: 'تبریز',
    address: 'ولیعصر، خیابان همافر، پلاک ۳۰',
    postalCode: '5157891234',
    notes: ['در دایرکت استعلام موجودی مانتو مشکی سایز ۲ کرده.'],
    tags: ['لید تلگرام', 'استعلام قیمت']
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    customerId: 'cust-1',
    customerName: 'فاطمه رضایی',
    socialHandle: '@fa_rezaee',
    channel: 'instagram',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    lastMessage: 'سلام عزیزم فیش واریز رو براتون فرستادم، لطفا تایید کنید مانتو کتی کرم با شال اسلپ 🙏',
    lastMessageTime: '۱۴:۳۲',
    unreadCount: 1,
    status: 'waiting_payment',
    tags: ['در انتظار تایید فیش', 'VIP', 'مانتو کتی'],
    messages: [
      {
        id: 'msg-101',
        conversationId: 'conv-1',
        sender: 'customer',
        text: 'سلام عزیزم وقتتون بخیر مانتو کتی لینن ژاکارد کرم سایز ۲ موجود دارید؟',
        timestamp: '۱۳:۴۰',
        isRead: true
      },
      {
        id: 'msg-102',
        conversationId: 'conv-1',
        sender: 'merchant',
        text: 'سلام فاطمه جان روزتون بخیر🌸 بله عزیزم سایز ۲ کرم فقط ۳ تا دونه موجوده. قیمت ۹۸۰ تومان + شال ست ۳۲۰ تومان که با تخفیف ست میشه ۱,۲۵۰,۰۰۰ تومان ✨',
        timestamp: '۱۳:۴۵',
        isRead: true
      },
      {
        id: 'msg-103',
        conversationId: 'conv-1',
        sender: 'customer',
        text: 'عالیه برام رزرو کنید شماره کارت لطف میکنید؟',
        timestamp: '۱۴:۰۰',
        isRead: true
      },
      {
        id: 'msg-104',
        conversationId: 'conv-1',
        sender: 'merchant',
        text: 'شماره کارت به نام زهرا کاظمی (بانک ملی):\n۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸\nمبلغ با پست پیشتاز: ۱,۳۰۵,۰۰۰ تومان 💳\nلطفاً پس از واریز عکس فیش رو ارسال بفرمایید.',
        timestamp: '۱۴:۰۵',
        isRead: true
      },
      {
        id: 'msg-105',
        conversationId: 'conv-1',
        sender: 'customer',
        text: 'واریز شد عزیزم! اینم عکس فیش. آدرس: تهران، سعادت‌آباد، میدان کاج، سرو غربی، پلاک ۲۴ واحد ۶. کدپستی: ۱۹۹۸۷۶۵۴۳۲ - تلفن: ۰۹۱۲۳۴۵۶۷۸۹',
        mediaUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        mediaType: 'receipt',
        isReceipt: true,
        receiptData: {
          amount: 1305000,
          bank: 'بانک سامان',
          refCode: '847291048',
          cardLastDigits: '4192'
        },
        timestamp: '۱۴:۳۲',
        isRead: false
      }
    ],
    pendingOrderDraft: {
      customerName: 'فاطمه رضایی',
      phone: '09123456789',
      address: 'تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۴، واحد ۶',
      postalCode: '1998765432',
      grandTotal: 1305000,
      bankRefNumber: '847291048'
    }
  },
  {
    id: 'conv-2',
    customerId: 'cust-2',
    customerName: 'مریم حسینی',
    socialHandle: 'maryam_h_teleg',
    channel: 'telegram',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    lastMessage: 'ممنون کد رهگیری تیپاکس رو گرفتم دستتون درد نکنه🌸',
    lastMessageTime: '۱۲:۳۰',
    unreadCount: 0,
    status: 'shipped',
    tags: ['تیپاکس', 'ارسال شده'],
    messages: [
      {
        id: 'msg-201',
        conversationId: 'conv-2',
        sender: 'customer',
        text: 'سلام خسته نباشید سفارش شومیز حریر مجلسی ثبت شد کی ارسال میکنید؟',
        timestamp: '۱۱:۵۰',
        isRead: true
      },
      {
        id: 'msg-202',
        conversationId: 'conv-2',
        sender: 'merchant',
        text: 'سلام مریم عزیز🌱 بسته شما تحویل تیپاکس شد. کد پیگیری: TPX-9821034',
        timestamp: '۱۲:۲۰',
        isRead: true
      },
      {
        id: 'msg-203',
        conversationId: 'conv-2',
        sender: 'customer',
        text: 'ممنون کد رهگیری تیپاکس رو گرفتم دستتون درد نکنه🌸',
        timestamp: '۱۲:۳۰',
        isRead: true
      }
    ]
  },
  {
    id: 'conv-3',
    customerId: 'cust-5',
    customerName: 'الناز ستوده',
    socialHandle: 'elnaz_sotoudeh',
    channel: 'telegram',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    lastMessage: 'سلام قیمت مانتو کتی مشکی سایز ۲ چنده؟ به تبریز ارسال دارید؟',
    lastMessageTime: '۱۰:۱۵',
    unreadCount: 2,
    status: 'active',
    tags: ['استعلام قیمت', 'تبریز', 'مشتری جدید'],
    messages: [
      {
        id: 'msg-301',
        conversationId: 'conv-3',
        sender: 'customer',
        text: 'سلام وقتتون بخیر🌹',
        timestamp: '۱۰:۱۰',
        isRead: false
      },
      {
        id: 'msg-302',
        conversationId: 'conv-3',
        sender: 'customer',
        text: 'قیمت مانتو کتی مشکی سایز ۲ چنده؟ به تبریز ارسال دارید با پست یا تیپاکس؟',
        timestamp: '۱۰:۱۵',
        isRead: false
      }
    ]
  }
];

export const mockShippingRates: ShippingRate[] = [
  { province: 'تهران', cities: ['تهران', 'اسلامشهر', 'ری', 'شهریار'], pishtazCost: 45000, tipaxCost: 65000, peykCost: 50000, estimatedDays: '۱ الی ۲ روز کاری' },
  { province: 'البرز', cities: ['کرج', 'فردیس', 'هشتگرد'], pishtazCost: 50000, tipaxCost: 70000, estimatedDays: '۱ الی ۲ روز کاری' },
  { province: 'اصفهان', cities: ['اصفهان', 'کاشان', 'نجف‌آباد'], pishtazCost: 55000, tipaxCost: 75000, estimatedDays: '۲ الی ۳ روز کاری' },
  { province: 'فارس', cities: ['شیراز', 'مرودشت', 'جهرم'], pishtazCost: 55000, tipaxCost: 80000, estimatedDays: '۲ الی ۳ روز کاری' },
  { province: 'خراسان رضوی', cities: ['مشهد', 'نیشابور', 'سبزوار'], pishtazCost: 60000, tipaxCost: 85000, estimatedDays: '۲ الی ۳ روز کاری' },
  { province: 'آذربایجان شرقی', cities: ['تبریز', 'مراغه', 'میانه'], pishtazCost: 55000, tipaxCost: 80000, estimatedDays: '۲ الی ۳ روز کاری' },
  { province: 'گیلان', cities: ['رشت', 'لاهیجان', 'انزلی'], pishtazCost: 55000, tipaxCost: 75000, estimatedDays: '۲ الی ۳ روز کاری' },
  { province: 'خوزستان', cities: ['اهواز', 'دزفول', 'آبادان'], pishtazCost: 60000, tipaxCost: 85000, estimatedDays: '۳ الی ۴ روز کاری' },
  { province: 'مازندران', cities: ['ساری', 'بابل', 'آمل'], pishtazCost: 55000, tipaxCost: 75000, estimatedDays: '۲ الی ۳ روز کاری' },
];
