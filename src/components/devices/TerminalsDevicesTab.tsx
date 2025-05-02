
import React from 'react';
import { TerminalDeviceStats } from './DeviceStatsCards';
import { TerminalsMonitoring } from './TerminalsMonitoring';

export const TerminalsDevicesTab = () => {
  // Dados mockados para maquininhas
  const terminalStats = {
    total: 245,
    online: 235,
    offline: 10
  };
  
  return (
    <div className="space-y-6">
      <TerminalDeviceStats terminalStats={terminalStats} />
      <TerminalsMonitoring />
    </div>
  );
};
