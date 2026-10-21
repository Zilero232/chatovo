# Naming

| What | How | Example |
|---|---|---|
| Slices | kebab-case | `voice-room`, `channels-panel` |
| Segments | kebab-case | `ui`, `model`, `lib`, `api`, `config` |
| Component folder | PascalCase | `VoiceRoom/`, `UserBar/` |
| Component file | PascalCase + `.tsx` | `VoiceRoom.tsx` |
| Types file | `<Name>.types.ts` | `VoiceRoom.types.ts` |
| Styles file | `<Name>.module.scss` | `Button.module.scss` |
| Hook file | kebab-case | `use-room-state.ts` |
| React component (export) | PascalCase | `VoiceRoom` |
| Hook | `use` + camelCase | `useEnterRoom`, `useRoomState` |
| Utility | camelCase | `groupMessages`, `formatTime` |
| Props type | `<Name>Props` | `VoiceRoomProps` |
| DTO type | `<Name>Input/Output` | `EnterRoomInput` |

> FSD canon: kebab-case for every file. Chatovo deviates: PascalCase for component folders and files, kebab-case for hooks and utilities.
