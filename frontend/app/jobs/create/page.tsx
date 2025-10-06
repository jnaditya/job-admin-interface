// frontend/app/jobs/create/page.tsx (Updated for API URL)
'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { TextInput, Select, Textarea, Button, Container, Title, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useRouter } from 'next/navigation';

// --- API Configuration ---
// Use environment variable for production, fallback to local for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; 
// -------------------------

const VALID_JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const;

const jobSchema = z.object({
  jobTitle: z.string().min(1, 'Job Title is required'),
  companyName: z.string().min(1, 'Company Name is required'),
  location: z.string().min(1, 'Location is required'),
  
  jobType: z.enum(VALID_JOB_TYPES)
  .refine((val) => VALID_JOB_TYPES.includes(val), {
    message: "Job Type is required",
  }),

  salaryRange: z.string().min(1, 'Salary Range is required'),
  jobDescription: z.string().min(1, 'Description is required'),
  requirements: z.string().min(1, 'Requirements are required'),
  responsibilities: z.string().min(1, 'Responsibilities are required'),

  // Match Mantine's DateInput (returns Date | null)
  applicationDeadline: z
    .date()
    .refine((val) => val instanceof Date, {
      message: "Invalid date",
    }),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function JobCreationPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobType: VALID_JOB_TYPES[0],
    },
  });

  // Form submission logic
  const onSubmit: SubmitHandler<JobFormData> = async (data) => {
    try {
      const payload = {
        ...data,
        applicationDeadline: data.applicationDeadline.toISOString(), // Convert date for API
      };

      // CRITICAL CHANGE: Use the dynamic API_URL
      await axios.post(`${API_URL}/jobs`, payload); 
      
      alert('✅ Job Posting Created Successfully!');
      reset();
      router.push('/jobs');
    } catch (error) {
      console.error('Submission Error:', error);
      alert('❌ Failed to create job. Check console for details.');
    }
  };

  return (
    <Container size="md" mt="xl">
      <Title order={2} mb="lg">
        Create New Job Posting
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Job Title"
            placeholder="Senior Developer"
            {...register('jobTitle')}
            error={errors.jobTitle?.message}
            required
          />

          <TextInput
            label="Company Name"
            placeholder="Tech Corp Inc."
            {...register('companyName')}
            error={errors.companyName?.message}
            required
          />

          <TextInput
            label="Location"
            placeholder="Remote / New York"
            {...register('location')}
            error={errors.location?.message}
            required
          />

          <TextInput
            label="Salary Range"
            placeholder="$80,000 - $120,000"
            {...register('salaryRange')}
            error={errors.salaryRange?.message}
            required
          />

          {/* Job Type Dropdown */}
          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <Select
                label="Job Type"
                placeholder="Select job type"
                data={VALID_JOB_TYPES.map((type) => ({ value: type, label: type }))}
                value={field.value}
                onChange={field.onChange}
                error={errors.jobType?.message}
                required
              />
            )}
          />

          {/* Application Deadline */}
          <Controller
            name="applicationDeadline"
            control={control}
            render={({ field }) => (
              <DateInput
                label="Application Deadline"
                placeholder="Select date"
                value={field.value}
                onChange={field.onChange}
                error={errors.applicationDeadline?.message}
                required
              />
            )}
          />

          <Textarea
            label="Job Description"
            minRows={3}
            {...register('jobDescription')}
            error={errors.jobDescription?.message}
            required
          />

          <Textarea
            label="Requirements"
            minRows={3}
            {...register('requirements')}
            error={errors.requirements?.message}
            required
          />

          <Textarea
            label="Responsibilities"
            minRows={3}
            {...register('responsibilities')}
            error={errors.responsibilities?.message}
            required
          />

          <Button type="submit" loading={isSubmitting} mt="lg">
            Create Job Posting
          </Button>
        </Stack>
      </form>
    </Container>
  );
}