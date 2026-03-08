import { useCallback, useEffect, useState } from 'react';

function getStorageArea(areaName) {
    const area = globalThis.chrome?.storage?.[areaName];

    if (!area) {
        throw new Error(`chrome.storage.${areaName} is not available`);
    }

    return area;
}

function getStorageError() {
    return globalThis.chrome?.runtime?.lastError?.message || '';
}

export function useStorage(areaName, key, initialValue) {
    const [value, setValue] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        const area = getStorageArea(areaName);

        area.get([key], (result) => {
            if (!mounted) {
                return;
            }

            const storageError = getStorageError();

            if (storageError) {
                setError(storageError);
                setIsLoading(false);
                return;
            }

            setValue(result[key] ?? initialValue);
            setIsLoading(false);
        });

        const handleChange = (changes, changedAreaName) => {
            if (!mounted || changedAreaName !== areaName || !changes[key]) {
                return;
            }

            setValue(changes[key].newValue ?? initialValue);
        };

        globalThis.chrome?.storage?.onChanged?.addListener(handleChange);

        return () => {
            mounted = false;
            globalThis.chrome?.storage?.onChanged?.removeListener(handleChange);
        };
    }, [areaName, initialValue, key]);

    const save = useCallback((nextValue = value) => new Promise((resolve, reject) => {
        const area = getStorageArea(areaName);

        setIsSaving(true);
        setError('');

        area.set({ [key]: nextValue }, () => {
            const storageError = getStorageError();

            if (storageError) {
                setError(storageError);
                setIsSaving(false);
                reject(new Error(storageError));
                return;
            }

            setValue(nextValue);
            setIsSaving(false);
            resolve(nextValue);
        });
    }), [areaName, key, value]);

    return {
        error,
        isLoading,
        isSaving,
        save,
        setValue,
        value,
    };
}
