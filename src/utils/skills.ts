export const norm = (s?: string) => (s ?? '').trim();
export const skillKey = (name: string, version?: string) =>
  `${norm(name).toLowerCase()}::${norm(version).toLowerCase()}`;