"use client";
import { useState } from "react";
import { HelpCircle, Mail, Phone, MapPin, MessageSquare, Send, CheckCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        toast.success("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/919315309289?text=${encodeURIComponent(
      "Hello Ceramic Bazaar Support, I need help with an order/product inquiry."
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex h-14 w-14 rounded-2xl bg-[#062524] text-[#c59b27] items-center justify-center mb-3 border border-[#c59b27]/30 shadow-md">
          <HelpCircle className="h-7 w-7" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">How can we help?</h1>
        <p className="text-slate-600 mt-2 font-medium">We're here to assist with product inquiries, wholesale orders, and delivery assistance.</p>
      </motion.div>

      {/* Prominent Direct WhatsApp Mobile Trigger Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-6 rounded-2xl bg-[#062524] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#0d4a47]"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-[#c59b27]/30 shrink-0">
            <Phone className="h-7 w-7 text-[#c59b27] fill-current" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
              💬 Direct WhatsApp Customer Support
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-medium mt-0.5">
              WhatsApp Helpdesk Number: <strong className="text-[#c59b27] font-bold underline">+91 93153 09289</strong>
            </p>
          </div>
        </div>

        <Button
          onClick={openWhatsApp}
          className="w-full sm:w-auto bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 border border-[#c59b27] shrink-0 text-sm transform transition-all active:scale-95"
        >
          <span>Chat on WhatsApp (+91 93153 09289)</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Phone, t: "Call Us", v: "+91 93153 09289", s: "Mon-Sat 9 AM - 8 PM" },
          { icon: Mail, t: "Email Us", v: "ceramicbazaar0@gmail.com", s: "24/7 online response" },
          {
            icon: MapPin,
            t: "Visit Us",
            v: "Bhagwanpur Hat, Siwan, Bihar – 841408",
            s: "Showroom open Mon-Sat",
          },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-5 text-center product-card-shadow border border-slate-200"
          >
            <div className="mx-auto h-11 w-11 rounded-lg bg-[#062524]/10 text-[#062524] flex items-center justify-center mb-3">
              <c.icon className="h-5 w-5 text-[#c59b27]" />
            </div>
            <p className="font-display font-bold text-slate-900">{c.t}</p>
            <p className="text-sm mt-1 font-semibold text-slate-700">{c.v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.s}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 product-card-shadow border border-slate-200">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2 text-slate-900">
          <MessageSquare className="h-5 w-5 text-[#c59b27]" /> Send us a message
        </h2>
        {sent ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
            <p className="font-semibold text-slate-900">Thanks! Your message has been received.</p>
            <p className="text-sm text-slate-500">We'll get back to you within 24 hours.</p>
            <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>
              Send Another
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-10 px-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#062524]"
            />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-10 px-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#062524]"
            />
            <input
              required
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="h-10 px-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#062524]"
            />
            <textarea
              required
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="p-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm md:col-span-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#062524]"
            />
            <p className="text-xs text-slate-500 md:col-span-2">
              We respect your privacy. Your message is stored securely and only used to respond to your enquiry.
            </p>
            <Button
              type="submit"
              disabled={submitting}
              className="md:col-span-2 bg-[#062524] hover:bg-[#0c3f3d] text-white font-bold"
            >
              {submitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2 text-[#c59b27]" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
