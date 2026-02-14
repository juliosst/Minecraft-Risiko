import { system, world } from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';

import { sendMessage } from '../runs/run';

export function kingdom(sender) {

    system.run(() => {

        let risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const kingdomlist = new ActionFormData();

        sender.playSound('random.pop2');

        kingdomlist.title({ translate: 'risiko.ui.title.kingdom' });
        kingdomlist.button({ translate: 'risiko.ui.add' }, 'textures/ui/ui-plus');

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

                add.title({ translate: 'risiko.ui.title.kingdom' });
                add.textField({ translate: 'risiko.ui.name' }, '');
                add.submitButton({ translate: 'risiko.ui.add' });
                add.show(sender).then((r) => {
                    if (r.canceled) return;

                    risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

                    if (risikoSave.kingdom[r.formValues[0]]) {

                        sendMessage('risiko.already.exists', [String(r.formValues)], sender.name);
                        sender.playSound('note.bass');

                    } else if (!risikoSave.kingdom[r.formValues[0]]) {

                        risikoSave.kingdom[r.formValues[0]] = {
                            kings: {},
                            members: {}
                        }

                        world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));

                        kingdom(sender);

                        sender.playSound('note.pling');
                        sendMessage(sender.name, 'risiko.add.kingdom.success', [String(r.formValues)]);
                    }
                })
            }

            if (r.selection >= 1) {
                risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

                const kingdomSettings = new ActionFormData();
                const kingdomSave = Object.keys(risikoSave.kingdom)[r.selection - 1]

                kingdomSettings.title(kingdomSave);
                kingdomSettings.button({ translate: 'risiko.add.king' }, 'textures/ui/permissions_op_crown');
                kingdomSettings.button({ translate: 'risiko.add.member' }, 'textures/ui/permissions_member_star');
                kingdomSettings.label({ translate: 'risiko.ui.memberList' });

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
                        add.textField({ translate: 'risiko.ui.name' }, '');
                        add.submitButton({ translate: 'risiko.ui.add' });
                        add.show(sender).then((r) => {

                            if (r.canceled) return;

                            risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

                            risikoSave.player[r.formValues] ??= {}

                            let addKing = risikoSave.kingdom[kingdomSave].kings[r.formValues]
                            let addMember = risikoSave.kingdom[kingdomSave].members[r.formValues]

                            if (addKing || addMember) {

                                sendMessage('risiko.already.exists', String(r.formValues), sender.name);
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
                                sendMessage('risiko.wasAddedTo', [String(r.formValues), kingdomSave], sender.name)
                            }
                        })
                    }

                    if (r.selection === 1) {
                        const add = new ModalFormData();

                        add.title(`§l§6${kingdomSave}`);
                        add.textField({ translate: 'risiko.ui.name' }, '');
                        add.submitButton({ translate: 'risiko.ui.add' });
                        add.show(sender).then((r) => {
                            if (r.canceled) return;

                            risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

                            risikoSave.player[r.formValues] ??= {}

                            let addKing = risikoSave.kingdom[kingdomSave].kings[r.formValues]
                            let addMember = risikoSave.kingdom[kingdomSave].members[r.formValues]

                            if (addMember || addKing) {

                                sendMessage('risiko.already.exists', String(r.formValues), sender.name)
                                sender.playSound('note.bass');

                            } else if (!addMember && !addKing) {

                                const playerSave = risikoSave.player[r.formValues]

                                risikoSave.kingdom[kingdomSave].members[r.formValues] = true;
                                playerSave.kingdom = kingdomSave
                                playerSave.health = 1

                                world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));

                                kingdom(sender);

                                sender.playSound('note.pling');

                                sendMessage('risiko.wasAddedTo', [String(r.formValues), kingdomSave], sender.name);
                            }
                        })
                    }
                })
            }
        })
    })
}