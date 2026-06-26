import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useCreateProject } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 14;

export default function Questionnaire() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createProject = useCreateProject();

  useEffect(() => {
    const saved = localStorage.getItem("alpha_omega_wizard");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("alpha_omega_wizard", JSON.stringify(formData));
  }, [formData]);

  const updateData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: string, value: string) => {
    setFormData((prev: any) => {
      const arr = prev[key] || [];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((v: string) => v !== value) };
      }
      return { ...prev, [key]: [...arr, value] };
    });
  };

  const handleNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = () => {
    createProject.mutate({
      data: {
        email: formData.email || "contact@example.com",
        companyName: formData.companyName || "N/A",
        phone: formData.phone,
        projectType: formData.primaryConversion || "Custom",
        description: formData.description,
        budget: formData.budget,
        deadline: formData.deadline,
        answers: JSON.stringify(formData),
      }
    }, {
      onSuccess: (project) => {
        localStorage.removeItem("alpha_omega_wizard");
        toast({ title: "Projet soumis avec succès", description: "Redirection vers l'estimation..." });
        setLocation(`/estimation?id=${project.id}`);
      },
      onError: () => {
        toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de la soumission." });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-4">Parlez-nous de votre vision</h1>
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
              <span>Étape {step} sur {TOTAL_STEPS}</span>
              <span>{Math.round((step / TOTAL_STEPS) * 100)}% complété</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-sm min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-grow"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">1. Identité de l'entreprise</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom de l'entreprise</Label>
                        <Input value={formData.companyName || ""} onChange={(e) => updateData("companyName", e.target.value)} placeholder="Ex: Alpha Oméga" />
                      </div>
                      <div className="space-y-2">
                        <Label>Slogan</Label>
                        <Input value={formData.slogan || ""} onChange={(e) => updateData("slogan", e.target.value)} placeholder="Votre slogan" />
                      </div>
                      <div className="space-y-2">
                        <Label>Site web actuel (si existant)</Label>
                        <Input value={formData.website || ""} onChange={(e) => updateData("website", e.target.value)} placeholder="https://..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Secteur d'activité</Label>
                        <Input value={formData.sector || ""} onChange={(e) => updateData("sector", e.target.value)} placeholder="Tech, Santé, Finance..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Email de contact *</Label>
                        <Input type="email" value={formData.email || ""} onChange={(e) => updateData("email", e.target.value)} placeholder="contact@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input value={formData.phone || ""} onChange={(e) => updateData("phone", e.target.value)} placeholder="+229..." />
                      </div>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">2. Présentation</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Description de l'entreprise</Label>
                        <Textarea value={formData.description || ""} onChange={(e) => updateData("description", e.target.value)} placeholder="Que faites-vous ?" className="h-32" />
                      </div>
                      <div className="space-y-2">
                        <Label>Mission & Vision</Label>
                        <Textarea value={formData.mission || ""} onChange={(e) => updateData("mission", e.target.value)} placeholder="Où allez-vous ?" className="h-24" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">3. Objectifs principaux</h2>
                    <p className="text-muted-foreground text-sm">Sélectionnez vos principaux objectifs (plusieurs choix possibles).</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Améliorer la marque", "Générer des leads", "Augmenter les ventes", 
                        "Automatiser des processus", "Moderniser l'existant", "Attirer des investisseurs", 
                        "Présenter des produits", "Améliorer l'UX", "Réduire les coûts", "Développer la présence web"
                      ].map(obj => (
                        <label key={obj} className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                          <Checkbox checked={(formData.objectives || []).includes(obj)} onCheckedChange={() => toggleArray("objectives", obj)} />
                          <span className="text-sm font-medium">{obj}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">4. Priorités & Succès</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Quelles sont vos 3 priorités absolues ?</Label>
                        <Input value={formData.priority1 || ""} onChange={(e) => updateData("priority1", e.target.value)} placeholder="Priorité 1" className="mb-2" />
                        <Input value={formData.priority2 || ""} onChange={(e) => updateData("priority2", e.target.value)} placeholder="Priorité 2" className="mb-2" />
                        <Input value={formData.priority3 || ""} onChange={(e) => updateData("priority3", e.target.value)} placeholder="Priorité 3" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">5. Public cible</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Type de cible</Label>
                        <RadioGroup value={formData.targetType || ""} onValueChange={(v) => updateData("targetType", v)} className="flex gap-4">
                          <div className="flex items-center space-x-2"><RadioGroupItem value="B2B" id="B2B" /><Label htmlFor="B2B">B2B</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="B2C" id="B2C" /><Label htmlFor="B2C">B2C</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="Mixte" id="Mixte" /><Label htmlFor="Mixte">Mixte</Label></div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>Description de la cible (âge, profils, besoins)</Label>
                        <Textarea value={formData.targetDesc || ""} onChange={(e) => updateData("targetDesc", e.target.value)} className="h-24" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">6. Positionnement & Concurrence</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Principaux concurrents (noms ou liens)</Label>
                        <Textarea value={formData.competitors || ""} onChange={(e) => updateData("competitors", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Votre avantage concurrentiel principal</Label>
                        <Input value={formData.advantage || ""} onChange={(e) => updateData("advantage", e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">7. ADN de Marque</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["Innovant", "Premium", "Accessible", "Ludique", "Corporate", "Créatif", "Minimaliste", "Chaleureux", "Épuré"].map(obj => (
                        <label key={obj} className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                          <Checkbox checked={(formData.brandDna || []).includes(obj)} onCheckedChange={() => toggleArray("brandDna", obj)} />
                          <span className="text-sm font-medium">{obj}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === 8 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">8. Inspirations visuelles</h2>
                    <p className="text-sm text-muted-foreground">Quelles marques vous inspirent ?</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Apple", "Stripe", "Notion", "Tesla", "Linear", "Airbnb", "Rolex", "Autre"].map(obj => (
                        <label key={obj} className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                          <Checkbox checked={(formData.inspirations || []).includes(obj)} onCheckedChange={() => toggleArray("inspirations", obj)} />
                          <span className="text-sm font-medium">{obj}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === 9 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">9. Animations & Interactions</h2>
                    <RadioGroup value={formData.animationLevel || ""} onValueChange={(v) => updateData("animationLevel", v)} className="space-y-3">
                      <div className="flex items-center space-x-3 border p-4 rounded-xl">
                        <RadioGroupItem value="Minimales" id="anim1" />
                        <Label htmlFor="anim1" className="font-medium cursor-pointer">Minimales (Subtiles, juste pour le feedback)</Label>
                      </div>
                      <div className="flex items-center space-x-3 border p-4 rounded-xl">
                        <RadioGroupItem value="Modérées" id="anim2" />
                        <Label htmlFor="anim2" className="font-medium cursor-pointer">Modérées (Transitions fluides, éléments au scroll)</Label>
                      </div>
                      <div className="flex items-center space-x-3 border p-4 rounded-xl">
                        <RadioGroupItem value="Complexes" id="anim3" />
                        <Label htmlFor="anim3" className="font-medium cursor-pointer">Complexes (Wow effect, 3D, interactions riches)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {step === 10 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">10. Univers Visuels</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Minimal Corporate", "Soft Waves", "Mesh Gradient", "Architectural Abstract", 
                        "Luxury Curves", "Organic Shapes", "Glass Morphism", "Autre"
                      ].map(obj => (
                        <label key={obj} className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                          <Checkbox checked={(formData.visualUniverse || []).includes(obj)} onCheckedChange={() => toggleArray("visualUniverse", obj)} />
                          <span className="text-sm font-medium">{obj}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === 11 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">11. État des contenus</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: "hasLogo", label: "Avez-vous un logo ?" },
                        { id: "hasBranding", label: "Avez-vous une charte graphique ?" },
                        { id: "hasPhotos", label: "Avez-vous des photos professionnelles ?" },
                        { id: "hasTexts", label: "Avez-vous les textes rédigés ?" }
                      ].map(item => (
                        <div key={item.id} className="border p-4 rounded-xl space-y-3">
                          <Label>{item.label}</Label>
                          <RadioGroup value={formData[item.id] || ""} onValueChange={(v) => updateData(item.id, v)} className="flex gap-4">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Oui" id={`${item.id}_oui`} /><Label htmlFor={`${item.id}_oui`}>Oui</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Non" id={`${item.id}_non`} /><Label htmlFor={`${item.id}_non`}>Non</Label></div>
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 12 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">12. Fonctionnalités requises</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Formulaire de contact", "Prise de rendez-vous", "E-commerce / Paiement", 
                        "Espace client / Dashboard", "Blog / Actualités", "Chat WhatsApp", 
                        "Génération de devis", "Back-office Admin"
                      ].map(obj => (
                        <label key={obj} className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                          <Checkbox checked={(formData.features || []).includes(obj)} onCheckedChange={() => toggleArray("features", obj)} />
                          <span className="text-sm font-medium">{obj}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === 13 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">13. Contraintes Projet</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Budget estimé</Label>
                        <Input value={formData.budget || ""} onChange={(e) => updateData("budget", e.target.value)} placeholder="Ex: 5000€ - 10000€" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date limite souhaitée</Label>
                        <Input type="date" value={formData.deadline || ""} onChange={(e) => updateData("deadline", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Contraintes techniques ou réglementaires spécifiques</Label>
                      <Textarea value={formData.constraints || ""} onChange={(e) => updateData("constraints", e.target.value)} className="h-24" placeholder="Multilingue, RGPD, API spécifique..." />
                    </div>
                  </div>
                )}

                {step === 14 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold">14. Vision finale</h2>
                    <div className="space-y-4">
                      <Label>Action de conversion principale souhaitée pour les visiteurs</Label>
                      <RadioGroup value={formData.primaryConversion || ""} onValueChange={(v) => updateData("primaryConversion", v)} className="grid grid-cols-2 gap-3">
                        {["Acheter", "Prendre rendez-vous", "Demander un devis", "S'inscrire", "Télécharger", "Appeler", "Autre"].map(action => (
                          <div key={action} className="flex items-center space-x-3 border p-3 rounded-xl">
                            <RadioGroupItem value={action} id={action} />
                            <Label htmlFor={action} className="cursor-pointer">{action}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Dernier commentaire (Optionnel)</Label>
                      <Textarea value={formData.finalNotes || ""} onChange={(e) => updateData("finalNotes", e.target.value)} placeholder="Un mot pour la fin ?" className="h-24" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between mt-auto">
              <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={step === 1}
                className="px-6 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Précédent
              </Button>
              
              {step < TOTAL_STEPS ? (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 px-8 rounded-xl text-white">
                  Suivant <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={createProject.isPending}
                  className="bg-primary hover:bg-primary/90 px-8 rounded-xl text-white"
                >
                  {createProject.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Soumettre mon projet
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
