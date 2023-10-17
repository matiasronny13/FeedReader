import { useMemo } from 'react';
import { createClient } from '@supabase/supabase-js'
import { SupabaseSettings } from '../../supabase';

function useSupabase() {
  return useMemo(() => createClient(SupabaseSettings.URL, SupabaseSettings.ANON_KEY), []);
}
 
export default useSupabase;