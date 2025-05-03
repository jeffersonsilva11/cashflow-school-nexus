
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, FileCheck, Bell, Database, Download } from 'lucide-react';
import { SecurityComplianceCard } from '@/components/security/SecurityComplianceCard';
import { useToast } from '@/components/ui/use-toast';

export default function SecurityCompliance() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleDataExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo de registro de operações será enviado ao seu e-mail."
    });
  };

  const handleRunTest = () => {
    toast({
      title: "Teste de segurança iniciado",
      description: "O teste de segurança foi iniciado. Você receberá os resultados em breve."
    });
  };
  
  const handleEnableMFA = () => {
    toast({
      title: "Autenticação multifator",
      description: "Configuração de autenticação multifator iniciada."
    });
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Segurança e Compliance</h1>
          <p className="text-muted-foreground">
            Controles de segurança, privacidade e conformidade com regulações
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleRunTest}>
            <Shield className="h-4 w-4" />
            Verificar Segurança
          </Button>
          <Button className="gap-2" onClick={handleEnableMFA}>
            <Lock className="h-4 w-4" />
            Ativar Autenticação MFA
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="data-protection" className="flex items-center gap-2">
            <Lock size={16} />
            <span>Proteção de Dados</span>
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="flex items-center gap-2">
            <FileCheck size={16} />
            <span>Auditoria</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <SecurityComplianceCard />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Proteção de Dados</CardTitle>
                  <Lock className="h-5 w-5 text-blue-500" />
                </div>
                <CardDescription>Status da proteção de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Criptografia</p>
                    <p className="text-sm text-muted-foreground">Todos os dados sensíveis são criptografados</p>
                  </div>
                  <div>
                    <p className="font-medium">Acesso Controlado</p>
                    <p className="text-sm text-muted-foreground">Permissões baseadas em funções</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Backup e Redundância</CardTitle>
                  <Database className="h-5 w-5 text-purple-500" />
                </div>
                <CardDescription>Status dos sistemas de backup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Backup Automático</p>
                    <p className="text-sm text-muted-foreground">Aguardando configuração</p>
                  </div>
                  <div>
                    <p className="font-medium">Retenção de Dados</p>
                    <p className="text-sm text-muted-foreground">30 dias de histórico</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  Configurar Backup
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Alertas e Notificações</CardTitle>
                  <Bell className="h-5 w-5 text-amber-500" />
                </div>
                <CardDescription>Configurações de alertas de segurança</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Alertas de Login</p>
                    <p className="text-sm text-muted-foreground">Ativado para logins suspeitos</p>
                  </div>
                  <div>
                    <p className="font-medium">Notificações</p>
                    <p className="text-sm text-muted-foreground">Email e SMS configurados</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  Gerenciar Alertas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data-protection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proteção de Dados</CardTitle>
              <CardDescription>Políticas e controles para proteção de dados sensíveis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Dados Sensíveis Protegidos</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span>Dados pessoais de alunos</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span>Dados financeiros</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span>Histórico de transações</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span>Dados de acesso</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Controlos de Acesso</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Controle granular de acesso aos dados por função do usuário
                </p>
                <Button variant="outline">Configurar Permissões</Button>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Termos de Uso e Políticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Política de Privacidade
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Termos de Serviço
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Política de Cookies
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Retenção de Dados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>LGPD - Direitos do Titular</CardTitle>
              <CardDescription>Gestão dos direitos dos titulares de dados conforme LGPD</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Acesso aos Dados</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Processo para solicitações de acesso aos dados pessoais
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Gerenciar Solicitações
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Correção de Dados</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Processo para correção de dados imprecisos
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Solicitações
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Exclusão de Dados</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Processo para exclusão de dados pessoais
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Solicitações
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Portabilidade de Dados</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Processo para exportação de dados em formato estruturado
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Gerenciar Exportações
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audit-logs" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Registro de Auditoria</CardTitle>
                <CardDescription>Logs de atividades e operações do sistema</CardDescription>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleDataExport}>
                <Download className="h-4 w-4" />
                Exportar Logs
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="p-4">
                    <h3 className="font-medium">Atividades Financeiras</h3>
                    <p className="text-sm text-muted-foreground">
                      Todas as transações financeiras são registradas com data, hora, usuário e detalhes da operação.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Logs Financeiros
                    </Button>
                  </div>
                  <div className="border-t p-4">
                    <h3 className="font-medium">Acesso a Dados</h3>
                    <p className="text-sm text-muted-foreground">
                      Todo acesso a dados sensíveis é registrado e monitorado.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Logs de Acesso
                    </Button>
                  </div>
                  <div className="border-t p-4">
                    <h3 className="font-medium">Alterações de Configuração</h3>
                    <p className="text-sm text-muted-foreground">
                      Todas as alterações nas configurações do sistema são registradas.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Logs de Configuração
                    </Button>
                  </div>
                  <div className="border-t p-4">
                    <h3 className="font-medium">Autenticação e Autorização</h3>
                    <p className="text-sm text-muted-foreground">
                      Logs de login, logout e tentativas de acesso mal-sucedidas.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Logs de Autenticação
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Política de Retenção de Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Logs de Transações Financeiras</span>
                        <span className="font-medium">5 anos</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Logs de Acesso</span>
                        <span className="font-medium">1 ano</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Logs de Autenticação</span>
                        <span className="font-medium">1 ano</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Logs de Sistema</span>
                        <span className="font-medium">90 dias</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4">
                      Configurar Retenção
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
