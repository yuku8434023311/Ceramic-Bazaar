import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Environment variables for Meta WhatsApp Cloud API
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "electro_bazaar_whatsapp_secret_2026";
const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN || "";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";

// Helper to send WhatsApp messages using Meta Graph API
async function sendWhatsAppMessage(to: string, payload: any) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.log("⚠️ WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID missing in env vars.");
    return false;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        ...payload,
      }),
    });

    const data = await res.json();
    console.log("📲 WhatsApp API Response:", data);
    return res.ok;
  } catch (err) {
    console.error("❌ WhatsApp send error:", err);
    return false;
  }
}

// 1. GET Method: Webhook Verification for Meta Developers Portal
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    console.log("🔍 Meta Webhook Verification Request:", { mode, token, challenge });

    if (challenge) {
      console.log("✅ Returning Meta Webhook Challenge:", challenge);
      return new Response(challenge, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export async function OPTIONS() {
  return new Response("OK", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

// 2. POST Method: Complete E-Commerce WhatsApp Automation Bot
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ status: "ignored" });
    }

    const fromNumber = message.from; // Customer WhatsApp Phone Number (e.g. 919876543210)
    const msgType = message.type;
    let userText = "";
    let buttonId = "";

    if (msgType === "text") {
      userText = (message.text?.body || "").trim();
    } else if (msgType === "interactive") {
      buttonId = message.interactive?.button_reply?.id || message.interactive?.list_reply?.id || "";
      userText = message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || "";
    }

    const cleanText = userText.toLowerCase();
    const cleanButtonId = buttonId.toUpperCase();

    console.log(`📩 WhatsApp Msg from ${fromNumber} | Text: "${userText}" | ButtonID: "${buttonId}"`);

    // =========================================================================
    // STEP 1: INITIAL GREETING & LANGUAGE SELECTION (जब 'Hi' या पहली बार मैसेज आए)
    // =========================================================================
    if (
      cleanText === "hi" ||
      cleanText === "hello" ||
      cleanText === "namaste" ||
      cleanText === "start" ||
      cleanText === "menu" ||
      cleanText === "hey" ||
      cleanButtonId === "RESET_MENU"
    ) {
      await sendWhatsAppMessage(fromNumber, {
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: "🛍️ Electro Bazaar Official",
          },
          body: {
            text: "नमस्ते! Electro Bazaar में आपका स्वागत है।\nWelcome to Electro Bazaar!\n\nआप किस भाषा में बात करना पसंद करेंगे?\nWhich language do you prefer?",
          },
          footer: {
            text: "Electro Bazaar - Electrifying Deals",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "LANG_HI",
                  title: "🇮🇳 Hindi (हिंदी)",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "LANG_EN",
                  title: "🇬🇧 English",
                },
              },
            ],
          },
        },
      });
      return NextResponse.json({ status: "greeting_sent" });
    }

    // =========================================================================
    // STEP 2: MAIN MENU BASED ON LANGUAGE SELECTION (हिंदी या English चुनने पर)
    // =========================================================================

    // A. HINDI LANGUAGE MAIN MENU
    if (cleanButtonId === "LANG_HI" || cleanText.includes("hindi") || cleanText.includes("हिंदी")) {
      await sendWhatsAppMessage(fromNumber, {
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: "🇮🇳 इलेक्ट्रो बाज़ार मुख्य मेनू",
          },
          body: {
            text: "नमस्ते! आप आज क्या करना चाहते हैं? नीचे दिए गए विकल्पों में से चुनें:",
          },
          footer: {
            text: "Electro Bazaar Help & Automation",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "OPT_TRACK_HI",
                  title: "📦 ऑर्डर ट्रैक करें",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "OPT_OFFERS_HI",
                  title: "🔥 आज के ऑफ़र्स",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "OPT_DEALER_HI",
                  title: "🏪 डीलर / दुकान खोलें",
                },
              },
            ],
          },
        },
      });
      return NextResponse.json({ status: "hindi_menu_sent" });
    }

    // B. ENGLISH LANGUAGE MAIN MENU
    if (cleanButtonId === "LANG_EN" || cleanText.includes("english")) {
      await sendWhatsAppMessage(fromNumber, {
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: "🇬🇧 Electro Bazaar Main Menu",
          },
          body: {
            text: "Welcome! How can we assist you today? Please choose an option from below:",
          },
          footer: {
            text: "Electro Bazaar Support & Services",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "OPT_TRACK_EN",
                  title: "📦 Track My Order",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "OPT_OFFERS_EN",
                  title: "🔥 Today's Offers",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "OPT_DEALER_EN",
                  title: "🏪 Become a Dealer",
                },
              },
            ],
          },
        },
      });
      return NextResponse.json({ status: "english_menu_sent" });
    }

    // =========================================================================
    // STEP 3: AUTOMATED ACTIONS (Order Tracking, Offers, Dealer Register, Support)
    // =========================================================================

    // 1. ORDER TRACKING ACTION (Hindi & English)
    if (
      cleanButtonId === "OPT_TRACK_HI" ||
      cleanButtonId === "OPT_TRACK_EN" ||
      cleanText.includes("track") ||
      cleanText.includes("ऑर्डर")
    ) {
      const last10 = fromNumber.slice(-10);
      const latestOrder = await prisma.order.findFirst({
        where: {
          customerPhone: {
            endsWith: last10,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (latestOrder) {
        const isHindi = cleanButtonId.endsWith("_HI");
        const statusText =
          latestOrder.status === "DELIVERED"
            ? isHindi ? "✅ डिलीवर हो चुका है" : "✅ Delivered"
            : latestOrder.status === "SHIPPED"
            ? isHindi ? "🚚 रास्ते में है (Shipped)" : "🚚 On The Way (Shipped)"
            : isHindi ? "⏳ प्रोसेस हो रहा है (Processing)" : "⏳ Processing";

        await sendWhatsAppMessage(fromNumber, {
          type: "text",
          text: isHindi
            ? `📦 *आपका ताज़ा ऑर्डर विवरण:*

🆔 *ऑर्डर नंबर:* #${latestOrder.id.slice(-6).toUpperCase()}
📊 *स्थिति:* ${statusText}
💰 *कुल राशि:* ₹${latestOrder.totalAmount?.toLocaleString("en-IN")}
💳 *पेमेंट मोड:* ${latestOrder.paymentMethod}

🌐 वेबसाइट पर पूरा ट्रैकिंग विवरण देखें:
https://electrobazaar.in/orders/${latestOrder.id}`
            : `📦 *Your Recent Order Details:*

🆔 *Order ID:* #${latestOrder.id.slice(-6).toUpperCase()}
📊 *Status:* ${statusText}
💰 *Total Amount:* ₹${latestOrder.totalAmount?.toLocaleString("en-IN")}
💳 *Payment Mode:* ${latestOrder.paymentMethod}

🌐 View complete tracking details online:
https://electrobazaar.in/orders/${latestOrder.id}`,
        });
      } else {
        await sendWhatsAppMessage(fromNumber, {
          type: "text",
          text: `❌ आपके इस व्हाट्सएप नंबर (${fromNumber}) से कोई सक्रिय ऑर्डर नहीं मिला।

यदि आपने किसी अन्य नंबर से ऑर्डर किया था, तो कृपया सपोर्ट टीम से संपर्क करें या ऑर्डर आईडी लिखकर भेजें।`,
        });
      }
      return NextResponse.json({ status: "order_tracked" });
    }

    // 2. TODAY'S HOT DEALS ACTION
    if (
      cleanButtonId === "OPT_OFFERS_HI" ||
      cleanButtonId === "OPT_OFFERS_EN" ||
      cleanText.includes("offer") ||
      cleanText.includes("ऑफ़र") ||
      cleanText.includes("deal")
    ) {
      await sendWhatsAppMessage(fromNumber, {
        type: "text",
        text: `🔥 *Electro Bazaar Mega Monsoon Offers:*

1️⃣ *4K Smart TVs:* up to 50% Instant Discount + Exchange Offers
2️⃣ *Laptops:* Intel Core i7 & M-Series Laptops with Free Accessories
3️⃣ *5G Smartphones:* Starting at just ₹12,999 + No-Cost EMI
4️⃣ *Extra Coupon Code:* Checkout page apply *DISCOUNT2000* to get ₹2,000 extra off!

🛒 अभी खरीदारी करें: https://electrobazaar.in/offers`,
      });
      return NextResponse.json({ status: "offers_sent" });
    }

    // 3. BECOME A DEALER / SHOP PARTNER ACTION
    if (
      cleanButtonId === "OPT_DEALER_HI" ||
      cleanButtonId === "OPT_DEALER_EN" ||
      cleanText.includes("dealer") ||
      cleanText.includes("डीलर") ||
      cleanText.includes("shop") ||
      cleanText.includes("दुकान")
    ) {
      await sendWhatsAppMessage(fromNumber, {
        type: "text",
        text: `🏪 *Electro Bazaar Dealer Portal (दुकानदार पार्टनर बनें):*

क्या आपकी भी इलेक्ट्रॉनिक्स की दुकान है? Electro Bazaar पर मुफ्त में रजिस्टर करें और अपने सामान को ऑनलाइन पूरे भारत में बेचें!

✅ बिना GST रजिस्ट्रेशन की सुविधा (GST Verification Requirement Exemption)
✅ 100% डीलर कंट्रोल पैनल (Add/Edit Products & Prices)
✅ कस्टमर टैक्स इनवॉइस जनरेटर (Custom GST Tax Invoices)

🔗 अभी डीलर रजिस्टर करें: https://electrobazaar.in/register?role=DEALER`,
      });
      return NextResponse.json({ status: "dealer_info_sent" });
    }

    // 4. CUSTOMER SUPPORT / STORE LOCATION ACTION
    if (
      cleanText.includes("support") ||
      cleanText.includes("help") ||
      cleanText.includes("मदद") ||
      cleanText.includes("सपोर्ट") ||
      cleanText.includes("address") ||
      cleanText.includes("location")
    ) {
      await sendWhatsAppMessage(fromNumber, {
        type: "text",
        text: `📍 *Electro Bazaar Main Official Store & Customer Care:*

🏪 *Store Name:* Electro Bazaar Official Store
📍 *Address:* Main Sabji Mandi, Basantpur, Siwan, Bihar - 841406
📞 *Helpline Number:* +91 9876543210
📧 *Email:* support@electrobazaar.in
⏰ *Opening Hours:* 09:00 AM - 09:00 PM (Monday to Saturday)

हमारी टीम आपसे जल्द से जल्द संपर्क करेगी!`,
      });
      return NextResponse.json({ status: "support_sent" });
    }

    // =========================================================================
    // FALLBACK RESPONSE (यदि कुछ और टाइप किया जाए)
    // =========================================================================
    await sendWhatsAppMessage(fromNumber, {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "🤖 Electro Bazaar WhatsApp Assistant:\n\nमुख्य मेनू खोलने या भाषा बदलने के लिए नीचे दिए गए बटन पर क्लिक करें:",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "RESET_MENU",
                title: "🔄 Main Menu / मेनू",
              },
            },
          ],
        },
      },
    });

    return NextResponse.json({ status: "fallback_sent" });
  } catch (error: any) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
