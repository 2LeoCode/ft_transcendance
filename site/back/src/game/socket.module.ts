import { Module } from "@nestjs/common";
import EventsModule from "src/nest/modules/events.module";
import ScoreModule from "src/nest/modules/score.module";
import UserModule from "src/nest/modules/user.module";
import { SocketEvents } from "./socket.gateway";

@Module({
  providers: [SocketEvents],
  exports: [SocketEvents],
  imports: [
    EventsModule,
    UserModule,
    ScoreModule
  ]
})
export class SocketModule {}