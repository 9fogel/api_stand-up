import { sendData, sendError } from "./sendUtils.js";

export const handleComediansRequest = async (req, res, comedians, id) => {
  try {
    if (id) {
      const comedian = comedians.find((comedian => comedian.id === id));

      if (!comedian) {
        sendError(res, 404, 'Stand-up comedian not found');
        return;
      }

      sendData(res, comedian);
      return;
    }

    sendData(res, comedians);
  } catch (error) {
    console.error(`Error while comedians request handling: ${error}`);
    sendError(res, 500, 'Server error while comedians request handling');
  }
}