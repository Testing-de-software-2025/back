"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const axios_1 = __importDefault(require("axios"));
const permissions_decorator_1 = require("./decorators/permissions.decorator");
let AuthGuard = class AuthGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        try {
            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization?.replace("Bearer ", "");
            if (!token) {
                throw new common_1.UnauthorizedException("No token provided");
            }
            const permissions = this.reflector.get(permissions_decorator_1.PERMISSIONS_KEY, context.getHandler()) ?? [];
            if (!permissions.length)
                return true;
            const baseURL = process.env.JWT_SERVICE_URL || "http://localhost:3001";
            const requests = permissions.map((permission) => axios_1.default.get(`${baseURL}/can-do/${permission}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }));
            const results = await Promise.allSettled(requests);
            for (const r of results) {
                if (r.status === "fulfilled" && r.value?.data)
                    return true;
            }
            throw new common_1.ForbiddenException("Insufficient permissions");
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ForbiddenException) {
                throw error;
            }
            const err = error;
            if (axios_1.default.isAxiosError(err) && err.response) {
                const status = err.response.status;
                const respData = err.response.data;
                const message = respData?.message ?? err.message;
                if (status === 401) {
                    throw new common_1.UnauthorizedException(message);
                }
                else if (status === 403) {
                    throw new common_1.ForbiddenException(message);
                }
            }
            throw new common_1.UnauthorizedException("An unexpected error occurred");
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.middleware.js.map