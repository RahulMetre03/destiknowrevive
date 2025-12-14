export const resolvers = {
  Query: {
    dummy: () => "ok",
  },
  Mutation: {
    createPost: async (_, { userId, placeId, postId }, { driver }) => {
      const session = driver.session();
      const query = `
        MERGE (u:User { userId: $userId })
        MERGE (p:Place { placeId: $placeId })
        CREATE (post:Post { postId: $postId, createdAt: datetime() })
        MERGE (u)-[:CREATED]->(post)
        MERGE (post)-[:AT_PLACE]->(p)
        RETURN post
      `;
      const result = await session.run(query, { userId, placeId, postId });
      await session.close();

      const postNode = result.records[0].get("post").properties;

      return {
        postId: postNode.postId,
        createdAt: new Date(postNode.createdAt?.epochMillis || Date.now()).toISOString(),
      };
    },
  },
};
