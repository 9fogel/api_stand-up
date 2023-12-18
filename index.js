import http from 'node:http';
import fs from 'node:fs/promises';
import { sendData, sendError } from './modules/sendUtils.js';
import { checkFile } from './modules/checkFile.js';

const PORT = 8080;
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';

const startServer = async () => {
  if (!(await checkFile(COMEDIANS))) {
    return;
  }

  await checkFile(CLIENTS, true);

  http.createServer(async (req, res) => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const segments = req.url.split('/').filter(Boolean);

      if (req.method === 'GET' && segments[0] === 'comedians') {
          const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
          const comedians = JSON.parse(comediansData);

          if (segments.length === 2) {
            const comedian = comedians.find((comedian => comedian.id === segments[1]));

            if (!comedian) {
              sendError(res, 404, 'Stand-up comedian not found');
              return;
            }

            sendData(res, comedian);
            return;
          }

          sendData(res, comedians);
          return;
      }

      if (req.method === 'POST' && segments[0] === 'clients') {
        // POST / clients/:ticket
        // Add client
      }

      if (req.method === 'GET' && segments[0] === 'clients' && segments.length === 2) {
        // GET / clients/:ticket
        // Get client by ticket number
      }

      if (req.method === 'PATCH' && segments[0] === 'clients' && segments.length === 2) {
        // PATCH / clients/:ticket
        // Update client by ticket number
      }

      sendError(res, 404, 'Not found');
    } catch (error) {
      sendError(res, 500, `Sorry, server-side error occurred: ${error}`);
    }
  })
    .listen(PORT);

  console.log(`Server is running on port ${PORT}`);
};

startServer();

