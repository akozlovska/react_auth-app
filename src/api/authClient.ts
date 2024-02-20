import { createClient } from "./client";

export const authClient = createClient();
authClient.interceptors.response.use(res => res.data);