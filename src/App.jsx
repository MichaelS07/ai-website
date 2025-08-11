import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Sparkles, Search, ArrowRight, Github, Twitter, Mail, SlidersHorizontal, ChevronLeft, Tag, Command, BookOpen } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

/* === your POSTS + TAGS data exactly as you had it === */
const TAGS = ["How-To","News","Releases","Tips","Opinion","Benchmarks","Agents","Ethics","Tools"];
const POSTS = [
  {
    id: "gpt5-first-look",
    title: "GPT-5 First Look: What Changed & Why It Matters",
    excerpt:
      "Hands-on impressions, breaking changes, and practical advice on when to adopt—and when to wait.",
    cover:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    tags: ["News", "Releases", "Benchmarks"],
    date: "2025-08-09",
    read: 7,
    body: `## TL;DR
GPT-5 feels like a platform, not a model. Reasoning is up, latency is down, and context windows finally feel roomy enough for real work.

### Key shifts
- **Reasoning**: More consistent multi-step outputs.
- **Latency**: Snappier first token, better streaming.
- **Reliability**: Fewer derailments, better fallbacks.

### Should you upgrade today?
If you build agentic workflows or do heavy research summarization, yes. For lightweight chat or content, test side-by-side first.

> Pro tip: keep your 4.x prompts—then A/B test with a "thin" 5.x system message before porting everything.`,
  },
  {
    id: "agents-field-guide",
    title: "Agentic Systems: A Field Guide for Busy Teams",
    excerpt:
      "Cut through the hype. Here’s a sane blueprint for agents that actually ship and don’t torch your cloud bill.",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
    tags: ["How-To", "Agents", "Tools"],
    date: "2025-08-07",
    read: 10,
    body: `## What makes an agent useful?
1. A bounded job.
2. A crisp success signal.
3. Cheap, trustworthy tools.

### Architecture
- **Planner** → **Tooling** → **Memory** → **Checker**.
- Kill loops early; reward finishing.

### Avoid
- Open-ended agents with no KPIs.
- Tool sprawl.

> Start boring: cron + webhook often beats a "smart" agent.`,
  },
  {
    id: "model-smackdown",
    title: "Model Smackdown: GPT-5 vs Gemini vs Claude vs Llama",
    excerpt:
      "We ran a clean bake-off across coding, search, and long-context tasks. Here’s what surprised us.",
    cover:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
    tags: ["Benchmarks", "Opinion", "Releases"],
    date: "2025-08-06",
    read: 8,
    body: `## Headline findings
- Claudes still best at tone control.
- GPT-5 wins on tool use + speed.
- Gemini is closing on research tasks.
- Llama shines when fine-tuned on niche data.

### Method
Same prompts, temperature 0.2, 5 seeds, human eval + rubric.

> Benchmarks are a compass, not a map. Re-test monthly.`,
  },
  {
    id: "prompt-toolbox",
    title: "Your Prompting Toolbox for 2025",
    excerpt:
      "Small tricks that stack: role compression, sandwich prompts, and structured outputs that never break.",
    cover:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1600&auto=format&fit=crop",
    tags: ["Tips", "How-To"],
    date: "2025-08-02",
    read: 6,
    body: `## Patterns that still work
- **JSON first**.
- Few shot > many shot.
- Explain the grader.

### Anti-patterns
- Hidden constraints.
- Monster system prompts.

> Guardrails beat hope.`,
  },
];

const classNames = (...c) => c.filter(Boolean).join(" ");
function useKey(key, handler) {
  React.useEffect(() => {
    const onKey = (e) => {
      if ((key === "k" && (e.key.toLowerCase() === "k") && (e.metaKey || e.ctrlKey)) || e.key === key) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, handler]);
}

function NeonBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_30%_-20%,rgba(56,189,248,0.25),transparent_60%),radial-gradient(900px_circle_at_80%_10%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(700px_circle_at_70%_80%,rgba(59,130,246,0.18),transparent_60%)]" />
      <div className="absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <svg className="w-full h-full animate-[pulse_8s_ease-in-out_infinite]" xmlns="http://www.w3.org/200/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect fill="url(#grid)" width="100%" height="100%" />
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent blur-2xl" />
    </div>
  );
}

