import { sequelize } from "./datasource.js";
import express from "express";
import bodyParser from "body-parser";
import { usersRouter } from "./routers/users_router.js";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import cors from "cors";

const PORT = 3000;
export const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});
app.use(bodyParser.json());

// app.use(express.static("static"));
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(
  session({
    secret: process.env.SECRET_KEY || "test",
    resave: false,
    saveUninitialized: true,
  })
);

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("msg", (message) => {
      socket.to(roomId).emit("user-msg", message);
    });
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

app.use("/users", usersRouter);

httpServer.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
