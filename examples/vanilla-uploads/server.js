import http from "http";
import requestHandler from "./requestHandler.js";

/**
 * Creates an http.Server instance, which extends net.Server
 *
 * @see https://nodejs.org/api/http.html#class-httpserver
 */
const server = http.createServer();

/**
 * Registers event listener to handle HTTP requests
 *
 * @see https://nodejs.org/api/http.html#event-request
 */
server.on("request", requestHandler);

/**
 * Registers event listener for when server is listening.  This event
 * is available on http.Server through extension of the net.Server class
 *
 * @see https://nodejs.org/api/net.html#event-listening
 */
server.on("listening", () => {
  console.log("server listening on port 8081");
});

server.listen(8081);
