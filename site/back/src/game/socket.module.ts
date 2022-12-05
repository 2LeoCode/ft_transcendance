import { Module } from "@nestjs/common";
import EventsModule from "src/nest/modules/events.module";
import UserModule from "src/nest/modules/user.module";
import { SocketEvents } from "./socket.gateway";

@Module({
  providers: [SocketEvents],
  exports: [SocketEvents],
  imports: [
    EventsModule,
    UserModule
  ]
})
export class SocketModule {}