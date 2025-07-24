// app/utils/bookmarks.js
import { supabase } from './supabaseClient';

export async function bookmarkCaption(userId, captionId) {
  const { error } = await supabase.from('bookmarks').insert([
    {
      user_id: userId,
      caption_id: captionId,
    },
  ]);
  return error;
}

export async function unbookmarkCaption(userId, captionId) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .match({ user_id: userId, caption_id: captionId });
  return error;
}

export async function getBookmarkedCaptionIds(userId) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('caption_id')
    .eq('user_id', userId);
  return { data: data?.map((row) => row.caption_id) || [], error };
}