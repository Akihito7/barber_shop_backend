
import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { Pool } from "pg";

export default defineConfig({
  dialect: "pg",
  dialectConfig: {
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  },
  migrations: {
    migrationFolder: "src/database/migrations",
    getMigrationPrefix: getKnexTimestampPrefix,
  },
  seeds: {
    seedFolder: "src/database/seeds",
    getSeedPrefix: getKnexTimestampPrefix,
  },
});