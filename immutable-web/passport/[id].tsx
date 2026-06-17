import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PassportPage() {
    const router = useRouter();
    const { id } = router.query;
    const [passport, setPassport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        supabase
            .from('passports')
            .select(`*, passport_anchors(*)`)
            .eq('id', id)
            .single()
            .then(({ data }) => {
                setPassport(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!passport) return <p>Passport not found</p>;

    const txHash = passport?.passport_anchors?.[0]?.tx_hash;

    return (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{ color: '#1D9E75' }}>MiniTrace</h1>
                <p style={{ color: '#666' }}>Digital Product Passport</p>
            </div>

            {/* Verified badge */}
            <div style={{ background: '#E1F5EE', borderRadius: 8, padding: '8px 16px', display: 'inline-block', marginBottom: 16 }}>
                <span style={{ color: '#0F6E56', fontWeight: 600 }}>✓ Verified Handmade Product</span>
            </div>

            {/* Product name */}
            <h2>{passport.product_name}</h2>
            <p>{passport.description}</p>

            {/* Details */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                {[
                    ['Material', passport.material],
                    ['Origin', passport.origin],
                    ['Method', passport.production_method],
                    ['Eco Score', `${passport.sustainability_score}/10`],
                    ['Passport ID', id],
                ].map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px 0', color: '#999', width: '40%' }}>{key}</td>
                        <td style={{ padding: '10px 0', fontWeight: 500 }}>{val}</td>
                    </tr>
                ))}
            </table>

            {/* Blockchain proof */}
            {txHash && (

                href = {`https://amoy.polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1D9E75', display: 'block', marginBottom: 24 }}
                >
            🔗 View blockchain proof
        </a>
    )
}

{/* Footer */ }
<p style={{ color: '#aaa', fontSize: 12, textAlign: 'center' }}>
    Powered by MiniTrace · Authenticated by Polygon blockchain
</p>
        </div >
    );
}
