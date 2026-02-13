import { world, system } from '@minecraft/server';
import { installPlayer } from '../runs/install';
import { sendMessage } from '../runs/run';

world.afterEvents.entityHurt.subscribe((event) => {
    system.run(() => {
        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const damage = event.damageSource.damagingEntity
        const hurt = event.hurtEntity

        function setCombat(player, dummy) {

            const playerSave = risikoSave.player[!dummy ? player.name : player.nameTag]
            const health = player.getComponent('health').currentValue;
            let setCombat;

            if (!playerSave) return installPlayer(player.name);

            if (playerSave.combatlog === 'xxx') {

                sendMessage(player.name, 'risiko.combat.start');
            }

            if (health >= 10) {
                setCombat = 30000
            } else if (health <= 10 && health >= 5) {
                setCombat = 60000
            } else if (health <= 5) {
                setCombat = 300000
            }

            playerSave.combatlog = Date.now() + setCombat;
            world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
        }

        if (hurt.typeId === 'risiko:dummy') {
            setCombat(hurt, true);
        }

        if (hurt.typeId === 'risiko:dummy' && damage?.typeId === 'minecraft:player') {
            setCombat(damage, false);
        }

        if (hurt.typeId === 'minecraft:player' && risikoSave.player[hurt.name].combatlog >= 0) {
            setCombat(hurt, false);
        }

        if (hurt.typeId === 'minecraft:player' && damage?.typeId === 'minecraft:player') {
            setCombat(hurt, false);
            setCombat(damage, false);
        }
    })
});