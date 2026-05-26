exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method not allowed' };

  const AUTH_KEY    = '519523AGf881ttNq6a1406deP1';
  const TEMPLATE_ID = '6a15794bdfaa3c7afb0b2413';
  const SENDER_ID   = 'smsind';

  try {
    const { action, mobile, otp } = JSON.parse(event.body);

    if (action === 'send') {
      // No OTP param - MSG91 generates it automatically
      const url = `https://api.msg91.com/api/v5/otp?authkey=${AUTH_KEY}&mobile=91${mobile}&template_id=${TEMPLATE_ID}&sender=${SENDER_ID}&otp_length=6&otp_expiry=10`;
      const res = await fetch(url, { method: 'GET', headers: { 'accept': 'application/json' } });
      const text = await res.text();
      console.log('send:', text);
      return { statusCode: 200, headers, body: text };
    }

    if (action === 'verify') {
      const url = `https://api.msg91.com/api/v5/otp/verify?authkey=${AUTH_KEY}&mobile=91${mobile}&otp=${otp}`;
      const res = await fetch(url, { method: 'GET', headers: { 'accept': 'application/json' } });
      const text = await res.text();
      console.log('verify:', text);
      return { statusCode: 200, headers, body: text };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
