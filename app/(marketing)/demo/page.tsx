"use client";

import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";

export default function DemoPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const list = JSON.parse(localStorage.getItem("demo-requests") || "[]");
      list.push({ t: Date.now(), ...payload });
      localStorage.setItem("demo-requests", JSON.stringify(list));
    } catch {}
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Book your free demo</h1>
              <p className="mt-4 max-w-prose text-base sm:text-lg">
                No contracts. No long-term commitment. See how Kira extends your Square POS with printed touchpoints, pickup screens, websites, and a phone agent.
              </p>
              <div className="mt-6 text-sm">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em]">In 20 minutes, we’ll cover</div>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { t: "Printers", d: "Entire order and per-item examples." },
                    { t: "Pickup screens", d: "Delightful order boards with callouts." },
                    { t: "Custom website", d: "Accurate pages grounded in Square." },
                    { t: "Phone agent", d: "Answers calls with live data." },
                  ].map((x) => (
                    <li key={x.t} className="border-2 border-black p-3 bg-white">
                      <div className="font-medium">{x.t}</div>
                      <div className="text-sm text-black/70">{x.d}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-xl border-2 border-black bg-white p-4 sm:p-6 shadow-[8px_8px_0_0_#000]">
                {done ? (
                  <div className="text-center py-10">
                    <div className="text-2xl font-mono">Thanks! We’ll reach out shortly.</div>
                    <div className="mt-2 text-sm text-black/70">Feel free to email hello@kira.app if you need anything sooner.</div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                      <div className="mb-1">Role</div>
                      <select name="role" className="w-full border-2 border-black bg-white p-2">
                        <option value="">Select one…</option>
                        <option>Owner</option>
                        <option>Manager</option>
                        <option>Staff</option>
                        <option>Other</option>
                      </select>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="text-sm">
                        <div className="mb-1">First name</div>
                        <input name="first" required className="w-full border-2 border-black bg-white p-2" placeholder="First name" />
                      </label>
                      <label className="text-sm">
                        <div className="mb-1">Last name</div>
                        <input name="last" required className="w-full border-2 border-black bg-white p-2" placeholder="Last name" />
                      </label>
                    </div>
                    <label className="text-sm">
                      <div className="mb-1">Email</div>
                      <input name="email" type="email" required className="w-full border-2 border-black bg-white p-2" placeholder="Email" />
                    </label>
                    <label className="text-sm">
                      <div className="mb-1">Cellphone</div>
                      <input name="phone" type="tel" className="w-full border-2 border-black bg-white p-2" placeholder="US Cellphone" />
                    </label>
                    <label className="text-sm">
                      <div className="mb-1">Restaurant name</div>
                      <input name="company" className="w-full border-2 border-black bg-white p-2" placeholder="Search your restaurant name…" />
                    </label>
                    <label className="text-sm">
                      <div className="mb-1">How did you hear about us?</div>
                      <select name="ref" className="w-full border-2 border-black bg-white p-2">
                        <option value="">Select one…</option>
                        <option>Google</option>
                        <option>Friend/Referral</option>
                        <option>Social</option>
                        <option>Other</option>
                      </select>
                    </label>
                    <label className="text-xs flex items-start gap-2">
                      <input type="checkbox" name="sms" className="mt-1" />
                      <span>
                        I agree to receive texts to help schedule and evaluate a demo. Consent not required. Msg & data rates may apply. Reply STOP to cancel.
                      </span>
                    </label>
                    <button
                      type="submit"
                      className="mt-1 px-4 py-2 border-2 border-black bg-black text-white disabled:opacity-50"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting…" : "Book your demo"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
        <SiteFooter />
      </main>
    </div>
  );
}
