import { useLogin } from './LoginProvider';
import { useState, useEffect } from 'react';
const [loading, setLoading] = useState(true);
import Card from 'react-bootstrap/Card';

export const Tasks: React.FC = () => {
    const context = useLogin();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { username } = context;

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/tasks?username=${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setTasks(data);
            } catch (err: unknown) {
                let errorMessage = 'An error occurred';
                if (err instanceof Error)
                    errorMessage = err.message;
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [username]);


    return (
        <h1>HelloWorld {username}</h1>
    )
};