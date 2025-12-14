import driver from "./driver.js";

async function test() {
  const session = driver.session();

  try {
    const result = await session.run("RETURN 'Neo4j Connected!' AS message");
    console.log(result.records[0].get('message'));
  } catch (err) {
    console.error("Neo4j error:", err);
  } finally {
    await session.close();
  }
}

test();
