import { supabase } from './supabaseClient';

/**
 * Fetch user's country based on IP address
 * @returns {string} Country name or 'Unknown'
 */
async function getUserCountry() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data.country_name || 'Unknown';
  } catch (error) {
    console.error('Error fetching country:', error);
    return 'Unknown';
  }
}

/**
 * Increments excited count in Supabase (date + country-based)
 */
export async function handleExcitedClick() {
  const today = new Date().toISOString().split('T')[0];
  const country = await getUserCountry();

  const { error } = await supabase.rpc('increment_excited_count_by_country', {
    p_date: today,
    p_country: country,
  });

  if (error) {
    console.error('Error incrementing excited count:', error.message);
    throw error;
  }
}

/**
 * Fetch today's count and total count (summed across all countries)
 * @returns {{ today: number, total: number }}
 */
export async function fetchExcitedCount() {
  const today = new Date().toISOString().split('T')[0];

  try {
    // Fetch today's count (across countries)
    const { data: todayData, error: todayError } = await supabase
      .from('excitement_clicks')
      .select('count')
      .eq('clicked_date', today);

    if (todayError && todayError.code !== 'PGRST116') {
      console.error("Today's fetch error:", todayError.message);
    }

    // Fetch total count (across all dates & countries)
    const { data: totalData, error: totalError } = await supabase
      .from('excitement_clicks')
      .select('count');

    if (totalError) {
      console.error('Total fetch error:', totalError.message);
    }

    const todayCount = todayData?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;
    const totalCount = totalData?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;

    return { today: todayCount, total: totalCount };
  } catch (err) {
    console.error('Unexpected error fetching excited counts:', err);
    return { today: 0, total: 0 };
  }
}