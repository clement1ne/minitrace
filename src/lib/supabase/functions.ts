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

export async function createPassport(data: {
  user_id: string;
  product_name: string;
  material: string;
  origin: string;
  method: string;
  sustainability_score: number;
  description: string;
  content_hash: string;
}) {
  const { error } = await supabase
    .from('passports')
    .insert({
      user_id: data.user_id,
      product_name: data.product_name,
      material: data.material,
      origin: data.origin,
      method: data.method,
      sustainability_score: data.sustainability_score,
      description: data.description,
      content_hash: data.content_hash,
      status: 'Verified',
      created_at: new Date().toISOString(),
    })

  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
