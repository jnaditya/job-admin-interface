// backend/src/jobs/jobs.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common'; // <-- ADD Get, Query
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/job.dto.js';
import { JobFilterDto } from './dto/job-filter.dto'; // <-- IMPORT FILTER DTO
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    // Validation is automatically handled by NestJS pipe
    return this.jobsService.create(createJobDto);
  }
  @Get()
findAll(@Query() filterDto: JobFilterDto) {
  // Passes query parameters (filters) to the service
  return this.jobsService.findAll(filterDto);
}
  // ... (We will add GET/filter methods later)
}