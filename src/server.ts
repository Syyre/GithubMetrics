import express, { type Express, type Request, type Response } from "express";

const PORT = 3000;
const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

console.log(`Server is running on http://localhost:${PORT}`);

app.listen(PORT);
