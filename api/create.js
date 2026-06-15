export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    // Rahasia ini akan kita pasang di Dashboard Vercel (bukan di kode HTML)
    const VPS_IP = process.env.VPS_IP; 
    const VPS_KEY = process.env.VPS_KEY;

    try {
        const vpsRequest = await fetch(`http://${VPS_IP}:5000/api/v1/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': VPS_KEY
            },
            body: JSON.stringify(req.body)
        });

        const data = await vpsRequest.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Gagal terhubung ke Server VPS.' });
    }
}
