const parentName = "dedefarius-01s-04-section";
const droneName = "dedefarius-hatchling";
const droneCount = 6;
const baseRadius = 35;
const pulseAmount = 1;
const orbitSpeed = 1;
const pulseSpeed = 0.05;
const respawnTime = 300;

let droneCache = {};
let respawnTimers = {};

Events.run(Trigger.update, () => {
    if (Vars.state.isPaused()) return;

    Groups.unit.each(u => {
        if (u.type.name === parentName) {
            if (!droneCache[u.id]) {
                droneCache[u.id] = [];
                respawnTimers[u.id] = 0;
            }

            let drones = droneCache[u.id];

            for (let i = drones.length - 1; i >= 0; i--) {
                if (!drones[i] || drones[i].dead || !drones[i].isAdded()) {
                    drones.splice(i, 1);
                }
            }

            if (drones.length < droneCount) {
                respawnTimers[u.id] += Time.delta;
                if (respawnTimers[u.id] >= respawnTime) {
                    const dType = Vars.content.getByName(ContentType.unit, droneName);
                    if (dType) {
                        let d = dType.spawn(u.team, u.x, u.y);
                        if (d) {
                            drones.push(d);
                            respawnTimers[u.id] = 0;
                            Fx.spawn.at(u.x, u.y);
                        }
                    }
                }
            }

            let currentRadius = baseRadius + Math.sin(Time.time * pulseSpeed) * pulseAmount;
            
            for (let i = 0; i < drones.length; i++) {
                let d = drones[i];
                let targetAngle = (i * 360 / droneCount) + Time.time * orbitSpeed;
                
                let tx = u.x + Angles.trnsx(targetAngle, currentRadius);
                let ty = u.y + Angles.trnsy(targetAngle, currentRadius);
                
                d.set(Mathf.lerp(d.x, tx, 0.1), Mathf.lerp(d.y, ty, 0.1));
                d.vel.setZero();
                d.rotation = Mathf.lerpDelta(d.rotation, targetAngle + 90, 0.1);
            }
        }
    });

    for (let id in droneCache) {
        let unit = Groups.unit.getByID(parseInt(id));
        if (!unit || unit.dead || unit.type.name !== parentName) {
            if (droneCache[id]) {
                droneCache[id].forEach(d => { if (d && !d.dead) d.kill(); });
            }
            delete droneCache[id];
            delete respawnTimers[id];
        }
    }
});
