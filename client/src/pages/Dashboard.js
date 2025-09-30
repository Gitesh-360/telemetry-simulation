import React, { useEffect, useState } from 'react';
import useTelemetry from '../hooks/useTelemetry';
import { createApiClient } from '../services/api';

export default function Dashboard({ token }) {
    const { robots } = useTelemetry(token);
    const [list, setList] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [configVal, setConfigVal] = useState('');
    const api = createApiClient(token);

    async function fetchRobots() {
        try {
            const res = await api.get('/api/robots?page=1&limit=50');
            setList(res.data.data || []);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                window.location.reload(); // simple logout/refresh
            } else console.error(err);
        }
    }

    useEffect(() => {
        fetchRobots();
        // poll initial list once, telemetry will update live
        // optionally refresh list periodically
    }, []);

    async function updateConfig() {
        if (!selectedId) return;
        try {
            await api.put(`/api/robots/${selectedId}/config`, { notes: configVal });
            alert('Config updated');
            fetchRobots();
        } catch (err) {
            if (err.response && err.response.status === 401) {
                window.location.reload();
            } else {
                alert('Update failed');
            }
        }
    }

    return (
        <div>
            <h3>Fleet Dashboard</h3>
            <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ flex: 1 }}>
                    <h4>Robots (DB snapshot)</h4>
                    {list.map(r => (
                        <div key={r._id} className="robot">
                            <strong>{r.name}</strong> <small>({r.type})</small>
                            <div>Status: {r.status} | Battery: {r.battery ?? 'N/A'}</div>
                            <div>LastSeen: {new Date(r.lastSeen || r.updatedAt).toLocaleString()}</div>
                            <div>
                                <button onClick={() => { setSelectedId(r._id); setConfigVal(JSON.stringify(r.config || {})); }}>
                                    Edit Config
                                </button>
                            </div>
                            <div style={{ marginTop: 6 }}>
                                <small>Realtime:</small>
                                <pre style={{ background:'#f9f9f9', padding:6 }}>{JSON.stringify(robots[r.name] || robots[r._id] || {}, null, 2)}</pre>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ width: 320 }}>
                    <h4>Config Editor</h4>
                    <div>
                        <label>Selected Robot ID</label><br />
                        <input value={selectedId || ''} readOnly style={{ width:'100%' }} />
                    </div>
                    <div>
                        <label>Config JSON</label><br />
                        <textarea rows={8} value={configVal} onChange={e => setConfigVal(e.target.value)} style={{ width:'100%' }} />
                    </div>
                    <div className="controls">
                        <button onClick={updateConfig}>Save Config</button>
                        <button onClick={() => { setSelectedId(null); setConfigVal(''); }}>Clear</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
