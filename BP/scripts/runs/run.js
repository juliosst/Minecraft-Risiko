import { world, system } from '@minecraft/server';
import { installSave, unlockTrident } from './install';

installSave();
unlockTrident();

import '../commands/registry';
import '../events/event';
import './actionbar';
import './combatlog';

export function sendMessage(translate, withs, name) {

    system.run(() => {

        const message = { rawtext: [{ text: '\uE300 ' }, { translate, with: [...withs] }] }

        if (name === undefined) {

            world.sendMessage(message);

        } else {

            for (const player of world.getPlayers().filter((p) => p.name === name)) {

                player.sendMessage(message);
            }
        }
    })
}