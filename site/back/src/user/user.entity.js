"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var typeorm_1 = require("typeorm");
var channel_entity_1 = require("../channel/channel.entity");
var message_entity_1 = require("../message/message.entity");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], User.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "nick");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "mail");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "firstName");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "lastName");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], User.prototype, "avatarPath");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], User.prototype, "highestScore");
    __decorate([
        (0, typeorm_1.Column)('int', { array: true, "default": [] })
    ], User.prototype, "scoreHistory");
    __decorate([
        (0, typeorm_1.Column)({ "default": true })
    ], User.prototype, "active");
    __decorate([
        (0, typeorm_1.Column)('json', { "default": [] })
    ], User.prototype, "friendIds");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return channel_entity_1.Channel; }, function (cha) { return cha.owner; })
    ], User.prototype, "ownedChannels");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return message_entity_1.Message; }, function (msg) { return msg.userReceiver; })
    ], User.prototype, "messagesIn");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return message_entity_1.Message; }, function (msg) { return msg.sender; })
    ], User.prototype, "messagesOut");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return channel_entity_1.Channel; }, function (cha) { return cha.users; })
    ], User.prototype, "channels");
    User = __decorate([
        (0, typeorm_1.Entity)()
    ], User);
    return User;
}());
exports.User = User;
