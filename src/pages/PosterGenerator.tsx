import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { store } from "@/lib/store";
import { PosterTheme } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ThemeConfig {
  name: string;
  id: PosterTheme;
  bg: string;
  textColor: string;
  accentColor: string;
  borderStyle: string;
  fontStyle: string;
  overlay: string;
}

const themes: ThemeConfig[] = [
  { id: 'professional-blue', name: 'Professional Blue', bg: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', textColor: '#ffffff', accentColor: '#60a5fa', borderStyle: 'border-2 border-blue-300/30', fontStyle: 'font-sans', overlay: '' },
  { id: 'elegant-dark', name: 'Elegant Dark', bg: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)', textColor: '#f0f0f0', accentColor: '#e2b85e', borderStyle: 'border border-yellow-600/30', fontStyle: 'font-serif', overlay: '' },
  { id: 'tech-gradient', name: 'Tech Gradient', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textColor: '#ffffff', accentColor: '#c4b5fd', borderStyle: '', fontStyle: 'font-mono', overlay: '' },
  { id: 'minimal-white', name: 'Minimal White', bg: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', textColor: '#1e293b', accentColor: '#3b82f6', borderStyle: 'border-2 border-gray-200', fontStyle: 'font-sans', overlay: '' },
  { id: 'vibrant-orange', name: 'Vibrant Orange', bg: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)', textColor: '#ffffff', accentColor: '#fff3e0', borderStyle: '', fontStyle: 'font-sans', overlay: '' },
  { id: 'academic-green', name: 'Academic Green', bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', textColor: '#ffffff', accentColor: '#a7f3d0', borderStyle: 'border-2 border-emerald-300/30', fontStyle: 'font-serif', overlay: '' },
  { id: 'creative-purple', name: 'Creative Purple', bg: 'linear-gradient(135deg, #6b21a8 0%, #a855f7 50%, #ec4899 100%)', textColor: '#ffffff', accentColor: '#f0abfc', borderStyle: '', fontStyle: 'font-sans', overlay: '' },
  { id: 'bold-red', name: 'Bold Red', bg: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)', textColor: '#ffffff', accentColor: '#fca5a5', borderStyle: 'border-2 border-red-300/20', fontStyle: 'font-sans', overlay: '' },
  { id: 'soft-pastel', name: 'Soft Pastel', bg: 'linear-gradient(135deg, #fce4ec 0%, #e8eaf6 50%, #e0f7fa 100%)', textColor: '#37474f', accentColor: '#7c4dff', borderStyle: 'border border-pink-200', fontStyle: 'font-sans', overlay: '' },
  { id: 'neon-glow', name: 'Neon Glow', bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)', textColor: '#00ff88', accentColor: '#ff00ff', borderStyle: 'border border-green-400/50', fontStyle: 'font-mono', overlay: '' },
  { id: 'classic-gold', name: 'Classic Gold', bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', textColor: '#d4af37', accentColor: '#ffd700', borderStyle: 'border-2 border-yellow-600/40', fontStyle: 'font-serif', overlay: '' },
  { id: 'modern-teal', name: 'Modern Teal', bg: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)', textColor: '#ffffff', accentColor: '#a7f3d0', borderStyle: '', fontStyle: 'font-sans', overlay: '' },
  { id: 'geometric', name: 'Geometric', bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', textColor: '#e0e7ff', accentColor: '#818cf8', borderStyle: 'border border-indigo-400/30', fontStyle: 'font-sans', overlay: '' },
  { id: 'abstract-wave', name: 'Abstract Wave', bg: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #38bdf8 100%)', textColor: '#ffffff', accentColor: '#bae6fd', borderStyle: '', fontStyle: 'font-sans', overlay: '' },
];

export default function PosterGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const webinar = store.getWebinar(id || "");
  const [selectedTheme, setSelectedTheme] = useState<PosterTheme>('professional-blue');
  const posterRef = useRef<HTMLDivElement>(null);

  if (!webinar) return <div className="text-center py-12 text-muted-foreground">Webinar not found</div>;

  const theme = themes.find(t => t.id === selectedTheme)!;

  const handleDownload = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `${webinar.title.replace(/\s+/g, '_')}_poster.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success("Poster downloaded!");
    } catch {
      toast.error("Failed to download poster");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Poster Generator</h1>
          <p className="text-muted-foreground">{webinar.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Select Theme</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-3 rounded-lg text-xs font-medium text-left transition-all ${selectedTheme === t.id ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-1 hover:ring-border'}`}
                    style={{ background: t.bg, color: t.textColor }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Button className="w-full" onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Download Poster</Button>
        </div>

        <div className="lg:col-span-2 flex justify-center">
          <div
            ref={posterRef}
            className={`w-[500px] h-[700px] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden ${theme.borderStyle} ${theme.fontStyle}`}
            style={{ background: theme.bg, color: theme.textColor }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: theme.accentColor, filter: 'blur(60px)' }} />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-10" style={{ background: theme.accentColor, filter: 'blur(80px)' }} />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">NSCET PRESENTS</p>
                <p className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: theme.accentColor + '40', color: theme.accentColor }}>WEBINAR</p>
              </div>
              <div className="mt-6">
                <h2 className="text-3xl font-bold leading-tight">{webinar.title}</h2>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">{webinar.topic}</p>
              </div>
            </div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-4">
                {webinar.mentorPhoto ? (
                  <img src={webinar.mentorPhoto} alt={webinar.mentorName} className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: theme.accentColor }} />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: theme.accentColor + '30', color: theme.accentColor }}>
                    {webinar.mentorName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm opacity-60">Speaker</p>
                  <p className="font-semibold text-lg">{webinar.mentorName}</p>
                  <p className="text-xs opacity-60">{webinar.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl" style={{ background: theme.accentColor + '15' }}>
                  <p className="text-[10px] uppercase opacity-60">Date</p>
                  <p className="text-sm font-semibold">{new Date(webinar.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: theme.accentColor + '15' }}>
                  <p className="text-[10px] uppercase opacity-60">Time</p>
                  <p className="text-sm font-semibold">{webinar.time}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: theme.accentColor + '15' }}>
                  <p className="text-[10px] uppercase opacity-60">Fee</p>
                  <p className="text-sm font-semibold">₹{webinar.registrationFee}</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-[10px] uppercase opacity-50 tracking-wider">Register Now</p>
                <p className="text-xs opacity-60 mt-1">{window.location.origin}/register/{webinar.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
