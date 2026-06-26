import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { useCreateAppointment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Video, Phone, Users, CheckCircle2, Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function RendezVous() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "visio" as "visio" | "phone" | "in_person",
    notes: "",
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { toast } = useToast();
  const createAppointment = useCreateAppointment();

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !formData.name || !formData.email) {
      toast({ variant: "destructive", title: "Erreur", description: "Veuillez remplir tous les champs obligatoires." });
      return;
    }

    createAppointment.mutate({
      data: {
        ...formData,
        date: date.toISOString().split('T')[0],
        time,
      }
    }, {
      onSuccess: () => setIsSuccess(true),
      onError: () => toast({ variant: "destructive", title: "Erreur", description: "Impossible de planifier le rendez-vous." })
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-20">
          <div className="bg-white p-12 rounded-3xl border border-border shadow-sm text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-4">Rendez-vous confirmé !</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Merci {formData.name}. Votre rendez-vous est prévu le {date && format(date, "EEEE d MMMM yyyy", { locale: fr })} à {time}. Vous recevrez un email de confirmation prochainement.
            </p>
            <Button onClick={() => window.location.href = '/'} className="w-full rounded-xl py-6">
              Retour à l'accueil
            </Button>
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
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Planifier un échange</h1>
            <p className="text-lg text-muted-foreground">
              Choisissez le créneau qui vous convient pour discuter de votre projet avec un architecte digital.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left Col - Booking Options */}
            <div className="p-8 lg:p-12 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border bg-[#FCFCFC]">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/> Date & Heure</h3>
              
              <div className="mb-8">
                <Label className="mb-3 block">Choisissez une date *</Label>
                <div className="bg-white rounded-xl border border-border p-2 shadow-sm inline-block w-full">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="mx-auto"
                    locale={fr}
                    disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) || d.getDay() === 0 || d.getDay() === 6}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Choisissez un créneau *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`py-3 rounded-xl text-sm font-medium transition-colors border ${
                        time === t 
                          ? 'bg-primary border-primary text-white' 
                          : 'bg-white border-border hover:border-primary text-foreground'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col - User Info */}
            <div className="p-8 lg:p-12 lg:w-1/2">
              <h3 className="text-xl font-semibold mb-6">Vos coordonnées</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4">
                  <Label className="block mb-2">Type de rendez-vous *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'visio', icon: Video, label: 'Visio' },
                      { id: 'phone', icon: Phone, label: 'Téléphone' },
                      { id: 'in_person', icon: Users, label: 'Présentiel' }
                    ].map(type => (
                      <div
                        key={type.id}
                        onClick={() => setFormData(p => ({ ...p, type: type.id as any }))}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.type === type.id 
                            ? 'bg-green-50 border-primary text-primary' 
                            : 'bg-white border-border hover:border-gray-300 text-muted-foreground'
                        }`}
                      >
                        <type.icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nom complet *</Label>
                  <Input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="bg-[#FAFAFA]" />
                </div>
                
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-[#FAFAFA]" />
                </div>
                
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="bg-[#FAFAFA]" />
                </div>

                <div className="space-y-2">
                  <Label>Notes additionnelles (optionnel)</Label>
                  <Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-[#FAFAFA] h-24" placeholder="De quoi souhaitez-vous parler ?" />
                </div>

                <Button type="submit" disabled={createAppointment.isPending} className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90">
                  {createAppointment.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Confirmer le rendez-vous
                </Button>
              </form>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
