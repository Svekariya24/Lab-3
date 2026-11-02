const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.get('/visit-count', (req, res) => {
  // Read the cookie sent by the browser (0 if it doesn't exist yet)
  const visits = parseInt(req.cookies.visits, 10) || 0;
  const newCount = visits + 1;

  // Send the updated value back to the client
  res.cookie('visits', newCount, {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true
  });

  res.send(`You have visited this page ${newCount} time(s).`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});