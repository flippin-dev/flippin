import { beforeEach, describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import {
	locallyPersistable,
	locallyPersistableController,
} from '$lib/store-utilities';

const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

beforeEach(() => localStorage.clear());

afterEach(() => {
	setItemSpy.mockClear();
});

describe('Locally persistable store', () => {
	it('Create with no local value available', () => {
		const controllerStore = locallyPersistableController('test-controller1');
		controllerStore.set(false);

		const store = locallyPersistable(controllerStore, 'test-key1', 'sample');
		const value = get(store);

		expect(value).toBe('sample');
		expect(localStorage.getItem('test-key1')).toBeNull();
	});

	it('Create with local value available', () => {
		localStorage.setItem('test-key2', 'existing');

		const controllerStore = locallyPersistableController('test-controller2');
		controllerStore.set(true);

		const store = locallyPersistable(controllerStore, 'test-key2', 'sample');
		const value = get(store);

		expect(value).toBe('existing');
		expect(localStorage.getItem('test-key2')).toBe(value);
	});

	it('Update value when local storage is allowed', () => {
		const controllerStore = locallyPersistableController('test-controller3');
		controllerStore.set(true);

		const store = locallyPersistable(controllerStore, 'test-key3', 'sample');
		const valueOriginal = get(store);

		expect(valueOriginal).toBe('sample');

		vi.waitFor(() => {
			expect(setItemSpy).toHaveBeenCalledWith('test-key3', valueOriginal);
		});

		store.set('updated');

		const valueUpdated = get(store);

		expect(valueUpdated).toBe('updated');

		vi.waitFor(() => {
			expect(setItemSpy).toHaveBeenLastCalledWith('test-key3', valueUpdated);
		});
	});

	it('Update value when local storage is not allowed', () => {
		const controllerStore = locallyPersistableController('test-controller4');

		controllerStore.set(false);

		const store = locallyPersistable(controllerStore, 'test-key4', 'sample');
		const valueOriginal = get(store);

		expect(valueOriginal).toBe('sample');
		expect(localStorage.getItem('test-key4')).toBeNull();

		store.set('updated');

		const valueUpdated = get(store);

		expect(valueUpdated).toBe('updated');
		expect(localStorage.getItem('test-key4')).toBeNull();
	});

	it('Create while name already in use', () => {
		const controllerStore = locallyPersistableController('test-controller5');

		controllerStore.set(false);

		const store = locallyPersistable(controllerStore, 'test-key5', 'sample');
		const valueOriginal = get(store);

		expect(valueOriginal).toBe('sample');

		const storeDupe = locallyPersistable(controllerStore, 'test-key5', 'other');
		const valueDupe = get(storeDupe);

		expect(valueDupe).toBe(valueOriginal);

		// Check that they point to the same object
		expect(storeDupe).toBe(store);
	});
});

describe('Locally persistable store controller', () => {
	it('Create without storage consent', () => {
		localStorage.setItem('test-key6', 'existing');

		expect(localStorage.getItem('test-key6')).toBe('existing');

		const store = locallyPersistableController('test-controller6');
		const value = get(store);

		expect(value).toBeNull();

		store.set(false);

		// Check that storage is cleared
		expect(localStorage.getItem('test-key6')).toBeNull();
	});

	it('Create with storage consent', () => {
		localStorage.setItem('test-key7', 'existing');

		expect(localStorage.getItem('test-key7')).toBe('existing');

		const store = locallyPersistableController('test-controller7');
		const value = get(store);

		expect(value).toBeNull();

		store.set(true);

		// Check that storage is preserved
		expect(localStorage.getItem('test-key7')).toBe('existing');
	});

	it('Update controller to true', () => {
		expect(localStorage.getItem('test-key8')).toBeNull();

		const controllerStore = locallyPersistableController('test-controller8');
		const controllerValue = get(controllerStore);

		expect(controllerValue).toBeNull();

		const persistableStore = locallyPersistable(
			controllerStore,
			'test-key8',
			'sample',
		);
		const persistableValue = get(persistableStore);

		expect(persistableValue).toBe('sample');
		expect(localStorage.getItem('test-key8')).toBeNull();

		controllerStore.set(true);

		vi.waitFor(() => {
			expect(setItemSpy).toHaveBeenCalledWith('test-key8', persistableValue);
		});
	});

	it('Update controller to false', () => {
		localStorage.setItem('test-key9', 'existing');

		const controllerStore = locallyPersistableController('test-controller9');
		controllerStore.set(true);

		const persistableStore = locallyPersistable(
			controllerStore,
			'test-key9',
			'sample',
		);
		const persistableValue = get(persistableStore);

		expect(persistableValue).toBe('existing');
		expect(localStorage.getItem('test-key9')).toBe('existing');

		controllerStore.set(false);

		const persistableValueAfter = get(persistableStore);

		expect(persistableValueAfter).toBe(persistableValue);
		expect(localStorage.getItem('test-key9')).toBeNull();
	});
});
