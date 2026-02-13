import { world, system } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

import { kingdom } from '../ui/kingdom';
import { settings } from '../ui/settings';

export function risikoSettings(senders) {
    system.run(() => {
        const sender = senders.sourceEntity;
        const menu = new ActionFormData();

        sender.playSound('random.pop2');

        menu.title('§l§4Risiko');
        menu.button('Einstellungen', 'textures/ui/icon_setting');
        menu.button('Königreiche', 'textures/ui/permissions_op_crown')
        menu.show(sender).then((r) => {
            if (r.canceled) return;

            if (sender.playerPermissionLevel >= 2) {

                if (r.selection === 0) {
                    settings(sender);
                }

                if (r.selection === 1) {
                    kingdom(sender);
                }
            }
        })
    })
}