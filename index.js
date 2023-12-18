import http from 'node:http';
import fs from 'node:fs/promises';

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

const sendData = (res, data) => {
  res.writeHead(200, {
    'Content-Type': 'text/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });

  res.end(data);
}

const sendError = (res, statusCode, errorMessage) => {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
  res.end(errorMessage);
}

const startServer = async () => {
  if (!(await checkFiles())) {
    return;
  }

  http.createServer(async (req, res) => {
    try {
      const segments = req.url.split('/').filter(Boolean);

      if (req.method === 'GET' && segments[0] === 'comedians') {
          const data = await fs.readFile(COMEDIANS, 'utf-8');

          if (segments.length === 2) {
            const comedian = JSON.parse(data).find((comedian => comedian.id === segments[1]));

            if (!comedian) {
              sendError(res, 404, 'Stand-up comedian not found');
              return;
            }

            sendData(res, JSON.stringify(comedian));
            return;
          }

          sendData(res, data);
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

