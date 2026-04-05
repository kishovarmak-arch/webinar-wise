import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { Webinar } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, Video, Calendar, Clock, LogOut, Upload, Bell } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function StudentDashboard() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    store.seedIfEmpty();
    setWebinars(store.getWebinars());
  }, []);

  const upcoming = webinars.filter(w => w.status === 'upcoming' || w.status === 'live');
  const pastEmails = store.getAllPreviousAttendeeEmails();
  const userEmail = store.getUserEmail();
  const isReturning = pastEmails.includes(userEmail);

  const handleLogout = () => { store.logout(); navigate("/login"); };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPaymentScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRegister = () => {
    if (!selectedWebinar || !studentName || !studentEmail || !studentId || !paymentScreenshot) {
      toast.error("Please fill all fields and upload payment screenshot");
      return;
    }
    store.addParticipant({
      id: crypto.randomUUID(),
      webinarId: selectedWebinar.id,
      name: studentName,
      studentId,
      email: studentEmail,
      phone,
      department,
      year,
      registeredAt: new Date().toISOString(),
      paymentVerified: false,
      paymentScreenshot,
      teamsLinkSent: false,
    });
    toast.success("Registration submitted! You will receive the Teams link after payment verification by admin.");
    setSelectedWebinar(null);
    setStudentName(""); setStudentEmail(""); setStudentId(""); setPhone(""); setDepartment(""); setYear(""); setPaymentScreenshot("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 flex items-center border-b bg-card px-6 gap-4 sticky top-0 z-10">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">NSCET Webinar Portal</span>
        <div className="flex-1" />
        <Badge variant="outline">Student</Badge>
        <span className="text-sm text-muted-foreground">{store.getUserName()}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {isReturning && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <p className="text-sm">Welcome back! As a previous attendee, you receive priority notifications for new webinars.</p>
            </CardContent>
          </Card>
        )}

        <div>
          <h1 className="text-2xl font-bold">Upcoming Webinars</h1>
          <p className="text-muted-foreground">Browse and register for upcoming webinars</p>
        </div>

        {upcoming.length === 0 ? (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No upcoming webinars at this time.</CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {upcoming.map(w => (
              <Card key={w.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{w.title}</h3>
                        <Badge variant={w.status === 'live' ? 'destructive' : 'default'}>{w.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{w.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Video className="h-3 w-3" />{w.mentorName}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(w.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{w.time}</span>
                        <span>🏢 {w.department}</span>
                        <span className="font-semibold text-foreground">₹99</span>
                      </div>
                    </div>
                    <Button onClick={() => setSelectedWebinar(w)}>Register & Pay</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Registration Dialog */}
        <Dialog open={!!selectedWebinar} onOpenChange={() => setSelectedWebinar(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Register for {selectedWebinar?.title}</DialogTitle>
            </DialogHeader>
            {selectedWebinar && (
              <div className="space-y-4">
                <Card className="bg-accent/30">
                  <CardContent className="p-4 text-center space-y-3">
                    <p className="text-sm font-medium">Scan QR to Pay ₹99</p>
                    <div className="flex justify-center">
                      <QRCodeSVG value={`upi://pay?pa=nscet@upi&pn=NSCET&am=99&tn=Webinar-${selectedWebinar.id}`} size={150} />
                    </div>
                    <p className="text-xs text-muted-foreground">After payment, take a screenshot of the success page and upload below</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Full Name *</label>
                    <Input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Student ID *</label>
                    <Input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="STU001" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Email *</label>
                    <Input type="email" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} placeholder="you@nscet.edu" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Phone</label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Department</label>
                    <Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="CSE" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Year</label>
                    <Input value={year} onChange={e => setYear(e.target.value)} placeholder="III" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Payment Screenshot *
                  </label>
                  <Input type="file" accept="image/*" onChange={handleScreenshotUpload} />
                  {paymentScreenshot && (
                    <img src={paymentScreenshot} alt="Payment" className="w-32 h-auto rounded border" />
                  )}
                </div>

                <Button className="w-full" onClick={handleRegister}>Submit Registration</Button>
                <p className="text-xs text-muted-foreground text-center">You'll receive the Teams link after admin verifies your payment.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
