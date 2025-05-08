
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Info } from 'lucide-react';

export default function SecurityCompliance() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Segurança & Compliance</h1>
          <p className="text-muted-foreground">
            Configurações de conformidade e segurança do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Conformidade LGPD</CardTitle>
            <CardDescription>Status geral de conformidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1 items-center">
                <Check size={16} />
                <span>Conformidade</span>
              </Badge>
              <span className="text-sm text-muted-foreground ml-2">100% completo</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Segurança de Dados</CardTitle>
            <CardDescription>Criptografia e proteção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1 items-center">
                <Check size={16} />
                <span>Ativo</span>
              </Badge>
              <span className="text-sm text-muted-foreground ml-2">AES-256</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Auditoria</CardTitle>
            <CardDescription>Logs e monitoramento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1 items-center">
                <Check size={16} />
                <span>Ativo</span>
              </Badge>
              <span className="text-sm text-muted-foreground ml-2">Retenção: 90 dias</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Requisitos de Compliance</CardTitle>
            <CardDescription>Status de atendimento aos requisitos regulatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Proteção de dados pessoais (LGPD Art. 6)</span>
                </div>
                <Badge className="bg-green-600">Implementado</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Segurança e prevenção (LGPD Art. 46)</span>
                </div>
                <Badge className="bg-green-600">Implementado</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Consentimento explícito (LGPD Art. 7)</span>
                </div>
                <Badge className="bg-green-600">Implementado</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  <span>Direito à eliminação (LGPD Art. 18)</span>
                </div>
                <Badge className="bg-blue-600">Parcial</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Relatório de impacto (LGPD Art. 38)</span>
                </div>
                <Badge className="bg-yellow-600">Pendente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Políticas de Segurança</CardTitle>
            <CardDescription>Configurações de segurança do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Autenticação em dois fatores</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Bloqueio após tentativas falhas</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">5 tentativas</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Tempo de sessão</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">30 minutos</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Complexidade de senha</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Alta</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificações</CardTitle>
            <CardDescription>Certificações de segurança do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span>ISO 27001</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Certificado</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>PCI DSS</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700">Em processo</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>SOC 2</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">Planejado</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>LGPD Compliance</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Certificado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
