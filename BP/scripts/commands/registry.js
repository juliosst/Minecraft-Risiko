import { system, CommandPermissionLevel, CustomCommandParamType } from '@minecraft/server';
import { risikoSettings } from './risikoSettings';
import { resetPlayer } from './resetPlayer'

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    customCommandRegistry.registerCommand({
        name: 'risiko:risiko-settings',
        description: 'risiko.command.risiko-settings',
        permissionLevel: CommandPermissionLevel.GameDirectors
    }, risikoSettings);

    customCommandRegistry.registerCommand({
        name: 'risiko:reset-player',
        description: 'risiko.command.reset-player',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'Name' }
        ]
    }, resetPlayer);
})