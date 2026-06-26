import { Link } from "wouter";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <span className="text-3xl font-heading font-bold text-primary group-hover:text-primary/80 transition-colors">
                α
              </span>
              <span className="text-2xl font-heading font-semibold text-foreground tracking-tight">
                Alpha Oméga Digital
              </span>
            </Link>
            <p className="text-lg font-medium text-foreground mb-4">
              De la vision à l'écran — chaque pixel pensé avec intention.
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-8">
              Alpha Oméga Digital conçoit des expériences numériques modernes,
              performantes et sur mesure pour accompagner la croissance des
              entreprises ambitieuses.
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-green-700 bg-green-50 px-4 py-2 rounded-full inline-flex border border-green-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Disponible pour de nouveaux projets
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-foreground">
              Expertises
            </h3>
            <ul className="space-y-4">
              {[
                "Sites Web Professionnels",
                "Applications Web",
                "Plateformes SaaS",
                "Applications Mobiles",
                "Automatisation Digitale",
                "Interfaces Sur Mesure",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-foreground">
              Contact & Infos
            </h3>
            <ul className="space-y-5 text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="mt-1 font-medium text-foreground">
                  Adinkpo Amour Dominique Koffi
                  <span className="block text-sm text-muted-foreground font-normal mt-1">
                    Architecte Digital • Concepteur Web & Applications
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="mailto:Alphaomegadigital35@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  Alphaomegadigital35@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-1" />
                <div className="flex flex-col">
                  <a href="tel:+2290167728061" className="hover:text-primary transition-colors">+229 01 67 72 80 61</a>
                  <a href="tel:+2290192956559" className="hover:text-primary transition-colors">+229 01 92 95 65 59</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>🇧🇯 Bénin / 🌍 Afrique Francophone / 🌐 International</span>
              </li>
            </ul>
            <a
              href="https://wa.me/2290167728061"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block w-full"
            >
              <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary rounded-xl h-auto py-4">
                Discuter sur WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Alpha Oméga Digital®. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
