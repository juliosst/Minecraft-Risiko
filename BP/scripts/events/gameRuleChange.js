import { world, system } from '@minecraft/server';

export function setDummy(dimension) {
    const boolean = world.gameRules.keepInventory;

    for (const entity of world.getDimension(dimension).getEntities()) {

        if (entity.typeId === 'risiko:dummy') {
            entity.triggerEvent(`risiko:keepInventory_${boolean}`);
        }
    }
}

world.afterEvents.gameRuleChange.subscribe((event) => {
    system.run(() => {
        if (event.rule === 'keepInventory') {
            setDummy('overworld');
            setDummy('the_end');
            setDummy('nether');
        }
    })
})