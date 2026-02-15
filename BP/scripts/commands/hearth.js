import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';

export function hearth(senders, name, hearth) {

    system.run(() => {

        const sender = senders.sourceEntity

        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const playerSave = risikoSave?.player[name]

        function setHeart() {
            playerSave.health = hearth
            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
        }

        if (playerSave && playerSave?.kingdom) {

            if (playerSave?.king) {

                if (hearth <= 2 && hearth >= 0) {

                    setHeart();
                    sendMessage('risiko.setHeart.message', { withs: [name, hearth], name: sender.name });

                } else {
                    sendMessage('risiko.notAllowed.nummber', { withs: ['0', '2'], name: sender.name });
                }

            } else {

                if (hearth <= 1 && hearth >= 0) {

                    setHeart();
                    sendMessage('risiko.setHeart.message', { withs: [name, hearth], name: sender.name });

                } else {
                    sendMessage('risiko.notAllowed.nummber', { withs: ['0', '1'], name: sender.name });
                }
            }

        } else {

            sendMessage('risiko.NoFound.NoKingdom', { withs: name, name: sender.name })
        }
    })
}