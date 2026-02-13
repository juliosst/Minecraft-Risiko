import { world, system } from '@minecraft/server';

export const inventory = new Map();

system.runInterval(() => {
    const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

    function savePos(entity, dummy) {
        const entitySave = risikoSave.player[!dummy ? entity.name : entity.nameTag]

        const health = entity.getComponent('health').currentValue;
        const dimension = entity.dimension.id.replace('minecraft:', '');

        const rx = entity.getRotation().x;
        const ry = entity.getRotation().y;

        const x = entity.location.x;
        const y = entity.location.y;
        const z = entity.location.z;

        entitySave.dummy = {
            health,
            dimension,
            rotation: { rx, ry },
            position: { x, y, z }
        }

        world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
    }

    for (const player of world.getPlayers()) {
        const playerSave = risikoSave.player[player.name]

        if (playerSave?.combatlog >= 0) {
            savePos(player, false)

            let slots = []

            for (let s = 0; s <= 35; s++) {
                const item = player.getComponent('inventory').container.getItem(s);

                if (!item) {
                    slots.push('none')
                } else {
                    slots.push(item);
                }
            }

            const equipp = player.getComponent('equippable');

            function pushSlot(select) {
                const slot = equipp?.getEquipment(select) ?? 'none';
                slots.push(slot);
            }

            pushSlot('Head');
            pushSlot('Chest');
            pushSlot('Legs');
            pushSlot('Feet');
            pushSlot('Offhand');

            inventory.set(player.name, slots);
        }
    }

    function despawnDummy(dim) {

        for (const entity of world.getDimension(dim).getEntities()) {

            if (entity.typeId === 'risiko:dummy') {
                const entitySave = risikoSave.player[entity.nameTag];

                if (entitySave?.combatlog) {

                    const combat = entitySave.combatlog - Date.now();

                    savePos(entity, true);

                    if (combat <= 500) {

                        entitySave.combatlog = 'xxx';
                        world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));

                        entity.remove();
                    }
                }
            }
        }
    }

    despawnDummy('overworld');
    despawnDummy('the_end');
    despawnDummy('nether');
}, 5)