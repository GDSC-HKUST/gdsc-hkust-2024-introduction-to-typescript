import { Elysia, NotFoundError, t } from "elysia";
import { readFileSync, writeFileSync } from "fs";
// bun i elysia

const TOKEN = "sup3r-s3cr3t-4p1-k3y";

let users: {
  id: number;
  name: string;
  email: string;
}[] = JSON.parse(readFileSync("2-users.json", "utf8"));

let getNewUserId = () => (users[users.length - 1]?.id ?? 0) + 1;
let saveUsers = () => writeFileSync("2-users.json", JSON.stringify(users));

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/api/v1/students", () => users)
  .post(
    "/api/v1/students",
    ({ body }) => {
      users.push({
        id: getNewUserId(),
        ...body,
      });
      saveUsers();
      return { message: "success", id: users[users.length - 1].id };
    },
    {
      header: { authorization: t.Literal("Bearer " + TOKEN) },
      body: t.Object({
        name: t.String(),
        email: t.String(),
      }),
    }
  )
  .patch(
    "/api/v1/students/:userId",
    ({ params: { userId }, body }) => {
      const userIndex = users.findIndex((x) => x.id === userId);
      if (userIndex === -1) throw new NotFoundError();
      Object.entries(body).forEach(([x, y]) => {
        users[userIndex][x] = y;
      });
      saveUsers();
      return { message: "success" };
    },
    {
      header: { authorization: t.Literal("Bearer " + TOKEN) },
      params: t.Object({
        userId: t.Numeric(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/api/v1/students/:userId",
    ({ params: { userId } }) => {
      const userIndex = users.findIndex((x) => x.id === userId);
      if (userIndex === -1) throw new NotFoundError();
      users.splice(userIndex, 1);
      saveUsers();
      return { message: "success" };
    },
    {
      header: { authorization: t.Literal("Bearer " + TOKEN) },
      params: t.Object({
        userId: t.Numeric(),
      }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
