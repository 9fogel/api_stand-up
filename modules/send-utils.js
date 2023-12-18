export const sendData = (res, data) => {
  res.writeHead(200, {
    'Content-Type': 'text/json; charset=utf-8',
    // 'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

export const sendError = (res, statusCode, errorMessage) => {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
  res.end(errorMessage);
}