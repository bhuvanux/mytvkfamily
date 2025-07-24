import supabase from '../utils/supabaseClient';

export async function saveCaptionToHistory({ userId, text, hashtags }) {
  const { data, error } = await supabase
    .from('caption_history')
    .insert([{ user_id: userId, text, hashtags }]);

  if (error) console.error('Error saving to history:', error);
  return data;
}