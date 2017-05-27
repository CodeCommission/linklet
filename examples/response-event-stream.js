module.exports = async (req, res) => {
  res.setHeader('cache-control', 'no-cache');
  res.setHeader('content-type', 'text/event-stream;charset=UTF-8');

  setInterval(() => res.write(`data: ${JSON.stringify({s: '1'})}\n\n`), 1000);
};