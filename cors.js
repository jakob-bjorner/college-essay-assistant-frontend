import cors from 'cors';

// Initialize the cors middleware
const corsHandler = cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the HTTP methods you want to allow
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
});

export default function handler(req, res) {
  // Use the cors middleware before handling the request
  corsHandler(req, res, () => {
    // Your API logic
    res.status(200).json({ message: 'CORS allowed for this request.' });
  });
}
