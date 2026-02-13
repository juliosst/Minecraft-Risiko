import { world, system } from '@minecraft/server';

export function installSave() {
    system.run(() => {
        if (!world.getDynamicProperty('risikoSave')) {
            world.setDynamicProperty('risikoSave', JSON.stringify({}))
        }

        let risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));

        risikoSave = {
            settings: risikoSave?.settings ?? {},
            player: risikoSave?.player ?? {},
            kingdom: risikoSave?.kingdom ?? {}
        }

        world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave));
    })
}

export function installPlayer(name) {
    system.run(() => {
        const risikoSave = JSON.parse(world.getDynamicProperty('risikoSave'));
        const playerSave = risikoSave.player[name]

        if (!risikoSave.player[name]) {
            risikoSave.player[name] = {}
        }

        playerSave?.combatlog ?? 'xxx'

        world.setDynamicProperty('risikoSave', JSON.stringify(risikoSave))
    })
}