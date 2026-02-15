import { world, system } from '@minecraft/server';
import { installPlayer } from './install';
import { sendMessage } from './run';

system.runInterval(() => {

    if (world.getDynamicProperty('risikoSave')) {

        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

        for (const player of world.getPlayers()) {
            const playerSave = risikoSave.player[player.name]

            if (!playerSave) installPlayer(player.name)

            if (playerSave?.combatlog >= 0) {

                const combat = (playerSave.combatlog - Date.now()) / 1000

                if (combat <= 0.500) {

                    sendMessage('risiko.combat.end', { withs: player.name });
                    playerSave.combatlog = 'xxx';
                    if (playerSave?.dummy) { delete playerSave.dummy }
                    world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
                }

                player.runCommand(`title @s actionbar §cIm Kampf! §i(${Math.floor(combat)}s übrig)`);

            } else if (playerSave?.health >= 2) {

                player.runCommand(`titleraw @s actionbar {"rawtext":[{"text":"\n\n\n\uE200\uE200"}]}`);

            } else if (playerSave?.health === 1) {

                player.runCommand(`titleraw @s actionbar {"rawtext":[{"text":"\n\n\n\uE200"}]}`);

            } else if (playerSave?.health === 0) {

                player.runCommand(`kick ${player.name} §l§cDu bist AUSGESCHIEDEN!§r\n§iDu hast alle Herzen verloren.`);
            }
        }
    }
}, 5)