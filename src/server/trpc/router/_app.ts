import { router } from "../trpc";
import { authRouter } from "./auth";
import { noteRouter } from "./note";
import { teamRouter } from "./team";

export const appRouter = router({
  auth: authRouter,
  note: noteRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
