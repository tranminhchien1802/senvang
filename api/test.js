export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API route is working!',
    path: req.url,
    method: req.method
  });
}

export const config = {
  api: {
    bodyParser: true,
  },
};