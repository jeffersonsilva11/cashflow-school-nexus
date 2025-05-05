
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStudentActivityReport, useStudentDemographicsReport, useStudentRetentionReport } from '@/services/studentReportHooks';

const StudentReports = () => {
  const { data: activityData, isLoading: activityLoading } = useStudentActivityReport();
  const { data: demographicsData, isLoading: demographicsLoading } = useStudentDemographicsReport();
  const { data: retentionData, isLoading: retentionLoading } = useStudentRetentionReport();

  const isLoading = activityLoading || demographicsLoading || retentionLoading;
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios de Alunos</h1>
            <p className="text-muted-foreground">
              Análise e estatísticas dos alunos cadastrados no sistema
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground">Carregando dados dos alunos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Alunos</h1>
          <p className="text-muted-foreground">
            Análise e estatísticas dos alunos cadastrados no sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="mb-4">
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="demographics">Demografia</TabsTrigger>
          <TabsTrigger value="retention">Retenção</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Atividade dos Alunos</CardTitle>
              <CardDescription>Análise de alunos ativos e inativos por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={activityData && activityData[0]?.month ? "month" : "period"} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active" name="Alunos Ativos" fill="#82ca9d" />
                    <Bar dataKey="inactive" name="Alunos Inativos" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle>Demografia de Alunos</CardTitle>
              <CardDescription>Distribuição de alunos por série/ano</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="grade"
                      label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                    >
                      {demographicsData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} alunos`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-4">Distribuição por Série</h3>
                <div className="space-y-2">
                  {demographicsData?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 mr-2 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.grade}</span>
                      </div>
                      <div className="font-medium">{item.count} alunos ({item.percentage}%)</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>Retenção de Alunos</CardTitle>
              <CardDescription>Análise de novos alunos, transferências e formados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={retentionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newStudents" name="Novos Alunos" fill="#82ca9d" />
                    <Bar dataKey="transfers" name="Transferências" fill="#8884d8" />
                    <Bar dataKey="graduation" name="Formados" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {retentionData?.map((period, index) => (
                  <Card key={index} className="bg-muted/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h4 className="font-medium">{period.period}</h4>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          {period.retention_rate || period.retention || 0}%
                        </p>
                        <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentReports;
