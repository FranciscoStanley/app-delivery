import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades não definidas no DTO
      transform: true, // transforma os dados para as classes definidas nos DTOs
    }),
  );
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap().catch((error) => {
  console.error('Erro ao iniciar a aplicação:', error);
});
