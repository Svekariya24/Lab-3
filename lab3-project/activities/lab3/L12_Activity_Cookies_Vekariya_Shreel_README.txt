Name: Shreel Khushalbhai Vekariya
Activity: Cookie / Session Counter (Express)

GitLab Repository: https://github.com/Svekariya24/csci-3172.git
GitHub Mirror (used for deployment): https://github.com/Svekariya24/csci-3172
Deployment URL: https://csci-3172-3.onrender.com/visit-count

Code snippet (cookie implementation):

app.use(cookieParser());

app.get('/visit-count', (req, res) => {
  const visits = parseInt(req.cookies.visits, 10) || 0;
  const newCount = visits + 1;
  res.cookie('visits', newCount, { maxAge: 86400000, httpOnly: true });
  res.send(`You have visited this page ${newCount} time(s).`);
});

How state was preserved:
The server stores the visit count in a "visits" cookie in the client's browser, which the browser sends back with every request so the server can read and increment it.

Deployment hurdles:
Initial Render deployment failed because app.js was missing from the pushed repository (Cannot find module app.js). Fixed by committing and pushing app.js. Screenshot attached.