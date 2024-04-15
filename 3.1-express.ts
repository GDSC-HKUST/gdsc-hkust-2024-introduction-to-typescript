import express from "express";
import { readFileSync, writeFileSync } from "fs";
// bun i express
// bun i -D @types/express

const TOKEN = "sup3r-s3cr3t-4p1-k3y";

let users: {
  id: number;
  name: string;
  email: string;
}[] = JSON.parse(readFileSync("2-users.json", "utf8"));

let getNewUserId = () => (users[users.length - 1]?.id ?? 0) + 1;
let saveUsers = () => writeFileSync("2-users.json", JSON.stringify(users));

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/v1/students", (req, res) => {
  res.send(users);
});

app.post("/api/v1/students", (req, res) => {
  if (req.headers.authorization !== "Bearer " + TOKEN)
    return res.sendStatus(403);
  if (!req.body.name || !req.body.email)
    return res.status(400).send("Bad Request");
  users.push({
    id: getNewUserId(),
    name: req.body.name,
    email: req.body.email,
  });
  saveUsers();
  res.send({ message: "success", id: users[users.length - 1].id });
});

app.patch("/api/v1/students/:userId", (req, res) => {
  if (req.headers.authorization !== "Bearer " + TOKEN)
    return res.sendStatus(403);
  const userIndex = users.findIndex((x) => x.id === +req.params.userId);
  if (userIndex === -1) return res.status(404).send("Not Found");
  ["name", "email"].forEach((x) => {
    if (req.body[x] && users[userIndex][x] !== req.body[x])
      users[userIndex][x] = req.body[x];
  });
  saveUsers();
  res.send({ message: "success" });
});

app.delete("/api/v1/students/:userId", (req, res) => {
  if (req.headers.authorization !== "Bearer " + TOKEN)
    return res.sendStatus(403);
  const userIndex = users.findIndex((x) => x.id === +req.params.userId);
  if (userIndex === -1) return res.status(404).send("Not Found");
  users.splice(userIndex, 1);
  saveUsers();
  res.send({ message: "success" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
