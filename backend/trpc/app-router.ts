import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { signInProcedure } from "./routes/auth/sign-in/route";
import { signUpProcedure } from "./routes/auth/sign-up/route";
import { updateProfileProcedure } from "./routes/user/profile/route";
import { purchaseCreditsProcedure } from "./routes/credits/purchase/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    signIn: signInProcedure,
    signUp: signUpProcedure,
  }),
  user: createTRPCRouter({
    updateProfile: updateProfileProcedure,
  }),
  credits: createTRPCRouter({
    purchase: purchaseCreditsProcedure,
  }),
});

export type AppRouter = typeof appRouter;
