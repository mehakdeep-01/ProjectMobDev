import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jhpyhfucjhgpuftyinmt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocHloZnVjamhncHVmdHlpbm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDY5NzgsImV4cCI6MjA1ODU4Mjk3OH0.KrwRF72gIy0j5fI3Hi3BMT3UIv-ql9O-RdsOxb3n8P4';


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
