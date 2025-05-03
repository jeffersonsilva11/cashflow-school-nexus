
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, School, Users, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SchoolsMap() {
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { toast } = useToast();

  const handleLoadMap = () => {
    if (!mapboxToken) {
      toast({
        variant: "destructive",
        title: "Token necessário",
        description: "Por favor, insira seu token do Mapbox para carregar o mapa."
      });
      return;
    }
    
    // Simular carregamento do mapa
    toast({
      title: "Mapa carregado",
      description: "O mapa de escolas foi carregado com sucesso."
    });
    setIsMapLoaded(true);
  };

  const mockSchools = [
    { 
      id: 'SCH001', 
      name: 'Colégio São Paulo', 
      address: 'Rua das Flores, 123, São Paulo, SP',
      students: 850,
      devices: 780, 
      status: 'active' 
    },
    { 
      id: 'SCH002', 
      name: 'Escola Maria Eduarda', 
      address: 'Av. Principal, 456, São Paulo, SP',
      students: 650,
      devices: 590,
      status: 'active' 
    },
    { 
      id: 'SCH003', 
      name: 'Colégio São Pedro', 
      address: 'Rua dos Pinheiros, 789, Campinas, SP',
      students: 720,
      devices: 650,
      status: 'active' 
    },
    { 
      id: 'SCH004', 
      name: 'Instituto Educação', 
      address: 'Av. Brasil, 1000, Rio de Janeiro, RJ',
      students: 520,
      devices: 470,
      status: 'pending' 
    },
    { 
      id: 'SCH005', 
      name: 'Escola Nova Geração', 
      address: 'Rua das Palmeiras, 321, Belo Horizonte, MG',
      students: 430,
      devices: 380,
      status: 'inactive' 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mapa de Escolas</h1>
          <p className="text-muted-foreground">Visualização geográfica das instituições cadastradas</p>
        </div>
      </div>

      {!isMapLoaded ? (
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Mapa</CardTitle>
            <CardDescription>
              Adicione seu token de API do Mapbox para visualizar o mapa das escolas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="mapbox-token" className="text-sm font-medium">
                Token do Mapbox
              </label>
              <Input
                id="mapbox-token"
                placeholder="Cole seu token de acesso público do Mapbox aqui..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Você pode obter seu token criando uma conta em <a href="https://www.mapbox.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">mapbox.com</a>
              </p>
            </div>
            <div className="pt-2">
              <Button onClick={handleLoadMap}>Carregar Mapa</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Visualização do Mapa</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar escola ou endereço..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full bg-slate-100 rounded-md flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Visualização do mapa será implementada em breve.
                    <br />
                    Esta tela demonstra como será a interface quando conectada à API do Mapbox.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Escolas Próximas</CardTitle>
                <CardDescription>Instituições cadastradas no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSchools.map((school) => (
                  <div key={school.id} className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{school.name}</h3>
                        <p className="text-sm text-muted-foreground">{school.address}</p>
                      </div>
                      <Badge 
                        variant={
                          school.status === 'active' ? 'default' : 
                          school.status === 'pending' ? 'outline' : 
                          'secondary'
                        }
                      >
                        {
                          school.status === 'active' ? 'Ativo' : 
                          school.status === 'pending' ? 'Pendente' : 
                          'Inativo'
                        }
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 text-muted-foreground" />
                        <span>ID: {school.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{school.students} alunos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>{school.devices} dispositivos</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise Regional</CardTitle>
                <CardDescription>Distribuição de escolas por região</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="stats">
                  <TabsList className="mb-4">
                    <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                    <TabsTrigger value="regions">Regiões</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stats">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{mockSchools.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total de Escolas</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground mt-1">Estados</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">4</div>
                            <p className="text-xs text-muted-foreground mt-1">Cidades</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">80%</div>
                            <p className="text-xs text-muted-foreground mt-1">Escolas Ativas</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="regions">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>São Paulo, SP</span>
                        </div>
                        <Badge>2 escolas</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Campinas, SP</span>
                        </div>
                        <Badge>1 escola</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Rio de Janeiro, RJ</span>
                        </div>
                        <Badge>1 escola</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Belo Horizonte, MG</span>
                        </div>
                        <Badge>1 escola</Badge>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
