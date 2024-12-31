// src/server.js
import app from './app.js';

const port = 5001;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
