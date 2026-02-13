import { world, system } from '@minecraft/server';

world.afterEvents.entitySpawn.subscribe(({ entity }) => {
    system.run(() => {

        if (entity.typeId === 'risiko:dummy') {

            const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
            const entitySave = risikoSave.player[entity.nameTag]

            let succes = false;

            function checkDimension(dimension) {

                if (!succes) {

                    let check = 0

                    for (const entitys of world.getDimension(dimension).getEntities()) {

                        if (entity.nameTag === entitys.nameTag) check++

                        if (check >= 2) {

                            entity.remove();
                            succes = true;
                            break;
                        }
                    }
                }
            }

            checkDimension('overworld');
            checkDimension('the_end');
            checkDimension('nether');

            if (!succes && entity.nameTag === '') {

                entity.remove()
                succes = true;
            }

            if (!succes && (!entitySave || entitySave?.combatlog === 'xxx')) {

                entity.remove();
                succes = true;
            }
        }
    })
})