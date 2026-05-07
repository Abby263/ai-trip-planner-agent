"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CirclePlay,
  Heart,
  Hotel,
  MapPinned,
  MessageCircle,
  Navigation,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const chips = ["Weekend in Lisbon", "Delhi food walk", "Paris photo spots", "Comedy tonight", "Japan with friends"];

const highlights = [
  { icon: Plane, label: "Flights", value: "YYZ to DEL" },
  { icon: Hotel, label: "Stay", value: "Connaught Place" },
  { icon: MapPinned, label: "Route", value: "11 stops" },
  { icon: ShieldCheck, label: "Checked", value: "100 score" }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-2 pb-3 pt-2">
      <div className="relative min-h-[720px] overflow-hidden rounded-b-[32px] bg-[#f6b800] text-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=85')] bg-cover bg-center opacity-45 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#f6b800]/80" />
        <div className="container relative grid min-h-[720px] content-center gap-10 py-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.68fr)]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/30 px-4 py-2 text-sm font-medium backdrop-blur">
              <Sparkles className="h-4 w-4 fill-black" />
              AI concierge with tools, maps, validation, and booking-ready links
            </div>
            <h1 className="max-w-5xl text-[72px] font-black leading-[0.88] tracking-normal sm:text-[104px] lg:text-[132px]">
              Travel
              <span className="block">smarter.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8">
              Build complete trips from a single request, then inspect the routes, prices, sources, warnings, and booking links before you commit.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-16 rounded-full bg-black px-9 text-base text-white hover:bg-black/90">
                <Link href="/planner">
                  Start planning
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-16 rounded-full px-6 text-base text-black hover:bg-black/10">
                <Link href="/planner">
                  <CirclePlay className="h-7 w-7 fill-black" />
                  Try the demo trip
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full border border-black/10 bg-white/32 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="relative hidden min-h-[600px] lg:block">
            <div className="absolute right-0 top-0 h-[500px] w-[310px] overflow-hidden rounded-t-full rounded-b-lg border border-black/10 bg-slate-900 shadow-[0_28px_80px_rgba(41,25,0,0.34)]">
              <div className="h-full bg-[url('https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center" />
            </div>
            <div className="absolute right-36 top-10 h-28 w-40 overflow-hidden rounded-lg border-4 border-[#f6b800] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
              <div className="h-full bg-[url('https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center" />
            </div>
            <div className="absolute bottom-28 left-8 h-32 w-48 overflow-hidden rounded-lg border-4 border-[#f6b800] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
              <div className="h-full bg-[url('https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=85')] bg-cover bg-center" />
            </div>
            <div className="absolute right-5 top-60 w-72 rounded-lg border border-black/10 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6b800]">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Plan 3 days in Delhi</p>
                  <p className="text-xs text-black/55">Vegetarian, culture, photography</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-lg bg-black/[0.04] p-3">
                    <item.icon className="mb-2 h-4 w-4" />
                    <p className="text-[11px] uppercase tracking-wide text-black/50">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-2 top-20 flex items-center gap-3 rounded-lg border border-black/10 bg-white px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="w-36">
                <div className="h-2 rounded-full bg-slate-200" />
                <div className="mt-2 h-2 w-24 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="absolute bottom-8 right-4 w-80 rounded-lg border border-black/10 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-black/50">Smart Balanced</p>
                  <p className="mt-1 text-lg font-bold">Delhi cultural route</p>
                </div>
                <div className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">CAD 2,657</div>
              </div>
              <div className="mt-4 space-y-3">
                {["India Gate", "Cafe Lota", "Sufi Music Evening"].map((stop, index) => (
                  <div key={stop} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6b800] text-xs font-bold">{index + 1}</span>
                    <span className="text-sm font-medium">{stop}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-28 top-[430px] flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500 text-white shadow-[0_14px_32px_rgba(225,29,72,0.32)]">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <div className="absolute left-28 top-44 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <Navigation className="mr-2 inline h-4 w-4" />
              Route optimized
            </div>
            <div className="absolute left-2 top-6 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <Star className="mr-2 inline h-4 w-4 fill-[#f6b800]" />
              Source-backed
            </div>
          </motion.div>
        </div>
        <Link href="#how-it-works" className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm font-medium">
          Learn more
          <ArrowDown className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
