import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { Participant } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, CreditCard, Send } from "lucide-react";
import { toast } from "sonner";

export default function Payments() {
  const [webinars, setWebinars] = useState(store.getWebinars());
  const [selectedWebinar, setSelectedWebinar] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [previewScreenshot, setPreviewScreenshot] = useState("");

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);
  useEffect(() => {
    setParticipants(store.getParticipants(selectedWebinar || undefined));
  }, [selectedWebinar]);

  const refresh = () => setParticipants(store.getParticipants(selectedWebinar || undefined));

  const handleVerify = (p: Participant) => {
    store.updateParticipant({ ...p, paymentVerified: true });
    toast.success(`Payment verified for ${p.name}`);
    refresh();
  };

  const handleSendTeamsLink = (p: Participant) => {
    const webinar = store.getWebinar(p.webinarId);
    if (!webinar?.teamsLink) { toast.error("No Teams link set for this webinar"); return; }
    store.updateParticipant({ ...p, teamsLinkSent: true });
    toast.success(`Teams link sent to ${p.name} (${p.email})`);
    refresh();
  };

  const pending = participants.filter(p => !p.paymentVerified);
  const verified = participants.filter(p => p.paymentVerified);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Verification</h1>
        <p className="text-muted-foreground">Verify student payments and send Teams links</p>
      </div>

      <Select value={selectedWebinar} onValueChange={setSelectedWebinar}>
        <SelectTrigger className="w-full sm:w-[300px]"><SelectValue placeholder="Select a webinar" /></SelectTrigger>
        <SelectContent>{webinars.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}</SelectContent>
      </Select>

      {selectedWebinar && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card><CardContent className="p-4 flex items-center gap-3"><CreditCard className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{participants.length}</p><p className="text-xs text-muted-foreground">Total Registrations</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600" /><div><p className="text-2xl font-bold">{verified.length}</p><p className="text-xs text-muted-foreground">Verified</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><XCircle className="h-5 w-5 text-amber-500" /><div><p className="text-2xl font-bold">{pending.length}</p><p className="text-xs text-muted-foreground">Pending</p></div></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-lg">Payment Status</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Teams Link</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No registrations</TableCell></TableRow>
                  ) : participants.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-sm">{p.email}</TableCell>
                      <TableCell>
                        {p.paymentVerified ? (
                          <Badge className="bg-green-100 text-green-700">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {p.teamsLinkSent ? (
                          <Badge className="bg-blue-100 text-blue-700">Sent</Badge>
                        ) : (
                          <Badge variant="outline">Not Sent</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {p.paymentScreenshot && (
                            <Button variant="ghost" size="sm" onClick={() => setPreviewScreenshot(p.paymentScreenshot)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          {!p.paymentVerified && (
                            <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleVerify(p)}>
                              <CheckCircle className="h-3 w-3 mr-1" />Verify
                            </Button>
                          )}
                          {p.paymentVerified && !p.teamsLinkSent && (
                            <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handleSendTeamsLink(p)}>
                              <Send className="h-3 w-3 mr-1" />Send Link
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={!!previewScreenshot} onOpenChange={() => setPreviewScreenshot("")}>
        <DialogContent>
          <DialogHeader><DialogTitle>Payment Screenshot</DialogTitle></DialogHeader>
          {previewScreenshot && <img src={previewScreenshot} alt="Payment proof" className="w-full rounded" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
