import { world, system } from '@minecraft/server';
import { installSave } from './install';

installSave();

import '../commands/registry';
import '../events/event';
import '../actionbar';
import '../combatlog';

export function sendMessage(name, message) {
    system.run(() => {
        if (name === 'world') {
            world.sendMessage(`\uE300 ${message}`);
        } else {
            for (const player of world.getPlayers()) {
                if (player.name === name) {
                    player.sendMessage(`\uE300 ${message}`);
                    return;
                }
            }
        }
    })
}