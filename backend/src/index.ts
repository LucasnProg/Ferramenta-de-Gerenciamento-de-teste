import { Server } from "./server.js";

async function bootstrap() {
  const server = new Server();
  await server.start(); 
}

bootstrap();
