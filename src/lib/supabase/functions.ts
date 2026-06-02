import { Platform } from 'react-native';
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
    console.log("getcurrentuser: ", user?.user_metadata.id);
    return user;
}

export async function getCurrentUserName() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("userid: ", user?.id);

    if (!user) {
        console.log("No user logged in");
        return null;
    }

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

        if (error) {
            console.log("Current user profile: ", profile);
            return user.email?.split('@')[0] || "User";
        }
        console.log("userid: ", user.id)
        console.log("Current user full_name: ", profile?.full_name);

        return profile?.full_name || "User";
    } catch (err: any) {
        console.error(err.message);
    }
}

export async function getLatestPassports(user_id: string) {
    const { data: passports, error } = await supabase
        .from('passports')
        .select('*')
        .eq('user_id', user_id)
        .limit(3);

    console.log("Latest passports: ", passports);
    console.log("Error: ", error)

    if (error) throw error;

    return passports;
}
