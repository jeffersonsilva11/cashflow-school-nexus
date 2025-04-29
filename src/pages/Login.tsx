
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in a real app, this would verify credentials with a backend
    toast({
      title: "Login realizado com sucesso",
      description: "Bem-vindo ao sistema Cashflow School Nexus",
    });
    
    navigate('/dashboard');
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
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button variant="link" className="text-xs p-0 h-auto">
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-white/70">
          <p>© 2025 CashFlow School Nexus. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};
