// backend/src/jobs/jobs.service.ts
import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/job.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JobFilterDto } from './dto/job-filter.dto'; // <-- NEW: Import Filter DTO

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    return this.prisma.jobPosting.create({
      data: {
        ...createJobDto,
        // Ensure applicationDeadline is converted to a Date object
        applicationDeadline: new Date(createJobDto.applicationDeadline),
      },
    });
  }

  // NEW: Implementation of findAll method for the GET endpoint
  async findAll(filterDto: JobFilterDto) {
    const where: any = {};
    
    // Apply filtering logic using Prisma's 'where' clause
    
    // 1. Job Title Filter (case-insensitive partial match)
    if (filterDto.jobTitle) {
      where.jobTitle = { contains: filterDto.jobTitle, mode: 'insensitive' };
    }
    
    // 2. Location Filter (case-insensitive partial match)
    if (filterDto.location) {
      where.location = { contains: filterDto.location, mode: 'insensitive' };
    }
    
    // 3. Job Type Filter (exact match)
    if (filterDto.jobType) {
      where.jobType = filterDto.jobType;
    }
    
    // Note: SalaryRange filtering is complex with a single string field, so we omit the logic here,
    // but the structure is in place to accept the parameters.

    return this.prisma.jobPosting.findMany({ 
      where,
      orderBy: { createdAt: 'desc' } // Sort by newest first
    });
  }
}