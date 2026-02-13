import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
    system.run(() => {
        let risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const killer = damageSource.damagingEntity;

        function clearCombat(dummy) {
            const entitySave = risikoSave.player[!dummy ? deadEntity.name : deadEntity.nameTag]

            risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

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
            const playerSave = risikoSave.player[deadEntity.name]
            const killerSave = risikoSave.player[killer?.name]

            if (killer?.typeId === 'minecraft:player') {

                sendMessage('world', 'risiko.death.attack', [deadEntity.name, killer.name]);
            } else {
                sendMessage('world', 'risiko.death.player', [deadEntity.name]);
            }

            if (playerSave?.health >= 2) {

                playerSave.health = 1

            } else if (playerSave?.health === 1 && killer?.typeId === 'minecraft:player') {

                if (playerSave.kingdom && killerSave?.kingdom) {

                    if (playerSave?.king && killerSave?.king && playerSave.kingdom !== killerSave.kingdom) {

                        playerSave.health = 0;

                    } else if (!playerSave?.king && playerSave.kingdom !== killerSave.kingdom) {

                        playerSave.health = 0;
                    }
                }


            }

            playerSave.combatlog = 'xxx';
            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
        }

        if (deadEntity.typeId === 'risiko:dummy') {

            sendMessage('world', 'risiko.offline.death', deadEntity.nameTag);
            clearCombat(true);
        }
    })
})