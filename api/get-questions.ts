
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('text');

    if (error) {
      throw error;
    }

    const questions = data.map(row => row.text);
    return res.status(200).json(questions);

  } catch (error) {
    console.error('Error fetching questions from Supabase:', error);
    return res.status(500).json({ error: 'Failed to fetch questions.' });
  }
}
