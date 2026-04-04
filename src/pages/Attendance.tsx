import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, UserCheck, UserX, Download } from "lucide-react";
import { toast } from "sonner";

export default function Attendance() {
  const [webinars, setWebinars] = useState(store.getWebinars());
  const [selectedWebinar, setSelectedWebinar] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);

  const webinar = store.getWebinar(selectedWebinar);
  const participants = store.getParticipants(selectedWebinar);
  const attendance = store.getAttendance(selectedWebinar);

  const markPresent = () => {
    if (!studentId || !selectedWebinar) { toast.error("Enter a Student ID"); return; }
    const participant = participants.find(p => p.studentId === studentId);
    if (!participant) { toast.error("Student ID not registered for this webinar. Only registered students can be marked present."); return; }
    if (attendance.find(a => a.studentId === studentId && a.present)) { toast.info("Already marked present"); return; }
    store.markAttendance({
      id: crypto.randomUUID(),
      webinarId: selectedWebinar,
      studentId,
      participantId: participant.id,
      markedAt: new Date().toISOString(),
      present: true,
    });
    setStudentId("");
    toast.success(`${participant.name} marked present!`);
  };

  const presentCount = attendance.filter(a => a.present).length;
  const absentCount = participants.length - presentCount;

  const handleExport = () => {
    const rows = participants.map(p => {
      const a = attendance.find(att => att.studentId === p.studentId);
      return `${p.name},${p.studentId},${a?.present ? 'Present' : 'Absent'},${a?.markedAt || ''}`;
    });
    const csv = ["Name,Student ID,Status,Marked At", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance.csv";
    link.click();
    toast.success("Exported!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance Tracking</h1>
        <p className="text-muted-foreground">Mark and track webinar attendance</p>
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
            <CardHeader><CardTitle className="text-lg">Mark Attendance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input placeholder="Enter Student ID (e.g. STU001)" value={studentId} onChange={e => setStudentId(e.target.value)} onKeyDown={e => e.key === 'Enter' && markPresent()} className="max-w-sm" />
                <Button onClick={markPresent}>Mark Present</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Only registered Student IDs can be marked present</p>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Marked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map(p => {
                    const a = attendance.find(att => att.studentId === p.studentId);
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell><Badge variant="outline">{p.studentId}</Badge></TableCell>
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
