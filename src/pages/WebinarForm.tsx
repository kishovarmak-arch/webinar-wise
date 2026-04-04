import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "@/lib/store";
import { Webinar } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const departments = ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil"];

export default function WebinarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id ? store.getWebinar(id) : undefined;
  const isEdit = !!existing;

  const [form, setForm] = useState<Partial<Webinar>>(existing || {
    title: "", topic: "", description: "", mentorName: "", mentorPhoto: "",
    department: "Computer Science", date: "", time: "", registrationFee: 99, status: "draft",
  });

  const update = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.topic || !form.mentorName || !form.date || !form.time) {
      toast.error("Please fill all required fields");
      return;
    }
    const webinar: Webinar = {
      id: existing?.id || crypto.randomUUID(),
      title: form.title!,
      topic: form.topic!,
      description: form.description || "",
      mentorName: form.mentorName!,
      mentorPhoto: form.mentorPhoto || "",
      department: form.department || "Computer Science",
      date: form.date!,
      time: form.time!,
      registrationFee: 99,
      status: (form.status as Webinar['status']) || "draft",
      createdAt: existing?.createdAt || new Date().toISOString(),
      registrationUrl: `/register/${existing?.id || 'new'}`,
    };
    if (!existing) webinar.registrationUrl = `/register/${webinar.id}`;
    store.saveWebinar(webinar);
    toast.success(isEdit ? "Webinar updated!" : "Webinar created!");
    navigate("/admin/webinars");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => update("mentorPhoto", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? "Edit Webinar" : "Create Webinar"}</h1>
          <p className="text-muted-foreground">{isEdit ? "Update webinar details" : "Fill in the details to create a new webinar"}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Webinar Title *</label>
                <Input value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. Introduction to AI" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic *</label>
                <Input value={form.topic} onChange={e => update("topic", e.target.value)} placeholder="e.g. Artificial Intelligence" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={form.department} onValueChange={v => update("department", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mentor Name *</label>
                <Input value={form.mentorName} onChange={e => update("mentorName", e.target.value)} placeholder="Dr. John Doe" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mentor Photo</label>
                <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                {form.mentorPhoto && <img src={form.mentorPhoto} alt="Mentor" className="w-16 h-16 rounded-full object-cover mt-1" />}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date *</label>
                <Input type="date" value={form.date} onChange={e => update("date", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time *</label>
                <Input type="time" value={form.time} onChange={e => update("time", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Registration Fee</label>
                <Input value="₹99" disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Fixed at ₹99</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={v => update("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="Describe the webinar..." rows={4} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4" />{isEdit ? "Update" : "Create"} Webinar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
