import { ModalFormData } from '@minecraft/server-ui';
import { system, world } from '@minecraft/server';
import { unlockTrident } from '../runs/install';
import { sendMessage } from '../runs/run';

export function settings(sender) {
    system.run(() => {
        let risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const settings = new ModalFormData();
        const sett = risikoSave.settings

        sender.playSound('random.pop2');

        settings.title({ translate: 'risiko.ui.settings' });
        settings.label({ translate: 'risiko.ui.waitForMoRToggles' });

        settings.toggle({ translate: 'risiko.ui.blockTrident' }, { defaultValue: sett?.blockTrident ?? true });

        settings.label({ translate: 'risiko.ui.messages' });
        settings.toggle({ translate: 'risiko.ui.combatlog' }, { defaultValue: sett?.combatMessage ?? true });
        settings.toggle({ translate: 'risiko.ui.custom.deathMessage' }, { defaultValue: sett?.customDie ?? true });
        settings.toggle({ translate: 'risiko.ui.dummy.deathMessage' }, { defaultValue: sett?.dummyDie ?? true });

        settings.label({ translate: 'risiko.ui.dimenison' });
        settings.toggle({ translate: 'risiko.ui.the-end' }, { defaultValue: sett?.lockEnd ?? true });
        settings.toggle({ translate: 'risiko.ui.nether' }, { defaultValue: sett?.lockNether ?? true });

        settings.label({ translate: 'risiko.ui.deleteData' });
        settings.toggle({ translate: 'risiko.ui.deleteSettings' });
        settings.toggle({ translate: 'risiko.ui.deletePlayer' });
        settings.toggle({ translate: 'risiko.ui.deleteKingdoms' });

        settings.submitButton({ translate: 'risiko.ui.save' });

        settings.show(sender).then((r) => {

            risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

            if (r.canceled) return;

            if (!r.formValues[10]) {
                sendMessage('risiko.settings.save', '', sender.name);

                risikoSave.settings = {
                    blockTrident: r.formValues[1],
                    combatMessage: r.formValues[3],
                    customDie: r.formValues[4],
                    dummyDie: r.formValues[5],
                    lockEnd: r.formValues[7],
                    lockNether: r.formValues[8]
                }
            }

            if (r.formValues[10]) {
                risikoSave.settings = {}
                sendMessage('risiko.settings.deleted', '', sender.name);
            }

            if (r.formValues[11]) {
                risikoSave.player = {}
                sendMessage('risiko.players.deleted', '', sender.name);
            }

            if (r.formValues[12]) {
                risikoSave.kingdom = {}
                sendMessage('risiko.kingdom.deleted', '', sender.name);
            }

            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
            sender.playSound('note.pling');

            unlockTrident();
        })
    })
}