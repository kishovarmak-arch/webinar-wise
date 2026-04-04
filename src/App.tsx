import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/AdminLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Webinars from "./pages/Webinars";
import WebinarForm from "./pages/WebinarForm";
import PosterGenerator from "./pages/PosterGenerator";
import PublicRegistration from "./pages/PublicRegistration";
import Participants from "./pages/Participants";
import Attendance from "./pages/Attendance";
import Certificates from "./pages/Certificates";
import Emails from "./pages/Emails";
import Feedback from "./pages/Feedback";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:id" element={<PublicRegistration />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/webinars" element={<AdminLayout><Webinars /></AdminLayout>} />
          <Route path="/admin/webinars/create" element={<AdminLayout><WebinarForm /></AdminLayout>} />
          <Route path="/admin/webinars/:id/edit" element={<AdminLayout><WebinarForm /></AdminLayout>} />
          <Route path="/admin/webinars/:id/poster" element={<AdminLayout><PosterGenerator /></AdminLayout>} />
          <Route path="/admin/participants" element={<AdminLayout><Participants /></AdminLayout>} />
          <Route path="/admin/attendance" element={<AdminLayout><Attendance /></AdminLayout>} />
          <Route path="/admin/certificates" element={<AdminLayout><Certificates /></AdminLayout>} />
          <Route path="/admin/emails" element={<AdminLayout><Emails /></AdminLayout>} />
          <Route path="/admin/feedback" element={<AdminLayout><Feedback /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><Analytics /></AdminLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
