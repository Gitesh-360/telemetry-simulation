import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

export default function useTelemetry(token) {
    const [robots, setRobots] = useState({});
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token) return;
        const socket = io(WS_URL, { auth: { token } });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('socket connected', socket.id);
        });
        socket.on('telemetry:update', (payload) => {
            setRobots(prev => ({ ...prev, [payload.id]: payload }));
        });
        socket.on('connect_error', (err) => {
            console.error('WS conn error', err.message);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [token]);

    return { robots, socket: socketRef.current };
}
