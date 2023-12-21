import fs from 'node:fs/promises';
import { sendData, sendError } from "./sendUtils.js";
import { CLIENTS } from "../index.js";

export const handleClientsRequest = async (req, res, ticketNumber) => {
  try {
    const clientData = await fs.readFile(CLIENTS, 'utf-8');
    const clients = JSON.parse(clientData);

    const client = clients.find((client) => client.ticketNumber === ticketNumber);

    if (!client) {
      sendError(res, 404, `Client with ticketNumber ${ticketNumber} not found`);
    }

    sendData(res, client);
  } catch (error) {
    console.error(`Error while request handling: ${error}`);
    sendError(res, 500, 'Server error while client request handling');
  }
};