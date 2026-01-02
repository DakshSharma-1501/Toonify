import React, { useState, useEffect, useCallback } from 'react';

function TestComponent() {
    const [count, setCount] = useState(0);
    const [data, setData] = useState(null);

    useEffect(() => {
        function fetchData() {
            console.log('Fetching data...');
        }
        fetchData();
    }, []);

    useEffect(() => {
        document.title = `Count: ${count}`;
    }, [count]);

    const handleClick = useCallback(() => {
        setCount(count + 1);
    }, [count]);

    const message = "Hello World";

    return (
        <div className="container">
            <h1>Counter: {count}</h1>
            <p>{message}</p>
            <button onClick={handleClick}>Increment</button>
        </div>
    );
}

export default TestComponent;
