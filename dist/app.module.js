"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const zone_module_1 = require("./zone/zone.module");
const deliveryPerson_module_1 = require("./deliveryPerson/deliveryPerson.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.POSTGRES_HOST || "localhost",
                port: parseInt(process.env.POSTGRES_PORT || "5433", 10),
                database: process.env.POSTGRES_DB || "deliveryzona",
                username: process.env.POSTGRES_USER || "postgres",
                password: process.env.POSTGRES_PASSWORD || "postgres",
                synchronize: process.env.TYPEORM_SYNCHRONIZE !== "false",
                entities: entities_1.entities,
                logging: process.env.TYPEORM_LOGGING === "true",
            }),
            zone_module_1.ZoneModule,
            deliveryPerson_module_1.DeliveryPersonModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map