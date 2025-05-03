
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface StudentData {
  name: string;
  document_id?: string;
  grade?: string;
  school_id: string;
}

export const StudentsImportForm = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [importMethod, setImportMethod] = useState<'csv' | 'excel'>('csv');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    total: number;
    errors: string[];
  }>({
    success: 0,
    failed: 0,
    total: 0,
    errors: []
  });
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Fetch schools when component mounts
  React.useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: 'Erro ao buscar escolas',
        description: 'Não foi possível carregar a lista de escolas.',
        variant: 'destructive'
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type based on importMethod
    if (importMethod === 'csv' && !selectedFile.name.endsWith('.csv')) {
      toast({
        title: 'Formato de arquivo inválido',
        description: 'Por favor, selecione um arquivo CSV.',
        variant: 'destructive'
      });
      return;
    }

    if (importMethod === 'excel' && 
        !selectedFile.name.endsWith('.xlsx') && 
        !selectedFile.name.endsWith('.xls')) {
      toast({
        title: 'Formato de arquivo inválido',
        description: 'Por favor, selecione um arquivo Excel (xlsx ou xls).',
        variant: 'destructive'
      });
      return;
    }

    setFile(selectedFile);
    setShowResults(false);
  };

  const parseCSV = async (csvFile: File): Promise<StudentData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n');
          const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
          
          const nameIndex = headers.indexOf('nome');
          const documentIndex = headers.indexOf('documento');
          const gradeIndex = headers.indexOf('série') !== -1 ? 
                             headers.indexOf('série') : 
                             headers.indexOf('serie');
          
          if (nameIndex === -1) {
            reject('O arquivo CSV deve conter uma coluna "nome".');
            return;
          }

          const students: StudentData[] = [];
          for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;
            
            const values = rows[i].split(',').map(v => v.trim());
            const student: StudentData = {
              name: values[nameIndex],
              school_id: selectedSchool
            };
            
            if (documentIndex !== -1 && values[documentIndex]) {
              student.document_id = values[documentIndex];
            }
            
            if (gradeIndex !== -1 && values[gradeIndex]) {
              student.grade = values[gradeIndex];
            }
            
            if (student.name) {
              students.push(student);
            }
          }
          
          resolve(students);
        } catch (error) {
          reject('Erro ao processar o arquivo CSV. Verifique o formato.');
        }
      };
      reader.onerror = () => reject('Erro ao ler o arquivo CSV.');
      reader.readAsText(csvFile);
    });
  };

  const importStudents = async () => {
    if (!file || !selectedSchool) {
      toast({
        title: 'Informações incompletas',
        description: 'Selecione uma escola e um arquivo para importar.',
        variant: 'destructive'
      });
      return;
    }

    setImporting(true);
    setProgress(0);
    setShowResults(false);
    
    try {
      let students: StudentData[] = [];
      
      if (importMethod === 'csv') {
        students = await parseCSV(file);
      } else {
        // For Excel files we would need a library like xlsx
        // This is a simplified example, in production you'd implement proper Excel parsing
        toast({
          title: 'Funcionalidade limitada',
          description: 'Importação de Excel ainda não está completamente implementada.',
          variant: 'destructive'
        });
        setImporting(false);
        return;
      }

      if (students.length === 0) {
        toast({
          title: 'Nenhum aluno encontrado',
          description: 'O arquivo parece estar vazio ou mal formatado.',
          variant: 'destructive'
        });
        setImporting(false);
        return;
      }

      // Track progress and results
      const results = {
        success: 0,
        failed: 0,
        total: students.length,
        errors: [] as string[]
      };

      // Process students in batches to avoid overwhelming the database
      const batchSize = 50;
      const batches = Math.ceil(students.length / batchSize);

      for (let i = 0; i < batches; i++) {
        const batch = students.slice(i * batchSize, (i + 1) * batchSize);
        
        const { data, error } = await supabase
          .from('students')
          .insert(batch)
          .select();
        
        if (error) {
          console.error('Error importing students batch:', error);
          results.failed += batch.length;
          results.errors.push(`Erro em lote ${i+1}: ${error.message}`);
        } else {
          results.success += data.length || 0;
          results.failed += batch.length - (data?.length || 0);
        }
        
        // Update progress
        setProgress(Math.round(((i + 1) / batches) * 100));
      }

      setImportResults(results);
      setShowResults(true);
      
      toast({
        title: 'Importação concluída',
        description: `${results.success} alunos importados com sucesso. ${results.failed} falhas.`,
        variant: results.failed === 0 ? 'default' : 'destructive'
      });
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: 'Erro na importação',
        description: error.message || 'Ocorreu um erro ao importar os alunos.',
        variant: 'destructive'
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importação de Alunos</CardTitle>
        <CardDescription>
          Importe vários alunos de uma vez usando arquivos CSV ou Excel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upload">Importar Arquivo</TabsTrigger>
            <TabsTrigger value="template">Baixar Modelo</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">Escola</Label>
                  <Select 
                    value={selectedSchool} 
                    onValueChange={setSelectedSchool}
                    disabled={importing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma escola" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="import-method">Formato do Arquivo</Label>
                  <Select 
                    value={importMethod} 
                    onValueChange={(value: 'csv' | 'excel') => setImportMethod(value)}
                    disabled={importing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Valores separados por vírgula)</SelectItem>
                      <SelectItem value="excel">Excel (xlsx, xls)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Arquivo de Importação</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept={importMethod === 'csv' ? '.csv' : '.xlsx,.xls'}
                    onChange={handleFileChange}
                    disabled={importing}
                  />
                  <Button 
                    variant="outline" 
                    disabled={!file || !selectedSchool || importing}
                    onClick={importStudents}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                  </Button>
                </div>
                {file && <p className="text-sm text-muted-foreground">Arquivo selecionado: {file.name}</p>}
              </div>

              {importing && (
                <div className="space-y-2">
                  <Label>Progresso da importação</Label>
                  <Progress value={progress} className="w-full h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Importando... {progress}%
                  </p>
                </div>
              )}

              {showResults && (
                <div className="space-y-4">
                  <Alert variant={importResults.failed > 0 ? "destructive" : "default"}>
                    <div className="flex items-center gap-2">
                      {importResults.failed > 0 ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                      <AlertTitle>Resultado da Importação</AlertTitle>
                    </div>
                    <AlertDescription>
                      <div className="mt-2">
                        <p>Total de registros: {importResults.total}</p>
                        <p>Importados com sucesso: {importResults.success}</p>
                        <p>Falhas: {importResults.failed}</p>
                      </div>
                      
                      {importResults.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="font-semibold">Erros encontrados:</p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {importResults.errors.slice(0, 5).map((error, index) => (
                              <li key={index} className="text-sm">{error}</li>
                            ))}
                            {importResults.errors.length > 5 && (
                              <li className="text-sm">
                                E mais {importResults.errors.length - 5} erros...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-4">
            <div className="space-y-4">
              <p>
                Baixe um dos modelos de arquivo abaixo para ajudar na formatação 
                correta dos dados para importação:
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5" />
                      CSV Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Formato CSV para importação simples com valores separados por vírgula.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Baixar CSV Template
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5" />
                      Excel Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Planilha Excel com formatação e colunas pré-definidas.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Baixar Excel Template
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Dicas de preenchimento</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>O campo <strong>nome</strong> é obrigatório para todos os alunos.</li>
                    <li>Use o campo <strong>documento</strong> para CPF ou outro documento do aluno.</li>
                    <li>Preencha o campo <strong>série</strong> com o ano/série do aluno (ex: "5º Ano").</li>
                    <li>Evite caracteres especiais, exceto nos campos onde for apropriado.</li>
                    <li>Verifique se todos os alunos estão associados à escola correta.</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
