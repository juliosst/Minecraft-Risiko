import { system, CustomCommandParamType } from '@minecraft/server';
import { risikoSettings } from './risikoSettings';
import { resetPlayer } from './resetPlayer'
import { hearth } from './hearth';

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    customCommandRegistry.registerCommand({
        name: 'risiko:risiko-settings',
        description: 'risiko.command.risiko-settings',
        permissionLevel: 1
    }, risikoSettings);

    customCommandRegistry.registerCommand({
        name: 'risiko:reset-player',
        description: 'risiko.command.reset-player',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'Name' }
        ]
    }, resetPlayer);

    customCommandRegistry.registerCommand({
        name: 'risiko:hearth',
        description: 'risiko.command.hearth',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'Name' },
            { type: CustomCommandParamType.Integer, name: 'Herzen' }
        ]
    }, hearth);
})