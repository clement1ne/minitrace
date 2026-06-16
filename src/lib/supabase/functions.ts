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
    production_method: string;
    sustainability_score: number;
    description: string;
    content_hash: string;
    category: string;
    blockchain_tx_hash?: string | null;
}) {
    // 1. Create passport (without content_hash)
    const { data: passport, error } = await supabase
        .from('passports')
        .insert({
            user_id: data.user_id,
            product_name: data.product_name,
            category: data.category,
            production_method: data.production_method,
            description: data.description,
            sustainability_data: {
                material: data.material,
                origin: data.origin,
                sustainability_score: data.sustainability_score,
            },
            status: 'Verified',
            blockchain_tx_hash: data.blockchain_tx_hash ?? null,
            blockchain_network: data.blockchain_tx_hash ? 'polygon-amoy' : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) throw error;

    // 2. Create anchor with content_hash
    const { error: anchorError } = await supabase
        .from('passport_anchors')
        .insert({
            passport_id: passport.passport_id,
            content_hash: data.content_hash,
            tx_hash: data.blockchain_tx_hash,
            anchored_at: new Date().toISOString(),
            snapshot: {
                product_name: data.product_name,
                material: data.material,
                origin: data.origin,
                production_method: data.production_method,
                sustainability_score: data.sustainability_score,
                description: data.description,
            },
        });

    if (anchorError) throw anchorError;

    return passport;
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
            console.log("Error fetching profile: ", error);
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

export async function getPassportById(passportId: string) {
    const { data, error } = await supabase
        .from('passports')
        .select('*, passport_anchors(content_hash, tx_hash)')
        .eq('passport_id', passportId)
        .single();

    if (error) throw error;
    return data;
}
