import { world } from '@minecraft/server';
import { blockTrident } from '../runs/install';

world.beforeEvents.itemUse.subscribe((event) => {

    if (blockTrident) {

        const itemStack = event.itemStack
        const source = event.source

        if (itemStack.typeId === 'minecraft:trident' && source.typeId === 'minecraft:player') {

            for (const enchantment of itemStack.getComponent('enchantable').getEnchantments()) {

                if (enchantment.type.id === 'riptide') event.cancel = true;
            }
        }
    }
});