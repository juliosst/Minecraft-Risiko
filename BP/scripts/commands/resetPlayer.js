import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';

export function resetPlayer(senders, select) {

    system.run(() => {
        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const sender = senders.sourceEntity;

        if (risikoSave.player[select]) {

            delete risikoSave.player[select]
            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));

            sender.playSound('note.pling');

            sendMessage('risiko.data.reset', { withs: select, name: sender.name });

        } else if (!risikoSave.player[select]) {

            sender.playSound('note.bass');
            sendMessage('risiko.player.noFound', { withs: select, name: sender.name });
        }
    })
}