import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  useGetProjectByToken,
  getGetProjectByTokenQueryKey,
} from "@workspace/api-client-react";
import {
  CheckCircle2, Clock, ArrowRight, MessageCircle,
  Calendar, FileText, Zap, Shield, TrendingUp, Phone,
  Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const STATUS_STEPS = [
  { key: "new", label: "Dossier reçu", desc: "Votre demande a bien été enregistrée.", icon: FileText },
  { key: "contacted", label: "Prise de contact", desc: "Notre équipe vous a contacté pour cadrer votre projet.", icon: Phone },
  { key: "in_progress", label: "En cours", desc: "Votre projet est en cours de développement.", icon: Zap },
  { key: "closed", label: "Livré", desc: "Votre projet a été livré avec succès.", icon: CheckCircle2 },
] as const;

type ProjectStatus = "new" | "contacted" | "in_progress" | "closed";

function getStatusIndex(status: ProjectStatus): number {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

function ComplexityBadge({ complexity }: { complexity: string }) {
  const map: Record<string, { label: string; color: string }> = {
    simple: { label: "Simple", color: "bg-gray-100 text-gray-700" },
    moderate: { label: "Modéré", color: "bg-blue-50 text-blue-700" },
    complex: { label: "Complexe", color: "bg-purple-50 text-purple-700" },
    enterprise: { label: "Enterprise", color: "bg-gray-900 text-white" },
  };
  const c = map[complexity] ?? map.moderate;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${c.color}`}>
      {c.label}
    </span>
  );
}

export default function Suivi() {
  const { token } = useParams<{ token: string }>();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useGetProjectByToken(token ?? "", {
    query: {
      enabled: !!token,
      queryKey: getGetProjectByTokenQueryKey(token ?? ""),
    },
  });

  const trackingUrl = typeof window !== "undefined" ? window.location.href : "";

  function copyLink() {
    navigator.clipboard.writeText(trackingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">

          {/* Loading */}
          {isLoading && (
            <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center py-32">
              <div className="w-10 h-10 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-6" />
              <p className="text-muted-foreground">Chargement de votre dossier…</p>
            </motion.div>
          )}

          {/* Error */}
          {isError && (
            <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center py-32">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-3">Dossier introuvable</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Ce lien de suivi est invalide ou a expiré. Vérifiez le lien reçu ou démarrez un nouveau projet.
              </p>
              <Link href="/questionnaire">
                <Button className="rounded-full px-8">Démarrer un projet <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </Link>
            </motion.div>
          )}

          {/* Success */}
          {data && (
            <div className="space-y-8">

              {/* Header */}
              <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium text-accent mb-1 uppercase tracking-widest">Espace de suivi client</p>
                    <h1 className="text-3xl font-heading font-bold text-foreground">
                      {data.project.companyName
                        ? `Projet — ${data.project.companyName}`
                        : "Votre projet"}
                    </h1>
                    <p className="text-muted-foreground mt-1">Dossier <span className="font-mono font-semibold text-foreground">{data.project.projectNumber}</span></p>
                  </div>
                  <button
                    onClick={copyLink}
                    data-testid="button-copy-link"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-4 py-2 bg-white hover:bg-gray-50"
                  >
                    {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Lien copié !" : "Copier ce lien"}
                  </button>
                </div>
              </motion.div>

              {/* Status timeline */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-3xl border border-border p-8"
              >
                <h2 className="text-lg font-heading font-semibold mb-8">Avancement du dossier</h2>
                <div className="relative">
                  {/* connector line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {STATUS_STEPS.map((step, i) => {
                      const currentIdx = getStatusIndex(data.project.status as ProjectStatus);
                      const done = i <= currentIdx;
                      const active = i === currentIdx;
                      const Icon = step.icon;
                      return (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          className="flex items-start gap-5 relative"
                        >
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                            active
                              ? "bg-foreground border-foreground text-white shadow-lg"
                              : done
                              ? "bg-foreground/10 border-foreground/20 text-foreground"
                              : "bg-white border-border text-muted-foreground/40"
                          }`}>
                            {done && !active ? <CheckCircle2 className="w-4 h-4" /> : active ? <Clock className="w-4 h-4 animate-pulse" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <div className="pt-1.5">
                            <p className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground/50"}`}>
                              {step.label}
                            </p>
                            {(done || active) && (
                              <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Estimation */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-semibold">Estimation personnalisée</h2>
                  <ComplexityBadge complexity={data.estimation.complexity} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Essentiel", amount: data.estimation.low, desc: "Version fonctionnelle essentielle", muted: true },
                    { label: "Professionnel", amount: data.estimation.medium, desc: "Solution complète recommandée", featured: true },
                    { label: "Premium", amount: data.estimation.premium, desc: "Expérience maximale", muted: true },
                  ].map((tier) => (
                    <div
                      key={tier.label}
                      className={`rounded-2xl border p-6 transition-all ${
                        tier.featured
                          ? "bg-foreground text-white border-foreground shadow-xl scale-[1.02]"
                          : "bg-white border-border"
                      }`}
                    >
                      {tier.featured && (
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/60 block mb-3">Recommandé</span>
                      )}
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${tier.featured ? "text-white/70" : "text-muted-foreground"}`}>
                        {tier.label}
                      </p>
                      <p className={`text-3xl font-heading font-bold mb-1 ${tier.featured ? "text-white" : "text-foreground"}`}>
                        {formatCurrency(tier.amount)}
                      </p>
                      <p className={`text-sm ${tier.featured ? "text-white/70" : "text-muted-foreground"}`}>{tier.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Clock, label: "Délai estimé", value: `${data.estimation.estimatedWeeks} semaines` },
                    { icon: Shield, label: "Hébergement / mois", value: formatCurrency(data.estimation.hostingMonthly ?? 0) },
                    { icon: TrendingUp, label: "Maintenance / mois", value: formatCurrency(data.estimation.monthlyMaintenance ?? 0) },
                    { icon: Zap, label: "Complexité", value: { simple: "Simple", moderate: "Modéré", complex: "Complexe", enterprise: "Enterprise" }[data.estimation.complexity] },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-white rounded-2xl border border-border p-5">
                      <Icon className="w-4 h-4 text-muted-foreground mb-3" />
                      <p className="text-xs text-muted-foreground mb-1">{label}</p>
                      <p className="font-semibold text-foreground text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tech + Features */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading font-semibold mb-4 text-sm">Technologies recommandées</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.estimation.recommendedTechnologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-full bg-gray-50 border border-border text-xs font-medium text-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading font-semibold mb-4 text-sm">Fonctionnalités prioritaires</h3>
                  <ul className="space-y-2">
                    {data.estimation.priorityFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-white rounded-2xl border border-border p-6"
              >
                <h3 className="font-heading font-semibold mb-3 text-sm">Recommandations Alpha Oméga Digital</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.estimation.recommendations}</p>
              </motion.div>

              {/* CTA */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-foreground text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div>
                  <h3 className="font-heading font-bold text-xl mb-1">Prêt à démarrer ?</h3>
                  <p className="text-white/70 text-sm">Réservez un appel gratuit avec notre équipe pour valider votre projet.</p>
                </div>
                <div className="flex flex-wrap gap-3 flex-shrink-0">
                  <Link href="/rendez-vous">
                    <Button data-testid="button-book-rdv" className="bg-white text-foreground hover:bg-white/90 rounded-full px-6">
                      <Calendar className="w-4 h-4 mr-2" /> Prendre rendez-vous
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/22901677280"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-whatsapp-cta"
                  >
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-6">
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </Button>
                  </a>
                </div>
              </motion.div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
