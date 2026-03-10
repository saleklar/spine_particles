const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const t1 =                         case 'turbulence':
                          const turbNoise = {
                            x: (Math.random() - 0.5) * 2,
                            y: (Math.random() - 0.5) * 2,
                            z: (Math.random() - 0.5) * 2,
                          };
                          particle.velocity.add(
                            new THREE.Vector3(turbNoise.x, turbNoise.y, turbNoise.z).multiplyScalar(force.strength * deltaTime)
                          );
                          break;;

const r1 =                         case 'turbulence': {
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
                          };

const t2 =         case 'turbulence':
          // Turbulence is chaotic, use neutral indicator
          direction.set(1, 0, 0);
          color = 0x00ccff; // Light cyan for turbulence
          break;;

const r2 =         case 'turbulence':
          // Turbulence is chaotic, use neutral indicator
          direction.set(1, 0, 0);
          color = 0x8800ff; // Purple for turbulence
          break;
        case 'thermal-updraft':
          direction.set(0, 1, 0); // Always up
          color = 0xff3300; // Deep Orange for heat
          break;;

code = code.replace(t1, r1);
code = code.replace(t2, r2);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Done!');