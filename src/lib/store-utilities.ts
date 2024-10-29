/**
 * @file Contains utilities for Svelte stores. Adapted from [svelte-persisted-store](https://github.com/joshnuss/svelte-persisted-store) and Svelte's derived store implementation.
 * @author Brendan Sherman
 */

import { get, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

/** Updater type to match Svelte's expectations. */
declare type Updater<T> = (value: T) => T;
/** Dictionary of writable stores. */
declare type StoreDict<T> = { [key: string]: Writable<T> };

/** Dictionary to keep track of key names so multiple stores aren't writing to the same target. */
/* eslint-disable  @typescript-eslint/no-explicit-any */
const stores: StoreDict<any> = {};

/**
 * Checks if localStorage is available for use. Adapted from the storageAvailable function defined in [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage).
 *
 * @returns {boolean} Whether or not localStorage is available for use.
 */
function isLocalStorageAvailable(): boolean {
	let storage;
	try {
		storage = localStorage;
		const x = '__storage_test__';

		storage.setItem(x, x);
		storage.removeItem(x);

		return true;
	} catch (e) {
		return (
			e instanceof DOMException &&
			e.name === 'QuotaExceededError' &&
			// Acknowledge QuotaExceededError only if there's something already stored
			storage != null &&
			storage.length !== 0
		);
	}
}

/**
 * Load a value from storage if it is available for use, otherwise return a fallback value.
 *
 * @template StoreType
 * @param {boolean}        canUseStorage Whether or not storage is available for use.
 * @param {Storage | null} storage       Where values will be stored if allowed.
 * @param {string}         key           The name of the store.
 * @param {StoreType}      initialValue  The fallback value for the store.
 *
 * @example
 * ```ts
 * loadFromStorage(true, 'flp-storageConsent', localStorage, false);
 * ```
 *
 * @returns {StoreType} The value from storage if it is available, otherwise the fallback value.
 */
function loadFromStorage<StoreType>(
	canUseStorage: boolean,
	storage: Storage | null,
	key: string,
	initialValue: StoreType,
): StoreType {
	if (canUseStorage) {
		/* eslint-disable  @typescript-eslint/no-explicit-any */
		function deserialize(json: any) {
			try {
				return JSON.parse(json);
			} catch {
				console.error(
					`Error when parsing ${json ? '"' + json + '"' : 'value'} from persisted store "${key}"!`,
				);
			}

			return json;
		}

		const json = storage?.getItem(key);

		if (json == null) {
			return initialValue;
		}

		const deserialized = deserialize(json);

		return deserialized;
	}

	return initialValue;
}

/**
 * Update storage with a value if it is available for use.
 *
 * @template StoreType
 * @param {boolean | null} canUseStorage Whether or not storage is available for use.
 * @param {Storage | null} storage       Where values will be stored if allowed.
 * @param {string}         key           The name of the store.
 * @param {StoreType}      value         The value to write to storage.
 *
 * @example
 * ```ts
 * updateStorage(true, 'flp-storageConsent', localStorage, true);
 * ```
 */
function updateStorage<StoreType>(
	canUseStorage: boolean | null,
	storage: Storage | null,
	key: string,
	value: StoreType,
) {
	if (canUseStorage) {
		try {
			storage?.setItem(key, JSON.stringify(value));
		} catch {
			console.error(
				`Error when writing value from store "${key}" to localStorage!`,
			);
		}
	}
}

/**
 * A wrapper for a writable store that can be updated after storage events if allowed.
 *
 * @template StoreType
 * @param {Readable<boolean | null> | boolean} canUseStorage The store or boolean controlling the storage decision.
 * @param {Storage | null}                     storage       Where values will be stored if allowed.
 * @param {string}                             key           The name of the store.
 * @param {StoreType}                          initialValue  The fallback value for the store.
 *
 * @example
 * ```ts
 * storageWritable(true, 'flp-storageConsent', localStorage, true);
 * ```
 *
 * @returns {Writable{StoreType}} A writable store that can be updated after storage events.
 */
function storageWritable<StoreType>(
	canUseStorage: Readable<boolean | null> | boolean,
	storage: Storage | null,
	key: string,
	initialValue: StoreType,
): Writable<StoreType> {
	return writable(initialValue, (set) => {
		if (storage != null) {
			const handleStorage = (event: StorageEvent) => {
				// Make sure storageConsent is up to date so that we always respect user's decision
				const storageConsent =
					typeof canUseStorage === 'boolean'
						? canUseStorage
						: get(canUseStorage);

				if (storageConsent && event.key === key && event.newValue) {
					const json = event.newValue;
					/* eslint-disable  @typescript-eslint/no-explicit-any */
					let newVal: any;
					try {
						newVal = JSON.parse(json);
					} catch {
						console.error(
							`Error when parsing ${json ? '"' + json + '"' : 'value'} from persisted store "${key}"!`,
						);
						return;
					}

					set(newVal);
				}
			};

			const handleStorageAvailable = () => {
				// Write current value to storage once it is available
				updateStorage(true, storage, key, get(stores[key]));
			};

			window.addEventListener('storage', handleStorage);

			// Only add this to non-controllers
			if (typeof canUseStorage !== 'boolean') {
				window.addEventListener(
					'flippin:storageavailable',
					handleStorageAvailable,
				);
			}

			return () => {
				window.removeEventListener('storage', handleStorage);
				window.removeEventListener(
					'flippin:storageavailable',
					handleStorageAvailable,
				);
			};
		}
	});
}

/**
 * A wrapper for a writable store that can be used to control the behavior of other locally persistable stores.
 *
 * @param {string} key The name to use for the local store.
 *
 * @example
 * ```ts
 * locallyPersistableController('flp-storageConsent');
 * ```
 *
 * @returns {Writable<boolean | null>} A writable store that can be used to control the behavior of other locally persistable stores.
 */
export function locallyPersistableController(
	key: string,
): Writable<boolean | null> {
	const storage = isLocalStorageAvailable() ? localStorage : null;
	// Event to trigger a save to local in other locally persistable stores
	const storageAvailableEvent = new Event('flippin:storageavailable');
	// Initial value should be null so that any boolean assignment will trigger store update logic
	const initial = loadFromStorage<boolean | null>(true, storage, key, null);
	const store = storageWritable(true, storage, key, initial);
	const { subscribe, set } = store;

	stores[key] = {
		set(value: boolean | null) {
			set(value);

			// Clear out any stored values if consent to store is not provided
			if (value) {
				updateStorage(value, storage, key, value);

				if (window) {
					// Dispatch an event for other locally persistable stores to save non-default values
					window.dispatchEvent(storageAvailableEvent);
				}
			} else if (value === false) {
				storage?.clear();
			}
		},
		update(callback: Updater<boolean | null>) {
			return store.update((last) => {
				const value = callback(last);

				// Clear out any stored values if consent to store is not provided
				if (value) {
					updateStorage(value, storage, key, value);
				} else {
					storage?.clear();
				}

				return value;
			});
		},
		subscribe,
	};

	return stores[key];
}

/**
 * A wrapper for a writable store that will persist to localStorage if allowed.
 *
 * @template StoreType
 * @param {Readable<boolean | null>} shouldPersistStore A store containing a boolean value for whether or not localStorage is allowed.
 * @param {string}                   key                The name to use for the local store.
 * @param {StoreType}                initialValue       The initial value and fallback value for the store.
 *
 * @example
 * ```ts
 * // Given a boolean store, storageConsent
 * locallyPersistable(storageConsent, 'flp-localContent', 'Flippin');
 * ```
 *
 * @returns {Writable<StoreType>} A writable store that behaves normally but can persist data to localStorage if allowed.
 */
export function locallyPersistable<StoreType>(
	shouldPersistStore: Readable<boolean | null>,
	key: string,
	initialValue: StoreType,
): Writable<StoreType> {
	// Whether or not values should be read from and written to localStorage
	let shouldPersist: boolean | null = false;
	// Subscribe to the store containing storage decision
	const unsubPersistStore = shouldPersistStore.subscribe(
		(value) => (shouldPersist = value),
	);
	const storage = isLocalStorageAvailable() ? localStorage : null;

	// Check if the localStorage key is already being used
	if (!stores[key]) {
		const initial = loadFromStorage(shouldPersist, storage, key, initialValue);
		const store = storageWritable(shouldPersistStore, storage, key, initial);
		const { subscribe, set } = store;

		stores[key] = {
			set(value: StoreType) {
				set(value);
				updateStorage(shouldPersist, storage, key, value);

				// Unsubscribe from the watched store
				return unsubPersistStore;
			},
			update(callback: Updater<StoreType>) {
				return store.update((last) => {
					const value = callback(last);

					updateStorage(shouldPersist, storage, key, value);

					return value;
				});
			},
			subscribe,
		};
	}

	return stores[key];
}
