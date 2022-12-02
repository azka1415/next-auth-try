import { router } from "../trpc";
import { authRouter } from "./auth";
import { noteRouter } from "./note";

export const appRouter = router({
  auth: authRouter,
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
