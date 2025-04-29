
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CreditCard, Wifi, Plus, Server } from 'lucide-react';

export default function Devices() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispositivos</h1>
          <p className="text-muted-foreground">Gerencie cartões, pulseiras e maquininhas do sistema.</p>
        </div>
      </div>
      
      <Tabs defaultValue="cards">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Cartões/Pulseiras</span>
          </TabsTrigger>
          <TabsTrigger value="terminals" className="flex items-center gap-2">
            <Server size={16} />
            <span>Maquininhas</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total de Dispositivos</CardTitle>
                <CardDescription>Cartões e pulseiras emitidos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12,458</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  98.5% ativos
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cartões Ativos</CardTitle>
                <CardDescription>Vinculados a estudantes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">10,874</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  +154 desde o mês passado
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cartões em Trânsito</CardTitle>
                <CardDescription>Em processo de entrega</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">458</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  5 escolas aguardando entrega
                </p>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Gerenciamento de Cartões</CardTitle>
                  <CardDescription>Emissão e controle de cartões e pulseiras RFID</CardDescription>
                </div>
                <Button className="gap-1">
                  <Plus size={16} />
                  Novo Lote
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
                <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-muted-foreground max-w-md">
                  O módulo completo de gerenciamento de cartões está sendo implementado. 
                  Em breve você poderá controlar todos os cartões e pulseiras do sistema por aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terminals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total de Maquininhas</CardTitle>
                <CardDescription>Dispositivos instalados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">245</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Em 23 escolas
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Online</CardTitle>
                <CardDescription>Conectados ao sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">235</p>
                  <span className="rounded-full bg-green-500 h-3 w-3 animate-pulse"></span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  95.9% de disponibilidade
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Offline</CardTitle>
                <CardDescription>Desconectados do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">10</p>
                  <span className="rounded-full bg-red-500 h-3 w-3"></span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  4.1% requerindo atenção
                </p>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Monitoramento de Maquininhas</CardTitle>
                  <CardDescription>Acompanhe o status dos terminais em tempo real</CardDescription>
                </div>
                <Button className="gap-1">
                  <Plus size={16} />
                  Novo Terminal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
                <Wifi className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-muted-foreground max-w-md">
                  O módulo completo de monitoramento de terminais está sendo implementado. 
                  Em breve você poderá acompanhar o status de todas as maquininhas do sistema por aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
