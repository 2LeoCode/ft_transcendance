"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateUserDto = exports.CreateUserDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var CreateUserDto = /** @class */ (function () {
    function CreateUserDto() {
    }
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'joe42' })
    ], CreateUserDto.prototype, "nick");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'joe42@42.fr' })
    ], CreateUserDto.prototype, "mail");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'Joe' })
    ], CreateUserDto.prototype, "firstName");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'Fortytwo' })
    ], CreateUserDto.prototype, "lastName");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'lapin123' })
    ], CreateUserDto.prototype, "password");
    return CreateUserDto;
}());
exports.CreateUserDto = CreateUserDto;
var UpdateUserDto = /** @class */ (function () {
    function UpdateUserDto() {
    }
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 'joe42' })
    ], UpdateUserDto.prototype, "nick");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 'joe42@42.fr' })
    ], UpdateUserDto.prototype, "mail");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 'Joe' })
    ], UpdateUserDto.prototype, "firstName");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 'Fortytwo' })
    ], UpdateUserDto.prototype, "lastName");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 'lapin123' })
    ], UpdateUserDto.prototype, "password");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 42 })
    ], UpdateUserDto.prototype, "highestScore");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: [15, 24, 3] })
    ], UpdateUserDto.prototype, "scoreHistory");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: true })
    ], UpdateUserDto.prototype, "active");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: ['123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-12d3-a456-426614100047'] })
    ], UpdateUserDto.prototype, "friendIds");
    return UpdateUserDto;
}());
exports.UpdateUserDto = UpdateUserDto;
