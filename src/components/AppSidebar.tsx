import {
  LayoutDashboard, Video, Users, ClipboardCheck, Award, Mail, MessageSquare, BarChart3, LogOut, GraduationCap
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "@/lib/store";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Webinars", url: "/admin/webinars", icon: Video },
  { title: "Participants", url: "/admin/participants", icon: Users },
  { title: "Attendance", url: "/admin/attendance", icon: ClipboardCheck },
  { title: "Certificates", url: "/admin/certificates", icon: Award },
  { title: "Emails", url: "/admin/emails", icon: Mail },
  { title: "Feedback", url: "/admin/feedback", icon: MessageSquare },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    store.logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              {!collapsed && <span className="font-bold text-base">NSCET</span>}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-accent/50"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
