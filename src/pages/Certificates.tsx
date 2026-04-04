import { useState, useEffect, useRef } from "react";
import { store } from "@/lib/store";
import { Certificate } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    else toast.info("No new eligible participants. Certificates require matching registered + attended Student IDs.");
  };

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2 });
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
          <p className="text-muted-foreground">Generate and manage participation certificates</p>
        </div>
        <Button onClick={handleGenerate} disabled={!selectedWebinar}><RefreshCw className="mr-2 h-4 w-4" />Generate Certificates</Button>
      </div>

      <Card className="bg-accent/30 border-primary/20">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Business Rule:</strong> Certificates are only generated for participants whose <strong>registered Student ID</strong> matches their <strong>attended Student ID</strong>. Non-registered attendees cannot receive certificates.
        </CardContent>
      </Card>

      <Select value={selectedWebinar} onValueChange={setSelectedWebinar}>
        <SelectTrigger className="w-full sm:w-[300px]"><SelectValue placeholder="Select a webinar (or view all)" /></SelectTrigger>
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

      <Dialog open={!!previewCert} onOpenChange={() => setPreviewCert(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {previewCert && (
            <div className="space-y-4">
              <div ref={certRef} className="bg-white border-8 border-double border-primary/30 rounded-lg p-10 text-center space-y-4" style={{ aspectRatio: '1.414/1' }}>
                <div className="text-xs tracking-[0.3em] text-muted-foreground uppercase">NSCET — Department of Higher Education</div>
                <div className="text-3xl font-serif font-bold text-primary">Certificate of Participation</div>
                <div className="w-24 h-0.5 bg-primary/30 mx-auto" />
                <p className="text-muted-foreground">This is to certify that</p>
                <p className="text-2xl font-bold text-foreground">{previewCert.participantName}</p>
                <p className="text-sm text-muted-foreground">Student ID: {previewCert.studentId}</p>
                <p className="text-muted-foreground">has successfully participated in the webinar</p>
                <p className="text-lg font-semibold text-primary">"{previewCert.webinarTitle}"</p>
                <p className="text-sm text-muted-foreground">held on {new Date(previewCert.webinarDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <div className="pt-8 flex justify-between items-end px-8">
                  <div className="text-center"><div className="w-32 border-t border-muted-foreground/30" /><p className="text-xs text-muted-foreground mt-1">Organizer</p></div>
                  <div className="text-center"><div className="w-32 border-t border-muted-foreground/30" /><p className="text-xs text-muted-foreground mt-1">Head of Department</p></div>
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
