// import { ApolloServer } from "@apollo/server";
import { createYoga, createSchema } from "graphql-yoga";
import bodyParser from "body-parser";
import cors from "cors";
import { typeDefs } from "./models/schema.js";
import { resolvers } from "./resolver/resolver.js";

export async function buildGraphQLApp(app, driver) {
  const yoga = createYoga({
    schema: createSchema({
      typeDefs,
      resolvers,
    }),
    context: () => ({ driver }),
    graphqlEndpoint: "/graphql",
  });

  app.use("/graphql", yoga);
}
