export const getDataImageUrlWithHeader = (base64) => {
    if (!base64) return null;

    const hasHeader = base64.startsWith('data:image/');
    if (hasHeader) return base64;

    // Add header if missing
    return `data:image/png;base64,${base64}`;
};
