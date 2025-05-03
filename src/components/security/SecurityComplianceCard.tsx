
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Check, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SecurityItemProps {
  title: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  icon: React.ReactNode;
  actions?: React.ReactNode;
}

const SecurityItem = ({ title, description, status, icon, actions }: SecurityItemProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
          {status === 'compliant' && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
              Conforme
            </Badge>
          )}
          {status === 'partial' && (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
              Parcial
            </Badge>
          )}
          {status === 'non-compliant' && (
            <Badge variant="destructive">
              Não Conforme
            </Badge>
          )}
        </div>
        <div>
          {actions}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {status === 'compliant' && (
        <ul className="text-xs text-green-600 space-y-1 mt-1">
          <li className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            Implementado e verificado
          </li>
        </ul>
      )}
      {status === 'partial' && (
        <ul className="text-xs text-amber-600 space-y-1 mt-1">
          <li className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Verificação adicional necessária
          </li>
        </ul>
      )}
      {status === 'non-compliant' && (
        <ul className="text-xs text-red-600 space-y-1 mt-1">
          <li className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Ação necessária
          </li>
        </ul>
      )}
    </div>
  );
};

export const SecurityComplianceCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança e Compliance</CardTitle>
        <CardDescription>Status de conformidade com regulações de proteção de dados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">LGPD (Lei Geral de Proteção de Dados)</h3>
          
          <SecurityItem 
            title="Dados de Menores de Idade"
            description="Conformidade com requisitos específicos da LGPD para processamento de dados de menores de idade"
            status="partial"
            icon={<Shield className="h-5 w-5 text-amber-500" />}
            actions={<Button variant="outline" size="sm">Revisar</Button>}
          />
          
          <SecurityItem 
            title="Consentimento dos Responsáveis"
            description="Mecanismos para obtenção e gestão do consentimento dos responsáveis legais"
            status="partial"
            icon={<Shield className="h-5 w-5 text-amber-500" />}
            actions={<Button variant="outline" size="sm">Configurar</Button>}
          />
          
          <SecurityItem 
            title="Direito à Exclusão"
            description="Procedimentos para exclusão de dados mediante solicitação"
            status="compliant"
            icon={<Shield className="h-5 w-5 text-green-500" />}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-semibold">Segurança de Dados</h3>
          
          <SecurityItem 
            title="Criptografia em Trânsito"
            description="Todas as comunicações com o servidor são protegidas por TLS 1.2+"
            status="compliant"
            icon={<Lock className="h-5 w-5 text-green-500" />}
          />
          
          <SecurityItem 
            title="Criptografia em Repouso"
            description="Dados sensíveis armazenados são criptografados"
            status="compliant"
            icon={<Lock className="h-5 w-5 text-green-500" />}
          />
          
          <SecurityItem 
            title="Gestão de Acessos"
            description="Controle de acesso baseado em funções (RBAC) implementado"
            status="partial"
            icon={<Lock className="h-5 w-5 text-amber-500" />}
            actions={<Button variant="outline" size="sm">Configurar</Button>}
          />
          
          <SecurityItem 
            title="Segurança de Transações Financeiras"
            description="Uso de gateway de pagamento PCI-DSS compliant para transações"
            status="compliant"
            icon={<Lock className="h-5 w-5 text-green-500" />}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-semibold">Auditoria e Backup</h3>
          
          <SecurityItem 
            title="Logs de Auditoria"
            description="Auditoria de todas as operações financeiras e acesso a dados sensíveis"
            status="partial"
            icon={<Shield className="h-5 w-5 text-amber-500" />}
            actions={<Button variant="outline" size="sm">Configurar</Button>}
          />
          
          <SecurityItem 
            title="Backups Regulares"
            description="Backups automáticos diários com retenção de 30 dias"
            status="non-compliant"
            icon={<Shield className="h-5 w-5 text-red-500" />}
            actions={<Button variant="outline" size="sm">Ativar</Button>}
          />
        </div>
      </CardContent>
    </Card>
  );
};
