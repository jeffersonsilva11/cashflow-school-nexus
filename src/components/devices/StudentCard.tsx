
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentCardProps {
  student?: {
    id: string;
    name: string;
    grade: string;
    photo: string;
  };
}

export const StudentCard = ({ student }: StudentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estudante</CardTitle>
        <CardDescription>Usuário vinculado ao dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-4">
          {student ? (
            <>
              <div className="h-16 w-16 rounded-full overflow-hidden mb-4">
                <img 
                  src={student.photo} 
                  alt={student.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <h3 className="font-bold text-lg mb-1">{student.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{student.grade}</p>
              <p className="text-sm text-muted-foreground mb-4">ID: {student.id}</p>
              
              <Button variant="outline" className="w-full">Ver Perfil do Estudante</Button>
            </>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-muted-foreground mb-4">Nenhum estudante vinculado</p>
              <Button className="w-full">Vincular Estudante</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
