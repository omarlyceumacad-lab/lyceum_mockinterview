
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabaseClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('id, interview_details, feedback_data')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    
    // The data structure from Supabase already matches what the frontend expects.
    // The column names 'interview_details' and 'feedback_data' become keys.
    // We just map it to be certain of the final structure.
    const history = data.map(row => ({
        id: row.id,
        interviewDetails: row.interview_details,
        feedbackData: row.feedback_data
    }));

    return res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history from Supabase:', error);
    return res.status(500).json({ error: 'Failed to fetch assessment history.' });
  }
}
