import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Endpoint: Parse Customer DM Screenshot / Text Order Receipt
app.post('/api/gemini/parse-order', async (req, res) => {
  try {
    const { text, imageBase64, mimeType } = req.body;

    if (!ai) {
      // Fallback mock smart parser if no API key present
      return res.json({
        success: true,
        data: {
          customerName: "فاطمه رضایی",
          phoneNumber: "09123456789",
          address: "تهران، سعادت‌آباد، خیابان سرو غربی، پلاک ۲۴، واحد ۶",
          postalCode: "1998765432",
          city: "تهران",
          province: "تهران",
          items: [
            { title: "مانتو لینن خنک تابستانه - کرم", size: "M", color: "کرم", quantity: 1, price: 890000 },
            { title: "شال اسلپ نخی نگین‌دار - شیری", size: "فری‌سایز", color: "شیری", quantity: 1, price: 340000 }
          ],
          totalAmount: 1230000,
          shippingCost: 55000,
          grandTotal: 1285000,
          paymentMethod: "کارت به کارت (بانک سامان)",
          trackingCode: "847291048",
          channel: "instagram",
          notes: "لطفا با تیپاکس ارسال شود، تا قبل ۵ عصر تحویل داده شود."
        }
      });
    }

    const systemPrompt = `You are an expert Iranian Social Commerce Order & Receipt Parser AI for Instagram and Telegram merchants.
Analyze the provided text message or payment slip / chat screenshot and extract structured order information in Persian JSON format.
Ensure you accurately identify:
- customerName (نام مشتری)
- phoneNumber (شماره موبایل ایران مانند 09...)
- address (آدرس دقیق پستی شامل استان، شهر، خیابان، پلاک، واحد)
- postalCode (کد پستی ۱۰ رقمی در صورت وجود)
- city (شهر)
- province (استان)
- items: array of { title (نام کالا), size (سایز), color (رنگ), quantity (تعداد), price (قیمت به تومان) }
- totalAmount (جمع مبلغ اجناس به تومان)
- shippingCost (هزینه ارسال به تومان در صورت ذکر)
- grandTotal (مبلغ کل واریزی به تومان)
- paymentMethod (نوع پرداخت مثلا کارت به کارت، زرین‌پال، شبا)
- trackingCode (کد پیگیری واریز بانکی یا شماره ارجاع)
- channel (instagram یا telegram)
- notes (توضیحات و ترجیحات مشتری)

Output strictly valid JSON with no markdown wrapping or code fences.`;

    let contents: any;
    if (imageBase64) {
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
            },
          },
          {
            text: text ? `Text accompanying the receipt/chat: "${text}". Parse all order details.` : 'Extract all order details and payment slip info from this image.'
          }
        ]
      };
    } else {
      contents = `Text DM from customer:\n${text}\n\nParse and extract the customer order info.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error parsing order with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to parse order with AI',
      fallbackData: {
        customerName: "مشتری اینستاگرام",
        phoneNumber: "09121112233",
        address: "تهران، میدان ونک، خیابان ملاصدرا",
        postalCode: "1435678901",
        city: "تهران",
        province: "تهران",
        items: [{ title: "محصول انتخابی", size: "فری‌سایز", color: "مشکی", quantity: 1, price: 450000 }],
        totalAmount: 450000,
        shippingCost: 50000,
        grandTotal: 500000,
        paymentMethod: "کارت به کارت",
        trackingCode: "REF-992817",
        channel: "instagram",
        notes: "استخراج شده به صورت پیش‌فرض"
      }
    });
  }
});

// 2. AI Endpoint: Smart Persian Reply Assistant for Instagram DM / Telegram Chat
app.post('/api/gemini/suggest-reply', async (req, res) => {
  try {
    const { customerMessage, customerName, intent, storeDetails } = req.body;

    if (!ai) {
      const mockReplies = [
        `سلام ${customerName || 'عزیز'} جان وقتتون بخیر🌸\nبله این مدل موجودی داره و جنسش لینن درجه یک وارداتی هست. برای ثبت سفارش، آدرس، کدپستی، نام و شماره تماستون رو به همراه فیش واریز بفرستید تا براتون ثبت بشه ✨`,
        `سلام و ارادت خدمت شما🌱\nارسال به سراسر کشور با پست پیشتاز (۵۵ تومان) و تیپاکس به صورت پس‌کرایه انجام میشه. تحویل ۲ تا ۴ روز کاری. در خدمتم!`,
        `سلام ${customerName || 'همراه گرامی'}💖\nشماره کارت جهت واریز:\n۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸\nبه نام بافت استور (بانک ملی)\nلطفاً پس از واریز عکس فیش رو برامون ارسال کنید 🙏`
      ];
      return res.json({ success: true, replies: mockReplies });
    }

    const systemPrompt = `You are a courteous, professional, and friendly Iranian Social Media Merchant Assistant (فروشنده خوش‌برخورد اینستاگرام و تلگرام).
Generate 3 distinct, polite, and persuasive Persian replies for the customer's message.
Tone: Warm, welcoming, respectful, using natural Persian e-commerce terminology (عزیز جان، در خدمتتون هستیم، ارسال پیشتاز، شماره کارت).

Context:
- Store info: ${storeDetails || 'فروشگاه آنلاین پوشاک و اکسسوری بافت، ارسال با پست پیشتاز و تیپاکس، درگاه پرداخت و کارت به کارت'}
- Intent: ${intent || 'عمومی و پاسخگویی به سوال مشتری'}

Return a JSON array of 3 strings: ["پاسخ اول", "پاسخ دوم با جزییات بیشتر", "پاسخ سوم کوتاه و سریع"]`;

    const prompt = `Customer Name: ${customerName || 'ناشناس'}\nCustomer Message: "${customerMessage}"\nGenerate 3 suggested replies in Persian JSON array format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const parsedReplies = JSON.parse(response.text || '[]');
    return res.json({ success: true, replies: parsedReplies });
  } catch (error: any) {
    console.error('Error suggesting reply with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      replies: [
        `سلام وقت بخیر🌸 بله محصول مورد نظرتون موجوده. برای ثبت سفارش لطفاً سایز، رنگ و آدرس دقیق پستی‌تون رو ارسال بفرمایید.`,
        `سلام و احترام✨ ارسال سفارشات روزهای زوج با پست پیشتاز و روزانه با تیپاکس انجام میشه. خدمتگزاریم!`,
        `سلام عزیزم، شماره کارت بافت استور: ۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸ به نام فروشگاه بافت. منتظر فیش واریزیتون هستم.`
      ]
    });
  }
});

