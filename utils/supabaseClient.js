import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hoitrdzrrrutqxcoqdhs.supabase.co'; // 替换为你的 Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaXRyZHpycnJ1dHF4Y29xZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5ODU2OTQsImV4cCI6MjA1NTU2MTY5NH0.BYl2hxY_D_yWfwQ2eANZ4Nmu_YSOd4Lz63dgQYPuFHc'; // 替换为你的 Supabase Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);