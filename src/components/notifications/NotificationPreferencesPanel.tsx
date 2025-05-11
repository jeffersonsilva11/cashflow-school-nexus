
import { useState } from 'react';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/services/notificationService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Bell, AlertTriangle, CreditCard, Server, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationPreferences } from '@/types/notification';

export const NotificationPreferencesPanel = () => {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences | null>(null);
  const { mutate: updatePreferences, isPending: isSaving } = useUpdateNotificationPreferences();
  
  // Update local preferences when data is loaded
  useState(() => {
    if (preferences && !localPreferences) {
      setLocalPreferences(preferences);
    }
  });
  
  const handleToggle = (field: keyof NotificationPreferences) => {
    if (!localPreferences) return;
    
    setLocalPreferences({
      ...localPreferences,
      [field]: !localPreferences[field],
    });
  };
  
  const handleSave = () => {
    if (!localPreferences) return;
    
    updatePreferences(localPreferences);
  };
  
  const hasChanges = () => {
    if (!preferences || !localPreferences) return false;
    
    return (
      preferences.deviceAlerts !== localPreferences.deviceAlerts ||
      preferences.transactionAlerts !== localPreferences.transactionAlerts ||
      preferences.systemAlerts !== localPreferences.systemAlerts ||
      preferences.schoolAlerts !== localPreferences.schoolAlerts
    );
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferências de Notificações</CardTitle>
          <CardDescription>
            Configure quais tipos de notificações deseja receber
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preferências de Notificações
        </CardTitle>
        <CardDescription>
          Configure quais tipos de notificações deseja receber no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <Label className="text-base font-medium">Alertas de Dispositivos</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre dispositivos com bateria fraca, problemas de conexão, etc.
                </p>
              </div>
            </div>
            <Switch 
              checked={localPreferences?.deviceAlerts || false} 
              onCheckedChange={() => handleToggle('deviceAlerts')}
            />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex gap-3">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <div>
                <Label className="text-base font-medium">Alertas de Transações</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre transações realizadas, falhas de pagamento, etc.
                </p>
              </div>
            </div>
            <Switch 
              checked={localPreferences?.transactionAlerts || false} 
              onCheckedChange={() => handleToggle('transactionAlerts')}
            />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex gap-3">
              <Server className="h-5 w-5 text-purple-500" />
              <div>
                <Label className="text-base font-medium">Alertas de Sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre atualizações do sistema, manutenções programadas, etc.
                </p>
              </div>
            </div>
            <Switch 
              checked={localPreferences?.systemAlerts || false} 
              onCheckedChange={() => handleToggle('systemAlerts')}
            />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex gap-3">
              <Building2 className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-base font-medium">Alertas de Escolas</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações relacionadas às escolas, como novas inscrições, alterações de plano, etc.
                </p>
              </div>
            </div>
            <Switch 
              checked={localPreferences?.schoolAlerts || false} 
              onCheckedChange={() => handleToggle('schoolAlerts')}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges() || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              'Salvar Preferências'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
