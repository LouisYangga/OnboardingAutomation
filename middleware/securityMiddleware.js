export function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'] || req.headers['X-Api-Key'];
    if (apiKey !== process.env.API_KEY) {
      return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }
    next();
}