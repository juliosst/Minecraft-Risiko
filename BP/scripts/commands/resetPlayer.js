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

            sendMessage('risiko.data.reset', [select], sender.name);

        } else if (!risikoSave.player[select]) {

            sender.playSound('note.bass');
            sendMessage('risiko.player.noFound', [select], sender.name);
        }
    })
}