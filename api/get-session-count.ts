
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { referenceNumber } = req.query;

    if (!referenceNumber || typeof referenceNumber !== 'string') {
      return res.status(400).json({ error: 'Reference number is required.' });
    }

    // This query efficiently gets just the count without fetching the full records.
    const { count, error } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .eq('interview_details->>referenceNumber', referenceNumber);

    if (error) {
      throw error;
    }

    return res.status(200).json({ count: count ?? 0 });
    
  } catch (error) {
    console.error('Error fetching session count from Supabase:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: 'Failed to fetch session count.', details: errorMessage });
  }
}
