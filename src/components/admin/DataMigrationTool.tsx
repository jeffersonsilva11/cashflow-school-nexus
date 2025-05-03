
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useMigrateData } from '@/services/dataMigrationService';
import { Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DataMigrationTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    schoolsCount?: number;
    plansCount?: number;
    error?: any;
  } | null>(null);
  
  const { migrateAllData } = useMigrateData();
  
  const handleMigration = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const migrationResult = await migrateAllData();
      setResult(migrationResult);
    } catch (error) {
      setResult({
        success: false,
        message: error.message || "Ocorreu um erro desconhecido durante a migração",
        error
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Ferramenta de Migração de Dados
        </CardTitle>
        <CardDescription>
          Migre os dados mockados para o banco de dados Supabase
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p>
          Esta ferramenta migrará todos os dados mockados para o banco de dados.
          Isto incluirá escolas, planos, assinaturas, faturas e relatórios financeiros.
        </p>
        
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? "Migração bem-sucedida" : "Erro na migração"}</AlertTitle>
            <AlertDescription>
              {result.message}
              
              {result.success && (
                <div className="mt-2">
                  <p>Detalhes:</p>
                  <ul className="list-disc pl-5">
                    <li>{result.schoolsCount} escolas migradas</li>
                    <li>{result.plansCount} planos migrados</li>
                    <li>Assinaturas, faturas e relatórios financeiros migrados</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleMigration} 
          disabled={isLoading || result?.success}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrando dados...
            </>
          ) : result?.success ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Migração Concluída
            </>
          ) : (
            "Iniciar Migração de Dados"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
