import { world, system, CommandPermissionLevel, CustomCommandParamType } from '@minecraft/server';
import { risikoSettings } from './risikoSettings';
import { resetPlayer } from './resetPlayer'

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    customCommandRegistry.registerCommand({
        name: 'risiko:risiko-settings',
        description: 'Öffnet die Risiko Einstellungen',
        permissionLevel: CommandPermissionLevel.GameDirectors
    }, risikoSettings);

    customCommandRegistry.registerCommand({
        name: 'risiko:reset-player',
        description: 'Löscht daten eines spielers',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'Name' }
        ]
    }, resetPlayer);
})