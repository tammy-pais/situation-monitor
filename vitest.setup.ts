import { vi } from 'vitest';

// jsdom (under this jsdom + Node combination) ships no functional Web Storage —
// `localStorage` exists but `localStorage.clear` is not a function, so the L2
// cache tier and every test that exercises it (cache.test.ts) throw. Provide a
// Map-backed implementation so those tests run for real.
function createStorage(): Storage {
	const store = new Map<string, string>();
	return {
		get length() {
			return store.size;
		},
		clear: () => store.clear(),
		getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
		setItem: (key: string, value: string) => {
			store.set(String(key), String(value));
		},
		removeItem: (key: string) => {
			store.delete(key);
		},
		key: (index: number) => Array.from(store.keys())[index] ?? null
	} as Storage;
}

vi.stubGlobal('localStorage', createStorage());
