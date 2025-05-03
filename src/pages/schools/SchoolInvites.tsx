
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Plus, Copy, CheckCircle, Search, X, Clock, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for invites
const invitesMockData = [
  { 
    id: 'INV001', 
    schoolName: 'Colégio São Paulo',
    email: 'diretor@colegiosaopaulo.edu.br',
    role: 'Diretor',
    status: 'pending',
    sentDate: '10/05/2023',
    expiresDate: '24/05/2023'
  },
  { 
    id: 'INV002', 
    schoolName: 'Escola Maria Eduarda',
    email: 'coord@mariaed.edu.br',
    role: 'Coordenador',
    status: 'accepted',
    sentDate: '02/05/2023',
    expiresDate: '16/05/2023'
  },
  { 
    id: 'INV003', 
    schoolName: 'Instituto Educação',
    email: 'admin@institutoeducacao.org.br',
    role: 'Administrador',
    status: 'expired',
    sentDate: '15/04/2023',
    expiresDate: '29/04/2023'
  },
  { 
    id: 'INV004', 
    schoolName: 'Escola Nova Geração',
    email: 'diretoria@novageracao.edu.br',
    role: 'Diretor',
    status: 'pending',
    sentDate: '08/05/2023',
    expiresDate: '22/05/2023'
  },
  { 
    id: 'INV005', 
    schoolName: 'Colégio São Pedro',
    email: 'financeiro@saopedro.edu.br',
    role: 'Financeiro',
    status: 'declined',
    sentDate: '05/05/2023',
    expiresDate: '19/05/2023'
  },
];

export default function SchoolInvites() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newInviteOpen, setNewInviteOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    schoolName: '',
    email: '',
    role: 'Diretor',
  });
  const { toast } = useToast();

  const filteredInvites = invitesMockData.filter(invite => 
    invite.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendInvite = () => {
    if (!newInvite.schoolName || !newInvite.email) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newInvite.email)) {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido."
      });
      return;
    }

    toast({
      title: "Convite enviado",
      description: `O convite para ${newInvite.schoolName} foi enviado com sucesso.`
    });
    setNewInviteOpen(false);
    setNewInvite({
      schoolName: '',
      email: '',
      role: 'Diretor',
    });
  };

  const handleResendInvite = (id: string) => {
    toast({
      title: "Convite reenviado",
      description: `O convite ${id} foi reenviado com sucesso.`
    });
  };

  const handleCancelInvite = (id: string) => {
    toast({
      title: "Convite cancelado",
      description: `O convite ${id} foi cancelado.`
    });
  };

  const handleCopyInviteLink = (id: string) => {
    // In a real app, this would copy a real invitation link
    navigator.clipboard.writeText(`https://app.example.com/invite/${id}`);
    toast({
      title: "Link copiado",
      description: "O link do convite foi copiado para a área de transferência."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Convites para Escolas</h1>
          <p className="text-muted-foreground">Gerencie convites para acesso de escolas ao sistema</p>
        </div>
        <Button onClick={() => setNewInviteOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Novo Convite
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Convites Enviados</CardTitle>
          <CardDescription>Histórico e status de convites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative sm:max-w-xs flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar convite..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="flex-1 sm:max-w-md">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="accepted">Aceitos</TabsTrigger>
                <TabsTrigger value="expired">Expirados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Envio</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvites.length > 0 ? (
                filteredInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.id}</TableCell>
                    <TableCell>{invite.schoolName}</TableCell>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>{invite.role}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          invite.status === 'accepted' ? 'default' : 
                          invite.status === 'pending' ? 'outline' : 
                          invite.status === 'expired' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {
                          invite.status === 'accepted' ? 'Aceito' : 
                          invite.status === 'pending' ? 'Pendente' : 
                          invite.status === 'expired' ? 'Expirado' :
                          'Recusado'
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>{invite.sentDate}</TableCell>
                    <TableCell>{invite.expiresDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleCopyInviteLink(invite.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {invite.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleResendInvite(invite.id)}
                            >
                              <RefreshCcw className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleCancelInvite(invite.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {(invite.status === 'expired' || invite.status === 'declined') && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleResendInvite(invite.id)}
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={newInviteOpen} onOpenChange={setNewInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Convite</DialogTitle>
            <DialogDescription>
              Envie um convite para uma nova escola acessar o sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="school-name">Nome da Escola</Label>
              <Input 
                id="school-name"
                value={newInvite.schoolName}
                onChange={(e) => setNewInvite({...newInvite, schoolName: e.target.value})}
                placeholder="Digite o nome da escola"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Institucional</Label>
              <Input 
                id="email"
                type="email"
                value={newInvite.email}
                onChange={(e) => setNewInvite({...newInvite, email: e.target.value})}
                placeholder="nome@escola.edu.br"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo do Destinatário</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newInvite.role}
                onChange={(e) => setNewInvite({...newInvite, role: e.target.value})}
              >
                <option value="Diretor">Diretor</option>
                <option value="Coordenador">Coordenador</option>
                <option value="Administrador">Administrador</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Secretário">Secretário</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewInviteOpen(false)}>Cancelar</Button>
            <Button onClick={handleSendInvite} className="gap-1">
              <Mail className="h-4 w-4" />
              Enviar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
