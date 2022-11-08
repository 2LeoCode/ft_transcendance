"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Message = void 0;
var channel_entity_1 = require("../channel/channel.entity");
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../user/user.entity");
var Message = /** @class */ (function () {
    function Message() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Message.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Message.prototype, "content");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], Message.prototype, "createDate");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)()
    ], Message.prototype, "updateDate");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (usr) { return usr.messagesOut; }, { nullable: false })
    ], Message.prototype, "sender");
    __decorate([
        (0, typeorm_1.Column)()
    ], Message.prototype, "type");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return channel_entity_1.Channel; }, function (cha) { return cha.messages; })
    ], Message.prototype, "channelReceiver");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (usr) { return usr.messagesIn; })
    ], Message.prototype, "userReceiver");
    Message = __decorate([
        (0, typeorm_1.Entity)()
    ], Message);
    return Message;
}());
exports.Message = Message;
