import { JotaiProvider, createSignal, useSignal } from './hooks/Jotai';

const counterSignal = createSignal('counter', {
    count: 0,
    count2: 10,
});
const nameSignal = createSignal('name', 'John');

const manSignal = createSignal('man', {
    name: 'John',
    age: 30,
    height: 180,
});

function App() {
    return (
        <JotaiProvider>
            <Counter />
            <Counter />
            <Counter2 />
            <Counter2 />
        </JotaiProvider>
    );
}

const Counter = () => {
    const [count, setCount] = useSignal(counterSignal, ({ count }) => count);

    const increment = () => {
        setCount((currentCount) => ({
            ...currentCount,
            count: currentCount.count + 1,
        }));
    };

    const decrement = () => {
        setCount((currentCount) => ({
            ...currentCount,
            count: currentCount.count - 1,
        }));
    };

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    );
};

const Counter2 = () => {
    const [count, setCount] = useSignal(counterSignal, ({ count2 }) => count2);

    const increment = () => {
        setCount((currentCount) => ({
            ...currentCount,
            count2: currentCount.count2 + 1,
        }));
    };

    const decrement = () => {
        setCount((currentCount) => ({
            ...currentCount,
            count2: currentCount.count2 - 1,
        }));
    };

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    );
};

export default App;
