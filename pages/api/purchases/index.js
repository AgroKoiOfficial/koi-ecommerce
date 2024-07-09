
export default async function handler(req, res) {
    const apiKey = "5FLMzVasIGP4zi6At7GWJdK1iefJuAmMY7ZaLVMm";
    const url = 'https://tripay.co.id/api/merchant/payment-channel';
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
  
      if (response.status < 999) {
        const data = await response.json();
        res.status(response.status).json(data);
      } else {
        res.status(response.status).json({ message: 'Error fetching data' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
  