
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatNumber } from '@/lib/format';

interface SchoolUsageReportProps {
  schools: Array<{
    id: string;
    name: string;
    activeStudents: number;
    totalStudents: number;
    activeDevices: number;
    totalRevenue: number;
  }>;
}

export function SchoolUsageReport({ schools = [] }: SchoolUsageReportProps) {
  // Add default empty array to prevent undefined errors
  return (
    <div className="space-y-4">
      {schools.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma escola encontrada com os critérios de busca.
        </div>
      ) : (
        schools.map((school) => (
          <div key={school.id} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="text-lg font-medium">{school.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>ID: {school.id}</span>
                  <span>•</span>
                  <span>Receita Total: {formatCurrency(school.totalRevenue)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Alunos Ativos</p>
                  <p className="font-medium">{formatNumber(school.activeStudents)} / {formatNumber(school.totalStudents)}</p>
                  <div className="flex items-center text-xs text-green-600 justify-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>3.2%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Dispositivos</p>
                  <p className="font-medium">{school.activeDevices}</p>
                  <div className="flex items-center text-xs text-red-600 justify-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <span>1.1%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uso de Alunos</span>
                <span className="font-medium">{Math.round((school.activeStudents / school.totalStudents) * 100)}%</span>
              </div>
              <Progress value={(school.activeStudents / school.totalStudents) * 100} className="h-2" />
              
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">
                  {school.activeStudents} alunos ativos
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                  {school.activeDevices} dispositivos
                </div>
                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-md">
                  {formatCurrency(school.totalRevenue / 6)} média mensal
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
