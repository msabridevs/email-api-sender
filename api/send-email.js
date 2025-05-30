const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
  console.log("Request received:", req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, name, transaction, number } = req.body;

  if (!email || !name || !transaction || !number) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const msg = {
    to: email,
    from: 'egypt.in.frankfurt@gmail.com', // Make sure this is verified in SendGrid!
    subject: `طلبك: ${transaction}`,
    text: `تم تسجيل طلبك بنجاح.\n\nالاسم: ${name}\nرقم الطلب: ${number}\nنوع المعاملة: ${transaction}`
  };

  try {
    const result = await sgMail.send(msg);
    console.log("SendGrid response:", result);
    res.status(200).json({ message: '📧 تم إرسال البريد الإلكتروني بنجاح.' });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message, error);
    res.status(500).json({ 
      message: '❌ فشل إرسال البريد الإلكتروني.', 
      error: error.message, 
      details: error.response?.body 
    });
  }
};