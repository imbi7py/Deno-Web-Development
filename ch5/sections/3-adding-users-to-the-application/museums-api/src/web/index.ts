import { serve } from "https://deno.land/std/http/server.ts";
import { MuseumController } from "../museums/index.ts";
import { Application } from "../deps.ts";
import { Router } from "https://deno.land/x/oak@v6.3.0/router.ts";
import { UserController } from "../users/types.ts";

interface CreateServerDependencies {
  configuration: {
    port: number;
  };
  museum: MuseumController;
  user: UserController;
}

export async function createServer({
  configuration: {
    port,
  },
  museum,
  user,
}: CreateServerDependencies) {
  const app = new Application();

  app.addEventListener("listen", (e) => {
    console.log(
      `Application running at http://${e.hostname || "localhost"}:${port}`,
    );
  });

  app.addEventListener("error", (e) => {
    console.log("An error occurred", e.message);
  });

  const apiRouter = new Router({ prefix: "/api" });

  apiRouter.get("/museums", async (ctx) => {
    ctx.response.body = {
      museums: await museum.getAll(),
    };
  });

  apiRouter.post("/users/register", async (ctx) => {
    const { username, password } = await ctx.request.body({ type: "json" })
      .value;

    if (!username && !password) {
      ctx.response.status = 400;

      return;
    }

    const createdUser = await user.register({ username, password });

    ctx.response.status = 201;
    ctx.response.body = { user: createdUser };
  });

  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());

  app.use((ctx) => {
    ctx.response.body = "Hello World!";
  });

  await app.listen({ port });
}
