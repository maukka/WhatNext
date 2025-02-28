import { useLogin } from './LoginProvider';
import { useState, useEffect } from 'react';
const [loading, setLoading] = useState(true);
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

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
        <>
            {loading &&
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            {error && error.length > 0 &&
                <h3>Error while loading data: {error}</h3>
            }
            {tasks.map(task => (
                <Card key={task._id} className="mb-2" bg="primary" style={{ width: '18rem' }}>
                    <Card.Header>{username}</Card.Header>
                    <Card.Body>
                        <Card.Title>{task.title}</Card.Title>
                        <Card.Text>{task.description}</Card.Text>
                        <Card.Footer>Created at: {task.createdAt}</Card.Footer>
                    </Card.Body>
                </Card>
            ))}
        </>
    )
};