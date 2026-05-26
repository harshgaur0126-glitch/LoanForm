exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method not allowed' };

  const WIDGET_ID  = '366579686b51333133303739';
  const TOKEN_AUTH = '519523Tn9qtE5V6a14054eP1';

  try {
    const { action, mobile, otp } = JSON.parse(event.body);

    if (action === 'send') {
      const res = await fetch('https://control.msg91.com/api/v5/widget/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: `91${mobile}`,
          widget_id: WIDGET_ID,
          tokenAuth: TOKEN_AUTH
        })
      });
      const data = await res.json();
      console.log('send response:', JSON.stringify(data));
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'verify') {
      const res = await fetch('https://control.msg91.com/api/v5/widget/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: `91${mobile}`,
          widget_id: WIDGET_ID,
          tokenAuth: TOKEN_AUTH,
          otp: otp
        })
      });
      const data = await res.json();
      console.log('verify response:', JSON.stringify(data));
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };
  } catch(e) {
    console.error('Error:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
