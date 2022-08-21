import dbConnection from "./db/dbConnection";
import expressApp from "./expressApp";
import { createServer } from "http";
import { Server } from "socket.io";
import { serverPort } from "./utils/config";

// Connect database
const connect = async () => {
  let retries = 10;
  while (retries > 0) {
    console.log("While:", retries);
    await dbConnection
      .then(async () => {
        console.log("HPO Orchestral DB - database connected");
        retries = 0;
      })
      .catch(async (error: any) => {
        retries--;
        console.log("Error:", error);
        console.log("Retries:", retries);
        await new Promise((res) => setTimeout(res, 3000));
      });
  }
};

connect();

const socketServer = createServer(expressApp);
export const io = new Server(socketServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  io.emit("connect_message", `Connection successfull. Hello from server, user key '${socket.id}!'`);
});

socketServer.listen(serverPort, () => {
  console.log(`HPO Orchestral DB - express server initialized on port: ${serverPort}`);
});
