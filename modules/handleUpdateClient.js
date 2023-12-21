import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./sendUtils.js";
import fs from 'node:fs/promises';

export const handleUpdateClient = (req, res, ticketNumber) => {
  let body = '';

  try {
    req.on('data', chunk => {
      body += chunk;
    });
  } catch (error) {
    console.log(`Error while reading request`);
    sendError(res, 500, 'Server error while reading request');
  }

  req.on('end', async () => {
    try {
      const updateClientData = JSON.parse(body);

      if (
        !updateClientData.fullName ||
        !updateClientData.phone ||
        !updateClientData.ticketNumber ||
        !updateClientData.booking
        ) {
        sendError(res, 400, 'Wrong client data');
        return;
      }

      if (updateClientData.booking &&
        (!updateClientData.booking.length ||
        !Array.isArray(updateClientData.booking) ||
        !updateClientData.booking.every(item => item.comedian && item.time))
      ) {
        sendError(res, 400, 'Wrong booking data');
        return;
      }

      const clientData = await fs.readFile(CLIENTS, 'utf-8');
      const clients = JSON.parse(clientData);

      const clientIndex = clients.findIndex((client) => client.ticketNumber === ticketNumber);

      if (clientIndex === -1) {
        sendError(res, 404, `Client with ticketNumber ${ticketNumber} not found`);
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updateClientData,
      };

      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, clients[clientIndex]);
    } catch (error) {
      console.error(`Error while update request handling: ${error}`);
      sendError(res, 500, 'Server error while updating client data');
    }
  })
};