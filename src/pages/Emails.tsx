import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, Clock, Users } from "lucide-react";
import { toast } from "sonner";

export default function Emails() {
  const [webinars, setWebinars] = useState(store.getWebinars());
  const [selectedWebinar, setSelectedWebinar] = useState("");
  const [emailType, setEmailType] = useState<'invitation' | 'reminder' | 'followup'>('invitation');
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);

  const emailLogs = store.getEmailLogs();
  const previousEmails = store.getAllPreviousAttendeeEmails();
  const webinar = store.getWebinar(selectedWebinar);

  const handleSend = () => {
    if (!selectedWebinar || !subject) { toast.error("Select a webinar and enter subject"); return; }
    const recipients = emailType === 'followup' ? previousEmails.length : store.getParticipants(selectedWebinar).length;
    store.addEmailLog({
      id: crypto.randomUUID(),
      webinarId: selectedWebinar,
      subject,
      type: emailType,
      recipientCount: recipients || 1,
      status: 'sent',
      sentAt: new Date().toISOString(),
    });
    toast.success(`Email "${subject}" sent to ${recipients} recipients (mock)`);
    setSubject("");
    setBody("");
  };

  const statusColor = (s: string) => s === 'sent' ? 'default' : s === 'pending' ? 'secondary' : 'destructive';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Email Campaigns</h1>
        <p className="text-muted-foreground">Send invitations, reminders, and follow-ups</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{emailLogs.length}</p><p className="text-xs text-muted-foreground">Total Campaigns</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Send className="h-5 w-5 text-green-600" /><div><p className="text-2xl font-bold">{emailLogs.filter(e => e.status === 'sent').length}</p><p className="text-xs text-muted-foreground">Sent</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-2xl font-bold">{previousEmails.length}</p><p className="text-xs text-muted-foreground">Previous Attendees</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="compose">
        <TabsList><TabsTrigger value="compose">Compose</TabsTrigger><TabsTrigger value="logs">Email Logs</TabsTrigger></TabsList>

        <TabsContent value="compose">
          <Card>
            <CardHeader><CardTitle className="text-lg">Compose Email</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Webinar</label>
                  <Select value={selectedWebinar} onValueChange={setSelectedWebinar}>
                    <SelectTrigger><SelectValue placeholder="Select webinar" /></SelectTrigger>
                    <SelectContent>{webinars.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Type</label>
                  <Select value={emailType} onValueChange={v => setEmailType(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invitation">Invitation</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="followup">Follow-up (Previous Attendees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {emailType === 'followup' && (
                <Card className="bg-accent/30 border-primary/20"><CardContent className="p-3 text-sm text-muted-foreground">
                  <strong>Auto-populated:</strong> {previousEmails.length} previous attendee emails will receive this email.
                </CardContent></Card>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Body</label>
                <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Email content..." rows={6} />
              </div>
              <Button onClick={handleSend}><Send className="mr-2 h-4 w-4" />Send Email (Mock)</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailLogs.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No emails sent yet</TableCell></TableRow>
                  ) : emailLogs.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.subject}</TableCell>
                      <TableCell><Badge variant="outline">{e.type}</Badge></TableCell>
                      <TableCell>{e.recipientCount}</TableCell>
                      <TableCell><Badge variant={statusColor(e.status) as any}>{e.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(e.sentAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
