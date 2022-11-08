"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Channel = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../user/user.entity");
var message_entity_1 = require("../message/message.entity");
var Channel = /** @class */ (function () {
    function Channel() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Channel.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)({ "default": false })
    ], Channel.prototype, "isPrivate");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (usr) { return usr.ownedChannels; })
    ], Channel.prototype, "owner");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return user_entity_1.User; }, function (usr) { return usr.channels; }),
        (0, typeorm_1.JoinTable)()
    ], Channel.prototype, "users");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return message_entity_1.Message; }, function (msg) { return msg.channelReceiver; })
    ], Channel.prototype, "messages");
    Channel = __decorate([
        (0, typeorm_1.Entity)()
    ], Channel);
    return Channel;
}());
exports.Channel = Channel;
