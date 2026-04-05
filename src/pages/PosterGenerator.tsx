import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function PosterGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const webinar = store.getWebinar(id || "");
  const posterRef = useRef<HTMLDivElement>(null);

  if (!webinar) return <div className="text-center py-12 text-muted-foreground">Webinar not found</div>;

  const handleDownload = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `${webinar.title.replace(/\s+/g, '_')}_poster.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success("Poster downloaded!");
    } catch {
      toast.error("Failed to download poster");
    }
  };

  const regUrl = `${window.location.origin}/register/${webinar.id}`;
  const dateFormatted = new Date(webinar.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeFormatted = webinar.time ? new Date(`2000-01-01T${webinar.time}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

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
            <CardHeader><CardTitle className="text-lg">Poster Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Title:</strong> {webinar.title}</p>
              <p><strong>Mentor:</strong> {webinar.mentorName}</p>
              <p><strong>Domain:</strong> {webinar.domain}</p>
              <p><strong>Date:</strong> {dateFormatted}</p>
              <p><strong>Time:</strong> {timeFormatted}</p>
              <p><strong>Platform:</strong> {webinar.platform || 'Microsoft Teams'}</p>
              <p><strong>Fee:</strong> ₹99</p>
            </CardContent>
          </Card>
          <Button className="w-full" onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Download Poster</Button>
        </div>

        <div className="lg:col-span-2 flex justify-center">
          {/* Poster Canvas — Dark theme matching reference */}
          <div
            ref={posterRef}
            className="relative overflow-hidden"
            style={{
              width: 500, height: 750,
              background: 'radial-gradient(ellipse at top right, #2a0a0a 0%, #0a0a0a 40%, #0d0d0d 100%)',
              fontFamily: "'Segoe UI', sans-serif",
              color: '#ffffff',
            }}
          >
            {/* Border glow */}
            <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, pointerEvents: 'none' }} />

            {/* Star particles */}
            {[...Array(20)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: 2, height: 2,
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }} />
            ))}

            {/* Top glow */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)' }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 10, padding: '24px 28px', display: 'flex', flexDirection: 'column', height: '100%' }}>

              {/* College Name */}
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, color: '#e0e0e0' }}>NADAR SARASWATHI COLLEGE OF</p>
                <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: '#dc2626' }}>ENGINEERING & TECHNOLOGY</p>
              </div>

              {/* Premium Webinar badge */}
              <div style={{ textAlign: 'center', margin: '8px 0 16px' }}>
                <span style={{
                  display: 'inline-block', padding: '6px 24px',
                  border: '1px solid rgba(220,38,38,0.5)', borderRadius: 20,
                  fontSize: 11, fontWeight: 600, letterSpacing: 3, color: '#dc2626',
                  textTransform: 'uppercase',
                }}>Premium Webinar</span>
              </div>

              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {webinar.title}
                </h2>
              </div>

              {/* Info card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.95) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: 16,
                display: 'flex', gap: 12, alignItems: 'center',
                marginBottom: 16, flex: '0 0 auto',
              }}>
                {/* Mentor */}
                <div style={{ flex: '0 0 100px', textAlign: 'center' }}>
                  {webinar.mentorPhoto ? (
                    <img src={webinar.mentorPhoto} alt={webinar.mentorName} style={{
                      width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                      border: '2px solid #dc2626', margin: '0 auto',
                    }} />
                  ) : (
                    <div style={{
                      width: 80, height: 80, borderRadius: '50%', margin: '0 auto',
                      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                      border: '2px solid #dc2626',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, fontWeight: 700, color: '#dc2626',
                    }}>{webinar.mentorName.charAt(0)}</div>
                  )}
                  <p style={{ fontSize: 9, color: '#dc2626', fontWeight: 700, letterSpacing: 2, marginTop: 6, textTransform: 'uppercase' }}>Expert Mentor</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 2 }}>{webinar.mentorName}</p>
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <InfoRow icon="📅" label="DATE" value={dateFormatted} />
                  <InfoRow icon="🕐" label="TIME" value={timeFormatted} />
                  <InfoRow icon="💻" label="PLATFORM" value={webinar.platform || 'Live on Teams'} />
                </div>

                {/* QR */}
                <div style={{ flex: '0 0 100px', textAlign: 'center' }}>
                  <div style={{
                    background: '#ffffff', borderRadius: 8, padding: 8,
                    display: 'inline-block',
                  }}>
                    <QRCodeSVG value={regUrl} size={80} />
                  </div>
                  <p style={{ fontSize: 8, color: '#888', marginTop: 6, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Scan to Join</p>
                </div>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Register Button */}
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{
                  display: 'inline-block', padding: '12px 48px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  borderRadius: 30, fontSize: 16, fontWeight: 800,
                  letterSpacing: 4, textTransform: 'uppercase',
                  color: '#ffffff',
                }}>Register Now</div>
              </div>

              {/* Fee */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{
                  display: 'inline-block', padding: '6px 20px',
                  border: '1px solid rgba(220,38,38,0.4)', borderRadius: 20,
                  fontSize: 13, color: '#dc2626', fontWeight: 600,
                }}>Registration Fee: ₹ 99</span>
              </div>

              {/* Footer */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 8, letterSpacing: 3, color: '#666', textTransform: 'uppercase', marginBottom: 4 }}>Exclusively Organized By</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', letterSpacing: 1 }}>NADAR SARASWATHI COLLEGE OF ENGINEERING & TECHNOLOGY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '6px 10px',
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 8, color: '#888', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{value}</p>
      </div>
    </div>
  );
}
