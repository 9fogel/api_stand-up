import { sendData, sendError } from "./sendUtils.js";

export const handleComediansRequest = async (req, res, comedians, segments) => {
  try {
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
  } catch (error) {
    console.error(`Error while comedians request handling: ${error}`);
    sendError(res, 500, 'Server error while comedians request handling');
  }
}