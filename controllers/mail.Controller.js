// controllers/mailController.js
exports.sendMail = (req, res) => {
  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log(`Mail sent from ${from} to ${to}: ${message}`);
  res.status(200).json({ success: true, msg: 'Mail sent successfully' });
};

exports.getInbox = (req, res) => {
  // Placeholder inbox
  res.status(200).json([
    {
      from: 'demo@grownfolk',
      message: 'Welcome to GrownFolk Mail!',
      timestamp: Date.now()
    }
  ]);
};
