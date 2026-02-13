import { world, system } from '@minecraft/server';
import { setDummy } from './gameRuleChange';
import { inventory } from '../combatlog';

export function spawnDummy(name) {

    system.run(() => {

        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const playerSave = risikoSave.player[name]

        const health = playerSave.dummy.health

        const dimension = playerSave.dummy.dimension

        const x = playerSave.dummy.position.x
        const y = playerSave.dummy.position.y
        const z = playerSave.dummy.position.z

        const rx = playerSave.dummy.rotation.rx
        const ry = playerSave.dummy.rotation.ry

        world.getDimension(dimension).spawnEntity('risiko:dummy', { x, y, z }).nameTag = name;

        setDummy('overworld');
        setDummy('the_end');
        setDummy('nether');

        for (const entity of world.getDimension(dimension).getEntities()) {

            if (entity.typeId === 'risiko:dummy' && entity.nameTag === name) {

                entity.setRotation({ x: rx, y: ry });

                entity.applyDamage(20 - health);

                for (let s = 0; s <= 40; s++) {

                    const item = inventory.get(name)[s]

                    if (item !== 'none') {
                        function equip(slot) {
                            entity.runCommand(`replaceitem entity @s slot.armor.${slot} 0 ${item.typeId} 1`);
                        }

                        if (s === 36) equip('head');
                        if (s === 37) equip('chest');
                        if (s === 38) equip('legs');
                        if (s === 39) equip('feet');

                        entity.getComponent('inventory').container.setItem(s, item);
                    }
                }
            }
        }
    })
}

world.afterEvents.playerLeave.subscribe(({ playerName }) => {

    system.run(() => {

        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const playerSave = risikoSave.player[playerName]
        const combat = playerSave.combatlog - Date.now();

        if (combat >= 500) {
            spawnDummy(playerName);
        }
    })
})