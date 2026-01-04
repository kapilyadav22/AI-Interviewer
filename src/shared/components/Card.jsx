import React from 'react';
import { cn } from '../utils/cn';

export const Card = React.memo(({ children, className, ...props }) => {
    return (
        <div
            className={cn('bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden', className)}
            {...props}
        >
            {children}
        </div>
    );
});

export const CardHeader = React.memo(({ children, className, ...props }) => {
    return (
        <div className={cn('px-6 py-4 border-b border-slate-100 dark:border-slate-700', className)} {...props}>
            {children}
        </div>
    );
});

export const CardBody = React.memo(({ children, className, ...props }) => {
    return (
        <div className={cn('p-6', className)} {...props}>
            {children}
        </div>
    );
});

export const CardFooter = React.memo(({ children, className, ...props }) => {
    return (
        <div className={cn('px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700', className)} {...props}>
            {children}
        </div>
    );
});
