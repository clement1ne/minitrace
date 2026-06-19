import { Platform } from 'react-native';
import { supabase } from '@/utils/supabase';

export async function login(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error("Login error: ", error.message);
            return { success: false, error: error.message }
        }
        console.log('login success')
        return {
            success: true,
            data,
            user: data.user,
            session: data.session
        }
    } catch (err: any) {
        console.log(err);
        return { success: false, error: err.message }
    }
}

export async function signup(userEmail: string, userPassword: string, fullName: string, shopName: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: userEmail,
            password: userPassword,
        })

        if (error) { throw error; }
        if (!data.user) { throw new Error("User creation failed"); }

        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                shop_name: shopName,
            })
            .eq('id', data.user.id);

        if (profileError) { throw profileError; }

        return { success: true, user: data.user };
    } catch (err: any) {
        console.log(err);
        return { success: false, error: err.message }
    }
}
