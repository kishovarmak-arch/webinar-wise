import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Users, Award, Mail, Plus, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const [webinars, setWebinars] = useState(store.getWebinars());
  const participants = store.getParticipants();
  const certificates = store.getCertificates();
  const emails = store.getEmailLogs();

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);

  const stats = [
    { label: "Total Webinars", value: webinars.length, icon: Video, color: "text-primary" },
    { label: "Registrations", value: participants.length, icon: Users, color: "text-info" },
    { label: "Certificates", value: certificates.length, icon: Award, color: "text-success" },
    { label: "Emails Sent", value: emails.filter(e => e.status === 'sent').length, icon: Mail, color: "text-warning" },
  ];

  const regData = webinars.map(w => ({
    name: w.title.length > 20 ? w.title.slice(0, 20) + '…' : w.title,
    registrations: store.getParticipants(w.id).length,
  }));

  const statusData = [
    { name: 'Upcoming', value: webinars.filter(w => w.status === 'upcoming').length },
    { name: 'Completed', value: webinars.filter(w => w.status === 'completed').length },
    { name: 'Draft', value: webinars.filter(w => w.status === 'draft').length },
  ].filter(d => d.value > 0);

  const COLORS = ['hsl(225,65%,52%)', 'hsl(142,72%,42%)', 'hsl(220,9%,46%)'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your webinar management system</p>
        </div>
        <Button asChild>
          <Link to="/admin/webinars/create"><Plus className="mr-2 h-4 w-4" />Create Webinar</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Registrations by Webinar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="registrations" fill="hsl(225,65%,52%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Webinar Status</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Webinars</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/webinars">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {webinars.slice(0, 5).map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{w.title}</p>
                  <p className="text-sm text-muted-foreground">{w.mentorName} · {new Date(w.date).toLocaleDateString()}</p>
                </div>
                <Badge variant={w.status === 'upcoming' ? 'default' : w.status === 'completed' ? 'secondary' : 'outline'}>
                  {w.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
