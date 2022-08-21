import { io } from "./index";

interface SeedData {
  completed?: boolean;
  progressPercent?: number;
}

export const seedLog = (message: string, type: string = "default", data: SeedData = {}) => {
  console.log(message);
  const sendData = { type: type ?? "default", message: message, data };
  io.emit("db_seed", sendData);
};
