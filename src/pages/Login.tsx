import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Eye, EyeOff, Shield, BookOpen, User } from "lucide-react";

const roleConfig: Record<UserRole, { icon: typeof Shield; label: string; defaultEmail: string; defaultPass: string; description: string }> = {
  admin: { icon: Shield, label: 'Admin', defaultEmail: 'admin@nscet.edu', defaultPass: 'admin123', description: 'Full system access' },
  hod: { icon: BookOpen, label: 'HOD', defaultEmail: 'hod.cse@nscet.edu', defaultPass: 'hod123', description: 'Department management' },
  student: { icon: User, label: 'Student', defaultEmail: 'student@nscet.edu', defaultPass: 'student123', description: 'View webinars & register' },
};

export default function Login() {
  const [activeRole, setActiveRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState(roleConfig.admin.defaultEmail);
  const [password, setPassword] = useState(roleConfig.admin.defaultPass);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (role: string) => {
    const r = role as UserRole;
    setActiveRole(r);
    setEmail(roleConfig[r].defaultEmail);
    setPassword(roleConfig[r].defaultPass);
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = store.login(email, password);
    if (user) {
      store.seedIfEmpty();
      if (user.role === 'student') navigate("/student");
      else navigate("/admin");
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">NSCET Webinar Portal</CardTitle>
            <CardDescription>Sign in to continue</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeRole} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              {(Object.keys(roleConfig) as UserRole[]).map(role => {
                const cfg = roleConfig[role];
                return (
                  <TabsTrigger key={role} value={role} className="flex items-center gap-1.5">
                    <cfg.icon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {(Object.keys(roleConfig) as UserRole[]).map(role => (
              <TabsContent key={role} value={role}>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <p className="text-xs text-muted-foreground text-center">{roleConfig[role].description}</p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full">Sign In as {roleConfig[role].label}</Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Demo: {roleConfig[role].defaultEmail} / {roleConfig[role].defaultPass}
                  </p>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
