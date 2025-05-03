
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, Info } from 'lucide-react';

export default function Login() {
  const { toast } = useToast();
  const { login, loading, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Erro ao realizar login:", error);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cashless-700 to-cashless-900 p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center">
              <div className="text-2xl font-bold text-cashless-700">CS</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">CashFlow School Nexus</h1>
          <p className="text-white/70 mt-1">Sistema Cashless para Escolas</p>
        </div>
        
        <Card className="border-none shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Acesse o painel administrativo do sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button variant="link" className="text-xs p-0 h-auto">
                    Esqueceu a senha?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-xs text-left text-blue-700">
                    <p className="font-medium">Para criar um usuário superadmin:</p>
                    <ol className="list-decimal list-inside mt-1 ml-1 space-y-1">
                      <li>Acesse o painel do Supabase</li>
                      <li>Vá em Authentication &gt; Users</li>
                      <li>Clique em "Add User"</li>
                      <li>Crie com o email: admin@cashflow.com</li>
                      <li>Use a senha: admin123</li>
                      <li>Em "User Metadata", adicione: <code className="bg-blue-100 px-1">{`{"role":"admin","name":"Admin"}`}</code></li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="text-xs text-center text-muted-foreground">
                <p>Use as credenciais fornecidas pelo administrador do sistema.</p>
              </div>
            </CardContent>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-white/70">
          <p>© 2025 CashFlow School Nexus. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
