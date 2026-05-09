import { supabase } from '../../utils/supabase'

export async function getPassports(user_id: string) {
  const { data: passports, error } = await supabase
    .from('passports')
    .select('*')
    .eq('user_id', user_id)

  console.log('passports:', passports);
  console.log('error:', error);

  if (error) throw error;
  return passports;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
