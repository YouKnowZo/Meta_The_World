"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
const config = {
    development: {
        client: "pg",
        connection: process.env.DATABASE_URL || {
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "postgres",
            database: process.env.DB_NAME || "metatheworld",
            port: Number(process.env.DB_PORT) || 5432,
        },
        migrations: {
            directory: "./src/db/migrations",
            extension: "ts",
        },
        seeds: {
            directory: "./src/db/seeds",
            extension: "ts",
        },
    },
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./src/db/migrations",
            extension: "ts",
        },
        seeds: {
            directory: "./src/db/seeds",
            extension: "ts",
        },
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map