import express, { NextFunction, Request, Response } from "express";
import { readFileSync, writeFileSync } from "fs";
import { z } from "zod";
// bun i express
// bun i -D @types/express
// bun i zod

const TOKEN = "sup3r-s3cr3t-4p1-k3y";

const User = z.object({
  id: z.coerce.number(),
  name: z.string(),
  email: z.string(),
});
type User = z.infer<typeof User>;

let users = User.array().parse(
  JSON.parse(readFileSync("2-users.json", "utf8"))
);

let getNewUserId = () => (users[users.length - 1]?.id ?? 0) + 1;
let saveUsers = () => writeFileSync("2-users.json", JSON.stringify(users));

let verifyToken = (req: Request, res: Response, next: NextFunction) => {
  if (typeof req.headers.authorization === "undefined")
    return res.status(401).send("Unauthorized");
  if (req.headers.authorization !== "Bearer " + TOKEN)
    return res.status(403).send("Forbidden");
  next();
};

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/v1/students", (req, res) => {
  res.send(users);
});

app.post("/api/v1/students", verifyToken, (req, res) => {
  const body = User.omit({ id: true }).safeParse(req.body);
  if (!body.success) return res.status(400).send("Bad Request");
  users.push({
    id: getNewUserId(),
    ...body.data,
  });
  saveUsers();
  res.send({ message: "success", id: users[users.length - 1].id });
});

app.patch("/api/v1/students/:userId", verifyToken, (req, res) => {
  const body = User.omit({ id: true }).partial().parse(req.body);
  const userIndex = users.findIndex((x) => x.id === +req.params.userId);
  if (userIndex === -1) return res.status(404).send("Not Found");
  Object.entries(body).forEach(([x, y]) => {
    users[userIndex][x] = y;
  });
  saveUsers();
  res.send({ message: "success" });
});

app.delete("/api/v1/students/:userId", verifyToken, (req, res) => {
  const userIndex = users.findIndex((x) => x.id === +req.params.userId);
  if (userIndex === -1) return res.status(404).send("Not Found");
  users.splice(userIndex, 1);
  saveUsers();
  res.send({ message: "success" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
