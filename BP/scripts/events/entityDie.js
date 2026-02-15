import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {

    system.run(() => {

        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const killer = damageSource.damagingEntity;

        function removeHearth(entity) {

            const entitySave = risikoSave.player[entity]
            const killerSave = risikoSave.player[killer?.name]

            if (entitySave?.health >= 2) {

                entitySave.health = 1

            } else if (entitySave?.health === 1 && killer?.typeId === 'minecraft:player') {

                if (entitySave.kingdom && killerSave?.kingdom) {

                    if (entitySave?.king && killerSave?.king && entitySave.kingdom !== killerSave.kingdom) {

                        entitySave.health = 0;

                    } else if (!entitySave?.king && entitySave.kingdom !== killerSave.kingdom) {

                        entitySave.health = 0;
                    }
                }
            }

            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
        }

        function clearCombat(dummy) {
            const entitySave = risikoSave.player[!dummy ? deadEntity.name : deadEntity.nameTag]

            if (entitySave.combatlog >= 0) {
                entitySave.combatlog = 'xxx';

                if (dummy) {

                    const keepInventory = world.gameRules.keepInventory

                    entitySave.dummy = {
                        kill: true,
                        keepInventory
                    }
                }
            }

            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
        }

        if (deadEntity.typeId === 'minecraft:player') {

            if (killer?.typeId === 'minecraft:player') {

                sendMessage('risiko.death.attack', { withs: [deadEntity.name, killer.name] });
            } else {
                sendMessage('risiko.death.player', { withs: [deadEntity.name] });
            }

            removeHearth(deadEntity.name);
            clearCombat(false);
        }

        if (deadEntity.typeId === 'risiko:dummy') {

            sendMessage('risiko.offline.death', { withs: [deadEntity.nameTag] });
            removeHearth(deadEntity.nameTag);
            clearCombat(true);
        }
    })
})