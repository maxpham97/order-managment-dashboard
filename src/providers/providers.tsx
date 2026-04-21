import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '../components/ui/tooltip'
import store from '../lib/store/store'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30_000,
        },
    },
})

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </QueryClientProvider>
            </Provider>
        </BrowserRouter>
    )
}

export default Providers