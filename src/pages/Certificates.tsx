import { useState, useEffect, useRef } from "react";
import { store } from "@/lib/store";
import { Certificate } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, Download, RefreshCw, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function Certificates() {
  const [webinars, setWebinars] = useState(store.getWebinars());
  const [selectedWebinar, setSelectedWebinar] = useState("");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);
  useEffect(() => { setCertificates(store.getCertificates(selectedWebinar || undefined)); }, [selectedWebinar]);

  const handleGenerate = () => {
    if (!selectedWebinar) { toast.error("Select a webinar first"); return; }
    const newCerts = store.generateCertificates(selectedWebinar);
    setCertificates(store.getCertificates(selectedWebinar));
    if (newCerts.length > 0) toast.success(`${newCerts.length} certificates generated!`);
    else toast.info("No new eligible participants. Registered email must match attended email.");
  };

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: '#ffffff' });
    const link = document.createElement("a");
    link.download = `certificate_${previewCert?.participantName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Certificate downloaded!");
  };

  const allCerts = selectedWebinar ? certificates : store.getCertificates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Generate professional certificates for eligible participants</p>
        </div>
        <Button onClick={handleGenerate} disabled={!selectedWebinar}><RefreshCw className="mr-2 h-4 w-4" />Generate Certificates</Button>
      </div>

      <Card className="bg-accent/30 border-primary/20">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Rule:</strong> Certificates are only generated when the <strong>registered email</strong> matches the <strong>attended email</strong> from the uploaded attendance file.
        </CardContent>
      </Card>

      <Select value={selectedWebinar} onValueChange={setSelectedWebinar}>
        <SelectTrigger className="w-full sm:w-[300px]"><SelectValue placeholder="Select a webinar" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Webinars</SelectItem>
          {webinars.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Award className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{allCerts.length}</p><p className="text-xs text-muted-foreground">Certificates Issued</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Webinar</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCerts.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No certificates generated yet</TableCell></TableRow>
              ) : allCerts.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.participantName}</TableCell>
                  <TableCell><Badge variant="outline">{c.studentId}</Badge></TableCell>
                  <TableCell className="text-sm">{c.webinarTitle}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(c.issuedAt).toLocaleDateString()}</TableCell>
                  <TableCell><Button variant="ghost" size="sm" onClick={() => setPreviewCert(c)}><Eye className="mr-1 h-3 w-3" />Preview</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Professional Light Theme Certificate */}
      <Dialog open={!!previewCert} onOpenChange={() => setPreviewCert(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Certificate Preview</DialogTitle></DialogHeader>
          {previewCert && (
            <div className="space-y-4">
              <div
                ref={certRef}
                style={{
                  width: 700, minHeight: 500, aspectRatio: '1.414/1',
                  background: 'linear-gradient(135deg, #fefefe 0%, #f8f6f0 100%)',
                  padding: 0, position: 'relative', overflow: 'hidden',
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                }}
              >
                {/* Decorative border */}
                <div style={{ position: 'absolute', inset: 12, border: '2px solid #c9a96e', borderRadius: 4 }} />
                <div style={{ position: 'absolute', inset: 16, border: '1px solid #e8d5a8', borderRadius: 2 }} />

                {/* Corner ornaments */}
                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => (
                  <div key={corner} style={{
                    position: 'absolute',
                    [corner.includes('top') ? 'top' : 'bottom']: 20,
                    [corner.includes('left') ? 'left' : 'right']: 20,
                    width: 30, height: 30,
                    borderTop: corner.includes('top') ? '3px solid #c9a96e' : 'none',
                    borderBottom: corner.includes('bottom') ? '3px solid #c9a96e' : 'none',
                    borderLeft: corner.includes('left') ? '3px solid #c9a96e' : 'none',
                    borderRight: corner.includes('right') ? '3px solid #c9a96e' : 'none',
                  }} />
                ))}

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, padding: '40px 50px', textAlign: 'center' }}>
                  {/* College */}
                  <p style={{ fontSize: 11, letterSpacing: 4, color: '#8b7355', textTransform: 'uppercase', marginBottom: 4 }}>
                    Nadar Saraswathi College of Engineering and Technology
                  </p>

                  {/* Title */}
                  <h1 style={{ fontSize: 32, fontWeight: 700, color: '#2d5016', marginTop: 16, marginBottom: 4, letterSpacing: 2 }}>
                    Certificate of Participation
                  </h1>

                  {/* Divider */}
                  <div style={{ width: 120, height: 2, background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)', margin: '12px auto' }} />

                  <p style={{ fontSize: 13, color: '#666', marginTop: 16 }}>This is to certify that</p>

                  {/* Name */}
                  <p style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: '10px 0', fontStyle: 'italic' }}>
                    {previewCert.participantName}
                  </p>

                  <p style={{ fontSize: 13, color: '#666' }}>has successfully participated in the webinar on</p>

                  {/* Topic */}
                  <p style={{ fontSize: 18, fontWeight: 600, color: '#2d5016', margin: '8px 0' }}>
                    "{previewCert.webinarTitle}"
                  </p>

                  {/* Domain */}
                  <p style={{ fontSize: 13, color: '#555' }}>
                    Domain: <strong>{previewCert.webinarDomain}</strong>
                  </p>

                  {/* Date */}
                  <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
                    held on <strong>{new Date(previewCert.webinarDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </p>

                  {/* Signatures */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, padding: '0 30px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 140, borderTop: '1.5px solid #999', marginBottom: 4 }} />
                      <p style={{ fontSize: 10, color: '#888' }}>Webinar Coordinator</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 140, borderTop: '1.5px solid #999', marginBottom: 4 }} />
                      <p style={{ fontSize: 10, color: '#888' }}>Head of Department</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 140, borderTop: '1.5px solid #999', marginBottom: 4 }} />
                      <p style={{ fontSize: 10, color: '#888' }}>Principal</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Download</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
