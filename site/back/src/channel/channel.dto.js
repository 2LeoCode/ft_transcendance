"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateChannelDto = exports.CreateChannelDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var CreateChannelDto = /** @class */ (function () {
    function CreateChannelDto() {
    }
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'MyChannel' })
    ], CreateChannelDto.prototype, "name");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'foobar123' })
    ], CreateChannelDto.prototype, "password");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: false })
    ], CreateChannelDto.prototype, "isPrivate");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'ff9619c7-930e-42d2-9b30-8e2e29316665' })
    ], CreateChannelDto.prototype, "ownerId");
    return CreateChannelDto;
}());
exports.CreateChannelDto = CreateChannelDto;
var UpdateChannelDto = /** @class */ (function () {
    function UpdateChannelDto() {
    }
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 'MyChannel' })
    ], UpdateChannelDto.prototype, "name");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 'foobar123' })
    ], UpdateChannelDto.prototype, "password");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: false })
    ], UpdateChannelDto.prototype, "isPrivate");
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: ['ff9619c7-930e-42d2-9b30-8e2e29316665', '29446624-db02-47ff-8d30-43abfeabf56c'] })
    ], UpdateChannelDto.prototype, "userIds");
    return UpdateChannelDto;
}());
exports.UpdateChannelDto = UpdateChannelDto;
