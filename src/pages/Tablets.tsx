
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Tablets() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tablets</h1>
          <p className="text-muted-foreground">Gerenciamento de tablets do sistema</p>
        </div>
        <Button asChild>
          <Link to="/tablets/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Tablet
          </Link>
        </Button>
      </div>
      <div className="p-8 text-center text-muted-foreground border rounded-md">
        Lista de tablets será implementada em breve.
      </div>
    </div>
  );
}
