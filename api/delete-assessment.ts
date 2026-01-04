
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Assessment ID is required.' });
    }

    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);

    if (error) {
      // If the error indicates the item was not found, it might have been already deleted.
      // We can treat this as a success for the client to avoid confusion.
      if (error.code === 'PGRST204') { // PostgREST code for no rows found
         return res.status(200).json({ message: 'Assessment already deleted.' });
      }
      throw error;
    }

    return res.status(200).json({ message: 'Assessment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting assessment from Supabase:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: 'Failed to delete assessment.', details: errorMessage });
  }
}
