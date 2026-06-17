// src/providers/QueryProvider.jsx

// React
import { QueryClientProvider } from '@tanstack/react-query';

// Devtools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Query Client
import { queryClient } from './queryClient';

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;