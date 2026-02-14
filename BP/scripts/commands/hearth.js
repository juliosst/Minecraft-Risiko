import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';

export function hearth(senders, name, hearth) {

    system.run(() => {

        const sender = senders.sourceEntity

        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const playerSave = risikoSave.player[name]

        function setHeart() {
            playerSave.health = hearth
            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
        }

        if (playerSave?.king) {

            if (hearth <= 2 && hearth >= 0) {

                setHeart();
                sendMessage('risiko.setHeart.message', [String(name), String(hearth)], sender.name);

            } else {

                sendMessage('risiko.notAllowed.nummber', ['0', '2'], sender.name);
            }

        } else {

            if (hearth <= 1 && hearth >= 0) {

                setHeart();
                sendMessage('risiko.setHeart.message', [String(name), String(hearth)], sender.name);

            } else {

                sendMessage('risiko.notAllowed.nummber', ['0', '1'], sender.name);
            }
        }
    })
}