import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSearch } from "wouter";
import { useGetProjectEstimation, getGetProjectEstimationQueryKey, useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, Loader2, Calendar, HardDrive, Shield, Sparkles, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Estimation() {
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const idParam = searchParams.get("id");
  const id = idParam ? parseInt(idParam, 10) : null;
  const [copied, setCopied] = useState(false);

  const { data: estimation, isLoading, error } = useGetProjectEstimation(id || 0, {
    query: {
      enabled: !!id,
      queryKey: getGetProjectEstimationQueryKey(id || 0)
    }
  });

  const { data: project } = useGetProject(id || 0, {
    query: {
      enabled: !!id,
      queryKey: getGetProjectQueryKey(id || 0)
    }
  });

  const trackingUrl = project?.trackingToken
    ? `${window.location.origin}/suivi/${project.trackingToken}`
    : null;

  function copyTrackingLink() {
    if (!trackingUrl) return;
    navigator.clipboard.writeText(trackingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
  };

  const formatXOF = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(val * 655.957);
  };

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Projet introuvable</h1>
            <Link href="/questionnaire">
              <Button>Retour au questionnaire</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Estimation Automatique générée
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">
              Votre proposition sur mesure
            </h1>
            <p className="text-lg text-muted-foreground">
              Basée sur vos réponses, voici 3 approches pour réaliser votre vision numérique avec l'exigence de qualité Alpha Oméga Digital®.
            </p>
          </div>

          {/* Tracking link banner */}
          {trackingUrl && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto mb-10 bg-white border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Votre lien de suivi personnel</p>
                <p className="text-sm text-foreground font-mono truncate">{trackingUrl}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={copyTrackingLink}
                  data-testid="button-copy-tracking-link"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border border-border bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copié !" : "Copier"}
                </button>
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-open-tracking"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Voir mon dossier
                </a>
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Calcul de votre estimation en cours...</p>
            </div>
          ) : error || !estimation ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-border">
              <p className="text-destructive mb-4">Impossible de charger l'estimation.</p>
              <Link href="/questionnaire"><Button>Réessayer</Button></Link>
            </div>
          ) : (
            <>
              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Essentiel */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                  <h3 className="text-2xl font-heading font-bold mb-2">Essentiel</h3>
                  <p className="text-sm text-muted-foreground mb-6 h-10">L'essentiel pour démarrer avec une base solide et professionnelle.</p>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-foreground mb-1">{formatCurrency(estimation.low)}</div>
                    <div className="text-sm text-muted-foreground">{formatXOF(estimation.low)}</div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Design UI/UX standard</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Développement responsive</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Intégration CMS basique</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> 1 mois de support inclus</li>
                  </ul>
                  <Link href="/rendez-vous" className="w-full mt-auto">
                    <Button variant="outline" className="w-full rounded-xl py-6">Choisir ce plan</Button>
                  </Link>
                </motion.div>

                {/* Professionnel (Highlighted) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-foreground text-background p-8 rounded-3xl border border-foreground shadow-xl relative flex flex-col transform md:-translate-y-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Recommandé
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Professionnel</h3>
                  <p className="text-sm text-gray-400 mb-6 h-10">L'équilibre parfait entre performance, design personnalisé et fonctionnalités.</p>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white mb-1">{formatCurrency(estimation.medium)}</div>
                    <div className="text-sm text-gray-400">{formatXOF(estimation.medium)}</div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow text-gray-300">
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Design UI/UX sur mesure</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Animations avancées (Framer)</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Panel d'administration complet</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Optimisation SEO & Vitesse</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> 3 mois de support inclus</li>
                  </ul>
                  <Link href="/rendez-vous" className="w-full mt-auto">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6">Choisir ce plan</Button>
                  </Link>
                </motion.div>

                {/* Premium */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-3xl border border-border shadow-sm flex flex-col">
                  <h3 className="text-2xl font-heading font-bold mb-2">Premium</h3>
                  <p className="text-sm text-muted-foreground mb-6 h-10">Une solution sans compromis, évolutive et hautement sécurisée.</p>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-foreground mb-1">{formatCurrency(estimation.premium)}</div>
                    <div className="text-sm text-muted-foreground">{formatXOF(estimation.premium)}</div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Direction artistique complète</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Architecture Cloud scalable</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Fonctionnalités complexes</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Tests de sécurité poussés</li>
                    <li className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-primary shrink-0" /> Support prioritaire 1 an</li>
                  </ul>
                  <Link href="/rendez-vous" className="w-full mt-auto">
                    <Button variant="outline" className="w-full rounded-xl py-6">Choisir ce plan</Button>
                  </Link>
                </motion.div>
              </div>

              {/* Details & CTA */}
              <div className="bg-white rounded-3xl border border-border p-8 md:p-12 mb-16 shadow-sm">
                <h3 className="text-2xl font-heading font-bold mb-8">Détails de l'estimation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Sparkles className="w-4 h-4" /> Complexité
                    </div>
                    <div className="font-semibold capitalize">{estimation.complexity}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" /> Délai estimé
                    </div>
                    <div className="font-semibold">{estimation.estimatedWeeks} semaines</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Shield className="w-4 h-4" /> Maintenance (Option)
                    </div>
                    <div className="font-semibold">{estimation.monthlyMaintenance ? formatCurrency(estimation.monthlyMaintenance) + '/mois' : 'Sur devis'}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <HardDrive className="w-4 h-4" /> Hébergement (Option)
                    </div>
                    <div className="font-semibold">{estimation.hostingMonthly ? formatCurrency(estimation.hostingMonthly) + '/mois' : 'Sur devis'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="font-semibold mb-4 text-lg">Technologies recommandées</h4>
                    <div className="flex flex-wrap gap-2">
                      {estimation.recommendedTechnologies.map(tech => (
                        <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 text-lg">Fonctionnalités prioritaires</h4>
                    <ul className="space-y-2">
                      {estimation.priorityFeatures.map(feat => (
                        <li key={feat} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {estimation.recommendations && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h4 className="font-semibold mb-4 text-lg">Recommandation de l'expert</h4>
                    <p className="text-muted-foreground leading-relaxed">{estimation.recommendations}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/rendez-vous">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 px-8 py-6 text-lg rounded-2xl">
                    Prendre rendez-vous <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="https://wa.me/22901677280" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl">
                    Démarrer sur WhatsApp
                  </Button>
                </a>
              </div>
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
