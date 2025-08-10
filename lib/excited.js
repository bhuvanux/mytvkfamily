// lib/excited.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DISTRICT_CACHE_KEY = 'tvk-district';
const DISTRICT_CACHE_MS = 24 * 60 * 60 * 1000; // 24h
const FALLBACK_DISTRICT = 'Coimbatore'; // or 'GLOBAL'

// normalize variants -> a single label
function normalizeDistrict(raw) {
  if (!raw) return FALLBACK_DISTRICT;
  const s = String(raw).toLowerCase().trim();

  if (s.startsWith('coimbatore')) return 'Coimbatore';
  if (s.startsWith('madurai')) return 'Madurai';
  if (s === 'unknown' || s === '') return FALLBACK_DISTRICT;

  // Title case as a generic fallback
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function fetchUserDistrict() {
  // 1) URL override
  const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
  const qd = url?.searchParams.get('district');
  if (qd) {
    const norm = normalizeDistrict(qd);
    localStorage.setItem(DISTRICT_CACHE_KEY, JSON.stringify({ v: norm, t: Date.now() }));
    return norm;
  }

  // 2) Cached value
  try {
    const cached = JSON.parse(localStorage.getItem(DISTRICT_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.t < DISTRICT_CACHE_MS) {
      return cached.v;
    }
  } catch { /* ignore */ }

  // 3) IP API
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const city = data?.city || data?.region || '';
    const norm = normalizeDistrict(city);
    localStorage.setItem(DISTRICT_CACHE_KEY, JSON.stringify({ v: norm, t: Date.now() }));
    return norm;
  } catch {
    return FALLBACK_DISTRICT;
  }
}

export async function getExcitedCount(district) {
  const { data, error } = await supabase
    .from('excited_totals')
    .select('count')
    .eq('district', normalizeDistrict(district))
    .maybeSingle();
  if (error) throw error;
  return data?.count ?? 0;
}

export async function incrementExcited(district) {
  // server side function also normalizes
  const { data, error } = await supabase.rpc('increment_excited', {
    d: normalizeDistrict(district),
  });
  if (error) throw error;
  return data ?? 0;
}

export function subscribeExcited(district, onChange) {
  const norm = normalizeDistrict(district);
  const channel = supabase
    .channel('excited_totals_live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'excited_totals', filter: `district=eq.${norm}` },
      (payload) => {
        const next = payload?.new?.count;
        if (Number.isFinite(next)) onChange(next);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
