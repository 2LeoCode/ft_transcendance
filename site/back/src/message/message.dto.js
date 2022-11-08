"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateMessageDto = exports.CreateMessageDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var CreateMessageDto = /** @class */ (function () {
    function CreateMessageDto() {
    }
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'Hello World!' })
    ], CreateMessageDto.prototype, "content");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'ff9619c7-930e-42d2-9b30-8e2e29316665' })
    ], CreateMessageDto.prototype, "senderId");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'private' })
    ], CreateMessageDto.prototype, "type");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: '9587a4f1-6099-463c-955d-779a0bbc54ff' })
    ], CreateMessageDto.prototype, "receiverId");
    return CreateMessageDto;
}());
exports.CreateMessageDto = CreateMessageDto;
var UpdateMessageDto = /** @class */ (function () {
    function UpdateMessageDto() {
    }
    __decorate([
        (0, swagger_1.ApiPropertyOptional)({ example: 'Hello World!' })
    ], UpdateMessageDto.prototype, "content");
    return UpdateMessageDto;
}());
exports.UpdateMessageDto = UpdateMessageDto;
