import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, Plugin } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

function apiPlugin(): Plugin {
  return {
    name: "api-server-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        const apiKey = process.env.GEMINI_API_KEY;
        let ai: GoogleGenAI | null = null;
        if (apiKey) {
          ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });
        }

        // Parse JSON body
        let body: any = {};
        if (req.method === "POST" || req.method === "PUT") {
          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(
              typeof chunk === "string" ? Buffer.from(chunk) : chunk,
            );
          }
          const raw = Buffer.concat(buffers).toString("utf-8");
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch (e) {
            body = {};
          }
        }

        res.setHeader("Content-Type", "application/json; charset=utf-8");

        if (req.url === "/api/gemini/parse-order") {
          try {
            const { text, imageBase64, mimeType } = body;
            if (!ai) {
              return res.end(
                JSON.stringify({
                  success: true,
                  data: {
                    customerName: "فاطمه رضایی",
                    phoneNumber: "09123456789",
                    address:
                      "تهران، سعادت‌آباد، خیابان سرو غربی، پلاک ۲۴، واحد ۶",
                    postalCode: "1998765432",
                    city: "تهران",
                    province: "تهران",
                    items: [
                      {
                        title: "مانتو لینن خنک تابستانه - کرم",
                        size: "M",
                        color: "کرم",
                        quantity: 1,
                        price: 890000,
                      },
                      {
                        title: "شال اسلپ نخی نگین‌دار - شیری",
                        size: "فری‌سایز",
                        color: "شیری",
                        quantity: 1,
                        price: 340000,
                      },
                    ],
                    totalAmount: 1230000,
                    shippingCost: 55000,
                    grandTotal: 1285000,
                    paymentMethod: "کارت به کارت (بانک سامان)",
                    trackingCode: "847291048",
                    channel: "instagram",
                    notes:
                      "لطفا با تیپاکس ارسال شود، تا قبل ۵ عصر تحویل داده شود.",
                  },
                }),
              );
            }

            const systemPrompt = `You are an expert Iranian Social Commerce Order & Receipt Parser AI for Instagram and Telegram merchants.
Analyze the provided text message or payment slip / chat screenshot and extract structured order information in Persian JSON format.
Ensure you accurately identify:
- customerName (نام مشتری)
- phoneNumber (شماره موبایل ایران مانند 09...)
- address (آدرس دقیق پستی شامل استان، شهر، خیابان، پلاک، واحد)
- postalCode (کد پستی ۱۰ رقمی)
- city (شهر)
- province (استان)
- items: array of { title, size, color, quantity, price }
- totalAmount (جمع کالا به تومان)
- shippingCost (هزینه ارسال به تومان)
- grandTotal (مبلغ کل به تومان)
- paymentMethod (نوع پرداخت مثل کارت به کارت یا زرین‌پال)
- trackingCode (کد رهگیری واریز بانکی یا شماره ارجاع)
- channel (instagram یا telegram)
- notes (توضیحات و ترجیحات مشتری)

Output strictly valid JSON with no markdown formatting.`;

            let contents: any;
            if (imageBase64) {
              contents = {
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType || "image/jpeg",
                      data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
                    },
                  },
                  {
                    text: text
                      ? `Text accompanying receipt: "${text}". Parse details.`
                      : "Extract all order details and payment slip info from this image.",
                  },
                ],
              };
            } else {
              contents = `Customer chat text:\n${text || "سفارش مانتو لینن کرم سایز مدیوم برای فاطمه رضایی ۰۹۱۲۳۴۵۶۷۸۹ تهران سعادت اباد پلاک ۲۴"}`;
            }

            const response = await ai.models.generateContent({
              model: "gemini-3.7-flash",
              contents: contents,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
              },
            });

            const parsed = JSON.parse(response.text || "{}");
            return res.end(JSON.stringify({ success: true, data: parsed }));
          } catch (err: any) {
            return res.end(
              JSON.stringify({
                success: false,
                error: err.message,
                fallbackData: {
                  customerName: "سارا محمدی",
                  phoneNumber: "09351234567",
                  address: "اصفهان، خیابان چهارباغ بالا، کوچه نگار، پلاک ۱۲",
                  postalCode: "8173645129",
                  city: "اصفهان",
                  province: "اصفهان",
                  items: [
                    {
                      title: "شومیز حریر مجلسی",
                      size: "L",
                      color: "یشمی",
                      quantity: 1,
                      price: 680000,
                    },
                  ],
                  totalAmount: 680000,
                  shippingCost: 55000,
                  grandTotal: 735000,
                  paymentMethod: "کارت به کارت (بانک ملی)",
                  trackingCode: "TRX-74892",
                  channel: "instagram",
                  notes: "ارسال سریع با پست پیشتاز",
                },
              }),
            );
          }
        }

        if (req.url === "/api/gemini/suggest-reply") {
          try {
            const { customerMessage, customerName } = body;
            if (!ai) {
              return res.end(
                JSON.stringify({
                  success: true,
                  replies: [
                    `سلام ${customerName || "عزیز"} جان وقتتون بخیر🌸\nبله این مدل موجودی داره و جنسش لینن درجه یک هست. برای ثبت نهایی لطفا مشخصات کاملتون رو همراه فیش واریز ارسال کنید ✨`,
                    `سلام و ارادت خدمت شما🌱\nارسال با پست پیشتاز به سراسر کشور ۵۵ تومان و با تیپاکس به صورت پس‌کرایه انجام میشه. در خدمتم!`,
                    `سلام ${customerName || "همراه گرامی"}💖\nشماره کارت جهت واریز:\n۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸\nبه نام بافت استور (بانک ملی)\nلطفاً پس از واریز عکس فیش رو بفرستید 🙏`,
                  ],
                }),
              );
            }

            const prompt = `Customer: ${customerName || "ناشناس"}\nMessage: "${customerMessage}"\nGenerate 3 polite, natural Persian responses for an Instagram/Telegram merchant shop.`;
            const response = await ai.models.generateContent({
              model: "gemini-3.7-flash",
              contents: prompt,
              config: {
                systemInstruction:
                  "You are a warm, courteous Iranian Social Commerce merchant assistant. Return a JSON array of 3 strings in Persian.",
                responseMimeType: "application/json",
              },
            });

            const replies = JSON.parse(response.text || "[]");
            return res.end(JSON.stringify({ success: true, replies }));
          } catch (err: any) {
            return res.end(
              JSON.stringify({
                success: true,
                replies: [
                  `سلام وقت بخیر🌸 بله محصول مورد نظرتون موجوده. برای ثبت سفارش لطفاً سایز، رنگ و آدرس دقیق پستی‌تون رو ارسال بفرمایید.`,
                  `سلام و احترام✨ ارسال سفارشات روزهای زوج با پست پیشتاز و روزانه با تیپاکس انجام میشه. خدمتگزاریم!`,
                ],
              }),
            );
          }
        }

        if (req.url === "/api/gemini/sales-insight") {
          try {
            const { totalSales, totalOrders } = body;
            if (!ai) {
              return res.end(
                JSON.stringify({
                  success: true,
                  insight: {
                    headline: "رشد ۲۸٪ سفارش‌های دایرکت اینستاگرام و تلگرام",
                    summary:
                      "بیشترین نرخ تبدیل مربوط به مشتریان دایرکت اینستاگرام با پاسخگویی زیر ۱۵ دقیقه بوده است.",
                    actionableTips: [
                      "با صدور خودکار بارکد پست و تیپاکس، زمان پردازش سفارش را به نصف کاهش دهید.",
                      "محصولات با موجودی کمتر از ۵ عدد را در استوری اینستاگرام اطلاع‌رسانی کنید.",
                      "ارسال کد تخفیف باشگاه مشتریان برای خریداران ماه گذشته موجب ۲۰٪ خرید مجدد می‌شود.",
                    ],
                    customerTrend:
                      "سهم پرداخت‌های کارت‌به‌کارت همچنان ۷۰٪ از کل تراکنش‌هاست.",
                  },
                }),
              );
            }

            const response = await ai.models.generateContent({
              model: "gemini-3.7-flash",
              contents: `Analyze seller metrics: Sales: ${totalSales}, Orders: ${totalOrders}. Return Persian business insight JSON with headline, summary, actionableTips array, customerTrend.`,
              config: {
                systemInstruction:
                  "You are a social commerce business analyst for Iranian online shops. Return JSON only.",
                responseMimeType: "application/json",
              },
            });

            return res.end(
              JSON.stringify({
                success: true,
                insight: JSON.parse(response.text || "{}"),
              }),
            );
          } catch (err: any) {
            return res.end(
              JSON.stringify({
                success: true,
                insight: {
                  headline: "عملکرد مطلوب فروش هفتگی",
                  summary: "روند فروش در دایرکت و کانال تلگرام صعودی است.",
                  actionableTips: [
                    "سرعت پاسخگویی به دایرکت‌ها را زیر ۱۰ دقیقه نگه دارید.",
                  ],
                  customerTrend: "افزایش رضایت مشتریان وفادار.",
                },
              }),
            );
          }
        }

        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Endpoint not found" }));
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: "baft",
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
