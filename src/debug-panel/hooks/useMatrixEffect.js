// hooks/useMatrixEffect.js
import { useState, useEffect } from 'react';

const useMatrixEffect = () => {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick((prev) => prev + 1), 500);
        return () => clearInterval(interval);
    }, []);
    return tick;
};

export default useMatrixEffect;
