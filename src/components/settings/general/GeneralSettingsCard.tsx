
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilLine, Settings, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GeneralSettingsForm } from './GeneralSettingsForm';
import { useGeneralSettings } from './useGeneralSettings';

const GeneralSettingsCard = () => {
  const {
    generalConfig,
    isLoading,
    isEditing,
    setIsEditing,
    saveConfig,
    handleLogoUpload,
    cancelEditing
  } = useGeneralSettings();
  
  // Handler for logo upload that updates the form
  const handleLogoUploadWrapper = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const logoUrl = await handleLogoUpload(e);
    if (logoUrl) {
      const updatedConfig = { ...generalConfig, logo_url: logoUrl };
      saveConfig(updatedConfig);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Configurações Gerais
        </CardTitle>
        <CardDescription>
          Configurações básicas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Informações Gerais</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <PencilLine className="mr-1 h-4 w-4" />
              Editar
            </Button>
          </div>
          
          <Separator />
          
          {isLoading ? (
            <div>Carregando configurações...</div>
          ) : generalConfig ? (
            <GeneralSettingsForm 
              defaultValues={generalConfig} 
              isEditing={isEditing}
              onSubmit={saveConfig}
              onCancel={cancelEditing}
              onLogoUpload={handleLogoUploadWrapper}
            />
          ) : (
            <div>Erro ao carregar configurações</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <p>Última atualização: {generalConfig?.updated_at ? new Date(generalConfig.updated_at).toLocaleString() : 'Nunca'}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeneralSettingsCard;
