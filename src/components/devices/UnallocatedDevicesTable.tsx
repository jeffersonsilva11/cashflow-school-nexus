
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, School, Users } from 'lucide-react';

interface DeviceData {
  serial: string;
  type: string;
  status: string;
  batch: string;
}

interface UnallocatedDevicesTableProps {
  devices: DeviceData[];
}

export const UnallocatedDevicesTable = ({ devices }: UnallocatedDevicesTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredDevices = devices.filter(device => 
    device.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Dispositivos Disponíveis</h3>
          <p className="text-sm text-muted-foreground">Dispositivos não alocados a estudantes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1" asChild>
            <Link to="/devices/register">
              <Package size={16} />
              Cadastrar Individual
            </Link>
          </Button>
          <Button variant="outline" className="gap-1" asChild>
            <Link to="/devices/allocate">
              <School size={16} />
              Alocar para Escola
            </Link>
          </Button>
          <Button variant="outline" className="gap-1" asChild>
            <Link to="/devices/bind">
              <Users size={16} />
              Vincular a Alunos
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Buscar por número de série, tipo ou lote..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de Série</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.length > 0 ? (
              filteredDevices.map(device => (
                <TableRow key={device.serial}>
                  <TableCell className="font-medium">{device.serial}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell><StatusBadge status={device.status} /></TableCell>
                  <TableCell>{device.batch}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/devices/${device.serial}`}>Detalhes</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  Nenhum dispositivo encontrado com os critérios de busca
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
