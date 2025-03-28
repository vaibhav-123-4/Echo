import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// const SUPABASE_URL = 'https://hxgslupubssgnxuvolwv.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4Z3NsdXB1YnNzZ254dXZvbHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDQ4MDgsImV4cCI6MjA1NDE4MDgwOH0.1H-J5-ca1mC94P8uXbF1trFabnJMw4GTrq9n7gHfXAo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
