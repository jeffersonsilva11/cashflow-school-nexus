
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { setupConnectivityListeners, getStoredOfflineTransactions, syncOfflineTransactions } from '@/services/apiService';

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  useEffect(() => {
    // Check for any offline transactions on mount
    updatePendingTransactions();
    
    // Listen for online/offline events
    const unsubscribe = setupConnectivityListeners(
      () => {
        setIsOnline(true);
        autoSync();
      },
      () => {
        setIsOnline(false);
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  // Update the count of pending transactions
  const updatePendingTransactions = () => {
    const offlineTransactions = getStoredOfflineTransactions();
    setPendingTransactions(offlineTransactions.length);
  };
  
  // Auto sync when coming online
  const autoSync = async () => {
    const offlineTransactions = getStoredOfflineTransactions();
    if (offlineTransactions.length > 0) {
      await handleSync();
    }
  };
  
  const handleSync = async () => {
    if (!isOnline) {
      return;
    }
    
    setIsSyncing(true);
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + 5, 90);
      setSyncProgress(progress);
    }, 100);
    
    try {
      const result = await syncOfflineTransactions();
      
      if (result.success) {
        setSyncProgress(100);
        setTimeout(() => {
          setShowSuccessBanner(true);
          setTimeout(() => setShowSuccessBanner(false), 3000);
        }, 500);
      }
      
      updatePendingTransactions();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgress(0);
      }, 1000);
    }
  };
  
  if (showSuccessBanner) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-green-50 border border-green-200 text-green-800 shadow-lg z-50">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle>Sincronização concluída</AlertTitle>
        <AlertDescription>
          Todas as transações offline foram sincronizadas com sucesso.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!isOnline) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-amber-50 border border-amber-200 text-amber-800 shadow-lg z-50">
        <WifiOff className="h-4 w-4 text-amber-600" />
        <AlertTitle>Modo Offline</AlertTitle>
        <AlertDescription>
          Você está em modo offline. As transações serão armazenadas localmente e sincronizadas quando a conexão for restaurada.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (pendingTransactions > 0) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-blue-50 border border-blue-200 text-blue-800 shadow-lg z-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertTitle>Transações pendentes</AlertTitle>
        <AlertDescription>
          Existem {pendingTransactions} transações offline pendentes de sincronização.
          
          {isSyncing ? (
            <div className="mt-2">
              <Progress value={syncProgress} className="h-2" />
              <span className="text-xs mt-1 block">Sincronizando... {syncProgress}%</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-blue-100 border-blue-200 hover:bg-blue-200 text-blue-700"
              onClick={handleSync}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Sincronizar Agora
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
