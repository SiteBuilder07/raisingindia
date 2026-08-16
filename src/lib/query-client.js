import { QueryClient } from '@tanstack/react-query';


export const queryClientInstance = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			// Content changes rarely — keep it fresh for a minute so browsing
			// between pages feels instant instead of refetching every time.
			staleTime: 60 * 1000,
			gcTime: 5 * 60 * 1000,
		},
	},
});