
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Upload, Check, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useMigrateData, MigrationResult } from "@/services/dataMigrationService";
import { supabase } from "@/integrations/supabase/client";

interface MigrationOption {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

export default function DataMigrationTool() {
  const [options, setOptions] = useState<MigrationOption[]>([
    { 
      id: 'schools-plans', 
      name: 'Escolas e Planos', 
      description: 'Migrar dados de escolas e planos para o banco de dados', 
      selected: true 
    },
    { 
      id: 'subscriptions', 
      name: 'Assinaturas', 
      description: 'Migrar assinaturas mockadas para o banco de dados', 
      selected: true 
    },
    { 
      id: 'invoices', 
      name: 'Faturas', 
      description: 'Migrar faturas mockadas para o banco de dados', 
      selected: true 
    },
    { 
      id: 'financial-reports', 
      name: 'Relatórios Financeiros', 
      description: 'Migrar dados de relatórios financeiros para o banco de dados', 
      selected: true 
    },
    { 
      id: 'students-devices', 
      name: 'Alunos e Dispositivos', 
      description: 'Migrar dados de alunos e dispositivos para o banco de dados', 
      selected: true 
    },
    { 
      id: 'transactions', 
      name: 'Transações', 
      description: 'Migrar transações mockadas para o banco de dados', 
      selected: true 
    },
    { 
      id: 'users-profiles', 
      name: 'Usuários e Perfis', 
      description: 'Migrar dados de usuários e perfis para o banco de dados', 
      selected: true 
    }
  ]);
  
  const [migrating, setMigrating] = useState<boolean>(false);
  const [clearing, setClearing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<{success: string[], error: string[]}>({ success: [], error: [] });
  const [showResults, setShowResults] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  
  const { migrateAllData, clearDatabaseData } = useMigrateData();
  
  // Verificar se já existem dados no banco
  useEffect(() => {
    const checkExistingData = async () => {
      try {
        // Verificar tabela de escolas
        const { count: schoolCount, error: schoolError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true });
        
        // Verificar tabela de planos
        const { count: planCount, error: planError } = await supabase
          .from('plans')
          .select('*', { count: 'exact', head: true });
          
        setHasExistingData((schoolCount || 0) > 0 || (planCount || 0) > 0);
        setIsChecking(false);
      } catch (error) {
        console.error("Erro ao verificar dados existentes:", error);
        setIsChecking(false);
      }
    };
    
    checkExistingData();
  }, []);
  
  const toggleOption = (id: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, selected: !option.selected } : option
    ));
  };
  
  const migrateData = async () => {
    setMigrating(true);
    setProgress(0);
    setResults({ success: [], error: [] });
    setShowResults(false);
    
    const selectedOptions = options.filter(option => option.selected);
    
    if (selectedOptions.length === 0) {
      toast({
        title: "Nenhuma opção selecionada",
        description: "Selecione pelo menos uma opção para migrar",
        variant: "destructive"
      });
      setMigrating(false);
      return;
    }

    try {
      // Iniciar a migração real usando o serviço
      const result: MigrationResult = await migrateAllData();
      
      if (result.success) {
        setResults({ 
          success: [`Migração concluída com sucesso! ${result.schoolsCount || 0} escolas e ${result.plansCount || 0} planos foram migrados.`],
          error: []
        });
        
        // Atualizar o estado para indicar que agora temos dados no banco
        setHasExistingData(true);
      } else {
        setResults({
          success: [],
          error: [result.message || "Ocorreu um erro durante a migração."]
        });
      }
    } catch (error) {
      console.error("Error during migration:", error);
      
      setResults({
        success: [],
        error: [error instanceof Error ? error.message : "Ocorreu um erro desconhecido durante a migração."]
      });
    } finally {
      setProgress(100);
      setShowResults(true);
      setMigrating(false);
    }
  };
  
  const clearData = async () => {
    // Confirmação do usuário
    if (!window.confirm("ATENÇÃO: Esta ação irá remover TODOS os dados do banco. Esta operação não pode ser desfeita. Deseja continuar?")) {
      return;
    }
    
    setClearing(true);
    setProgress(0);
    setResults({ success: [], error: [] });
    setShowResults(false);
    
    try {
      // Executar a limpeza de dados
      setProgress(30);
      const result = await clearDatabaseData();
      setProgress(100);
      
      if (result.success) {
        setResults({ 
          success: [result.message],
          error: []
        });
        
        // Atualizar o estado para indicar que não temos mais dados no banco
        setHasExistingData(false);
      } else {
        setResults({
          success: [],
          error: [result.message]
        });
      }
    } catch (error) {
      console.error("Error during database clearing:", error);
      
      setResults({
        success: [],
        error: [error instanceof Error ? error.message : "Ocorreu um erro desconhecido durante a limpeza do banco."]
      });
    } finally {
      setShowResults(true);
      setClearing(false);
    }
  };
  
  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Verificando dados existentes...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Ferramenta de Migração de Dados</h1>
        <p className="text-muted-foreground">
          Migre dados mockados para o banco de dados Supabase
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecione os tipos de dados para migrar</CardTitle>
          <CardDescription>
            {hasExistingData 
              ? "ATENÇÃO: Já existem dados no banco. A migração pode causar duplicações ou conflitos."
              : "Escolha quais tipos de dados você deseja migrar para o banco de dados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasExistingData && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <AlertCircle className="h-4 w-4 inline-block mr-2" />
              <span className="font-medium">Dados existentes detectados!</span>
              <p className="mt-1 text-sm">
                O banco de dados já contém informações. Executar a migração novamente pode causar 
                duplicações. Recomenda-se limpar os dados existentes antes de continuar.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={option.id} 
                  checked={option.selected} 
                  onCheckedChange={() => toggleOption(option.id)}
                  disabled={migrating || clearing}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={migrateData} 
              disabled={migrating || clearing || options.filter(opt => opt.selected).length === 0}
              className="w-full sm:w-auto"
              variant={hasExistingData ? "destructive" : "default"}
            >
              {migrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrando...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={16} />
                  {hasExistingData ? 'Forçar Migração' : 'Iniciar Migração'}
                </>
              )}
            </Button>
            
            <Button 
              onClick={clearData} 
              disabled={migrating || clearing || !hasExistingData}
              variant="outline"
              className="w-full sm:w-auto border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              {clearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Limpando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2" size={16} />
                  Limpar Banco de Dados
                </>
              )}
            </Button>
            
            {(migrating || clearing) && (
              <div className="mt-4 w-full">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center mt-1 text-muted-foreground">
                  {progress}% concluído
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Operação</CardTitle>
            <CardDescription>
              Detalhes sobre o processo de {clearing ? "limpeza" : "migração"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.success.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-green-600">
                  <Check size={18} />
                  Operações bem-sucedidas ({results.success.length})
                </h3>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                  {results.success.map((message, index) => (
                    <li key={index} className="text-green-600">{message}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {results.error.length > 0 && (
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 text-red-600">
                  <AlertCircle size={18} />
                  Erros encontrados ({results.error.length})
                </h3>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                  {results.error.map((message, index) => (
                    <li key={index} className="text-red-600">{message}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
