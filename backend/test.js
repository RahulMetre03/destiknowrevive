// import neo4j, { driver } from 'neo4j-driver';

// // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
// const URI = 'neo4j+s://f28fbc1d.databases.neo4j.io'
// const USER = 'neo4j'
// const PASSWORD = 'owEjF8ZBw3bul_houm8xri0peY0WwOdytTTnKlrOyLY'

// const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

// // optional: verify connection once (not required but useful)
// driver.getServerInfo()
//     .then(() => console.log("Neo4j connected"))
//     .catch((err) => console.error("Neo4j connection error:", err));

// export default driver;


import neo4j, { driver } from "neo4j-driver";
import { buildGraphQLApp } from "./main.js";

let driverInstance = null;

export function initNeo4j(app) {
  if (driverInstance) return driverInstance;

  const URI = 'neo4j+s://f28fbc1d.databases.neo4j.io'
  const USER = "neo4j";
  const PASSWORD = 'owEjF8ZBw3bul_houm8xri0peY0WwOdytTTnKlrOyLY'

  driverInstance = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

  buildGraphQLApp(app,driverInstance);

  driverInstance
    .getServerInfo()
    .then(() => console.log("Neo4j connected"))
    .catch((err) => console.error("Neo4j connection error:", err));

  return driverInstance;
}

export function getDriver() {
  if (!driverInstance) throw new Error("Call initNeo4j() before using the driver!");
  return driverInstance;
}
