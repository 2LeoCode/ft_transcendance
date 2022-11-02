import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('Transcendance API')
    .setVersion('1.0')
    .build();
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
=======
  await app.listen(3007);
>>>>>>> synchro
}
bootstrap();