function CommandPalette({ open, onClose, onOpenArticle }) {
  const [q, setQ] = useState("");
  const results = React.useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return POSTS;
    return POSTS.filter((p) =>
      [p.title, p.excerpt, ...(p.tags || [])].join(" ").toLowerCase().includes(n)
    );
  }, [q]);
  useKey("Escape", () => open && onClose());
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/90 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
              <Command className="w-4 h-4 text-cyan-300" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts, tags, topics…" className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none" />
              <kbd className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-400">esc</kbd>
            </div>
            <div className="max-h-[60vh] overflow-auto p-2">
              {results.length === 0 && <div className="p-6 text-center text-slate-400">No results. Try another term.</div>}
              <ul className="space-y-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <button onClick={() => { onOpenArticle(p.id); onClose(); }} className="group w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left hover:border-cyan-500/40 hover:bg-slate-900/80">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-slate-100 group-hover:text-white">{p.title}</h4>
                          <p className="mt-1 line-clamp-1 text-sm text-slate-400">{p.excerpt}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-300" />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {p.tags.map((t) => (
                          <span key={t} className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-400">#{t}</span>
                        ))}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavBar({ onOpenPalette }) {
  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 12 }} className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 shadow-lg">
              <Cpu className="h-4 w-4 text-slate-900" />
            </motion.div>
            <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-tr from-cyan-400/30 to-violet-500/30 blur-lg" />
          </div>
          <span className="text-sm font-semibold tracking-widest text-slate-100">NEON.AI</span>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#blog" className="text-sm text-slate-300 hover:text-white">Blog</a>
          <a href="#compare" className="text-sm text-slate-300 hover:text-white">Compare</a>
          <a href="#about" className="text-sm text-slate-300 hover:text-white">About</a>
          <a href="#subscribe" className="text-sm text-slate-300 hover:text-white">Subscribe</a>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenPalette} className="group inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 hover:border-cyan-500/50">
            <Search className="h-4 w-4 text-slate-400 group-hover:text-cyan-300" />
            Quick Search
            <kbd className="ml-2 rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">⌘K</kbd>
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-12">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-900/50 px-3 py-1 text-xs text-cyan-200">
            <Sparkles className="h-3 w-3" />
            Future-leaning AI reporting
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
            Practical AI news, hands-on guides, and no-BS model comparisons
          </h1>
          <p className="mt-4 text-slate-300">
            Daily coverage that favors signal over noise. We ship tutorials, breakdowns, and measured takes on the tools that actually move the needle.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#blog" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 px-4 py-2 font-medium text-slate-900 shadow-lg hover:shadow-cyan-500/30">
              Read the blog <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#compare" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-200 hover:border-cyan-500/40">
              Compare models <SlidersHorizontal className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/60 shadow-2xl">
            <AnimatedTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedTerminal() {
  const lines = [
    "> booting neon.ai …",
    "✓ connected to vector store",
    "✓ loaded tools: web.run, code.run, fetch.api",
    "> ask: compare gpt-5 vs claude-sonnet on long context",
    "# result: gpt-5 faster first token, sonnet tighter style",
  ];
  const [i, setI] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % (lines.length + 4)), 1600);
    return () => clearInterval(t);
  }, []);
    return (
    <div className="h-64 w-full bg-slate-950/70 p-4 font-mono text-[12px] text-slate-300">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500/70" />
        <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
        <div className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-auto text-slate-500">neon-shell</span>
      </div>
      <div className="space-y-1">
        {lines.slice(0, i).map((l, idx) => (
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap">
            {l}
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="h-4 w-24 rounded bg-cyan-500/20"
        />
      </div>
    </div>
  );
}

function FilterBar({ active, setActive }) {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mt-10 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-widest text-slate-400">Filter:</span>
        {["All", ...TAGS].map((t) => (
          <button key={t} onClick={() => setActive(t)} className={classNames("rounded-full border px-3 py-1 text-xs", active === t ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-200" : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600")}>
            <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BlogGrid({ onOpenArticle, activeTag }) {
  const items = React.useMemo(() => {
    const base = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (!activeTag || activeTag === "All") return base;
    return base.filter((p) => p.tags.includes(activeTag));
  }, [activeTag]);

  return (
    <section id="blog" className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Latest from the blog</h2>
        <div className="text-sm text-slate-400">{items.length} posts</div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, idx) => (
          <motion.article key={p.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }} className="group overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/60 backdrop-blur-md">
            <div className="relative">
              <img src={p.cover} alt="" className="h-44 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="absolute left-3 top-3 flex gap-2">
                {p.tags.slice(0, 2).map((t) => (
                  <span key={t} className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-200">{t}</span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-400">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{new Date(p.date).toLocaleDateString()}</span>
                <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" />{p.read} min</span>
              </div>
              <button onClick={() => onOpenArticle(p.id)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-500/50">
                Read article <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ArticleView({ post, onBack }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-slate-300 hover:text-white">
        <ChevronLeft className="h-4 w-4" /> Back to posts
      </button>
      <h1 className="text-3xl font-extrabold text-white md:text-4xl">{post.title}</h1>
      <div className="mt-2 text-sm text-slate-400">
        {new Date(post.date).toLocaleDateString()} • {post.read} min read
      </div>
      <img src={post.cover} alt="" className="mt-6 h-64 w-full rounded-2xl object-cover" />
      <article className="prose prose-invert mt-6 max-w-none">
        {post.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
      </article>
      <div className="mt-8 flex flex-wrap gap-2">
        {post.tags.map((t) => <span key={t} className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300">#{t}</span>)}
      </div>
    </section>
  );
}

function ModelCompare() {
  const [weights, setWeights] = useState({ reasoning: 0.9, speed: 0.85, coding: 0.8, writing: 0.8, longContext: 0.75, toolUse: 0.9 });
  const data = React.useMemo(() => {
    const base = {
      gpt5: { reasoning: 0.93, speed: 0.9, coding: 0.9, writing: 0.83, longContext: 0.85, toolUse: 0.95 },
      claude: { reasoning: 0.9, speed: 0.8, coding: 0.78, writing: 0.92, longContext: 0.88, toolUse: 0.82 },
      gemini: { reasoning: 0.86, speed: 0.82, coding: 0.76, writing: 0.8, longContext: 0.84, toolUse: 0.8 },
      llama: { reasoning: 0.75, speed: 0.78, coding: 0.74, writing: 0.72, longContext: 0.7, toolUse: 0.68 },
    };
    const fields = Object.keys(weights);
    const score = (m) => (fields.reduce((acc, f) => acc + base[m][f] * weights[f], 0) / fields.length) * 100;
    return [
      { subject: "Reasoning", gpt5: base.gpt5.reasoning * 100, claude: base.claude.reasoning * 100, gemini: base.gemini.reasoning * 100, llama: base.llama.reasoning * 100 },
      { subject: "Speed", gpt5: base.gpt5.speed * 100, claude: base.claude.speed * 100, gemini: base.gemini.speed * 100, llama: base.llama.speed * 100 },
      { subject: "Coding", gpt5: base.gpt5.coding * 100, claude: base.claude.coding * 100, gemini: base.gemini.coding * 100, llama: base.llama.coding * 100 },
      { subject: "Writing", gpt5: base.gpt5.writing * 100, claude: base.claude.writing * 100, gemini: base.gemini.writing * 100, llama: base.llama.writing * 100 },
      { subject: "Long Ctx", gpt5: base.gpt5.longContext * 100, claude: base.claude.longContext * 100, gemini: base.gemini.longContext * 100, llama: base.llama.longContext * 100 },
      { subject: "Tool Use", gpt5: base.gpt5.toolUse * 100, claude: base.claude.toolUse * 100, gemini: base.gemini.toolUse * 100, llama: base.llama.toolUse * 100 },
      { subject: "Overall", gpt5: score("gpt5"), claude: score("claude"), gemini: score("gemini"), llama: score("llama") },
    ];
  }, [weights]);

  return (
    <section id="compare" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Model comparison playground</h2>
        <div className="text-sm text-slate-400">Drag sliders to change weighting</div>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4 lg:col-span-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8" }} />
                <PolarRadiusAxis angle={45} domain={[0, 100]} tick={{ fill: "#64748b" }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }} />
                <Radar name="GPT-5" dataKey="gpt5" fill="#22d3ee" fillOpacity={0.35} stroke="#22d3ee" />
                <Radar name="Claude" dataKey="claude" fill="#a78bfa" fillOpacity={0.25} stroke="#a78bfa" />
                <Radar name="Gemini" dataKey="gemini" fill="#60a5fa" fillOpacity={0.25} stroke="#60a5fa" />
                <Radar name="Llama" dataKey="llama" fill="#f472b6" fillOpacity={0.2} stroke="#f472b6" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries({
            reasoning: "Multi-step reasoning",
            speed: "Latency / throughput",
            coding: "Code generation",
            writing: "Writing quality",
            longContext: "Long context",
            toolUse: "Tool use / API calls",
          }).map(([k, label]) => (
            <div key={k} className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                <span>{label}</span>
                <span className="text-slate-400">{Math.round(weights[k] * 100)}%</span>
              </div>
              <input type="range" min={0.4} max={1} step={0.01} value={weights[k]} onChange={(e) => setWeights((w) => ({ ...w, [k]: parseFloat(e.target.value) }))} className="w-full accent-cyan-400" />
            </div>
          ))}
          <p className="text-xs text-slate-500">These are illustrative scores for demo purposes. Replace with your evaluations or live benchmark data.</p>
        </div>
      </div>
    </section>
  );
}

function Subscribe() {
  return (
    <section id="subscribe" className="mx-auto max-w-7xl px-4 pb-16">
      <div className="grid gap-8 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-bold text-white">Stay current without the noise</h3>
          <p className="mt-2 text-slate-300">Get a concise morning brief + weekly deep dives. No spam, no fluff—unsubscribe anytime.</p>
          <form className="mt-4 flex max-w-md gap-2">
            <input type="email" placeholder="you@domain.com" className="flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500" />
            <button className="rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 px-4 py-2 font-medium text-slate-900">Subscribe</button>
          </form>
          <p className="mt-2 text-xs text-slate-500">We’ll never sell your data.</p>
        </div>
        <div className="rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4">
          <h4 className="font-semibold text-slate-100">What you’ll get</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            <li>Actionable how-tos with code + prompts</li>
            <li>Honest model comparisons (no pay-to-play)</li>
            <li>Weekly roundup of real-world AI wins</li>
            <li>Occasional hot takes with receipts</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="text-sm text-slate-400">© {new Date().getFullYear()} NEON.AI — Built with ❤️, caffeine, and curiosity.</div>
        <div className="flex items-center gap-4 text-slate-300">
          <a className="hover:text-white" href="#"><Twitter className="h-4 w-4" /></a>
          <a className="hover:text-white" href="#"><Github className="h-4 w-4" /></a>
          <a className="hover:text-white" href="mailto:hello@neon.ai"><Mail className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeTag, setActiveTag] = useState("All");
  const [articleId, setArticleId] = useState(null);
  const post = React.useMemo(() => POSTS.find((p) => p.id === articleId), [articleId]);
  useKey("k", () => setPaletteOpen(true));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <NeonBackground />
      <NavBar onOpenPalette={() => setPaletteOpen(true)} />
      <Hero />
      {!post ? (
        <>
          <FilterBar active={activeTag} setActive={setActiveTag} />
          <BlogGrid activeTag={activeTag} onOpenArticle={setArticleId} />
          <ModelCompare />
          <Subscribe />
        </>
      ) : (
        <ArticleView post={post} onBack={() => setArticleId(null)} />
      )}
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onOpenArticle={setArticleId} />
    </main>
  );
}
