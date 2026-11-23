"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Models } from "appwrite";
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  PanelsTopLeft,
  Users,
  ExternalLink,
  Star,
  ClipboardCheck,
} from "lucide-react";
import { account, errorMessage, teams } from "@/lib/appwrite/browser";
import { ADMIN_TEAM } from "@/lib/appwrite/config";
import { cn } from "@/lib/cn";
import { Btn, Field, TextInput, ToastProvider } from "./ui";

type AuthState = { user: Models.User<Models.Preferences> | null; isAdmin: boolean; loading: boolean; refresh: () => Promise<void> };
const Ctx = createContext<AuthState>({ user: null, isAdmin: false, loading: true, refresh: async () => {} });
export const useAuth = () => useContext(Ctx);

const PUBLIC_ADMIN_PAGES = ["/admin/invitation", "/admin/reinitialiser"];

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/contenus", label: "Textes des pages", icon: PanelsTopLeft },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/livres", label: "Livres", icon: BookOpen },
  { href: "/admin/avis", label: "Avis à valider", icon: Star },
  { href: "/admin/temoignages", label: "Témoignages & vidéos", icon: MessageSquareQuote },
  { href: "/admin/tests", label: "Tests & quiz", icon: ClipboardCheck },
  { href: "/admin/medias", label: "Médias", icon: ImageIcon },
  { href: "/admin/abonnes", label: "Abonnés", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminApp({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<Omit<AuthState, "refresh">>({ user: null, isAdmin: false, loading: true });

  const refresh = useCallback(async () => {
    try {
      const user = await account.get();
      let isAdmin = false;
      try {
        const t = await teams.list();
        isAdmin = t.teams.some((x) => x.$id === ADMIN_TEAM);
      } catch {}
      setState({ user, isAdmin, loading: false });
    } catch {
      setState({ user: null, isAdmin: false, loading: false });
    }
  }, []);

  useEffect(() => {
    // Lecture de la session Appwrite (système externe) au montage
    const id = setTimeout(refresh, 0);
    return () => clearTimeout(id);
  }, [refresh]);

  const isPublic = PUBLIC_ADMIN_PAGES.some((p) => pathname.startsWith(p));
  let body: React.ReactNode;
  if (isPublic) body = <Centered>{children}</Centered>;
  else if (state.loading) body = <Centered><p className="text-sm text-muted">Chargement…</p></Centered>;
  else if (!state.user) body = <Centered><Login onDone={refresh} /></Centered>;
  else if (!state.isAdmin)
    body = (
      <Centered>
        <p className="text-sm text-muted">Le compte {state.user.email} n’a pas les droits d’administration.</p>
        <Btn variant="secondary" className="mt-4" onClick={async () => { await account.deleteSession({ sessionId: "current" }); refresh(); }}>Se déconnecter</Btn>
      </Centered>
    );
  else body = <Shell email={state.user.email} onLogout={async () => { await account.deleteSession({ sessionId: "current" }); refresh(); }}>{children}</Shell>;

  return (
    <Ctx.Provider value={{ ...state, refresh }}>
      <ToastProvider>{body}</ToastProvider>
    </Ctx.Provider>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud p-6">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-soft">
        <p className="display text-2xl text-navy-deep">Yao Avevor<span className="text-blue-bright">.</span></p>
        <p className="label-caps mt-1 text-muted">Administration</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [msg, setMsg] = useState<{ text: string; ok?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "login") {
        await account.createEmailPasswordSession({ email, password });
        onDone();
      } else {
        await account.createRecovery({ email, url: `${window.location.origin}/admin/reinitialiser` });
        setMsg({ text: "Si ce compte existe, un email de réinitialisation vient d’être envoyé.", ok: true });
      }
    } catch (err) {
      setMsg({ text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email">
        <TextInput type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      {mode === "login" && (
        <Field label="Mot de passe">
          <TextInput type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
      )}
      {msg && <p className={cn("text-sm", msg.ok ? "text-blue" : "text-[#9b1c1c]")}>{msg.text}</p>}
      <Btn type="submit" disabled={busy} className="w-full">
        {busy ? "…" : mode === "login" ? "Se connecter" : "Recevoir le lien"}
      </Btn>
      <button type="button" onClick={() => { setMode(mode === "login" ? "forgot" : "login"); setMsg(null); }} className="block w-full text-center text-sm text-muted underline">
        {mode === "login" ? "Mot de passe oublié / première connexion" : "Retour à la connexion"}
      </button>
    </form>
  );
}

function Shell({ children, email, onLogout }: { children: React.ReactNode; email: string; onLogout: () => void }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-cloud lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-navy-deep text-white lg:sticky lg:top-0 lg:h-screen lg:border-0">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link href="/admin" className="display text-xl">Yao Avevor<span className="text-sky">.</span></Link>
          <p className="label-caps mt-1 hidden text-mist lg:block">Administration</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "bg-white text-navy-deep" : "text-white/80 hover:bg-white/10")}>
                <Icon strokeWidth={1.75} className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden space-y-2 px-5 pt-8 text-xs text-mist lg:block">
          <a href="/" target="_blank" className="flex items-center gap-2 hover:text-white"><ExternalLink className="size-3.5" /> Voir le site</a>
          <p className="truncate">{email}</p>
          <button type="button" onClick={onLogout} className="flex items-center gap-2 hover:text-white"><LogOut className="size-3.5" /> Se déconnecter</button>
        </div>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
