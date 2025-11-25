"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeor_exception_filter_1 = require("./common/typeor-exception.filter");
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
async function ensurePostgresDatabase() {
    const pgHost = process.env.POSTGRES_HOST || "localhost";
    const pgPort = parseInt(process.env.POSTGRES_PORT || "5434", 10);
    const pgUser = process.env.POSTGRES_USER || "postgres";
    const pgPassword = process.env.POSTGRES_PASSWORD || "postgres";
    const pgDatabase = process.env.POSTGRES_DB || "delivery-zona";
    try {
        const client = new pg_1.Client({
            host: pgHost,
            port: pgPort,
            user: pgUser,
            password: pgPassword,
            database: "postgres",
        });
        await client.connect();
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [pgDatabase]);
        if (res.rowCount === 0) {
            try {
                await client.query(`CREATE DATABASE "${pgDatabase}"`);
                console.log(`Created database ${pgDatabase}`);
            }
            catch (e) {
            }
        }
        await client.end();
    }
    catch (err) {
        console.warn("Could not ensure Postgres database exists:", err && err.message ? err.message : err);
    }
}
async function bootstrap() {
    await ensurePostgresDatabase();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new typeor_exception_filter_1.TypeOrmExceptionFilter());
    app.enableCors({
        origin: "http://localhost:4200",
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        skipMissingProperties: false,
    }));
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map