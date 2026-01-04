
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'A non-empty question string is required.' });
    }

    // Upsert ensures that if the question already exists, it doesn't create a duplicate.
    // The 'text' column must have a UNIQUE constraint in the database for this to work.
    const { error } = await supabase
      .from('questions')
      .upsert({ text: question.trim() }, { onConflict: 'text' });
      
    if (error) {
      throw error;
    }

    return res.status(201).json({ message: 'Question added successfully.' });

  } catch (error) {
    console.error('Error adding question to Supabase:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: 'Failed to add question.', details: errorMessage });
  }
}
