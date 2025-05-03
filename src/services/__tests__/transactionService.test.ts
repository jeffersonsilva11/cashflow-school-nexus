
import { createTransaction } from '../transactionService';
import { supabase } from '@/integrations/supabase/client';
import '@types/jest';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnValue({
      data: { id: 'test-id' },
      error: null
    })
  }
}));

describe('transactionService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should properly format Date objects to ISO strings', async () => {
      // Create test transaction with Date object
      const testDate = new Date();
      const testTransaction = {
        transaction_id: 'test-123',
        amount: 100,
        type: 'purchase' as const,
        status: 'completed' as const,
        transaction_date: testDate
      };

      // Call the function
      await createTransaction(testTransaction);

      // Get the mock calls to see what was passed to insert
      const insertMock = (supabase.from as jest.Mock).mock.results[0].value.insert;
      
      // Check that the first argument to insert was correctly formatted
      expect(insertMock).toHaveBeenCalledWith({
        ...testTransaction,
        transaction_date: testDate.toISOString()
      });
    });

    it('should pass string dates through unchanged', async () => {
      // Create test transaction with string date
      const testDateString = '2025-01-01T12:00:00Z';
      const testTransaction = {
        transaction_id: 'test-123',
        amount: 100,
        type: 'purchase' as const,
        status: 'completed' as const,
        transaction_date: testDateString
      };

      // Call the function
      await createTransaction(testTransaction);

      // Check that the string date was passed through unchanged
      const insertMock = (supabase.from as jest.Mock).mock.results[0].value.insert;
      expect(insertMock).toHaveBeenCalledWith({
        ...testTransaction,
        transaction_date: testDateString
      });
    });
  });
});
