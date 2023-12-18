import http from 'node:http';
import fs from 'node:fs/promises';

const PORT = 8080;
const COMEDIANS = './comdeians.json';
const CLIENTS = './clients.json';

const startServer = async () => {
  http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/comedians') {
      try {
        const data = await fs.readFile('comedians.json', 'utf-8');

        res.writeHead(200, {
          'Content-Type': 'text/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(data);
      } catch (error) {
        res.writeHead(500, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        res.end(`Sorry, serverside error occurred: ${error}`);
      }
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      res.end('Not found');
    }
  })
    .listen(PORT);

  console.log(`Server is running on port ${PORT}`);
};

startServer();

