// backend/src/jobs/dto/job-filter.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class JobFilterDto {
  @IsOptional() @IsString() jobTitle?: string;
  @IsOptional() @IsString() location?: string;

  @IsOptional()
  @IsIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
  jobType?: string;

  @IsOptional() @IsString() salaryRangeMin?: string; 
  @IsOptional() @IsString() salaryRangeMax?: string; 
}