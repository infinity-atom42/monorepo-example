"use client";

import { type ReactNode, useState } from "react";

import { QueryClient, QueryClientProvider as QCP } from "@tanstack/react-query";

interface QueryProviderProps {
	children: ReactNode;
}

export function QueryClientProvider({ children }: QueryProviderProps) {
	const [queryClient] = useState(() => new QueryClient());

	return <QCP client={queryClient}>{children}</QCP>;
}
