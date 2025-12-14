import {getDriver} from "../test.js";

export async function createPostService({ userId, placeId, postId }) {
    const driver = getDriver();
  const session = driver.session();

  try {
    const query = `
      MERGE (u:User {userId: $userId})
      MERGE (p:Place {placeId: $placeId})
      CREATE (post:Post {
        postId: $postId,
        createdAt: datetime()
      })
      MERGE (u)-[:CREATED]->(post)
      MERGE (post)-[:AT_PLACE]->(p)
      RETURN post
    `;

    const params = { userId, placeId, postId };
    const result = await session.run(query, params);

    return result.records[0].get("post").properties;

  } finally {
    await session.close();
  }
}
