
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileBarChart, BarChart3, UsersIcon, DeviceTabletIcon } from 'lucide-react';

export default function Reports() {
  const reportTypes = [
    {
      title: 'Relatórios Financeiros',
      description: 'Análise de receitas, comissões e faturamento',
      icon: FileBarChart,
      href: '/reports/financial',
    },
    {
      title: 'Relatórios de Alunos',
      description: 'Estatísticas de uso e comportamento dos alunos',
      icon: UsersIcon,
      href: '/reports/students',
    },
    {
      title: 'Relatórios de Dispositivos',
      description: 'Status e uso dos dispositivos no sistema',
      icon: DeviceTabletIcon,
      href: '/reports/devices',
    },
    {
      title: 'Relatórios Analíticos',
      description: 'Análises avançadas e métricas do sistema',
      icon: BarChart3,
      href: '/reports/analytics',
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Acesse todos os tipos de relatórios disponíveis no sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {report.description}
              </CardDescription>
              <Button asChild variant="outline" className="w-full">
                <Link to={report.href}>Acessar</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
