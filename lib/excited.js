// lib/excited.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function handleExcitedClick() {
  const clickedDate = new Date().toISOString().split('T')[0];

  const country = await fetchUserCountry();

  const { data: existing, error } = await supabase
    .from('excitement_clicks')
    .select('count')
    .eq('clicked_date', clickedDate)
    .eq('country', country)
    .single();

  if (existing) {
    await supabase
      .from('excitement_clicks')
      .update({ count: existing.count + 1 })
      .eq('clicked_date', clickedDate)
      .eq('country', country);
  } else {
    await supabase
      .from('excitement_clicks')
      .insert([{ clicked_date: clickedDate, count: 1, country }]);
  }
}

export async function fetchExcitedCount() {
  const clickedDate = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('excitement_clicks')
    .select('count')
    .eq('clicked_date', clickedDate)
    .order('count', { ascending: false })
    .maybeSingle();

  return { today: data?.count || 0 };
}

async function fetchUserCountry() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data.country || 'Unknown';
  } catch {
    return 'Unknown';
  }
}