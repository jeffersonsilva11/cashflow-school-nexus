
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, School, Users, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSchools } from '@/services/schoolService';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function SchoolsMap() {
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  const { data: schools, isLoading: schoolsLoading } = useSchools();

  // Check if mapbox token exists in system configs
  useEffect(() => {
    const checkMapboxToken = async () => {
      try {
        // Here we would ideally fetch the token from system_configs
        // For now we'll just check localStorage as a fallback
        const savedToken = localStorage.getItem('mapbox_token');
        if (savedToken) {
          setMapboxToken(savedToken);
          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error("Error checking for Mapbox token:", error);
      }
    };
    
    checkMapboxToken();
  }, []);

  const handleLoadMap = () => {
    if (!mapboxToken) {
      toast({
        variant: "destructive",
        title: "Token necessário",
        description: "Por favor, insira seu token do Mapbox para carregar o mapa."
      });
      return;
    }
    
    setLoading(true);
    
    // Save token to localStorage for persistence
    localStorage.setItem('mapbox_token', mapboxToken);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsMapLoaded(true);
      setLoading(false);
      toast({
        title: "Mapa carregado",
        description: "O mapa de escolas foi carregado com sucesso."
      });
    }, 1000);
  };

  // Initialize and load the map
  useEffect(() => {
    if (!isMapLoaded || !mapboxToken || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-47.9292, -15.7801], // Brazil centered
      zoom: 3
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Load schools on the map
    map.current.on('load', () => {
      if (!map.current || !schools) return;
      
      // Add markers for each school
      schools.forEach(school => {
        // In a real implementation, we'd use geocoding to get coordinates
        // For this demo, we're using random coordinates around Brazil
        const lat = -15.7801 + (Math.random() - 0.5) * 10;
        const lng = -47.9292 + (Math.random() - 0.5) * 10;
        
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'school-marker';
        markerElement.style.width = '30px';
        markerElement.style.height = '30px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = school.active ? '#4ade80' : '#a1a1aa';
        markerElement.style.display = 'flex';
        markerElement.style.alignItems = 'center';
        markerElement.style.justifyContent = 'center';
        markerElement.style.color = 'white';
        markerElement.style.fontWeight = 'bold';
        markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        markerElement.innerHTML = school.name.substring(0, 1);
        
        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px; font-weight: bold;">${school.name}</h3>
              <p style="margin: 0; font-size: 12px;">${school.address || 'Endereço não cadastrado'}</p>
              <p style="margin: 5px 0 0; font-size: 12px;">Status: ${school.active ? 'Ativo' : 'Inativo'}</p>
            </div>
          `);
        
        // Add marker to map
        new mapboxgl.Marker(markerElement)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    // Cleanup on unmount
    return () => {
      map.current?.remove();
    };
  }, [isMapLoaded, mapboxToken, schools]);

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
              <Button onClick={handleLoadMap} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Carregar Mapa'
                )}
              </Button>
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
              <div ref={mapContainer} className="h-[500px] w-full bg-slate-100 rounded-md" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Escolas Próximas</CardTitle>
                <CardDescription>Instituições cadastradas no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {schoolsLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : schools && schools.length > 0 ? (
                  schools.slice(0, 5).map((school) => (
                    <div key={school.id} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{school.name}</h3>
                          <p className="text-sm text-muted-foreground">{school.address || 'Endereço não cadastrado'}</p>
                        </div>
                        <Badge 
                          variant={school.active ? 'default' : 'secondary'}
                        >
                          {school.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          <span>ID: {school.id.substring(0, 8)}...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{school.subscription_plan || 'Plano Básico'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    Nenhuma escola cadastrada
                  </div>
                )}
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
                            <div className="text-2xl font-bold">{schools?.length || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total de Escolas</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                              {schools?.filter(s => s.active).length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Escolas Ativas</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                              {Array.from(new Set(schools?.map(s => s.state) || [])).filter(Boolean).length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Estados</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                              {Array.from(new Set(schools?.map(s => s.city) || [])).filter(Boolean).length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Cidades</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="regions">
                    <div className="space-y-3">
                      {!schoolsLoading ? 
                        Array.from(new Set(schools?.map(s => `${s.city}, ${s.state}`) || []))
                          .filter(location => location !== ", ")
                          .slice(0, 5)
                          .map((location, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{location || "Local não especificado"}</span>
                              </div>
                              <Badge>
                                {schools?.filter(s => `${s.city}, ${s.state}` === location).length || 0} escolas
                              </Badge>
                            </div>
                          ))
                        : 
                        <div className="flex justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      }
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
