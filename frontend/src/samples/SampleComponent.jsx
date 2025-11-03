// src/components/SampleComponent.jsx
import { useEffect, useState } from "react";

export default function SampleComponent({ fetchNameById }) {
    const [name, setName] = useState("");

    useEffect(() => {
        fetchNameById(42).then((result) => setName(result));
    }, [fetchNameById]);

    return (
        <div>
            <h1>Sample Component</h1>
            {name ? <p data-testid="name">{name}</p> : <p>Loading...</p>}
        </div>
    );
}