"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeor_exception_filter_1 = require("./common/typeor-exception.filter");
const common_1 = require("@nestjs/common");
const sanitize_middleware_1 = require("./middlewares/sanitize.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new typeor_exception_filter_1.TypeOrmExceptionFilter());
    app.use(sanitize_middleware_1.sanitizeMiddleware);
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