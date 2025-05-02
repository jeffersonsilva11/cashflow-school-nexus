
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SchoolCardProps {
  school: {
    id: string;
    name: string;
  };
}

export const SchoolCard = ({ school }: SchoolCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escola</CardTitle>
        <CardDescription>Instituição onde o dispositivo está alocado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-4">
          <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <School className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg mb-1">{school.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">ID: {school.id}</p>
          
          <Button variant="outline" className="w-full">Ver Detalhes da Escola</Button>
        </div>
      </CardContent>
    </Card>
  );
};