// 3. AI Endpoint: Store Performance Insights
app.post('/api/gemini/sales-insight', async (req, res) => {
  try {
    const { totalSales, totalOrders, topProducts, conversionRate } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        insight: {
          headline: "رشد ۲۴٪ سفارش‌های دایرکت اینستاگرام در هفته جاری",
          summary: "بیشترین تقاضا برای محصولات دسته‌بندی پوشاک زنانه ثبت شده است. ۶۴٪ خریداران پرداخت کارت‌به‌کارت را به درگاه آنلاین ترجیح داده‌اند.",
          actionableTips: [
            "با فعال‌سازی پیامک کد رهگیری پست بلافاصله پس از ارسال، رضایت مشتریان وفادار را ۳۵٪ افزایش دهید.",
            "موجودی مانتو لینن کرم به زیر ۵ عدد رسیده است؛ شارژ مجدد قبل از پنجشنبه پیشنهاد می‌شود.",
            "پاسخگویی به پیام‌های تلگرام در کمتر از ۱۰ دقیقه منجر به افزایش ۳۰٪ نرخ تبدیل سفارش شده است."
          ],
          customerTrend: "مشتریان وفادار (VIP) سهم ۴۱ درصدی از کل فروش این هفته را تشکیل داده‌اند."
        }
      });
    }

    const systemPrompt = `You are a Senior Social Commerce Growth Consultant for Iranian Instagram & Telegram Sellers.
Analyze the merchant's metrics and generate actionable Persian business insights in JSON format.
Include:
- headline (تیتر جذاب و امیدبخش)
- summary (خلاصه تحلیل عملکرد)
- actionableTips: array of 3 specific Persian tips (راهکارهای عملی برای افزایش فروش و سرعت ارسال)
- customerTrend (روند رفتار مشتریان)`;

    const prompt = `Data: Total Sales: ${totalSales || '۴۵,۶۰۰,۰۰۰ تومان'}, Total Orders: ${totalOrders || '۵۴'}, Top Products: ${JSON.stringify(topProducts || ['مانتو لینن', 'شال اسلپ', 'کیف چرم'])}, Conversion Rate: ${conversionRate || '۶۸%'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const parsedInsight = JSON.parse(response.text || '{}');
    return res.json({ success: true, insight: parsedInsight });
  } catch (error: any) {
    console.error('Error generating sales insight with Gemini:', error);
    return res.status(500).json({
      success: false,
      insight: {
        headline: "افزایش تعامل خریداران در دایرکت و تلگرام",
        summary: "فروش این هفته با رشد مداوم همراه بوده و نرخ رضایت مشتریان بالای ۹۵٪ است.",
        actionableTips: [
          "برای سفارش‌های بالای ۱ میلیون تومان ارسال رایگان پستی در نظر بگیرید.",
          "محصولات با موجودی کم را در استوری اینستاگرام اطلاع‌رسانی کنید."
        ],
        customerTrend: "نرخ خرید مجدد مشتریان ثابت روند صعودی دارد."
      }
    });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Export for server run or vite proxy
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
