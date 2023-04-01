import {
    createContext,
    Dispatch,
    MutableRefObject,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

const JotaiContext = createContext<MutableRefObject<
    Map<string, unknown>
> | null>(null);

interface Signal<T> {
    subscribe: (callback: (value: T) => void) => () => void;
    set: (
        contextValue: MutableRefObject<Map<string, unknown>> | null,
        value: T
    ) => void;
    get: (contextValue: MutableRefObject<Map<string, unknown>> | null) => T;
}

export const createSignal = <_, T>(key: string, initialValue: T) => {
    const subscribers = new Set<(value: T) => void>();
    const signal: Signal<T> = {
        subscribe: (callback: (value: T) => void) => {
            subscribers.add(callback);
            return () => {
                subscribers.delete(callback);
            };
        },
        set: (
            contextValue: MutableRefObject<Map<string, unknown>> | null,
            value: T
        ) => {
            if (!contextValue) {
                throw new Error('JotaiContext is not available');
            }
            contextValue.current.set(key, value);
            subscribers.forEach((callback) => callback(value));
        },
        get: (contextValue: MutableRefObject<Map<string, unknown>> | null) => {
            if (!contextValue) {
                throw new Error('JotaiContext is not available');
            }
            return (
                contextValue.current.has(key)
                    ? contextValue.current.get(key)
                    : initialValue
            ) as T;
        },
    };
    return signal;
};

type SetFunctionCurrentValue<T> = (currentValue: T) => T;

export const useSignal = <_, T, R = T>(
    signal: Signal<T>,
    selector?: (value: T) => R
) => {
    const contextValue = useContext(JotaiContext);
    const [value, setValue] = useState<R>(
        selector
            ? selector(signal.get(contextValue))
            : (signal.get(contextValue) as unknown as R)
    );
    useEffect(() => {
        return signal.subscribe((value) =>
            setValue(selector ? selector(value) : (value as unknown as R))
        );
    }, [signal]);

    const set: Dispatch<SetStateAction<T>> = (value) => {
        if (typeof value === 'function') {
            const currentValue = signal.get(contextValue);
            signal.set(
                contextValue,
                (value as SetFunctionCurrentValue<T>)(currentValue)
            );
            return;
        }
        signal.set(contextValue, value);
        return;
    };
    return [value, set] as const;
};

export const JotaiProvider = ({ children }: PropsWithChildren) => {
    const contextValue = useRef(new Map());
    return (
        <JotaiContext.Provider value={contextValue}>
            {children}
        </JotaiContext.Provider>
    );
};
