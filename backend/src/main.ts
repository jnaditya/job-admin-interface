// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Use process.env.PORT if available, otherwise default to 3000 for local dev
  const port = process.env.PORT || 3000; 

  const app = await NestFactory.create(AppModule);

  // CRITICAL FIX: ENABLE CORS
  app.enableCors({
    // You should replace 'http://localhost:3001' with your Vercel frontend URL after deployment
    origin: 'http://localhost:3001', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Use the correct port for the backend (it must use the 'port' variable)
  await app.listen(port); // <-- FIX: Changed from await app.listen(3000)
}
bootstrap();