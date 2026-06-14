import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles, Calendar, ShieldCheck, Leaf, Star, Check, ArrowRight,
  Home, Building2, Building, BrushCleaning, Wand2, Loader2, Phone,
} from "lucide-react";

import heroImg from "@/assets/hero-clean.jpg";
import teamImg from "@/assets/team.jpg";
import bubblesImg from "@/assets/bubbles.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { estimateCleaningCost } from "@/lib/estimate.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SparklePro Cleaning — Spotless Homes, Effortlessly Booked" },
      { name: "description", content: "Premium residential cleaning with instant AI quotes, online booking, and a 100% sparkle guarantee." },
      { property: "og:title", content: "SparklePro Cleaning" },
      { property: "og:description", content: "Instant AI quotes, online booking, spotless results." },
    ],
  }),
  component: Index,
});

const SERVICES = [
  { id: "standard", name: "Standard Clean", mult: 1, blurb: "Weekly fresh-up across every room." },
  { id: "deep", name: "Deep Clean", mult: 1.6, blurb: "Top-to-bottom reset including grout & vents." },
  { id: "move", name: "Move-In / Move-Out", mult: 1.9, blurb: "Get every deposit back. Spotless handover." },
  { id: "post", name: "Post-Construction", mult: 2.3, blurb: "Dust, debris and paint splatter — handled." },
];

const EXTRAS = [
  { id: "fridge", label: "Inside fridge", price: 35 },
  { id: "oven", label: "Inside oven", price: 30 },
  { id: "windows", label: "Interior windows", price: 40 },
  { id: "laundry", label: "Laundry & folding", price: 25 },
  { id: "garage", label: "Garage sweep", price: 60 },
];

const FREQ = [
  { id: "once", name: "One-time", discount: 0 },
  { id: "weekly", name: "Weekly", discount: 0.2 },
  { id: "biweekly", name: "Bi-weekly", discount: 0.15 },
  { id: "monthly", name: "Monthly", discount: 0.1 },
];

const HOME_TYPES = [
  { id: "apartment", label: "Apartment", icon: Building },
  { id: "house", label: "House", icon: Home },
  { id: "condo", label: "Condo", icon: Building2 },
];

const PACKAGES = [
  {
    name: "Fresh",
    price: 129,
    tag: "Most popular for 1BR",
    features: ["Up to 1,000 sqft", "Kitchen + bath deep wipe", "Floors vacuum & mop", "Trash & linens"],
    highlight: false,
  },
  {
    name: "Sparkle",
    price: 219,
    tag: "Best value",
    features: ["Up to 2,000 sqft", "Everything in Fresh", "Inside microwave & appliances", "Window sills + baseboards", "Eco-friendly products"],
    highlight: true,
  },
  {
    name: "Brilliant",
    price: 349,
    tag: "Whole-home reset",
    features: ["Up to 3,500 sqft", "Everything in Sparkle", "Inside fridge & oven", "Interior windows", "Two-person priority team"],
    highlight: false,
  },
];

