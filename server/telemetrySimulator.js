// telemetrySimulator.js
// Exports a function to start simulator; requires io (socket.io server) and Robot model
module.exports = function startSimulator(io, Robot) {
    // Initialize three sample robots in DB if not present
    const seedRobots = [
        { name: 'Alpha', type: 'AMR', location: { lat: 12.9716, lng: 77.5946 }, battery: 100, status: 'active' },
        { name: 'Beta', type: 'AMR', location: { lat: 12.9726, lng: 77.5948 }, battery: 80, status: 'active' },
        { name: 'Gamma', type: 'AMR', location: { lat: 12.9736, lng: 77.5950 }, battery: 60, status: 'active' },
    ];

    async function seed() {
        for (const r of seedRobots) {
            await Robot.updateOne({ name: r.name }, { $setOnInsert: r }, { upsert: true }).catch(() => {});
        }
    }

    // In-memory copy for simulation updates
    const robotsSim = [
        { id: 'Alpha', lat: 12.9716, lng: 77.5946, battery: 100, status: 'active' },
        { id: 'Beta', lat: 12.9726, lng: 77.5948, battery: 80, status: 'active' },
        { id: 'Gamma', lat: 12.9736, lng: 77.5950, battery: 60, status: 'active' }
    ];

    function randomWalk(r) {
        r.lat += (Math.random() - 0.5) * 0.0008;
        r.lng += (Math.random() - 0.5) * 0.0008;
        r.battery = Math.max(1, r.battery - Math.random() * 0.3);
        r.status = r.battery < 10 ? 'charging' : 'active';
        r.ts = new Date();
        return r;
    }

    async function broadcast() {
        try {
            for (const r of robotsSim) {
                const updated = randomWalk(r);
                const payload = {
                    id: updated.id,
                    name: updated.id,
                    location: { lat: updated.lat, lng: updated.lng, updatedAt: updated.ts },
                    battery: Number(updated.battery.toFixed(2)),
                    status: updated.status,
                    ts: updated.ts
                };
                io.emit('telemetry:update', payload);
                // Persist summary to DB for dashboard queries
                await Robot.findOneAndUpdate({ name: updated.id }, {
                    $set: {
                        location: { lat: updated.lat, lng: updated.lng, updatedAt: updated.ts },
                        battery: updated.battery,
                        status: updated.status,
                        lastSeen: updated.ts
                    }
                }, { upsert: true }).catch(() => {});
            }
        } catch (err) {
            console.error('Sim broadcast error', err);
        }
    }

    (async () => {
        await seed();
        setInterval(broadcast, 500); // every 500ms
    })();
};
