
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell, BellOff, CheckCircle, AlertCircle, Battery, Signal, MapPin } from 'lucide-react';
import { 
  useDeviceStatuses, 
  useActiveAlerts, 
  useAcknowledgeAlert, 
  useResolveAlert,
  subscribeToDeviceUpdates,
  subscribeToAlerts,
  DeviceAlert,
  DeviceStatus
} from '@/services/deviceMonitoringService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const DeviceMonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState('devices');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: deviceStatuses, refetch: refetchStatuses, isLoading: loadingStatuses } = useDeviceStatuses();
  const { data: activeAlerts, refetch: refetchAlerts, isLoading: loadingAlerts } = useActiveAlerts();
  const { toast } = useToast();
  const { user } = useAuth();
  const acknowledgeAlert = useAcknowledgeAlert();
  const resolveAlert = useResolveAlert();

  // Count devices by status
  const deviceCounts = {
    total: deviceStatuses?.length || 0,
    online: deviceStatuses?.filter(d => d.status === 'online').length || 0,
    offline: deviceStatuses?.filter(d => d.status === 'offline').length || 0,
    warning: deviceStatuses?.filter(d => d.status === 'warning').length || 0,
    critical: deviceStatuses?.filter(d => d.status === 'critical').length || 0,
  };

  // Group alerts by severity
  const alertCounts = {
    total: activeAlerts?.length || 0,
    info: activeAlerts?.filter(a => a.severity === 'info').length || 0,
    warning: activeAlerts?.filter(a => a.severity === 'warning').length || 0,
    critical: activeAlerts?.filter(a => a.severity === 'critical').length || 0,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchStatuses(), refetchAlerts()]);
    setIsRefreshing(false);
    toast({
      title: "Dashboard refreshed",
      description: "Device monitoring data has been updated"
    });
  };
  
  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert.mutate(alertId);
  };
  
  const handleResolve = (alertId: string) => {
    if (user?.id) {
      resolveAlert.mutate({ alertId, userId: user.id });
    } else {
      toast({
        title: "Authentication required",
        description: "You must be logged in to resolve alerts",
        variant: "destructive"
      });
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribeDevices = subscribeToDeviceUpdates(() => {
      refetchStatuses();
    });
    
    const unsubscribeAlerts = subscribeToAlerts(() => {
      refetchAlerts();
    });
    
    return () => {
      unsubscribeDevices();
      unsubscribeAlerts();
    };
  }, [refetchStatuses, refetchAlerts]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Device Monitoring</CardTitle>
            <CardDescription>Real-time monitoring and alert management</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing || loadingStatuses || loadingAlerts}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="devices" className="relative">
                Devices
                {deviceCounts.warning + deviceCounts.critical > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {deviceCounts.warning + deviceCounts.critical}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="alerts" className="relative">
                Alerts
                {alertCounts.total > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {alertCounts.total}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="h-6">
                Total: {activeTab === 'devices' ? deviceCounts.total : alertCounts.total}
              </Badge>
              {activeTab === 'devices' ? (
                <>
                  <Badge variant="success" className="h-6">
                    Online: {deviceCounts.online}
                  </Badge>
                  <Badge variant="destructive" className="h-6">
                    Offline: {deviceCounts.offline}
                  </Badge>
                </>
              ) : (
                <>
                  <Badge variant="warning" className="h-6">
                    Warning: {alertCounts.warning}
                  </Badge>
                  <Badge variant="destructive" className="h-6">
                    Critical: {alertCounts.critical}
                  </Badge>
                </>
              )}
            </div>
          </div>
          
          <TabsContent value="devices" className="space-y-4 mt-2">
            {loadingStatuses ? (
              <div className="text-center py-8">Loading device status data...</div>
            ) : deviceStatuses && deviceStatuses.length > 0 ? (
              <div className="grid gap-4">
                {deviceStatuses.map((device) => (
                  <DeviceStatusCard key={device.id} device={device} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No device status data available.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4 mt-2">
            {loadingAlerts ? (
              <div className="text-center py-8">Loading alert data...</div>
            ) : activeAlerts && activeAlerts.length > 0 ? (
              <div className="grid gap-4">
                {activeAlerts.map((alert) => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    onAcknowledge={handleAcknowledge}
                    onResolve={handleResolve}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active alerts at this time.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface DeviceStatusCardProps {
  device: DeviceStatus;
}

const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ device }) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-600'
  };
  
  const lastSeen = new Date(device.last_seen_at);
  const timeAgo = Math.floor((Date.now() - lastSeen.getTime()) / 60000); // minutes
  
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${statusColors[device.status]}`}></div>
        <div>
          <h4 className="font-medium">Device ID: {device.device_id}</h4>
          <p className="text-sm text-muted-foreground">
            Last seen: {timeAgo < 60 ? `${timeAgo} min ago` : `${Math.floor(timeAgo / 60)} hours ago`}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {device.battery_level !== undefined && (
          <div className="flex flex-col items-center">
            <Battery className={`h-5 w-5 ${device.battery_level < 20 ? 'text-red-500' : device.battery_level < 50 ? 'text-yellow-500' : 'text-green-500'}`} />
            <span className="text-xs">{device.battery_level}%</span>
          </div>
        )}
        
        {device.signal_strength !== undefined && (
          <div className="flex flex-col items-center">
            <Signal className={`h-5 w-5 ${device.signal_strength < 20 ? 'text-red-500' : device.signal_strength < 50 ? 'text-yellow-500' : 'text-green-500'}`} />
            <span className="text-xs">{device.signal_strength}%</span>
          </div>
        )}
        
        {device.location && (
          <div className="flex flex-col items-center">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="text-xs">Map</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface AlertCardProps {
  alert: DeviceAlert;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge, onResolve }) => {
  const severityColors = {
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    critical: 'bg-red-100 text-red-800 border-red-300'
  };
  
  const alertTime = new Date(alert.created_at);
  const timeAgo = Math.floor((Date.now() - alertTime.getTime()) / 60000); // minutes
  
  return (
    <div className={`border rounded-lg p-4 ${severityColors[alert.severity]}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <h4 className="font-medium">
              {alert.alert_type.replace('_', ' ').toUpperCase()}: Device {alert.device_id}
            </h4>
          </div>
          <p className="mt-1">{alert.message}</p>
          <p className="text-sm mt-2">
            Triggered: {timeAgo < 60 ? `${timeAgo} min ago` : `${Math.floor(timeAgo / 60)} hours ago`}
          </p>
        </div>
        
        <div className="flex gap-2">
          {alert.status === 'active' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAcknowledge(alert.id)}
              >
                <Bell className="h-4 w-4 mr-1" />
                Acknowledge
              </Button>
              <Button 
                size="sm"
                onClick={() => onResolve(alert.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Resolve
              </Button>
            </>
          )}
          {alert.status === 'acknowledged' && (
            <Button 
              size="sm"
              onClick={() => onResolve(alert.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Resolve
            </Button>
          )}
          {alert.status === 'resolved' && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Resolved
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
