import { createContext, useContext, useMemo } from 'react';
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { SupabaseSettings } from '../../supabase';

const SupabaseContext = createContext<SupabaseClient|null>(null);

export const SupabaseProvider = ({ children }: {children: string | JSX.Element | JSX.Element[]}) => {
  const memoizedClient = useMemo(() => createClient(SupabaseSettings.URL, SupabaseSettings.ANON_KEY), []);

  return (
    <SupabaseContext.Provider value={memoizedClient}>
      {children}
    </SupabaseContext.Provider>
  );
}

const useSupabase = () => {
  return useContext(SupabaseContext)
}

export default useSupabase;