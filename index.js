require("dotenv").config();
const { createServer } = require("http");
const app = require("./app/app");
const dbConnect = require("./db/db");

dbConnect();

const server = createServer(app);

const PORT = process.env.POST || 3030;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
