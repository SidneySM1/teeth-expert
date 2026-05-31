// Pequena camada de persistência em localStorage (mock do backend).
const PREFIX = 'teeth-expert:'
const LEGACY_PREFIX = 'odontoflow:'

// Migração única: renomeia chaves do prefixo antigo para o novo,
// preservando dados criados antes do rebatismo do projeto.
;(function migrateLegacy() {
  try {
    if (typeof localStorage === 'undefined') return
    for (const key of ['patients', 'procedures', 'appointments']) {
      const legacy = localStorage.getItem(LEGACY_PREFIX + key)
      if (legacy != null && localStorage.getItem(PREFIX + key) == null) {
        localStorage.setItem(PREFIX + key, legacy)
        localStorage.removeItem(LEGACY_PREFIX + key)
      }
    }
  } catch {
    /* ignora no mock */
  }
})()

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage cheio / indisponível — ignora no mock */
  }
}

export function uid(prefix = 'id'): string {
  const rnd =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.abs(Date.now() ^ (performance.now() * 1000)).toString(36)
  return `${prefix}-${rnd}`
}
