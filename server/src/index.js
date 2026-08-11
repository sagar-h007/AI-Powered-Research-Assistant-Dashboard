import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

// Connect to MongoDB
// In Vercel serverless, global state is preserved between warm function invocations
connectDB();

// Only listen on a port if we are NOT running in a Vercel serverless environment.
// Vercel handles the listening automatically when we export the app.
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express API for Vercel's serverless function handler
export default app;
