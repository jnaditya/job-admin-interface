// frontend/app/providers.tsx
'use client'; // Must be a Client Component

import { MantineProvider } from '@mantine/core';

// Import the required CSS files for Mantine to render correctly
import '@mantine/core/styles.css'; 
import '@mantine/dates/styles.css'; // Also include dates styles

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  );
}