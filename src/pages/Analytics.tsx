import { useEffect, useState } from "react";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function Analytics() {
  useEffect(() => { store.seedIfEmpty(); }, []);

  const webinars = store.getWebinars();
  const allParticipants = store.getParticipants();
  const allCertificates = store.getCertificates();
  const allEmails = store.getEmailLogs();
  const allFeedback = store.getFeedback();

  const regByWebinar = webinars.map(w => ({
    name: w.title.length > 15 ? w.title.slice(0, 15) + '…' : w.title,
    registrations: store.getParticipants(w.id).length,
    attendance: store.getAttendance(w.id).filter(a => a.present).length,
  }));

  const attendanceRate = webinars.map(w => {
    const reg = store.getParticipants(w.id).length;
    const att = store.getAttendance(w.id).filter(a => a.present).length;
    return { name: w.title.length > 15 ? w.title.slice(0, 15) + '…' : w.title, rate: reg > 0 ? Math.round((att / reg) * 100) : 0 };
  });

  const emailPerf = [
    { name: 'Sent', value: allEmails.filter(e => e.status === 'sent').length },
    { name: 'Pending', value: allEmails.filter(e => e.status === 'pending').length },
    { name: 'Failed', value: allEmails.filter(e => e.status === 'failed').length },
  ].filter(d => d.value > 0);

  const ratingDist = [1, 2, 3, 4, 5].map(r => ({
    rating: `${r}★`,
    count: allFeedback.filter(f => f.rating === r).length,
  }));

  const COLORS = ['hsl(225,65%,52%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground">Comprehensive insights into your webinar program</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{webinars.length}</p><p className="text-xs text-muted-foreground">Webinars</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{allParticipants.length}</p><p className="text-xs text-muted-foreground">Registrations</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{allCertificates.length}</p><p className="text-xs text-muted-foreground">Certificates</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{allEmails.reduce((s, e) => s + e.recipientCount, 0)}</p><p className="text-xs text-muted-foreground">Emails Sent</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Registrations vs Attendance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regByWebinar}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="registrations" fill="hsl(225,65%,52%)" radius={[4,4,0,0]} name="Registrations" />
                <Bar dataKey="attendance" fill="hsl(142,72%,42%)" radius={[4,4,0,0]} name="Attendance" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Attendance Rate (%)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={attendanceRate}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="hsl(225,65%,52%)" strokeWidth={2} dot={{ r: 5 }} name="Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Email Campaign Status</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={emailPerf.length > 0 ? emailPerf : [{ name: 'No data', value: 1 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {(emailPerf.length > 0 ? emailPerf : [{ name: 'No data', value: 1 }]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Feedback Rating Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ratingDist}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="rating" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(38,92%,50%)" radius={[4,4,0,0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
