import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowRight, CheckCircle2, Monitor, Layers, ShieldCheck, Zap, Users, Code, Globe, Layout, Database, 
  Target, Award, Heart, Eye, PenTool, Rocket, MessageCircle, Server, Lock, Smartphone
} from "lucide-react";
import { useGetStats } from "@workspace/api-client-react";
import { 
  SiNextdotjs, SiReact, SiTypescript, SiFlutter, SiNodedotjs, SiSupabase, 
  SiFirebase, SiPostgresql, SiDocker, SiStripe, SiTailwindcss, 
  SiFramer, SiGreensock
} from "react-icons/si";

export default function Home() {
  const { data: stats } = useGetStats();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden relative">
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], x: [0, -50, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-green-200 rounded-full blur-[120px]"
            />
          </div>

          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm font-medium text-secondary-foreground mb-8">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Agence Digitale Premium • Bénin & International
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
                  De la vision à l'écran — chaque pixel pensé avec{" "}
                  <span className="text-primary relative whitespace-nowrap">
                    intention.
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                  Alpha Oméga Digital® est un studio technologique boutique créant des expériences numériques d'élite. Applications sur mesure, SaaS, et automatisation pour les entreprises ambitieuses.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/questionnaire">
                    <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-2xl transition-transform hover:scale-105">
                      Démarrer mon projet <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <a href="#services">
                    <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl bg-white hover:bg-gray-50 border-border">
                      Découvrir nos services
                    </Button>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Accompagnement personnalisé</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Solutions sur mesure</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Architecture évolutive</div>
                </div>
              </div>

              <div className="relative hidden lg:block h-[600px] w-full perspective-1000">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 w-64 bg-white rounded-2xl shadow-xl border border-border p-4 z-20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">A</div>
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
                      <div className="h-2 w-16 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-4/5 bg-gray-100 rounded" />
                    <div className="h-2 w-full bg-gray-100 rounded" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 30, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-border p-5 z-30"
                >
                  <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 h-20 bg-primary/10 rounded-xl" />
                    <div className="flex-1 h-20 bg-green-50 rounded-xl" />
                  </div>
                  <div className="h-8 w-full bg-primary rounded-lg" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-20 right-0 w-56 bg-white rounded-2xl shadow-lg border border-border p-4 z-10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-8 bg-green-100 rounded-full" />
                  </div>
                  <div className="flex items-end gap-2 h-16">
                    <div className="w-1/4 bg-gray-100 h-1/2 rounded-t" />
                    <div className="w-1/4 bg-primary/40 h-3/4 rounded-t" />
                    <div className="w-1/4 bg-primary h-full rounded-t" />
                    <div className="w-1/4 bg-gray-100 h-1/4 rounded-t" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y border-border bg-[#FAFAFA]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
              <div className="text-center px-4">
                <div className="text-4xl font-heading font-bold text-foreground mb-2">
                  {stats?.totalHours ? `+${stats.totalHours}h` : "+1000h"}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">de développement</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-heading font-bold text-foreground mb-2">100%</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">sur mesure</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-heading font-bold text-foreground mb-2">
                  {stats?.responseTime || "<24h"}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">réponse</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-heading font-bold text-foreground mb-2">
                  {stats?.satisfactionRate ? `${stats.satisfactionRate}%` : "100%"}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">accompagnement</div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Expertises */}
        <section id="services" className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-heading font-bold mb-4">Nos Expertises</h2>
              <p className="text-lg text-muted-foreground">Des solutions numériques d'ingénierie conçues pour accélérer votre croissance et dominer votre marché.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Sites Web Professionnels", icon: Globe, desc: "Vitrines digitales premium qui convertissent." },
                { title: "Applications Web", icon: Layout, desc: "Interfaces complexes accessibles partout." },
                { title: "Plateformes SaaS", icon: Layers, desc: "Architectures robustes pour produits logiciels." },
                { title: "Applications Mobiles", icon: Smartphone, desc: "Expériences natives iOS et Android." },
                { title: "Automatisation Digitale", icon: Zap, desc: "Optimisation de vos processus métier." },
                { title: "Portails Clients", icon: Users, desc: "Espaces sécurisés pour votre audience." },
                { title: "Interfaces Sur Mesure", icon: Code, desc: "Design UX/UI centré sur l'utilisateur." },
                { title: "Branding Digital", icon: Target, desc: "Identité visuelle forte et cohérente." }
              ].map((service, i) => (
                <motion.div 
                  key={service.title}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl border border-border bg-[#FAFAFA] hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Processus */}
        <section id="processus" className="py-24 bg-[#FAFAFA] border-y border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-heading font-bold mb-4">Notre Processus</h2>
              <p className="text-lg text-muted-foreground">Une méthodologie éprouvée pour garantir l'excellence à chaque étape de votre projet.</p>
            </div>
            
            <div className="relative border-l-2 border-primary/20 ml-4 md:ml-0 md:pl-0">
              {[
                { step: "01", title: "Découverte", desc: "Analyse de vos besoins et de votre marché." },
                { step: "02", title: "Stratégie", desc: "Définition de l'architecture et des objectifs." },
                { step: "03", title: "Design UX/UI", desc: "Création des maquettes et prototypes interactifs." },
                { step: "04", title: "Développement", desc: "Code sur mesure, propre et performant." },
                { step: "05", title: "Validation", desc: "Tests rigoureux et ajustements finaux." },
                { step: "06", title: "Déploiement", desc: "Mise en production fluide et sécurisée." },
                { step: "07", title: "Accompagnement", desc: "Maintenance et évolutions continues." }
              ].map((item, i) => (
                <motion.div 
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="mb-10 ml-8 md:ml-12 relative"
                >
                  <div className="absolute -left-[43px] md:-left-[55px] top-1 w-8 h-8 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center font-bold text-sm shadow-sm z-10">
                    {item.step}
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pourquoi Nous Choisir */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-heading font-bold mb-4">Pourquoi Nous Choisir</h2>
              <p className="text-lg text-muted-foreground">Nous ne créons pas que des sites, nous bâtissons des fondations solides pour votre entreprise.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Approche stratégique", icon: Target },
                { title: "Solutions sur mesure", icon: Code },
                { title: "Performance", icon: Zap },
                { title: "Sécurité", icon: Lock },
                { title: "Accompagnement humain", icon: Users },
                { title: "Vision long terme", icon: Eye }
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-6 rounded-2xl bg-[#FAFAFA] border border-border">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">Une exigence de qualité appliquée à chaque dimension de notre collaboration.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section id="technologies" className="py-24 bg-foreground text-white overflow-hidden">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-heading font-bold mb-4">Technologies modernes pour des solutions durables</h2>
              <p className="text-lg text-gray-400">Nous utilisons les stacks technologiques les plus performantes et robustes du marché.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {[
                { icon: SiNextdotjs, name: "Next.js" },
                { icon: SiReact, name: "React" },
                { icon: SiTypescript, name: "TypeScript" },
                { icon: SiFlutter, name: "Flutter" },
                { icon: SiNodedotjs, name: "Node.js" },
                { icon: SiSupabase, name: "Supabase" },
                { icon: SiFirebase, name: "Firebase" },
                { icon: SiPostgresql, name: "PostgreSQL" },
                { icon: SiDocker, name: "Docker" },
                { icon: null, name: "AWS" },
                { icon: SiStripe, name: "Stripe" },
                { icon: SiTailwindcss, name: "Tailwind" },
                { icon: SiFramer, name: "Framer Motion" },
                { icon: SiGreensock, name: "GSAP" },
              ].map((tech, i) => (
                <motion.div 
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  {tech.icon ? <tech.icon className="w-8 h-8 mb-3 text-gray-300" /> : <span className="w-8 h-8 mb-3 text-gray-300 text-lg font-bold flex items-center justify-center">AWS</span>}
                  <span className="text-xs font-medium text-gray-400">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Conceptuel */}
        <section id="portfolio" className="py-24 bg-[#FAFAFA]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-heading font-bold mb-4">Portfolio Conceptuel</h2>
              <p className="text-lg text-muted-foreground">Aperçu de nos capacités techniques et créatives à travers des cas d'usage typiques.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "SaaS RH & Recrutement", tags: ["React", "Node.js", "PostgreSQL"], desc: "Plateforme complète de gestion des candidatures avec workflows automatisés." },
                { title: "CRM Intelligent", tags: ["Next.js", "Supabase", "Tailwind"], desc: "Outil de relation client avec tableaux de bord analytiques en temps réel." },
                { title: "Application Fintech", tags: ["Flutter", "Firebase", "Stripe"], desc: "App mobile sécurisée de gestion financière et paiements." },
                { title: "E-commerce Premium", tags: ["Next.js", "Stripe", "Framer"], desc: "Boutique en ligne haute performance à l'esthétique luxueuse." },
              ].map(project => (
                <div key={project.title} className="bg-white rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-border relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200"></div>
                    {/* Abstract Mockup Thumbnail */}
                    <div className="w-3/4 h-3/4 bg-white rounded-t-xl shadow-md border border-border border-b-0 p-4 relative z-10 flex flex-col gap-3 transform group-hover:translate-y-2 transition-transform">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded" />
                      <div className="flex gap-4 flex-grow">
                        <div className="w-1/3 bg-gray-100 rounded h-full" />
                        <div className="w-2/3 flex flex-col gap-2">
                          <div className="h-8 bg-primary/10 rounded w-full" />
                          <div className="h-full bg-gray-50 rounded border border-gray-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-heading font-bold mb-3">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{project.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium px-3 py-1 bg-secondary text-secondary-foreground rounded-full border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valeurs & Garanties */}
        <section className="py-24 bg-white border-y border-border">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              <div>
                <h2 className="text-3xl font-heading font-bold mb-8">Nos Valeurs</h2>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { name: "Excellence", icon: Award },
                    { name: "Innovation", icon: Rocket },
                    { name: "Intention", icon: PenTool },
                    { name: "Transparence", icon: Eye },
                    { name: "Fiabilité", icon: ShieldCheck },
                    { name: "Vision", icon: Globe }
                  ].map(val => (
                    <div key={val.name} className="flex items-center gap-3 p-4 bg-[#FAFAFA] rounded-xl border border-border">
                      <val.icon className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{val.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold mb-8">Maintenance & Garanties</h2>
                <div className="space-y-6 text-muted-foreground">
                  <p>
                    La livraison d'un projet n'est que le début. Alpha Oméga Digital s'engage à assurer la pérennité de vos outils via un support rigoureux :
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Maintenance corrective et évolutive</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Monitoring des performances 24/7</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Sauvegardes automatisées régulières</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Support technique réactif</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Code propre et documentation complète</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Respect strict des délais de livraison</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-32 bg-foreground text-background">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Transformons votre vision en une expérience digitale exceptionnelle. Discutons de vos objectifs et de la manière dont nous pouvons vous aider.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/questionnaire">
                <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-2xl">
                  Discuter de mon projet
                </Button>
              </Link>
              <Link href="/rendez-vous">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white text-lg px-8 py-6 rounded-2xl">
                  Prendre rendez-vous
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
