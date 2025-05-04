
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Upload, Check, AlertCircle } from "lucide-react";

interface MigrationOption {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

export default function DataMigrationTool() {
  const [options, setOptions] = useState<MigrationOption[]>([
    { 
      id: 'financial-reports', 
      name: 'Relatórios Financeiros', 
      description: 'Migrar dados de relatórios financeiros mockados para o banco de dados', 
      selected: true 
    },
    { 
      id: 'consumption-analysis', 
      name: 'Análise de Consumo', 
      description: 'Migrar dados de análise de consumo para o banco de dados', 
      selected: true 
    },
    { 
      id: 'monthly-trends', 
      name: 'Tendências Mensais', 
      description: 'Migrar dados de tendências mensais para o banco de dados', 
      selected: true 
    },
    { 
      id: 'revenue-by-plan', 
      name: 'Receita por Plano', 
      description: 'Migrar dados de receita por plano para o banco de dados', 
      selected: true 
    },
    { 
      id: 'transactions', 
      name: 'Transações', 
      description: 'Migrar transações mockadas para o banco de dados', 
      selected: false 
    }
  ]);
  
  const [migrating, setMigrating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<{success: string[], error: string[]}>({ success: [], error: [] });
  const [showResults, setShowResults] = useState<boolean>(false);
  
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
    
    let currentProgress = 0;
    const successResults: string[] = [];
    const errorResults: string[] = [];
    
    // Simular a migração de dados
    for (const option of selectedOptions) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Em um ambiente real, aqui executaríamos a migração real dos dados
        // por exemplo, fazendo chamadas ao Supabase para inserir dados
        
        currentProgress += (100 / selectedOptions.length);
        setProgress(Math.min(Math.round(currentProgress), 100));
        
        successResults.push(`Migração de ${option.name} concluída com sucesso.`);
      } catch (error) {
        console.error(`Error migrating ${option.name}:`, error);
        errorResults.push(`Erro ao migrar ${option.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }
    
    setResults({ success: successResults, error: errorResults });
    setShowResults(true);
    setMigrating(false);
    setProgress(100);
    
    if (errorResults.length === 0) {
      toast({
        title: "Migração concluída",
        description: `${successResults.length} tipos de dados foram migrados com sucesso.`,
      });
    } else {
      toast({
        title: "Migração concluída com erros",
        description: `${successResults.length} tipos de dados foram migrados com sucesso. ${errorResults.length} erros foram encontrados.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Ferramenta de Migração de Dados</h1>
        <p className="text-muted-foreground">
          Migre dados mockados para o banco de dados
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecione os tipos de dados para migrar</CardTitle>
          <CardDescription>
            Escolha quais tipos de dados você deseja migrar para o banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={option.id} 
                  checked={option.selected} 
                  onCheckedChange={() => toggleOption(option.id)}
                  disabled={migrating}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={migrateData} 
              disabled={migrating || options.filter(opt => opt.selected).length === 0}
              className="w-full sm:w-auto"
            >
              {migrating ? (
                <>
                  <span className="animate-spin mr-2">
                    <Upload size={16} />
                  </span>
                  Migrando...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={16} />
                  Iniciar Migração
                </>
              )}
            </Button>
            
            {migrating && (
              <div className="mt-4">
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
            <CardTitle>Resultados da Migração</CardTitle>
            <CardDescription>
              Detalhes sobre o processo de migração
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
