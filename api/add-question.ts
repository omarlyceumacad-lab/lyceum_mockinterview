
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { question } = req.body;
    const trimmedQuestion = question?.trim();

    if (!trimmedQuestion) {
      return res.status(400).json({ error: 'A non-empty question string is required.' });
    }

    // 1. Check if the question already exists to avoid duplicates.
    const { data: existing, error: selectError } = await supabase
      .from('questions')
      .select('text')
      .eq('text', trimmedQuestion)
      .limit(1);

    if (selectError) {
      throw selectError;
    }
    
    // 2. If it already exists, do nothing and return a success response.
    if (existing && existing.length > 0) {
      return res.status(200).json({ message: 'Question already exists.' });
    }

    // 3. If it doesn't exist, insert it.
    const { error: insertError } = await supabase
      .from('questions')
      .insert({ text: trimmedQuestion });
      
    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({ message: 'Question added successfully.' });

  } catch (error) {
    console.error('Error in add-question handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: 'Failed to add question to the database.', details: errorMessage });
  }
}
