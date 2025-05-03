
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { generateApiKey, listApiKeys, revokeApiKey } from '@/services/apiService';
import { Clipboard, Download, FileArchive, Key, Lock, RotateCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { createBackup, getBackupHistory } from '@/services/backupService';
import { AuditAction, downloadAuditLogs, exportAuditLogsToCSV, fetchAuditLogs } from '@/services/auditExportService';

export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState('encryption');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [backupPassword, setBackupPassword] = useState('');
  const [backupType, setBackupType] = useState<'full' | 'data-only' | 'config-only'>('full');
  const [includeAuditLogs, setIncludeAuditLogs] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [isExportingLogs, setIsExportingLogs] = useState(false);
  const { toast } = useToast();
  
  // Load API keys when tab changes to API
  React.useEffect(() => {
    if (activeTab === 'api') {
      loadApiKeys();
    }
  }, [activeTab]);
  
  const loadApiKeys = async () => {
    setIsLoadingKeys(true);
    try {
      const response = await listApiKeys();
      if (response.success && response.data) {
        setApiKeys(response.data);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as chaves de API',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setIsLoadingKeys(false);
    }
  };
  
  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite um nome para a chave',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGeneratingKey(true);
    try {
      const response = await generateApiKey(newKeyName.trim(), ['read', 'write']);
      
      if (response.success && response.data) {
        toast({
          title: 'Chave criada',
          description: 'Copie a chave agora, ela não será exibida novamente',
        });
        
        // Copy to clipboard automatically
        navigator.clipboard.writeText(response.data.key)
          .then(() => {
            toast({
              title: 'Copiado!',
              description: 'A chave foi copiada para a área de transferência',
            });
          })
          .catch(() => {
            toast({
              title: 'Atenção',
              description: 'Não foi possível copiar automaticamente. Copie a chave manualmente.',
              variant: 'destructive',
            });
          });
        
        setApiKeys([response.data, ...apiKeys]);
        setNewKeyName('');
      } else {
        toast({
          title: 'Erro',
          description: response.error || 'Não foi possível criar a chave',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar a chave',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };
  
  const handleRevokeApiKey = async (keyId: string) => {
    try {
      const response = await revokeApiKey(keyId);
      
      if (response.success) {
        toast({
          title: 'Chave revogada',
          description: 'A chave de API foi revogada com sucesso',
        });
        
        // Update the list
        setApiKeys(apiKeys.map(key => 
          key.id === keyId ? { ...key, status: 'revoked' } : key
        ));
      } else {
        toast({
          title: 'Erro',
          description: response.error || 'Não foi possível revogar a chave',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao revogar a chave',
        variant: 'destructive',
      });
    }
  };
  
  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      const response = await createBackup({
        backupType: backupType,
        encrypt: !!backupPassword.trim(),
        encryptionPassword: backupPassword.trim() || undefined,
        includeAuditLogs
      });
      
      if (response.success) {
        toast({
          title: 'Backup criado',
          description: 'O backup foi gerado com sucesso',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível criar o backup',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar o backup',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };
  
  const handleExportAuditLogs = async () => {
    setIsExportingLogs(true);
    try {
      // Get logs from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const logs = await fetchAuditLogs({
        startDate: thirtyDaysAgo,
        action: AuditAction.ALL,
      });
      
      if (logs.length === 0) {
        toast({
          title: 'Sem logs',
          description: 'Não há logs de auditoria para exportar',
          variant: 'default',
        });
        return;
      }
      
      const csvContent = exportAuditLogsToCSV(logs);
      downloadAuditLogs(csvContent, 'csv');
      
      toast({
        title: 'Exportação concluída',
        description: `${logs.length} registros exportados com sucesso`,
      });
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao exportar os logs',
        variant: 'destructive',
      });
    } finally {
      setIsExportingLogs(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Segurança</h1>
        <p className="text-muted-foreground">Configurações de segurança e privacidade</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="encryption">
            <Lock className="mr-2 h-4 w-4" />
            Criptografia
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="mr-2 h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="backup">
            <FileArchive className="mr-2 h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Shield className="mr-2 h-4 w-4" />
            Auditoria
          </TabsTrigger>
        </TabsList>
        
        {/* Encryption Tab */}
        <TabsContent value="encryption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Criptografia de Dados
              </CardTitle>
              <CardDescription>
                Configure a criptografia para proteger dados sensíveis
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="encrypt-sensitive-data">Criptografar Dados Sensíveis</Label>
                  <Switch id="encrypt-sensitive-data" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Criptografa automaticamente dados sensíveis antes de armazená-los
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="encrypt-backups">Criptografar Backups</Label>
                  <Switch id="encrypt-backups" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Aplica criptografia aos arquivos de backup
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="encrypt-api">Criptografia nas APIs</Label>
                  <Switch id="encrypt-api" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Aplica camada adicional de criptografia nas APIs
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Alterar Chave Mestra</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="Nova chave mestra" className="flex-1" />
                  <Button>Atualizar</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  A chave mestra é usada para criptografar outras chaves do sistema
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="bg-slate-50 border-t">
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                Criptografia AES-256 em uso para proteção de dados
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* API Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Chaves de API
              </CardTitle>
              <CardDescription>
                Gerencie chaves para integração externa
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key-name">Nova Chave de API</Label>
                <div className="flex gap-2">
                  <Input 
                    id="api-key-name" 
                    placeholder="Nome da chave (ex: App Mobile)" 
                    className="flex-1"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    disabled={isGeneratingKey}
                  />
                  <Button onClick={handleCreateApiKey} disabled={isGeneratingKey || !newKeyName.trim()}>
                    {isGeneratingKey ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <></>}
                    Gerar Chave
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Chaves Ativas</h3>
                
                {isLoadingKeys ? (
                  <div className="text-center py-4">
                    <RotateCw className="h-5 w-5 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Carregando chaves...</p>
                  </div>
                ) : apiKeys.length > 0 ? (
                  <div className="space-y-2">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{key.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Prefixo: {key.key_prefix}...
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Criada em {new Date(key.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="space-x-2">
                            {key.status === 'active' ? (
                              <>
                                <Button
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRevokeApiKey(key.id)}
                                >
                                  Revogar
                                </Button>
                                {key.key && (
                                  <Button
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      navigator.clipboard.writeText(key.key);
                                      toast({ title: "Chave copiada!" });
                                    }}
                                  >
                                    <Clipboard className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-red-500">Revogada</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma chave de API criada ainda.
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="bg-slate-50 border-t">
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                Chaves de API dão acesso aos dados, revogue-as se não forem mais necessárias
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileArchive className="mr-2 h-5 w-5" />
                Backup e Restauração
              </CardTitle>
              <CardDescription>
                Realize backups dos dados e restaure quando necessário
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Criar Novo Backup</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="backup-type">Tipo de Backup</Label>
                    <select 
                      id="backup-type"
                      className="w-full border border-slate-300 rounded-md h-10 px-3"
                      value={backupType}
                      onChange={(e) => setBackupType(e.target.value as any)}
                    >
                      <option value="full">Backup Completo</option>
                      <option value="data-only">Apenas Dados</option>
                      <option value="config-only">Apenas Configurações</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Selecione o tipo de dados a serem incluídos no backup
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="backup-password">Senha de Criptografia (Opcional)</Label>
                    <Input 
                      id="backup-password" 
                      type="password" 
                      placeholder="Deixe em branco para não criptografar" 
                      value={backupPassword}
                      onChange={(e) => setBackupPassword(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      A senha será necessária para restaurar este backup
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="include-audit" 
                      className="rounded border-slate-300"
                      checked={includeAuditLogs}
                      onChange={(e) => setIncludeAuditLogs(e.target.checked)}
                    />
                    <Label htmlFor="include-audit" className="text-sm">
                      Incluir logs de auditoria
                    </Label>
                  </div>
                  
                  <Button 
                    onClick={handleCreateBackup}
                    disabled={isCreatingBackup}
                    className="w-full"
                  >
                    {isCreatingBackup ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Criando Backup...
                      </>
                    ) : (
                      <>
                        <FileArchive className="mr-2 h-4 w-4" />
                        Criar Backup Agora
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Backups Automáticos</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Habilitar Backups Automáticos</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Realiza backups completos automaticamente a cada 7 dias
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Restaurar Backup</h3>
                  <Button variant="outline" size="sm">
                    <Label htmlFor="file-upload" className="cursor-pointer flex items-center gap-1">
                      <FileArchive className="h-4 w-4" />
                      Selecionar Arquivo
                    </Label>
                    <input id="file-upload" type="file" className="hidden" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selecione um arquivo de backup para restaurar
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="bg-slate-50 border-t">
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                Os backups são armazenados de forma segura e podem ser criptografados
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Logs de Auditoria
              </CardTitle>
              <CardDescription>
                Visualize e exporte os registros de auditoria
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Exportar Logs de Auditoria</h3>
                  <Button 
                    variant="outline"
                    onClick={handleExportAuditLogs}
                    disabled={isExportingLogs}
                  >
                    {isExportingLogs ? (
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Exportar (CSV)
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Exporta os logs de auditoria dos últimos 30 dias
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Configurações de Auditoria</h3>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="audit-data-changes">Auditar Alterações de Dados</Label>
                    <Switch id="audit-data-changes" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Registra todas as alterações em tabelas importantes
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="audit-logins">Auditar Logins</Label>
                    <Switch id="audit-logins" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Registra tentativas de login (bem-sucedidas e falhas)
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="audit-api">Auditar Chamadas de API</Label>
                    <Switch id="audit-api" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Registra todas as chamadas às APIs externas
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="retention-period">Período de Retenção</Label>
                  <select 
                    id="retention-period"
                    className="w-full border border-slate-300 rounded-md h-10 px-3"
                    defaultValue="90"
                  >
                    <option value="30">30 dias</option>
                    <option value="90">90 dias</option>
                    <option value="180">180 dias</option>
                    <option value="365">365 dias</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Período de retenção dos logs de auditoria
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-slate-50 border-t">
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                A auditoria ajuda a manter a conformidade com as regulamentações
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
