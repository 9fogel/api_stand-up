import http from 'node:http';
import fs from 'node:fs/promises';
import { sendData, sendError } from './modules/send-utils.js';

const PORT = 8080;
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';

const checkFiles = async () => {
  try {
    await fs.access(COMEDIANS);
  } catch (error) {
    console.error(`File ${COMEDIANS} not found!`)
    return false;
  }

  try {
    await fs.access(CLIENTS);
  } catch (error) {
    await fs.writeFile(CLIENTS, JSON.stringify([]));
    console.log(`File ${CLIENTS} was created!`)
    return false;
  }

  return true;
}

const startServer = async () => {
  if (!(await checkFiles())) {
    return;
  }

  http.createServer(async (req, res) => {
    try {
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

