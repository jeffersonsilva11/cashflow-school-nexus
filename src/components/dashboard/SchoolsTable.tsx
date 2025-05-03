
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
import { School } from '@/services/schoolService';
import { Skeleton } from '@/components/ui/skeleton';

interface SchoolsTableProps {
  schools: School[];
  title: string;
  description: string;
  isLoading?: boolean;
}

export const SchoolsTable = ({ schools, title, description, isLoading = false }: SchoolsTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Escola</TableHead>
                <TableHead className="text-right">Localização</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Plano</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div>
                      <Skeleton className="h-5 w-[150px] mb-1" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

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
              <TableHead className="text-right">Localização</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Plano</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools && schools.length > 0 ? (
              schools.slice(0, 5).map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-muted-foreground">{school.email || 'Sem email'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{school.city || 'N/A'}, {school.state || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={school.subscription_status || 'inactive'} />
                  </TableCell>
                  <TableCell className="text-right">{school.subscription_plan || 'Sem plano'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhuma escola encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
