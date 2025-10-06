// backend/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; 

@Injectable()
// CRITICAL FIX: Must EXTEND PrismaClient to inherit $connect/$disconnect
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy { 

  constructor() { 
    super(); 
  }

  async onModuleInit() {
    // $connect is now inherited
    await this.$connect(); 
  }

  async onModuleDestroy() {
    // $disconnect is now inherited
    await this.$disconnect();
  }
}