import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', className }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className="flex justify-center items-center py-12">
            <Loader2 className={`animate-spin text-primary-600 ${sizes[size]} ${className}`} />
        </div>
    );
};

export { LoadingSpinner };
