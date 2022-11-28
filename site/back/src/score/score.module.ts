import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ScoreController from "./score.controller";
import Score from "./score.entity";
import ScoreService from "./score.service";

@Module({
	imports: [TypeOrmModule.forFeature([Score])],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export default class ScoreModule {}
