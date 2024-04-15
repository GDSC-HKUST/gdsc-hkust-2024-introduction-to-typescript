import { writeFileSync } from "fs";

let users = (await fetch("https://dummyjson.com/users").then((x) => x.json()))
  .users;
users = users.map((x) => ({
  id: +x.id,
  name: x.firstName + " " + x.lastName,
  email: x.email,
}));
writeFileSync("2-users.json", JSON.stringify(users));
