import 'dotenv/config'; // Loads environment variables BEFORE importing app.js or db.js
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});