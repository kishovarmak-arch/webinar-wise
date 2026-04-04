import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function Feedback() {
  const [webinars, setWebinars] = useState(store.getWebinars());
  const [selectedWebinar, setSelectedWebinar] = useState("");
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);

  const feedback = store.getFeedback(selectedWebinar || undefined);
  const avgRating = feedback.length > 0 ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : "N/A";

  const handleSubmit = () => {
    if (!selectedWebinar || !name || !comment) { toast.error("Fill all fields"); return; }
    store.addFeedback({
      id: crypto.randomUUID(),
      webinarId: selectedWebinar,
      participantName: name,
      rating,
      comment,
      submittedAt: new Date().toISOString(),
    });
    toast.success("Feedback submitted!");
    setName("");
    setComment("");
    setRating(5);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Feedback</h1>
        <p className="text-muted-foreground">Collect and review participant feedback</p>
      </div>

      <Select value={selectedWebinar} onValueChange={setSelectedWebinar}>
        <SelectTrigger className="w-full sm:w-[300px]"><SelectValue placeholder="Select a webinar" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Webinars</SelectItem>
          {webinars.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><MessageSquare className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{feedback.length}</p><p className="text-xs text-muted-foreground">Responses</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Star className="h-5 w-5 text-yellow-500" /><div><p className="text-2xl font-bold">{avgRating}</p><p className="text-xs text-muted-foreground">Avg Rating</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Star className="h-5 w-5 text-green-600" /><div><p className="text-2xl font-bold">{feedback.filter(f => f.rating >= 4).length}</p><p className="text-xs text-muted-foreground">Positive (4+)</p></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Submit Feedback</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Participant name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)} className="p-1">
                    <Star className={`h-6 w-6 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Your feedback..." rows={4} />
            </div>
            <Button onClick={handleSubmit}>Submit Feedback</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Feedback</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-auto">
            {feedback.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No feedback yet</p>
            ) : feedback.map(f => (
              <div key={f.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{f.participantName}</span>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />)}</div>
                </div>
                <p className="text-sm text-muted-foreground">{f.comment}</p>
                <p className="text-xs text-muted-foreground">{new Date(f.submittedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
