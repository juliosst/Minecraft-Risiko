import { system, world } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { sendMessage } from '../runs/run';

export function settings(sender) {
    system.run(() => {
        let risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const settings = new ModalFormData();
        const sett = risikoSave.settings

        sender.playSound('random.pop2');

        settings.title('Einstelungen');
        settings.label('Es gibt noch nicht so fiele einstelungen aber ihr könnt vorschläge auf meinem Discord einreichen :)');

        settings.label('§6Nachrichten');
        settings.toggle('Combatlog', { defaultValue: sett?.combatMessage ?? true });
        settings.toggle('Custom todesnachricht', { defaultValue: sett?.customDie ?? true });
        settings.toggle('Dummy todesnachricht', { defaultValue: sett?.dummyDie ?? true });

        settings.label('Dimenison');
        settings.toggle('The End', { defaultValue: sett?.lockEnd ?? true });
        settings.toggle('Nether', { defaultValue: sett?.lockNether ?? true });

        settings.label('§4Daten Löschen');
        settings.toggle('Einstellungen Löschen');
        settings.toggle('Spieler Löschen');
        settings.toggle('Königreiche löschen');

        settings.submitButton('§l§2Speichern');

        settings.show(sender).then((r) => {
            risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

            if (r.canceled) return;

            if (!r.formValues[9]) {
                sendMessage(sender.name, 'Einstellungen gespeichert');

                risikoSave.settings = {
                    combatMessage: r.formValues[2],
                    customDie: r.formValues[3],
                    dummyDie: r.formValues[4],
                    lockEnd: r.formValues[6],
                    lockNether: r.formValues[7]
                }
            }

            if (r.formValues[9]) {
                risikoSave.settings = {}
                sendMessage(sender.name, 'Alle Einstellungen wurden gelöscht');
            }

            if (r.formValues[10]) {
                risikoSave.player = {}
                sendMessage(sender.name, 'Alle Spieler Daten wurden gelöscht');
            }

            if (r.formValues[11]) {
                risikoSave.kingdom = {}
                sendMessage(sender.name, 'Alle Königreiche wurden gelöscht');
            }

            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
            sender.playSound('note.pling');
        })
    })
}