// frontend/app/jobs/page.tsx
'use client';

import { Container, Title, Paper, Table, Button, TextInput, Select, Stack, RangeSlider, Loader } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { Controller } from "react-hook-form";
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import ClientOnly from '../components/ClientOnly'; // Ensure path is correct

// --- API Configuration ---
// CRITICAL: Use environment variable for production, fallback to local for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; 
// -------------------------

// --- TYPE DEFINITIONS ---
interface Job {
    id: number;
    jobTitle: string;
    companyName: string;
    location: string;
    jobType: string;
    salaryRange: string;
    applicationDeadline: string;
}

interface FilterForm {
    jobTitle: string;
    location: string;
    jobType: string;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const SALARY_RANGE_LIMITS: [number, number] = [50000, 200000]; 

// Main component containing all the state logic
function JobListContent() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [salaryRange, setSalaryRange] = useState<[number, number]>(SALARY_RANGE_LIMITS);

    const { register, watch, control } = useForm<FilterForm>({
        defaultValues: { jobTitle: '', location: '', jobType: '' }
    });

    const filterValues = watch();
    const [debouncedFilters] = useDebounce(filterValues, 500);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams(); // Initialize params inside the function
        
        try {
            // Construct query parameters
            Object.entries(debouncedFilters).forEach(([key, value]) => {
                if (value) params.set(key, value as string);
            });
            
            // Add salary range to params
            params.set('salaryRangeMin', salaryRange[0].toString());
            params.set('salaryRangeMax', salaryRange[1].toString());

            // CRITICAL CHANGE: Use the dynamic API_URL
            const response = await axios.get(`${API_URL}/jobs?${params.toString()}`);
            
            // Ensure data is an array before setting state
            if (Array.isArray(response.data)) {
                setJobs(response.data);
            } else {
                console.warn("API response was not an array:", response.data);
                setJobs([]); 
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedFilters, salaryRange]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const rows = jobs.length > 0 ? jobs.map((job) => (
        <Table.Tr key={job.id}>
            <Table.Td>{job.jobTitle}</Table.Td>
            <Table.Td>{job.companyName}</Table.Td>
            <Table.Td>{job.location}</Table.Td>
            <Table.Td>{job.jobType}</Table.Td>
            <Table.Td>{job.salaryRange}</Table.Td>
            <Table.Td>{new Date(job.applicationDeadline).toLocaleDateString()}</Table.Td>
            <Table.Td>
                <Button size="xs" variant="light" color="blue" mr="xs">Edit</Button>
                <Button size="xs" variant="light" color="red">Delete</Button>
            </Table.Td>
        </Table.Tr>
    )) : (
        <Table.Tr><Table.Td colSpan={7} style={{ textAlign: 'center' }}>{loading ? <Loader size="sm" /> : 'No job postings found.'}</Table.Td></Table.Tr>
    );

    return (
        <Container size="xl" mt="xl">
            <Title order={1} mb="lg">Job Postings Admin</Title>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Title order={3}>Total Jobs: {jobs.length}</Title>
                <Button component={Link} href="/jobs/create">
                    Create New Job
                </Button>
            </div>

            <Paper p="md" shadow="sm" mb="xl">
                <Title order={3} mb="md">Filters</Title>
                <Stack gap="md">
                    <TextInput label="Job Title" placeholder="Filter by title" {...register('jobTitle')} />
                    <TextInput label="Location" placeholder="Filter by location" {...register('location')} />

                    <Controller
                        name="jobType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Job Type (Dropdown)"
                                placeholder="Select job type"
                                data={JOB_TYPES.map(type => ({ value: type, label: type }))}
                                clearable
                                {...field}
                            />
                        )}
                    />

                    <div style={{ padding: '0 10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Salary Range (Range Slider)</label>
                        <RangeSlider
                            min={SALARY_RANGE_LIMITS[0]}
                            max={SALARY_RANGE_LIMITS[1]}
                            step={10000}
                            labelAlwaysOn
                            label={(value) => `$${value.toLocaleString()}`}
                            value={salaryRange}
                            onChange={setSalaryRange}
                        />
                    </div>
                </Stack>
            </Paper>

            <Paper p="md" shadow="md">
                <Table highlightOnHover verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Job Type</th>
                            <th>Salary Range</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Paper>
        </Container>
    );
}

// Export the page wrapped in the ClientOnly component
export default function JobListPage() {
    return (
        <ClientOnly>
            <JobListContent />
        </ClientOnly>
    );
}