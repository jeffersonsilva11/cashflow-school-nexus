
import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMessageThread } from '@/services/messageService';
import { MessageParticipant } from '@/types/message';
import { useAuth } from '@/contexts/AuthContext';

interface NewThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewThreadDialog = ({ isOpen, onClose }: NewThreadDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [participantRole, setParticipantRole] = useState('school_admin');
  const [firstMessage, setFirstMessage] = useState('');
  
  const { mutate: createThread, isPending } = useCreateMessageThread();
  
  const handleCreateThread = () => {
    if (!title.trim() || !participantName.trim() || !firstMessage.trim()) return;
    
    const participant: MessageParticipant = {
      userId: crypto.randomUUID(), // temporary ID for demo
      name: participantName,
      role: participantRole,
    };
    
    createThread(
      {
        title,
        participants: [participant],
        initialMessage: firstMessage,
        threadType: 'direct',
      },
      {
        onSuccess: (data) => {
          onClose();
          navigate(`/messages/${data.id}`);
        }
      }
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
          <DialogDescription>
            Inicie uma nova conversa com outro usuário do sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Título da conversa</Label>
            <Input
              id="title"
              placeholder="Ex: Dúvidas sobre pagamentos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="participant">Nome do participante</Label>
            <Input
              id="participant"
              placeholder="Nome do outro participante"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Tipo de participante</Label>
            <select
              id="role"
              className="w-full px-3 py-2 border rounded-md"
              value={participantRole}
              onChange={(e) => setParticipantRole(e.target.value)}
            >
              <option value="school_admin">Administrador de Escola</option>
              <option value="vendor">Cantina</option>
              <option value="admin">Administrador do Sistema</option>
              <option value="staff">Funcionário</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Primeira mensagem</Label>
            <Textarea
              id="message"
              placeholder="Digite sua mensagem inicial..."
              rows={4}
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            onClick={handleCreateThread}
            disabled={!title.trim() || !participantName.trim() || !firstMessage.trim() || isPending}
          >
            Iniciar Conversa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
