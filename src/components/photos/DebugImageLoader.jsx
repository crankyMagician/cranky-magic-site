import React, { useEffect, useState } from 'react';

const DebugImageLoader = ({ base64String }) => {
    const [debug, setDebug] = useState({
        isValid: false,
        error: null,
        details: {}
    });

    useEffect(() => {
        const analyzeBase64 = () => {
            try {
                const details = {
                    length: base64String?.length || 0,
                    startsWithData: base64String?.startsWith('data:'),
                    containsComma: base64String?.includes(','),
                    hasContent: !!base64String,
                    preview: base64String?.substring(0, 50) + '...'
                };

                // Basic validation
                const isValid = details.hasContent &&
                    details.startsWithData &&
                    details.containsComma;

                setDebug({
                    isValid,
                    error: !isValid ? 'Invalid base64 format' : null,
                    details
                });

            } catch (err) {
                setDebug({
                    isValid: false,
                    error: err.message,
                    details: {}
                });
            }
        };

        analyzeBase64();
    }, [base64String]);

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Base64 Debug Info</h3>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span className={debug.isValid ? "text-green-600" : "text-red-600"}>
            {debug.isValid ? "Valid" : "Invalid"}
          </span>
                </div>

                {debug.error && (
                    <div className="text-red-600">
                        Error: {debug.error}
                    </div>
                )}

                <div className="space-y-1">
                    <div>Length: {debug.details.length}</div>
                    <div>Starts with 'data:': {debug.details.startsWithData ? "Yes" : "No"}</div>
                    <div>Contains comma: {debug.details.containsComma ? "Yes" : "No"}</div>
                    <div>Has content: {debug.details.hasContent ? "Yes" : "No"}</div>
                    <div className="break-all">
                        <span className="font-medium">Preview: </span>
                        <span className="font-mono text-sm">{debug.details.preview}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugImageLoader;