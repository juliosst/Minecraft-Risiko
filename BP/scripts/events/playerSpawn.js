import { world, system } from '@minecraft/server';

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {

    system.run(() => {

        if (initialSpawn) {
            const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
            const playerSave = risikoSave.player[player.name]

            player.sendMessage(`§l§6Willkommen bei Minecraft Risiko!
        
§ivon JuliosStefen
§bBugs Melden: §r§bhttps://discord.gg/vSf4WSQRfm`);

            if (player.name !== 'JuliosStefen') { // Diese if bedingung hat keine wichtige funktion
                player.nameTag = player.name;
            } else {
                player.nameTag = `\uE301 ${player.name}`;
            }

            if (playerSave.dummy?.kill) {

                const wsp = world.getDefaultSpawnLocation()

                const x = player.getSpawnPoint()?.x ?? wsp.x
                const y = player.getSpawnPoint()?.y ?? wsp.y
                const z = player.getSpawnPoint()?.z ?? wsp.z

                const dimension = world.getDimension(player.getSpawnPoint()?.dimension.id ?? 'overworld');

                player.teleport({ x, y, z }, { dimension })

                player.addEffect('instant_health', 5, { amplifier: 255, showParticles: false });
                player.addEffect('saturation', 5, { amplifier: 255, showParticles: false });
                player.addEffect('resistance', 5, { amplifier: 255, showParticles: false });

                if (!playerSave.dummy?.keepInventory) {

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

            delete playerSave.dummy;
            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
        }
    })
})