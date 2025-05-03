
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vendor } from '@/services/vendorService';

interface VendorsListProps {
  vendors: Vendor[];
  isLoading: boolean;
}

export const VendorsList = ({ vendors, isLoading }: VendorsListProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="bg-muted/30 h-24"></CardHeader>
            <CardContent className="h-24 mt-4">
              <div className="h-4 bg-muted/50 rounded mb-2"></div>
              <div className="h-4 bg-muted/50 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (vendors.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Nenhuma cantina encontrada</CardTitle>
          <CardDescription>Não existem cantinas cadastradas no sistema.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <Card key={vendor.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{vendor.name}</CardTitle>
              <Badge variant={vendor.type === 'third_party' ? "secondary" : "outline"}>
                {vendor.type === 'third_party' ? 'Terceirizada' : 'Própria'}
              </Badge>
            </div>
            <CardDescription>
              {vendor.school?.name || 'Sem escola associada'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vendor.contact_name && (
              <p className="text-sm text-muted-foreground">
                Contato: {vendor.contact_name}
              </p>
            )}
            {vendor.contact_email && (
              <p className="text-sm text-muted-foreground break-words">
                Email: {vendor.contact_email}
              </p>
            )}
            {vendor.contact_phone && (
              <p className="text-sm text-muted-foreground">
                Telefone: {vendor.contact_phone}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/20 pt-2">
            <Badge variant={vendor.active ? "default" : "destructive"} className="mr-2">
              {vendor.active ? 'Ativo' : 'Inativo'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/vendors/${vendor.id}`)}
            >
              Detalhes
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
