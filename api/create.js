export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const VPS_IP = process.env.VPS_IP; 
    const VPS_KEY = process.env.VPS_KEY;

    if (!VPS_IP || !VPS_KEY) {
        return res.status(500).json({ status: 'error', message: 'Environment Variables tidak disetel di Vercel.' });
    }

    try {
        const targetUrl = `http://${VPS_IP}:5000/api/v1/create`;
        
        const vpsRequest = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': VPS_KEY
            },
            body: JSON.stringify(req.body)
        });

        // Tangkap response meski statusnya bukan 200 (seperti 401 Unauthorized)
        const responseData = await vpsRequest.json();
        
        res.status(vpsRequest.status).json(responseData);
    } catch (error) {
        // Ini akan menangkap jika VPS mati atau Firewall memblokir port 5000
        res.status(500).json({ 
            status: 'error', 
            message: `Gagal terhubung ke VPS: ${error.message}. Pastikan port 5000 terbuka di Firewall Tencent.` 
        });
    }
}
