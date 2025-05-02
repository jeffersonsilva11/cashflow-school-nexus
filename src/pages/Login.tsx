
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Obtém a URL de redirecionamento após login, se existir
  const from = location.state?.from?.pathname || '/dashboard';
  
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
      // O redirecionamento é feito dentro da função login
    } catch (error) {
      // Erros já são tratados dentro da função login
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
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
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
              
              <div className="text-xs text-center text-muted-foreground mt-4">
                <p>Para fins de demonstração, você pode usar:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-left">
                    <p><strong>admin@example.com</strong></p>
                    <p><strong>escola@example.com</strong></p>
                    <p><strong>pai@example.com</strong></p>
                    <p><strong>funcionario@example.com</strong></p>
                  </div>
                  <div className="text-left">
                    <p>Administrador do Sistema</p>
                    <p>Administrador da Escola</p>
                    <p>Responsável/Pai</p>
                    <p>Funcionário da Escola</p>
                  </div>
                </div>
                <p className="mt-2">Senha para todos: <strong>123456</strong></p>
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