const REVIEWS = [
  { name: "Maya R.", role: "Brooklyn, NY", text: "I came home to a place that smelled like a hotel suite. The team caught corners I'd ignored for years.", rating: 5 },
  { name: "Dev P.", role: "Austin, TX", text: "Booked at 9pm, cleaners showed up Tuesday morning. The AI quote was spot-on within $4.", rating: 5 },
  { name: "Sara L.", role: "Seattle, WA", text: "Move-out clean got me my full deposit back. Worth every cent.", rating: 5 },
  { name: "Jordan K.", role: "Chicago, IL", text: "I love that I can see exactly what's included. No phone tag, just sparkle.", rating: 5 },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Packages />
      <EstimatorSection />
      <BookingSection />
      <Reviews />
      <Footer />
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-display text-xl md:text-2xl">
          <span className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </span>
          SparklePro
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#services" className="hover:text-primary">Services</a>
          <a href="#packages" className="hover:text-primary">Packages</a>
          <a href="#estimator" className="hover:text-primary">AI Estimator</a>
          <a href="#reviews" className="hover:text-primary">Reviews</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden md:inline-flex rounded-full bg-foreground text-background hover:bg-foreground/90">
            <a href="#book">Book now <ArrowRight className="ml-1 h-4 w-4" /></a>
          </Button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background px-4 py-4 space-y-3">
          <a href="#services" onClick={() => setOpen(false)} className="block text-sm font-medium hover:text-primary">Services</a>
          <a href="#packages" onClick={() => setOpen(false)} className="block text-sm font-medium hover:text-primary">Packages</a>
          <a href="#estimator" onClick={() => setOpen(false)} className="block text-sm font-medium hover:text-primary">AI Estimator</a>
          <a href="#reviews" onClick={() => setOpen(false)} className="block text-sm font-medium hover:text-primary">Reviews</a>
          <Button asChild className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 mt-2">
            <a href="#book">Book now <ArrowRight className="ml-1 h-4 w-4" /></a>
          </Button>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-10 md:pt-16 pb-16 md:pb-24 grid lg:grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="lg:col-span-6 space-y-5 md:space-y-7 relative z-10">
          <Badge className="rounded-full bg-secondary text-secondary-foreground border-0 px-3 py-1 text-xs md:text-sm">
            <Sparkles className="h-3 w-3 mr-1" /> AI-powered instant quotes
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance">
            Spotless homes,<br />
            <em className="text-primary not-italic">effortlessly</em> booked.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg text-balance">
            SparklePro pairs eco-friendly cleaners with a smart estimator that prices your job
            in 12 seconds. No phone calls. No surprise fees.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full h-11 md:h-12 px-5 md:px-6 text-sm md:text-base bg-foreground text-background hover:bg-foreground/90">
              <a href="#estimator"><Wand2 className="mr-2 h-4 w-4" /> Get instant quote</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-11 md:h-12 px-5 md:px-6 text-sm md:text-base border-foreground/20">
              <a href="#packages">See packages</a>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-2 md:pt-4">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-8 w-8 md:h-9 md:w-9 rounded-full border-2 border-background"
                  style={{ background: `oklch(${0.7 + i*0.04} 0.13 ${160 + i*15})` }} />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-accent-foreground">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current text-[color:var(--sun)]" />)}
                <span className="ml-1 font-semibold">4.9</span>
              </div>
              <div className="text-muted-foreground">from 4,200+ homes</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="absolute -inset-4 md:-inset-6 bg-gradient-hero rounded-[3rem] blur-3xl opacity-30" />
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-soft border border-border/50">
            <img
              src={heroImg}
              alt="Sparkling clean bright living room with sunlight and bubbles"
              width={1600}
              height={1200}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="hidden md:flex absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-card p-4 items-center gap-3 border border-border/50">
            <div className="h-10 w-10 rounded-full bg-mint flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm">
              <div className="font-semibold">100% Sparkle Guarantee</div>
              <div className="text-muted-foreground text-xs">Re-clean free within 24h</div>
            </div>
          </div>
          <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-accent rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-card rotate-3">
            <div className="font-display text-lg md:text-2xl text-accent-foreground">$129</div>
            <div className="text-xs text-accent-foreground/80">from / visit</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Eco-friendly products", "Background-checked teams", "Same-day booking", "No contracts", "Insured & bonded", "100% sparkle guarantee"];
  return (
    <div className="border-y border-border/60 bg-mint/30 py-4 overflow-hidden">
      <div className="flex gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items, ...items].map((it, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-medium text-deep">
            <Sparkles className="h-4 w-4 text-primary" /> {it}
          </div>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }`}</style>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="py-12 md:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <div className="text-xs md:text-sm uppercase tracking-widest text-primary font-semibold mb-2 md:mb-3">Services</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-balance max-w-2xl">
              Pick a clean. We handle the rest.
            </h2>
          </div>
          <p className="max-w-sm text-sm md:text-base text-muted-foreground">From a quick refresh to a full reset, every visit ends with a 50-point inspection.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {SERVICES.map((s, i) => (
            <div key={s.id} className="group relative rounded-3xl bg-card border border-border/60 p-7 hover:shadow-card transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground mb-6">
                <BrushCleaning className="h-5 w-5" />
              </div>
              <div className="text-xs text-muted-foreground mb-1">0{i+1}</div>
              <h3 className="font-display text-2xl mb-2">{s.name}</h3>
              <p className="text-sm text-muted-foreground">{s.blurb}</p>
              <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">from</span>
                <span className="font-display text-2xl">${Math.round(129 * s.mult)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section id="packages" className="py-12 md:py-16 px-4 md:px-6 bg-gradient-soft">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-14">
          <div className="text-xs md:text-sm uppercase tracking-widest text-primary font-semibold mb-2 md:mb-3">Packages</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-balance max-w-3xl mx-auto">
            Transparent pricing. <em className="text-primary">Zero</em> surprises.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {PACKAGES.map(p => (
            <div key={p.name}
              className={`relative rounded-3xl p-6 md:p-8 border transition-all ${
                p.highlight
                  ? "bg-deep text-background border-deep shadow-soft md:scale-[1.03]"
                  : "bg-card border-border/60 hover:shadow-card"
              }`}>
              {p.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground border-0 rounded-full">
                  ★ {p.tag}
                </Badge>
              )}
              <div className={`text-xs uppercase tracking-widest mb-2 ${p.highlight ? "text-background/60" : "text-muted-foreground"}`}>
                {!p.highlight && p.tag}
              </div>
              <h3 className={`font-display text-4xl mb-1 ${p.highlight ? "text-background" : ""}`}>{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-6xl">${p.price}</span>
                <span className={p.highlight ? "text-background/60" : "text-muted-foreground"}>/visit</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex gap-3 text-sm">
                    <Check className={`h-5 w-5 shrink-0 ${p.highlight ? "text-accent" : "text-primary"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className={`w-full rounded-full h-12 ${
                p.highlight
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}>
                <a href="#book">Choose {p.name}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type EstimateResult = {
  lowPrice: number;
  highPrice: number;
  estimatedHours: number;
  summary: string;
  breakdown: string[];
  recommendation: string;
};

function EstimatorSection() {
  const estimate = useServerFn(estimateCleaningCost);

  const [homeType, setHomeType] = useState("house");
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [sqft, setSqft] = useState(1800);
  const [serviceType, setServiceType] = useState("standard");
  const [frequency, setFrequency] = useState("biweekly");
  const [extras, setExtras] = useState<string[]>(["windows"]);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const localQuick = useMemo(() => {
    const svc = SERVICES.find(s => s.id === serviceType)!;
    const f = FREQ.find(x => x.id === frequency)!;
    const base = Math.max(120, sqft * 0.1) * svc.mult;
    const rooms = bedrooms * 15 + bathrooms * 25;
    const ext = extras.reduce((sum, id) => sum + (EXTRAS.find(e => e.id === id)?.price ?? 0), 0);
    return Math.round((base + rooms + ext) * (1 - f.discount));
  }, [serviceType, frequency, sqft, bedrooms, bathrooms, extras]);

  async function onEstimate() {
    setLoading(true);
    setResult(null);
    try {
      const r = await estimate({
        data: {
          homeType: HOME_TYPES.find(h => h.id === homeType)?.label ?? homeType,
          bedrooms, bathrooms, sqft,
          serviceType: SERVICES.find(s => s.id === serviceType)?.name ?? serviceType,
          frequency: FREQ.find(f => f.id === frequency)?.name ?? frequency,
          extras: extras.map(id => EXTRAS.find(e => e.id === id)?.label ?? id),
          notes,
        },
      });
      setResult(r as EstimateResult);
    } catch {
      toast.error("Couldn't generate estimate. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="estimator" className="py-12 md:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-6 md:gap-10 items-start">
        <div className="lg:sticky lg:top-24 space-y-4 md:space-y-6">
          <Badge className="rounded-full bg-accent text-accent-foreground border-0 px-3 py-1 text-xs md:text-sm">
            <Wand2 className="h-3 w-3 mr-1" /> AI Cost Estimator
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl leading-[1] text-balance">
            A real quote, <em className="text-primary">written by AI,</em> in seconds.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-md">
            Our model studies thousands of past jobs in your area and gives you a fair price range,
            estimated hours, and a personalized recommendation.
          </p>
          <div className="relative rounded-3xl overflow-hidden border border-border/60">
            <img src={bubblesImg} alt="Soap bubbles" loading="lazy" width={1200} height={900}
              className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent" />
            <div className="absolute bottom-5 left-5 text-background">
              <div className="font-display text-3xl">${localQuick}</div>
              <div className="text-xs opacity-80">live quick estimate</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl md:rounded-3xl bg-card border border-border/60 p-5 md:p-8 shadow-card space-y-5 md:space-y-6">
          <div className="space-y-2 md:space-y-3">
            <Label className="text-sm">Home type</Label>
            <div className="grid grid-cols-3 gap-2">
              {HOME_TYPES.map(h => {
                const Icon = h.icon;
                const active = homeType === h.id;
                return (
                  <button key={h.id} onClick={() => setHomeType(h.id)}
                    className={`rounded-xl md:rounded-2xl border p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 transition-all ${
                      active ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                    }`}>
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-xs md:text-sm font-medium">{h.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2 md:space-y-3">
              <Label className="text-sm">Bedrooms: <span className="font-bold">{bedrooms}</span></Label>
              <Slider value={[bedrooms]} min={0} max={8} step={1} onValueChange={v => setBedrooms(v[0])} />
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label className="text-sm">Bathrooms: <span className="font-bold">{bathrooms}</span></Label>
              <Slider value={[bathrooms]} min={0} max={6} step={1} onValueChange={v => setBathrooms(v[0])} />
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <Label className="text-sm">Square footage: <span className="font-bold">{sqft.toLocaleString()}</span></Label>
            <Slider value={[sqft]} min={400} max={6000} step={100} onValueChange={v => setSqft(v[0])} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Service</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SERVICES.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FREQ.map(f => <SelectItem key={f.id} value={f.id}>{f.name}{f.discount ? ` (-${f.discount*100}%)` : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <Label className="text-sm">Add-ons</Label>
            <div className="grid grid-cols-2 gap-2">
              {EXTRAS.map(e => {
                const active = extras.includes(e.id);
                return (
                  <label key={e.id}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 cursor-pointer transition ${
                      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}>
                    <span className="flex items-center gap-2 text-sm">
                      <Checkbox checked={active} onCheckedChange={(v) => {
                        setExtras(v ? [...extras, e.id] : extras.filter(x => x !== e.id));
                      }} />
                      {e.label}
                    </span>
                    <span className="text-xs text-muted-foreground">+${e.price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Anything we should know? (optional)</Label>
            <Textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. two cats, hardwood floors, paint job last week" className="rounded-xl resize-none" />
          </div>

          <Button onClick={onEstimate} disabled={loading}
            className="w-full h-14 rounded-2xl text-base bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-soft">
            {loading
              ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Calculating estimate…</>
              : <><Wand2 className="mr-2 h-5 w-5" /> Get my estimate</>}
          </Button>

          {result && (
            <div className="rounded-2xl bg-gradient-soft border border-border/60 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary font-semibold">Estimate</div>
                  <div className="font-display text-5xl">${result.lowPrice}–${result.highPrice}</div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  ~{result.estimatedHours} hrs<br />of cleaning
                </div>
              </div>
              <p className="text-sm">{result.summary}</p>
              <ul className="space-y-1.5 text-sm">
                {result.breakdown.map((b, i) => (
                  <li key={i} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {b}</li>
                ))}
              </ul>
              <div className="rounded-xl bg-accent/40 p-3 text-sm">
                <span className="font-semibold">Tip: </span>{result.recommendation}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pkg, setPkg] = useState("Sparkle");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !date) {
      toast.error("Please fill in your name, email and a preferred date.");
      return;
    }
    toast.success("Booking received! We'll confirm via email in under 15 minutes.");
  }

  return (
    <section id="book" className="py-12 md:py-16 px-4 md:px-6 bg-deep text-background relative overflow-hidden">
      <div className="hidden md:block absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="hidden md:block absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="mx-auto max-w-7xl relative grid lg:grid-cols-5 gap-6 md:gap-10 items-start">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Badge className="rounded-full bg-background/10 text-background border-0 text-xs md:text-sm">
            <Calendar className="h-3 w-3 mr-1" /> Online Booking
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl leading-[1] text-balance">
            Pick a day. <em className="text-accent">We'll bring</em> the sparkle.
          </h2>
          <p className="text-background/70 max-w-md text-sm md:text-base">
            Real human confirmation in under 15 minutes. Reschedule any time, no fees.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-sm pt-2 md:pt-4">
            <Stat n="4.2k+" l="Happy homes" />
            <Stat n="15 min" l="Confirmation" />
            <Stat n="50pt" l="Inspection" />
            <Stat n="24h" l="Re-clean window" />
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-3 bg-background text-foreground rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-soft space-y-4 md:space-y-5">
          <Tabs value={pkg} onValueChange={setPkg}>
            <TabsList className="grid grid-cols-3 w-full rounded-xl">
              {PACKAGES.map(p => <TabsTrigger key={p.name} value={p.name} className="rounded-lg text-xs md:text-sm">{p.name}</TabsTrigger>)}
            </TabsList>
            {PACKAGES.map(p => (
              <TabsContent key={p.name} value={p.name} className="text-xs md:text-sm text-muted-foreground pt-3">
                Starting at <span className="font-display text-foreground text-lg md:text-xl">${p.price}</span> · {p.features[0]}
              </TabsContent>
            ))}
          </Tabs>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            <Field label="Full name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" className="rounded-xl h-11" /></Field>
            <Field label="Email"><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@email.com" className="rounded-xl h-11" /></Field>
            <Field label="Phone"><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 010-2010" className="rounded-xl h-11" /></Field>
            <Field label="Address"><Input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Maple St" className="rounded-xl h-11" /></Field>
            <Field label="Preferred date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl h-11" /></Field>
            <Field label="Arrival window">
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Pick a time" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8am – 11am)</SelectItem>
                  <SelectItem value="midday">Midday (11am – 2pm)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (2pm – 5pm)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-base bg-foreground text-background hover:bg-foreground/90">
            Confirm booking <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> Insured, bonded, and backed by our Sparkle Guarantee.
          </div>
        </form>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl bg-background/5 border border-background/10 p-4">
      <div className="font-display text-3xl">{n}</div>
      <div className="text-xs text-background/70">{l}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="py-12 md:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-10 mb-8 md:mb-14">
          <div className="lg:col-span-2">
            <div className="text-xs md:text-sm uppercase tracking-widest text-primary font-semibold mb-2 md:mb-3">Reviews</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-balance">
              4,200 homes. <em className="text-primary">One</em> very high standard.
            </h2>
          </div>
          <div className="rounded-2xl md:rounded-3xl bg-mint/40 p-5 md:p-6 border border-border/40">
            <div className="flex items-center gap-1 text-accent-foreground mb-2 md:mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 md:h-6 md:w-6 fill-current text-[color:var(--sun)]" />)}
            </div>
            <div className="font-display text-3xl md:text-5xl">4.9 / 5</div>
            <div className="text-xs md:text-sm text-muted-foreground">Average across Google, Yelp, and Thumbtack</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {REVIEWS.map(r => (
            <div key={r.name} className="rounded-3xl bg-card border border-border/60 p-6 hover:shadow-card transition">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(r.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current text-[color:var(--sun)]" />)}
              </div>
              <p className="text-sm mb-5">"{r.text}"</p>
              <div className="text-sm font-semibold">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.role}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-16 grid lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <div className="rounded-2xl md:rounded-3xl overflow-hidden max-h-[400px]">
            <img src={teamImg} alt="The SparklePro team" loading="lazy" width={1200} height={1200} className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl md:rounded-3xl bg-gradient-soft p-6 md:p-10 border border-border/60 flex flex-col justify-center gap-4 md:gap-5">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h3 className="font-display text-2xl md:text-4xl">Trained humans. Eco supplies. Real accountability.</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Every SparklePro cleaner is W-2, background-checked, and trained for 40 hours before
              their first solo visit. We use only plant-based, child-and-pet-safe products.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm md:text-base">
                <a href="#book">Book your first clean</a>
              </Button>
              <Button asChild variant="outline" className="rounded-full text-sm md:text-base">
                <a href="tel:+18005550100"><Phone className="h-4 w-4 mr-2" /> (800) 555-0100</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-6 md:py-10 px-4 md:px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-display text-base md:text-lg text-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> SparklePro Cleaning
        </div>
        <div>© {new Date().getFullYear()} SparklePro. Insured · Bonded · 100% Sparkle Guarantee.</div>
      </div>
    </footer>
  );
}
