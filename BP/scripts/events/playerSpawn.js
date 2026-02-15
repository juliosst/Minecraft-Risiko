import { world, system } from '@minecraft/server';
import { sendMessage, version } from '../runs/run';

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {

    system.run(() => {

        if (initialSpawn) {

            const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
            const playerSave = risikoSave.player[player.name]

            player.sendMessage({ translate: 'risiko.joinMessage', with: [version], name: player.name });

            system.runTimeout(() => {
                sendMessage('risiko.support.message', { name: player.name });
                player.playSound('note.pling');
            }, 1200);

            if (player.name !== 'JuliosStefen') { // Diese if bedingung hat keine wichtige funktion
                player.nameTag = player.name;
            } else {
                player.nameTag = `\uE301 ${player.name}`;
            }

            if (!risikoSave.player[player.name]?.kingdom) {

                system.runTimeout(() => {

                    sendMessage('risiko.nokingdom.error', { name: player.name });
                }, 100)
            }

            if (playerSave?.dummy && playerSave.dummy?.kill) {

                const wsp = world.getDefaultSpawnLocation()

                const x = player.getSpawnPoint()?.x ?? wsp.x
                const y = player.getSpawnPoint()?.y ?? wsp.y
                const z = player.getSpawnPoint()?.z ?? wsp.z

                const dimension = world.getDimension(player.getSpawnPoint()?.dimension.id ?? 'overworld');

                player.teleport({ x, y, z }, { dimension })

                player.addEffect('instant_health', 5, { amplifier: 255, showParticles: false });
                player.addEffect('saturation', 5, { amplifier: 255, showParticles: false });
                player.addEffect('resistance', 5, { amplifier: 255, showParticles: false });

                if (playerSave.dummy.keepInventory === false) {

                    player.runCommand('clear @s');
                    player.resetLevel();
                }

            } else if (playerSave?.dummy && !playerSave.dummy?.kill) {

                const dimension = world.getDimension(playerSave.dummy.dimension);

                const x = playerSave.dummy.position.x
                const y = playerSave.dummy.position.y
                const z = playerSave.dummy.position.z

                const rx = playerSave.dummy.rotation.rx
                const ry = playerSave.dummy.rotation.ry

                player.teleport({ x, y, z }, { dimension, rotation: { x: rx, y: ry } });

                for (const entity of dimension.getEntities()) {
                    if (entity.typeId === 'risiko:dummy' && entity.nameTag === player.name) {
                        entity.remove()
                    }
                }
            }

            if (playerSave?.dummy) {

                delete playerSave.dummy;
                world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
            }
        }
    })
})