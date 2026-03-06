const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // serve frontend

// Endpoint to generate pairing code and send to WhatsApp
app.post('/api/pair', async (req, res) => {
  const { phone } = req.body; // user phone to link
  if(!phone) return res.status(400).json({ error: 'Phone number required' });

  // Generate 8-digit pairing code
  const code = Math.floor(10000000 + Math.random() * 90000000);

  try {
    // Send code to your WhatsApp via wa.me link or API
    // Example using wa.me link (user clicks to send message to your number)
    const whatsappLink = `https://wa.me/254755660053?text=Pairing+Code:+${code}+from+${phone}`;

    res.json({
      message: 'Pairing code generated!',
      code,
      whatsappLink
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send code' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('QUEEN BELLA Pairing API running...');
});