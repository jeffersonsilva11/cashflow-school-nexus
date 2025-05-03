
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AccessDenied() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Informações de depuração
  const currentPath = location.pathname;
  const currentTime = new Date().toLocaleString();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-lg border-red-200">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
              <ShieldAlert className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar esta página. Esta área é restrita a usuários com níveis de acesso específicos.
          </p>
          
          {user && (
            <>
              <div className="bg-muted p-4 rounded-md mb-4 text-left">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Informações do Usuário
                </h3>
                <p><span className="font-medium">Nome:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Função:</span> {
                  user.role === 'admin' ? 'Administrador' :
                  user.role === 'school_admin' ? 'Admin. Escolar' :
                  user.role === 'parent' ? 'Responsável' :
                  'Funcionário'
                }</p>
                {user.schoolId && <p><span className="font-medium">ID da Escola:</span> {user.schoolId}</p>}
              </div>
              
              <div className="bg-muted p-4 rounded-md mb-6 text-left">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Informações de Depuração
                </h3>
                <p><span className="font-medium">Página atual:</span> {currentPath}</p>
                <p><span className="font-medium">Horário:</span> {currentTime}</p>
              </div>
            </>
          )}
        </CardContent>
        
        <Separator />
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            variant="default" 
            onClick={() => navigate('/dashboard')}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => logout()}
            className="gap-2 w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            Sair do Sistema
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
