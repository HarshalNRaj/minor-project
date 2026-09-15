import { ArrowRight, Droplet, Package, Siren, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

const FLOW = [
  { n: "01", label: "Resource", detail: "An item, a meal, a unit of blood, or a need is listed." },
  { n: "02", label: "Need", detail: "The platform matches it against someone who's asked." },
  { n: "03", label: "Connection", detail: "A volunteer, donor, or organization steps in." },
  { n: "04", label: "Impact", detail: "Completion is logged — for real, on the dashboard." },
];

const MODULES = [
  { icon: Package, title: "Donate & reuse", body: "Clothes, electronics, furniture, books — matched to someone nearby who needs them." },
  { icon: UtensilsCrossed, title: "Food rescue", body: "Surplus from restaurants and events, routed to NGOs before it goes to waste." },
  { icon: Droplet, title: "Blood coordination", body: "Requesters, registered donors, and blood banks — one open board, not scattered appeals." },
  { icon: Siren, title: "Emergency support", body: "Shelter, transport, supplies, volunteers — raised with urgency, tracked to closure." },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-paper">
      <div className="bg-ink px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-primary-50 md:text-xs">
        Free community sharing is now live in your area
      </div>
      <header className="border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <nav className="hidden gap-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-soft md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-primary-500">How it works</a>
            <a href="#modules" className="transition-colors hover:text-primary-500">Explore</a>
          </nav>
          <Link to="/" className="font-display text-3xl italic text-ink transition-transform hover:scale-105">resqlink</Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-soft transition-colors hover:text-primary-500 sm:block">Sign in</Link>
            <Link to="/register" className="rounded-full border border-ink/30 px-4 py-2 text-xs font-semibold transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white">Join us</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-24 text-center md:pt-32">
          <p className="editorial-rule animate-rise-in text-xs font-semibold uppercase tracking-[0.35em] text-primary-500">Join the movement</p>
          <h1 className="mx-auto mt-10 max-w-4xl animate-rise-in animate-rise-in-delay-1 font-display text-6xl leading-[0.92] text-ink md:text-8xl">
            Empowering neighbors
            <br />
            through shared
            <br />
            <span className="italic text-primary-500">resources.</span>
          </h1>
          <p className="mx-auto mt-9 max-w-xl animate-rise-in animate-rise-in-delay-2 text-base leading-7 text-ink-soft md:text-lg">
            A thoughtful way to give what you can, find what you need, and turn everyday
            generosity into visible community impact.
          </p>
          <div className="mt-10 flex animate-rise-in animate-rise-in-delay-3 flex-wrap justify-center gap-3">
            <Link to="/register" className="rounded-full bg-primary-500 px-7 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-1 hover:bg-primary-600 hover:shadow-lg">Create your account <ArrowRight className="ml-2 inline" size={16} /></Link>
            <Link to="/login" className="rounded-full border border-ink/30 px-7 py-3 text-sm font-semibold text-ink transition-all hover:-translate-y-1 hover:border-primary-500 hover:text-primary-500">I already have one</Link>
          </div>
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="absolute -left-5 top-12 h-24 w-24 rounded-full bg-primary-100/60 blur-2xl animate-drift" />
            <div className="absolute -right-5 bottom-5 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl animate-drift" />
            <div id="how-it-works" className="relative grid gap-px overflow-hidden rounded-2xl border border-line bg-line text-left shadow-[0_24px_80px_rgba(66,39,25,0.12)] sm:grid-cols-4">
              {FLOW.map((step, i) => (
                <div key={step.n} className="bg-surface p-6 transition-colors hover:bg-primary-50">
                  <span className="font-stat text-xs text-primary-500">0{i + 1}</span>
                  <p className="mt-10 font-display text-xl text-ink">{step.label}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">One platform</p>
              <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Many ways to make a difference.</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map(({ icon: Icon, title, body }, index) => (
              <div key={title} className="editorial-card rounded-2xl border border-line bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Icon size={20} />
              </div>
                <p className="mt-8 text-xs font-semibold text-primary-500">0{index + 1}</p>
                <h3 className="mt-2 font-display text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl bg-ink px-8 py-12 text-primary-50 md:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-100">A connected neighborhood</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Small actions. Shared impact.</h2>
          <p className="mt-4 max-w-xl text-primary-100/80">
            General users, donors, volunteers, NGOs, blood banks, and administrators each
            get their own dashboard — role-based access, not one screen trying to be everything.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["General user", "Donor", "Volunteer", "NGO", "Blood bank", "Admin"].map((r) => (
              <span key={r} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium">{r}</span>
            ))}
          </div>
          </div>
        </section>

        <footer className="mx-auto max-w-7xl px-6 py-14 text-center text-xs uppercase tracking-[0.25em] text-ink-soft">
          ResQLink — built for a smaller, more accountable set of promises kept.
        </footer>
      </main>
    </div>
  );
}
