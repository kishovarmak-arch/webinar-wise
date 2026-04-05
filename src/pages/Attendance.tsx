import { useState, useEffect, useRef } from "react";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, UserCheck, UserX, Download, Upload } from "lucide-react";
import { toast } from "sonner";

export default function Attendance() {
  const [webinars, setWebinars] = useState(store.getWebinars());
  const [selectedWebinar, setSelectedWebinar] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);

  const participants = store.getParticipants(selectedWebinar);
  const attendance = store.getAttendance(selectedWebinar);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedWebinar) { toast.error("Select a webinar and file"); return; }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      // Expect CSV with email column — first column or column named "email"
      const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
      const emailIdx = header.indexOf('email');
      if (emailIdx === -1) {
        toast.error("Excel/CSV must have an 'email' column");
        return;
      }

      let matched = 0;
      const records = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));
        const email = cols[emailIdx];
        if (!email) continue;

        const participant = participants.find(p => p.email.toLowerCase() === email.toLowerCase());
        if (participant) {
          records.push({
            id: crypto.randomUUID(),
            webinarId: selectedWebinar,
            studentId: participant.studentId,
            participantId: participant.id,
            markedAt: new Date().toISOString(),
            present: true,
            email: participant.email,
          });
          matched++;
        }
      }

      if (records.length > 0) {
        store.bulkMarkAttendance(records);
        setRefreshKey(k => k + 1);
        toast.success(`${matched} students marked present from uploaded file`);
      } else {
        toast.error("No matching registered emails found in the uploaded file");
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const presentCount = attendance.filter(a => a.present).length;
  const absentCount = participants.length - presentCount;

  const handleExport = () => {
    const rows = participants.map(p => {
      const a = attendance.find(att => att.email === p.email);
      return `${p.name},${p.studentId},${p.email},${a?.present ? 'Present' : 'Absent'},${a?.markedAt || ''}`;
    });
    const csv = ["Name,Student ID,Email,Status,Marked At", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance.csv";
    link.click();
    toast.success("Exported!");
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      <div>
        <h1 className="text-2xl font-bold">Attendance Tracking</h1>
        <p className="text-muted-foreground">Upload attendance Excel/CSV file to mark attendance</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedWebinar} onValueChange={setSelectedWebinar}>
          <SelectTrigger className="w-full sm:w-[300px]"><SelectValue placeholder="Select a webinar" /></SelectTrigger>
          <SelectContent>{webinars.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {selectedWebinar && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card><CardContent className="p-4 flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{participants.length}</p><p className="text-xs text-muted-foreground">Registered</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><UserCheck className="h-5 w-5 text-green-600" /><div><p className="text-2xl font-bold">{presentCount}</p><p className="text-xs text-muted-foreground">Present</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><UserX className="h-5 w-5 text-red-500" /><div><p className="text-2xl font-bold">{absentCount}</p><p className="text-xs text-muted-foreground">Absent</p></div></CardContent></Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Attendance File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Upload a CSV/Excel file with an <strong>"email"</strong> column. Only registered emails will be marked present.</p>
              <div className="flex gap-3 items-center">
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleExcelUpload} className="text-sm" />
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="mr-1 h-3 w-3" />Upload
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Workflow: Upload attendance → Matching registered + attended emails → Certificate generation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Attendance List</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-1 h-3 w-3" />Export</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Marked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map(p => {
                    const a = attendance.find(att => att.email === p.email);
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell><Badge variant="outline">{p.studentId}</Badge></TableCell>
                        <TableCell className="text-sm">{p.email}</TableCell>
                        <TableCell>
                          {a?.present ? <Badge className="bg-green-100 text-green-700">Present</Badge> : <Badge variant="secondary">Absent</Badge>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{a?.markedAt ? new Date(a.markedAt).toLocaleString() : '—'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
