import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./sendUtils.js";
import fs from 'node:fs/promises';
import { readRequestBody } from "./helpers.js";

export const handleUpdateClient = async (req, res, ticketNumber) => {
  try {
    const body = await readRequestBody(req);
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

    /* Alternative code for updating the client data */
    // Object.assign(clients[clientIndex], updateClientData);

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
};