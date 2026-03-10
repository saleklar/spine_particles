const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const targetStr =                           case 'wind':
                            if (force.direction) {
                              const windDir = new THREE.Vector3(force.direction.x, force.direction.y, force.direction.z).normalize();
                              particle.velocity.addScaledVector(windDir, force.strength * deltaTime);
                            }
                            break;

                          case 'tornado':;

const newStr =                           case 'wind':
                            if (force.direction) {
                              const windDir = new THREE.Vector3(force.direction.x, force.direction.y, force.direction.z).normalize();
                              particle.velocity.addScaledVector(windDir, force.strength * deltaTime);
                            }
                            break;

                          case 'turbulence': {
                            const noiseScale = force.radius || 20.0;
                            const timeDrift = Date.now() * 0.001 * 0.5;
                            const curl = curlNoise(
                                particlePos.x, 
                                particlePos.y + timeDrift * 10, 
                                particlePos.z, 
                                noiseScale
                            );
                            particle.velocity.addScaledVector(curl, force.strength * deltaTime);
                            break;
                          }

                          case 'thermal-updraft': {
                            const lifeRatio = 1.0 - (particle.age / (particle.lifetime || 1.0));
                            const heatMultiplier = Math.max(0.1, lifeRatio);
                            particle.velocity.y += force.strength * heatMultiplier * deltaTime;
                            
                            const d = directionToParticle.clone();
                            d.y = 0;
                            if (d.lengthSq() > 0.01) {
                                particle.velocity.addScaledVector(d.normalize(), force.strength * 0.1 * heatMultiplier * deltaTime);
                            }
                            break;
                          }

                          case 'tornado':;

code = code.replace(targetStr, newStr);

// Also patch the gizmos
const targetStrGizmo =           case 'wind':
            if (force.direction) {
              direction.set(force.direction.x, force.direction.y, force.direction.z);
            }
            color = 0x00ff99; // Cyan for wind
            break;
          case 'tornado':;

const newStrGizmo =           case 'wind':
            if (force.direction) {
              direction.set(force.direction.x, force.direction.y, force.direction.z);
            }
            color = 0x00ff99; // Cyan for wind
            break;
          case 'turbulence':
            color = 0x8800ff; // Purple for turbulence
            break;
          case 'thermal-updraft':
            direction.set(0, 1, 0); // Always up
            color = 0xff3300; // Deep Orange for heat
            break;
          case 'tornado':;

code = code.replace(targetStrGizmo, newStrGizmo);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('patched');
