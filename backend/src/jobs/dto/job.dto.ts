// backend/src/jobs/dto/create-job.dto.ts
import { IsString, IsNotEmpty, IsDateString, IsIn } from 'class-validator';

export class CreateJobDto {
  @IsString() @IsNotEmpty() jobTitle: string;

  @IsString() @IsNotEmpty() companyName: string;

  @IsString() @IsNotEmpty() location: string;

  @IsIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

  @IsString() @IsNotEmpty() salaryRange: string;

  @IsString() @IsNotEmpty() jobDescription: string;

  @IsString() @IsNotEmpty() requirements: string;

  @IsString() @IsNotEmpty() responsibilities: string;

  @IsDateString() @IsNotEmpty() applicationDeadline: string;
}