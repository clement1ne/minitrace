import { supabase } from '../../utils/supabase'

export async function login(email: string, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password,
    })

    if (error) {
      console.error("Login error: ", error.message);
      return {success: false, error: error.message}
    }
    console.log('login success')
    return {
      success: true,
      data,
      user: data.user,
      session: data.session
    }
  } catch(err) {
    console.log(err)
    return {success: false, error: err.message}
  }
} 

