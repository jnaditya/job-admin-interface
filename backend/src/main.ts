// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CRITICAL FIX: ENABLE CORS ---
  app.enableCors({
    origin: 'http://localhost:3001', // Allow requests from your frontend port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // ---------------------------------

  // Use the correct port for the backend (e.g., 3000)
  await app.listen(3000); 
}
bootstrap();