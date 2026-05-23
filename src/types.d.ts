/**
 * Ambient declarations.
 *
 * `*.css` side-effect imports (Expo web CSS support) have no type by default
 * until `expo-env.d.ts` is generated on first `expo start`. Declaring it here
 * keeps `tsc --noEmit` green in CI before the dev server has ever run.
 */
declare module '*.css';
