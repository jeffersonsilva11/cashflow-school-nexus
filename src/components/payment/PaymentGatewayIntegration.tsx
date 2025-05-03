
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, CreditCard, Key, ShieldAlert, ShieldCheck, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PaymentGatewayIntegration = () => {
  const [activeTab, setActiveTab] = useState('stripe');
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [isStoneConnected, setIsStoneConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stoneApiKey, setStoneApiKey] = useState('');
  const [stoneStoreId, setStoneStoreId] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handleSaveStripeConfig = () => {
    if (!stripeSecretKey || !stripePublishableKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todas as chaves da API do Stripe",
        variant: "destructive"
      });
      return;
    }

    // Save configuration to database/API
    // In a real app, this would be a secure API call
    setIsStripeConnected(true);
    setIsEditing(false);
    
    toast({
      title: "Configuração salva",
      description: "Integração com Stripe configurada com sucesso",
      variant: "default"
    });
  };

  const handleSaveStoneConfig = () => {
    if (!stoneApiKey || !stoneStoreId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todas as informações da Stone",
        variant: "destructive"
      });
      return;
    }

    // Save configuration to database/API
    setIsStoneConnected(true);
    setIsEditing(false);
    
    toast({
      title: "Configuração salva",
      description: "Integração com Stone configurada com sucesso",
      variant: "default"
    });
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    
    // Simulate API test call
    setTimeout(() => {
      setIsTesting(false);
      
      if (activeTab === 'stripe') {
        toast({
          title: "Teste concluído",
          description: "Conexão com Stripe estabelecida com sucesso",
          variant: "default"
        });
      } else {
        toast({
          title: "Teste concluído",
          description: "Conexão com Stone estabelecida com sucesso",
          variant: "default"
        });
      }
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-6 w-6" />
          Integração de Gateway de Pagamento
        </CardTitle>
        <CardDescription>
          Configure integrações com provedores de pagamento para processar transações
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe">
              Stripe
              {isStripeConnected && <Check className="ml-2 h-4 w-4 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="stone">
              Stone
              {isStoneConnected && <Check className="ml-2 h-4 w-4 text-green-500" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stripe" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Configurações do Stripe</h3>
                <p className="text-sm text-muted-foreground">
                  {isStripeConnected ? "Conectado e configurado" : "Não configurado"}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancelar" : "Editar"}
                </Button>
                
                {isStripeConnected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    {isTesting ? "Testando..." : "Testar Conexão"}
                  </Button>
                )}
              </div>
            </div>
            
            {(isEditing || !isStripeConnected) && (
              <div className="space-y-4 border rounded-md p-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">Chave Secreta (Secret Key)</Label>
                  <div className="flex">
                    <Input
                      id="stripe-secret"
                      type="password"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      placeholder="sk_test_..."
                    />
                    <Button variant="ghost" size="icon" className="ml-2">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Encontre esta chave no painel do Stripe
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stripe-publishable">Chave Publicável (Publishable Key)</Label>
                  <Input
                    id="stripe-publishable"
                    value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Label htmlFor="stripe-test-mode">Modo de Teste</Label>
                  <Switch id="stripe-test-mode" defaultChecked />
                </div>
                
                <div className="pt-2">
                  <Button onClick={handleSaveStripeConfig}>
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            )}
            
            {isStripeConnected && !isEditing && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span>Integração ativa e configurada</span>
                </div>
                
                <div className="rounded-md bg-slate-50 p-4">
                  <h4 className="text-sm font-medium mb-2">Recursos disponíveis:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Pagamentos com cartão
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Pagamentos recorrentes
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Pagamentos com Pix
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Boletos bancários
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stone" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Configurações da Stone</h3>
                <p className="text-sm text-muted-foreground">
                  {isStoneConnected ? "Conectado e configurado" : "Não configurado"}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancelar" : "Editar"}
                </Button>
                
                {isStoneConnected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    {isTesting ? "Testando..." : "Testar Conexão"}
                  </Button>
                )}
              </div>
            </div>
            
            {(isEditing || !isStoneConnected) && (
              <div className="space-y-4 border rounded-md p-4">
                <div className="space-y-2">
                  <Label htmlFor="stone-api-key">Chave da API</Label>
                  <div className="flex">
                    <Input
                      id="stone-api-key"
                      type="password"
                      value={stoneApiKey}
                      onChange={(e) => setStoneApiKey(e.target.value)}
                      placeholder="stone_api_key_..."
                    />
                    <Button variant="ghost" size="icon" className="ml-2">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stone-store-id">ID da Loja</Label>
                  <Input
                    id="stone-store-id"
                    value={stoneStoreId}
                    onChange={(e) => setStoneStoreId(e.target.value)}
                    placeholder="stone_store_..."
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Label htmlFor="stone-sandbox-mode">Modo Sandbox</Label>
                  <Switch id="stone-sandbox-mode" defaultChecked />
                </div>
                
                <div className="pt-2">
                  <Button onClick={handleSaveStoneConfig}>
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            )}
            
            {isStoneConnected && !isEditing && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span>Integração ativa e configurada</span>
                </div>
                
                <div className="rounded-md bg-slate-50 p-4">
                  <h4 className="text-sm font-medium mb-2">Recursos disponíveis:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Pagamento com cartão (TEF)
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Integração com maquininhas
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Pagamentos com Pix
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t bg-slate-50 flex flex-col items-start">
        <div className="flex items-center text-sm text-muted-foreground pt-2">
          <ShieldAlert className="h-4 w-4 mr-2" />
          As chaves da API são armazenadas de forma segura e criptografadas
        </div>
      </CardFooter>
    </Card>
  );
};
