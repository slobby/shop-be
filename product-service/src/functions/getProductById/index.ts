import schema from "./schema";
import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: "hello",
        method: "post",
        request: {
          schema: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
