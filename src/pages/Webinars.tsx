import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { store } from "@/lib/store";
import { Webinar } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Image, ExternalLink } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Webinars() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => { store.seedIfEmpty(); setWebinars(store.getWebinars()); }, []);

  const filtered = webinars.filter(w => {
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) || w.mentorName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || w.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id: string) => {
    store.deleteWebinar(id);
    setWebinars(store.getWebinars());
  };

  const statusColor = (s: string) => s === 'upcoming' ? 'default' : s === 'completed' ? 'secondary' : s === 'live' ? 'destructive' : 'outline';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Webinars</h1>
          <p className="text-muted-foreground">Manage all your webinars</p>
        </div>
        <Button asChild><Link to="/admin/webinars/create"><Plus className="mr-2 h-4 w-4" />Create Webinar</Link></Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search webinars..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="live">Live</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No webinars found. Create your first webinar!</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map(w => (
            <Card key={w.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{w.title}</h3>
                      <Badge variant={statusColor(w.status) as any}>{w.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{w.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                      <span>🎤 {w.mentorName}</span>
                      <span>📅 {new Date(w.date).toLocaleDateString()}</span>
                      <span>🕐 {w.time}</span>
                      <span>🏢 {w.department}</span>
                      <span className="font-medium text-foreground">₹{w.registrationFee}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/webinars/${w.id}/poster`}><Image className="mr-1 h-3 w-3" />Poster</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/register/${w.id}`} target="_blank"><ExternalLink className="mr-1 h-3 w-3" />Register</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/admin/webinars/${w.id}/edit`)}>
                      <Edit className="mr-1 h-3 w-3" />Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Webinar</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete "{w.title}" and all associated data.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(w.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
