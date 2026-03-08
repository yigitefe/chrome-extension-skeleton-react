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
    const [loadError, setLoadError] = useState('');
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        let mounted = true;
        let area;

        try {
            area = getStorageArea(areaName);
        } catch (error) {
            setLoadError(error.message);
            setIsLoading(false);
            return undefined;
        }

        area.get([key], (result) => {
            if (!mounted) {
                return;
            }

            const storageError = getStorageError();

            if (storageError) {
                setLoadError(storageError);
                setIsLoading(false);
                return;
            }

            setLoadError('');
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
        let area;

        try {
            area = getStorageArea(areaName);
        } catch (error) {
            setSaveError(error.message);
            reject(error);
            return;
        }

        setIsSaving(true);
        setSaveError('');

        area.set({ [key]: nextValue }, () => {
            const storageError = getStorageError();

            if (storageError) {
                setSaveError(storageError);
                setIsSaving(false);
                reject(new Error(storageError));
                return;
            }

            setSaveError('');
            setValue(nextValue);
            setIsSaving(false);
            resolve(nextValue);
        });
    }), [areaName, key, value]);

    return {
        isLoading,
        isSaving,
        error: loadError || saveError,
        loadError,
        save,
        saveError,
        setValue,
        value,
    };
}
