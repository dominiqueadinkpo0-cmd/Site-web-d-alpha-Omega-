import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListProjects,
  useListAppointments,
  useListContacts,
  useUpdateProjectStatus,
  useGetStats,
  getListProjectsQueryKey,
  getListAppointmentsQueryKey,
  getListContactsQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, Users, Calendar, MessageSquare,
  ChevronDown, ExternalLink, Lock, Eye, EyeOff,
  TrendingUp, Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const ADMIN_PASSWORD = "alphaomega2024";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Nouveau", color: "bg-blue-50 text-blue-700 border-blue-100" },
  contacted: { label: "Contacté", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  in_progress: { label: "En cours", color: "bg-purple-50 text-purple-700 border-purple-100" },
  closed: { label: "Clôturé", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  visio: "Visioconférence",
  phone: "Téléphone",
  in_person: "Présentiel",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? STATUS_LABELS.new;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.color}`}>
      {s.label}
    </span>
  );
}

type Tab = "overview" | "projects" | "appointments" | "contacts";

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: projects = [] } = useListProjects();
  const { data: appointments = [] } = useListAppointments();
  const { data: contacts = [] } = useListContacts();
  const { data: stats } = useGetStats();
  const updateStatus = useUpdateProjectStatus();

  function handleStatusChange(id: number, status: string) {
    setUpdatingId(id);
    updateStatus.mutate(
      { id, data: { status: status as "new" | "contacted" | "in_progress" | "closed" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          setUpdatingId(null);
        },
        onError: () => setUpdatingId(null),
      }
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; count?: number }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "projects", label: "Projets", icon: Users, count: projects.length },
    { id: "appointments", label: "Rendez-vous", icon: Calendar, count: appointments.length },
    { id: "contacts", label: "Messages", icon: MessageSquare, count: contacts.length },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top bar */}
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-heading font-bold text-foreground">α</span>
          <div>
            <span className="font-heading font-semibold text-foreground">Alpha Oméga Digital</span>
            <span className="ml-2 text-xs font-medium text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" className="rounded-full text-sm h-9 px-4">
            <ExternalLink className="w-3.5 h-3.5 mr-2" /> Voir le site
          </Button>
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-56 min-h-[calc(100vh-65px)] bg-white border-r border-border p-4 sticky top-[65px] self-start">
          <ul className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setTab(t.id)}
                    data-testid={`tab-${t.id}`}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      tab === t.id
                        ? "bg-foreground text-white"
                        : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </span>
                    {t.count !== undefined && (
                      <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold ${
                        tab === t.id ? "bg-white/20 text-white" : "bg-gray-100 text-muted-foreground"
                      }`}>
                        {t.count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8 min-w-0">
          <AnimatePresence mode="wait">

            {/* Overview */}
            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <h1 className="text-2xl font-heading font-bold mb-2">Vue d'ensemble</h1>
                <p className="text-muted-foreground mb-8">Tableau de bord Alpha Oméga Digital®</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Projets total", value: projects.length, icon: Users, sub: `${projects.filter(p => p.status === "new").length} nouveaux` },
                    { label: "Rendez-vous", value: appointments.length, icon: Calendar, sub: `${appointments.filter(a => a.status === "pending").length} en attente` },
                    { label: "Messages", value: contacts.length, icon: MessageSquare, sub: "messages reçus" },
                    { label: "Heures dev", value: stats?.totalHours ?? "—", icon: TrendingUp, sub: "heures cumulées" },
                  ].map(({ label, value, icon: Icon, sub }) => (
                    <div key={label} className="bg-white rounded-2xl border border-border p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                        <Icon className="w-4 h-4 text-muted-foreground/50" />
                      </div>
                      <p className="text-3xl font-heading font-bold text-foreground mb-1">{value}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Recent projects */}
                <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-heading font-semibold">Projets récents</h2>
                    <button onClick={() => setTab("projects")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Voir tout →
                    </button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dossier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Entreprise</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {projects.slice(0, 5).map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm font-medium">{p.projectNumber}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{p.companyName || p.email || "—"}</td>
                          <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(p.createdAt)}</td>
                        </tr>
                      ))}
                      {projects.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground text-sm">Aucun projet pour le moment</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Recent appointments */}
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-heading font-semibold">Prochains rendez-vous</h2>
                    <button onClick={() => setTab("appointments")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y divide-border">
                    {appointments.slice(0, 4).map((a) => (
                      <div key={a.id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.email} · {APPOINTMENT_TYPE_LABELS[a.type]}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{a.date} à {a.time}</p>
                          <span className={`text-xs font-medium ${a.status === "pending" ? "text-yellow-600" : a.status === "confirmed" ? "text-green-600" : "text-gray-400"}`}>
                            {a.status === "pending" ? "En attente" : a.status === "confirmed" ? "Confirmé" : "Annulé"}
                          </span>
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <div className="px-6 py-10 text-center text-muted-foreground text-sm">Aucun rendez-vous</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Projects tab */}
            {tab === "projects" && (
              <motion.div key="projects" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <h1 className="text-2xl font-heading font-bold mb-2">Projets</h1>
                <p className="text-muted-foreground mb-6">{projects.length} dossier{projects.length !== 1 ? "s" : ""} au total</p>

                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dossier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Budget</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Suivi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-mono text-sm font-semibold">{p.projectNumber}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{p.companyName || "—"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm">{p.contactName || "—"}</p>
                            <p className="text-xs text-muted-foreground">{p.email}</p>
                            {p.phone && <p className="text-xs text-muted-foreground">{p.phone}</p>}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{p.budget || "—"}</td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <select
                                value={p.status}
                                disabled={updatingId === p.id}
                                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                data-testid={`select-status-${p.id}`}
                                className="appearance-none text-xs font-medium border rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50 bg-white"
                              >
                                {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
                                  <option key={val} value={val}>{label}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(p.createdAt)}</td>
                          <td className="px-6 py-4">
                            <a
                              href={`/suivi/${p.trackingToken}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-testid={`link-suivi-${p.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-foreground/60 hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" /> Voir
                            </a>
                          </td>
                        </tr>
                      ))}
                      {projects.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-14 text-center text-muted-foreground text-sm">
                          <AlertCircle className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
                          Aucun projet soumis pour le moment
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Appointments tab */}
            {tab === "appointments" && (
              <motion.div key="appointments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <h1 className="text-2xl font-heading font-bold mb-2">Rendez-vous</h1>
                <p className="text-muted-foreground mb-6">{appointments.length} rendez-vous enregistré{appointments.length !== 1 ? "s" : ""}</p>

                <div className="grid gap-4">
                  {appointments.length === 0 && (
                    <div className="bg-white rounded-2xl border border-border p-14 text-center text-muted-foreground text-sm">
                      <Calendar className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
                      Aucun rendez-vous pour le moment
                    </div>
                  )}
                  {appointments.map((a) => (
                    <div key={a.id} className="bg-white rounded-2xl border border-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-border flex flex-col items-center justify-center flex-shrink-0">
                          <p className="text-xs font-bold leading-tight">{a.date.split("-")[2] || "?"}</p>
                          <p className="text-xs text-muted-foreground">{a.date.split("-")[1] || "?"}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{a.name}</p>
                          <p className="text-sm text-muted-foreground">{a.email}{a.phone ? ` · ${a.phone}` : ""}</p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-xs font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
                              {APPOINTMENT_TYPE_LABELS[a.type]}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {a.time}
                            </span>
                            <span className={`text-xs font-medium ${
                              a.status === "pending" ? "text-yellow-600"
                              : a.status === "confirmed" ? "text-green-600"
                              : "text-gray-400"
                            }`}>
                              {a.status === "pending" ? "• En attente" : a.status === "confirmed" ? "• Confirmé" : "• Annulé"}
                            </span>
                          </div>
                          {a.notes && <p className="text-xs text-muted-foreground mt-2 italic">"{a.notes}"</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a href={`tel:${a.phone || ""}`} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-gray-50 transition-colors">
                          Appeler
                        </a>
                        <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-colors">
                          Email
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contacts tab */}
            {tab === "contacts" && (
              <motion.div key="contacts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <h1 className="text-2xl font-heading font-bold mb-2">Messages</h1>
                <p className="text-muted-foreground mb-6">{contacts.length} message{contacts.length !== 1 ? "s" : ""} reçu{contacts.length !== 1 ? "s" : ""}</p>

                <div className="grid gap-4">
                  {contacts.length === 0 && (
                    <div className="bg-white rounded-2xl border border-border p-14 text-center text-muted-foreground text-sm">
                      <MessageSquare className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
                      Aucun message pour le moment
                    </div>
                  )}
                  {contacts.map((c) => (
                    <div key={c.id} className="bg-white rounded-2xl border border-border p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-sm text-muted-foreground">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {c.subject && <p className="text-xs font-medium text-muted-foreground mb-1">{c.subject}</p>}
                          <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed bg-gray-50 rounded-xl p-4 border border-border">
                        {c.message}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <a
                          href={`mailto:${c.email}?subject=Re: ${c.subject || "Votre message"}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Répondre par email
                        </a>
                        {c.phone && (
                          <a
                            href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border border-border hover:bg-gray-50 transition-colors"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Simple password gate
export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  }

  if (authenticated) return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold">Accès Admin</h1>
          <p className="text-muted-foreground text-sm mt-1">Alpha Oméga Digital®</p>
        </div>

        <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  data-testid="input-admin-password"
                  placeholder="••••••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${
                    error ? "border-red-300 bg-red-50" : "border-border bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-2">
                  Mot de passe incorrect. Réessayez.
                </motion.p>
              )}
            </div>
            <Button
              type="submit"
              data-testid="button-admin-login"
              className="w-full rounded-xl py-3 h-auto text-sm font-semibold"
            >
              Accéder au tableau de bord
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link href="/" className="hover:text-foreground transition-colors">← Retour au site</Link>
        </p>
      </motion.div>
    </div>
  );
}
