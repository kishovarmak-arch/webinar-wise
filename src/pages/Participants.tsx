import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { Participant } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Users } from "lucide-react";
import { toast } from "sonner";

export default function Participants() {
  const [webinars, setWebinars] = useState(store.getWebinars());
  const [selectedWebinar, setSelectedWebinar] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);

  const participants = store.getParticipants(selectedWebinar === "all" ? undefined : selectedWebinar);
  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.studentId.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const previousEmails = store.getAllPreviousAttendeeEmails();

  const handleExport = () => {
    const csv = ["Name,Student ID,Email,Phone,Department,Year,Registered At",
      ...filtered.map(p => `${p.name},${p.studentId},${p.email},${p.phone},${p.department},${p.year},${p.registeredAt}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "participants.csv";
    link.click();
    toast.success("Exported!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Participants</h1>
          <p className="text-muted-foreground">Manage registered participants</p>
        </div>
        <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, ID, email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={selectedWebinar} onValueChange={setSelectedWebinar}>
          <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Webinars</SelectItem>
            {webinars.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{filtered.length}</p><p className="text-xs text-muted-foreground">Total Participants</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-green-600" /><div><p className="text-2xl font-bold">{previousEmails.length}</p><p className="text-xs text-muted-foreground">Previous Attendees</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-2xl font-bold">{new Set(participants.map(p => p.department)).size}</p><p className="text-xs text-muted-foreground">Departments</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Previous</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No participants found</TableCell></TableRow>
              ) : filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant="outline">{p.studentId}</Badge></TableCell>
                  <TableCell className="text-sm">{p.email}</TableCell>
                  <TableCell>{p.department}</TableCell>
                  <TableCell>{p.year}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.registeredAt).toLocaleDateString()}</TableCell>
                  <TableCell>{previousEmails.includes(p.email) ? <Badge className="bg-green-100 text-green-700">Yes</Badge> : <span className="text-muted-foreground text-sm">No</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
