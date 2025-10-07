import { betterAuth, type Auth } from "better-auth";

export const auth: Auth = betterAuth({
    appName: "server-example",
    plugins: [],
});
