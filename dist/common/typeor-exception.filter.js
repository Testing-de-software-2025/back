"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let TypeOrmExceptionFilter = class TypeOrmExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const error = exception;
        const status = common_1.HttpStatus.BAD_REQUEST;
        const message = "Error en la base de datos";
        res.status(status).json({
            statusCode: status,
            message,
            error: common_1.HttpStatus[status].toString(),
        });
    }
};
exports.TypeOrmExceptionFilter = TypeOrmExceptionFilter;
exports.TypeOrmExceptionFilter = TypeOrmExceptionFilter = __decorate([
    (0, common_1.Catch)(typeorm_1.QueryFailedError)
], TypeOrmExceptionFilter);
//# sourceMappingURL=typeor-exception.filter.js.map