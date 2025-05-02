
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Você não tem permissão para acessar esta página. Esta área é restrita a usuários com níveis de acesso específicos.
        </p>
        
        {user && (
          <div className="bg-muted p-4 rounded-md mb-6 inline-block">
            <p className="text-sm mb-1">Conectado como:</p>
            <p className="font-medium">{user.name} ({user.email})</p>
            <p className="text-xs text-muted-foreground mt-1">
              Função: {
                user.role === 'admin' ? 'Administrador' :
                user.role === 'school_admin' ? 'Admin. Escolar' :
                user.role === 'parent' ? 'Responsável' :
                'Funcionário'
              }
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => logout()}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair do Sistema
          </Button>
        </div>
      </div>
    </div>
  );
}
