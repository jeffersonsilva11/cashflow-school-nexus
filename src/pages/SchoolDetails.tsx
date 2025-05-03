
import React from 'react';
import { useParams } from 'react-router-dom';

export default function SchoolDetails() {
  const { schoolId } = useParams();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Detalhes da Escola</h1>
      <p className="text-muted-foreground">ID da escola: {schoolId}</p>
      <div className="p-8 text-center text-muted-foreground border rounded-md">
        Detalhes da escola serão implementados em breve.
      </div>
    </div>
  );
}
