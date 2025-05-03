
import React from 'react';
import { useParams } from 'react-router-dom';

export default function TabletDetails() {
  const { tabletId } = useParams();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Detalhes do Tablet</h1>
      <p className="text-muted-foreground">ID do tablet: {tabletId}</p>
      <div className="p-8 text-center text-muted-foreground border rounded-md">
        Detalhes do tablet serão implementados em breve.
      </div>
    </div>
  );
}
