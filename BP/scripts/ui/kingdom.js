import { system, world } from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { installPlayer } from '../runs/install'

import { sendMessage } from '../runs/run';

export function kingdom(sender) {

    system.run(() => {
        let risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const kingdomlist = new ActionFormData();

        sender.playSound('random.pop2');

        kingdomlist.title('§l§6Königreiche');
        kingdomlist.button('§l§2Hinzufügen', 'textures/ui/ui-plus');

        for (const kingdomName of Object.keys(risikoSave.kingdom)) {

            if (kingdomName?.dead) {
                kingdomlist.button(kingdomName, 'textures/ui/broken-crown');
            } else if (!kingdomName?.dead) {
                kingdomlist.button(kingdomName, 'textures/ui/permissions_op_crown');
            }
        }

        kingdomlist.show(sender).then((r) => {
            if (r.canceled) return;

            sender.playSound('random.pop2');

            if (r.selection === 0) {
                const add = new ModalFormData();

                add.title('§l§6Königreiche');
                add.textField('Name:', '');
                add.submitButton('§l§2Hinzufügen');
                add.show(sender).then((r) => {
                    if (r.canceled) return;

                    risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

                    if (risikoSave.kingdom[r.formValues[0]]) {

                        sendMessage(sender.name, `Das königreich §e${r.formValues}§r exestiert bereits`);
                        sender.playSound('note.bass');

                    } else if (!risikoSave.kingdom[r.formValues[0]]) {

                        risikoSave.kingdom[r.formValues[0]] = {
                            kings: {},
                            members: {}
                        }

                        world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));

                        kingdom(sender);

                        sender.playSound('note.pling');
                        sendMessage(sender.name, `Das königreich §e${r.formValues}§r wurde erfolgreich hinzugefügt`);
                    }
                })
            }

            if (r.selection >= 1) {
                risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

                const kingdomSettings = new ActionFormData();
                const kingdomSave = Object.keys(risikoSave.kingdom)[r.selection - 1]

                kingdomSettings.title(kingdomSave);
                kingdomSettings.button('König Hinzufügen', 'textures/ui/permissions_op_crown');
                kingdomSettings.button('Mitglied Hinzufügen', 'textures/ui/permissions_member_star');
                kingdomSettings.label('§6Mitglieder:');

                for (const king of Object.keys(risikoSave.kingdom[kingdomSave].kings)) {
                    kingdomSettings.button(king, 'textures/ui/permissions_op_crown');
                }

                for (const member of Object.keys(risikoSave.kingdom[kingdomSave].members)) {
                    kingdomSettings.button(member, 'textures/ui/permissions_member_star');
                }

                kingdomSettings.show(sender).then((r) => {
                    if (r.canceled) return;

                    sender.playSound('random.pop2');

                    if (r.selection === 0) {
                        const add = new ModalFormData();

                        add.title(`§l§6${kingdomSave}`);
                        add.textField('Name:', '');
                        add.submitButton('§l§2Hinzufügen');
                        add.show(sender).then((r) => {
                            if (r.canceled) return;

                            risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

                            if (!risikoSave.player[r.formValues]) {
                                risikoSave.player[r.formValues] = {}
                            }

                            let addKing = risikoSave.kingdom[kingdomSave].kings[r.formValues]
                            let addMember = risikoSave.kingdom[kingdomSave].members[r.formValues]

                            if (addKing || addMember) {

                                sendMessage(sender.name, `§e${r.formValues}§r exestiert bereits`);
                                sender.playSound('note.bass');

                            } else if (!addKing && !addMember) {

                                const playerSave = risikoSave.player[r.formValues]

                                risikoSave.kingdom[kingdomSave].kings[r.formValues] = true;

                                playerSave.kingdom = kingdomSave
                                playerSave.health = 2
                                playerSave.king = true;

                                world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));

                                kingdom(sender);

                                sender.playSound('note.pling');
                                sendMessage(sender.name, `§e${r.formValues}§r wurde zu §e${kingdomSave}§r hinzugefügt`);
                            }
                        })
                    }

                    if (r.selection === 1) {
                        const add = new ModalFormData();

                        add.title(`§l§6${kingdomSave}`);
                        add.textField('Name:', '');
                        add.submitButton('§l§2Hinzufügen');
                        add.show(sender).then((r) => {
                            if (r.canceled) return;

                            risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

                            if (!risikoSave.player[r.formValues]) {
                                risikoSave.player[r.formValues] = {}
                            }

                            let addKing = risikoSave.kingdom[kingdomSave].kings[r.formValues]
                            let addMember = risikoSave.kingdom[kingdomSave].members[r.formValues]

                            if (addMember || addKing) {

                                sendMessage(sender.name, `§e${r.formValues}§r exestiert bereits`);
                                sender.playSound('note.bass');

                            } else if (!addMember && !addKing) {

                                const playerSave = risikoSave.player[r.formValues]

                                risikoSave.kingdom[kingdomSave].members[r.formValues] = true;
                                playerSave.kingdom = kingdomSave
                                playerSave.health = 1

                                world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));

                                kingdom(sender);

                                sender.playSound('note.pling');
                                sendMessage(sender.name, `§e${r.formValues}§r wurde zu §e${kingdomSave}§r hinzugefügt`);
                            }
                        })
                    }
                })
            }
        })
    })
}