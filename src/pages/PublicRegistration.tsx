import { useState } from "react";
import { useParams } from "react-router-dom";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, GraduationCap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export default function PublicRegistration() {
  const { id } = useParams();
  const webinar = store.getWebinar(id || "");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", studentId: "", email: "", phone: "", department: "", year: "" });

  if (!webinar) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full mx-4"><CardContent className="p-12 text-center text-muted-foreground">Webinar not found or registration closed.</CardContent></Card>
    </div>
  );

  const regUrl = `${window.location.origin}/register/${webinar.id}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.studentId || !form.email || !form.phone || !form.department || !form.year) {
      toast.error("Please fill all fields");
      return;
    }
    const existing = store.getParticipants(webinar.id);
    if (existing.some(p => p.studentId === form.studentId)) {
      toast.error("This Student ID is already registered");
      return;
    }
    store.addParticipant({
      id: crypto.randomUUID(),
      webinarId: webinar.id,
      ...form,
      registeredAt: new Date().toISOString(),
      paymentVerified: false,
      paymentScreenshot: '',
      teamsLinkSent: false,
    });
    setSubmitted(true);
    toast.success("Registration successful!");
  };

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8 space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Registration Successful!</h2>
          <p className="text-muted-foreground">You've been registered for <strong>{webinar.title}</strong></p>
          <div className="bg-muted p-4 rounded-lg text-sm space-y-1">
            <p><strong>Student ID:</strong> {form.studentId}</p>
            <p><strong>Date:</strong> {new Date(webinar.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {webinar.time}</p>
            <p><strong>Fee:</strong> ₹{webinar.registrationFee}</p>
          </div>
          <p className="text-xs text-muted-foreground">Save your Student ID — you'll need it for attendance and certificate.</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">NSCET Webinar Registration</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{webinar.title}</CardTitle>
            <CardDescription>{webinar.description}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">🎤 {webinar.mentorName}</Badge>
              <Badge variant="secondary">📅 {new Date(webinar.date).toLocaleDateString()}</Badge>
              <Badge variant="secondary">🕐 {webinar.time}</Badge>
              <Badge>₹{webinar.registrationFee}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Student ID *</label>
                  <Input value={form.studentId} onChange={e => update("studentId", e.target.value)} placeholder="STU001" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="student@nscet.edu" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone *</label>
                  <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="9876543210" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department *</label>
                  <Select value={form.department} onValueChange={v => update("department", v)}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year *</label>
                  <Select value={form.year} onValueChange={v => update("year", v)}>
                    <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>
                      {["I", "II", "III", "IV"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Register — ₹{webinar.registrationFee}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-center gap-6">
            <QRCodeSVG value={regUrl} size={120} />
            <div className="text-sm space-y-1">
              <p className="font-medium">Share Registration Link</p>
              <p className="text-muted-foreground text-xs break-all">{regUrl}</p>
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(regUrl); toast.success("Link copied!"); }}>Copy Link</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
