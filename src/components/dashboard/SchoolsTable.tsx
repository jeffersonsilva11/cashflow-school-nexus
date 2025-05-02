
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '@/lib/format';

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  students: number;
  transactions: number;
  volume: number;
  status: string;
}

interface SchoolsTableProps {
  schools: School[];
  title: string;
  description: string;
}

export const SchoolsTable = ({ schools, title, description }: SchoolsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Escola</TableHead>
              <TableHead className="text-right">Alunos</TableHead>
              <TableHead className="text-right">Transações</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.slice(0, 5).map((school) => (
              <TableRow key={school.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-muted-foreground">{school.city}, {school.state}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">{school.students}</TableCell>
                <TableCell className="text-right">{school.transactions}</TableCell>
                <TableCell className="text-right">{formatCurrency(school.volume)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
