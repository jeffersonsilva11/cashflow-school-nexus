
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, School, User, CreditCard } from 'lucide-react';

interface DeviceEvent {
  id: string;
  type: 'activation' | 'allocation' | 'binding' | 'transaction' | 'access' | string;
  date: string;
  description: string;
}

interface DeviceEventTimelineProps {
  events: DeviceEvent[];
}

export const DeviceEventTimeline = ({ events }: DeviceEventTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Eventos</CardTitle>
        <CardDescription>Registro completo de atividades do dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l border-gray-200 space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative mb-6">
              <div className="absolute top-0 left-[-1.34rem] h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                {event.type === 'activation' && <CheckCircle size={14} className="text-white" />}
                {event.type === 'allocation' && <School size={14} className="text-white" />}
                {event.type === 'binding' && <User size={14} className="text-white" />}
                {event.type === 'transaction' && <CreditCard size={14} className="text-white" />}
                {event.type === 'access' && <CheckCircle size={14} className="text-white" />}
              </div>
              <div>
                <h4 className="font-medium">{event.description}</h4>
                <time className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
