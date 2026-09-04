const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;

// In cPanel Passenger, process.env.PORT can be a numeric port or a Unix socket path.
// Detect if it is numeric or a socket path to prevent crash/NaN errors.
const rawPort = process.env.PORT || '3007';
const isNumeric = /^\d+$/.test(rawPort);
const port = isNumeric ? parseInt(rawPort, 10) : rawPort;
const hostname = process.env.HOST || 'localhost';

// Initialize Next.js app
const app = next({ 
  dev, 
  hostname: isNumeric ? hostname : undefined, 
  port: isNumeric ? port : undefined 
});
const handle = app.getRequestHandler();

console.log(`Starting server: NODE_ENV=${process.env.NODE_ENV}, PORT=${rawPort}, isNumeric=${isNumeric}`);

app.prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

    if (isNumeric) {
      server.listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
      });
    } else {
      // Unix socket or named pipe - do not pass hostname
      server.listen(port, () => {
        console.log(`> Ready on socket: ${port}`);
      });
    }
  })
  .catch((err) => {
    console.error('Failed to start Next.js:', err);
    process.exit(1);
  });

