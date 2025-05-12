
import { MessageParticipant } from "@/types/message";

/**
 * Helper function to safely parse participants from JSON
 */
export function parseParticipants(participantsJson: any): MessageParticipant[] {
  // Handle different formats that might come from the database
  if (!participantsJson) return [];
  
  let participantsArray: any[] = [];
  
  if (Array.isArray(participantsJson)) {
    participantsArray = participantsJson;
  } else if (typeof participantsJson === 'object') {
    participantsArray = [participantsJson];
  } else {
    try {
      // Try to parse if it's a JSON string
      const parsed = JSON.parse(String(participantsJson));
      participantsArray = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error('Error parsing participants:', e);
      return [];
    }
  }
  
  // Map to our expected MessageParticipant format
  return participantsArray.map(p => ({
    userId: p.user_id || p.userId,
    name: p.name || 'Usuário',
    avatar: p.avatar || undefined,
    role: p.role || 'user',
    schoolId: p.school_id || p.schoolId
  }));
}
