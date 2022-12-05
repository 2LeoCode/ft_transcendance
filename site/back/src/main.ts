import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AppModule from './nest/modules/app.module';

(async function main() {
  const config = new DocumentBuilder()
    .setTitle('Transcendance API')
    .setVersion('1.0')
    .build();
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(process.env.PORT || 2000, () => {
    Logger.log(`Server is running on port ${process.env.PORT || 2000}`);
  });
})();
