<!--
@component
A component that creates a dialog box over the page which can be filled with content.

@example
```svelte
<Dialog>
    <svelte:fragment slot="title">My Title</svelte:fragment>
    <p>This is my content.</p>
</Dialog>
```
-->

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import {
		currentScreen,
		storageConsent,
		storageNoticeVisible,
	} from '$src/stores/stores';

	/** A binding for the dialog element. */
	let dialog: HTMLDialogElement;
	/** Whether or not the dialog is for a storage consent confirmation */
	export let confirmation = false;
	/** Tracks acknowledgment of storage consent notice. */
	let acknowledged = false;

	$: if (dialog && $currentScreen !== null) {
		dialog.show();
	}
</script>

<div>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- The outside click event to close is a bonus feature used to replicate a common user expectation.
    Tab navigation users should instead use the dedicated close button or the Escape key. -->
	<dialog
		bind:this={dialog}
		in:fade={{ easing: quadOut, duration: 200 }}
		on:close={() => {
			if (!confirmation) {
				currentScreen.set(null);
			} else {
				storageNoticeVisible.set(false);
			}
		}}
		out:fade={{ easing: quadOut, duration: 200 }}
		on:click|self={() => {
			if (!confirmation) {
				dialog.close();
			}
		}}
		on:keydown={(event) => {
			if (!confirmation && event.key === 'Escape') {
				dialog.close();
			}
		}}
		aria-labelledby="dialog-title"
	>
		<div class="modal-content">
			{#if !confirmation}
				<button
					class="close-button"
					title="close dialog"
					on:click={() => dialog.close()}
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 6 6"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						stroke="var(--color-text)"
						stroke-width="1.5"
						stroke-linecap="round"
						opacity="0.6"
						width="24"
						height="24"
					>
						<title>Close</title>
						<line x1="1" y1="1" x2="5" y2="5" />
						<line x1="5" y1="1" x2="1" y2="5" />
					</svg>
				</button>
			{/if}

			{#if $$slots.title}
				<h2 id="dialog-title">
					<slot name="title" />
				</h2>
				<hr />
			{/if}
			<slot />

			{#if confirmation}
				<input
					type="checkbox"
					id="storage-notice-acknowledgment"
					name="storage-notice-acknowledgment"
					bind:checked={acknowledged}
				/>
				<label for="storage-notice-acknowledgment"
					>Do you understand the notice above?</label
				>

				<p>
					Do you consent to allowing Flippin to use your device's local storage
					for the reasons listed above?
				</p>
				<div class="confirmation-row">
					<button
						class="confirmation-button"
						on:click={() => {
							// Confirm that storage can be used
							storageConsent.set(true);
							dialog.close();
						}}
						disabled={!acknowledged}
						aria-disabled={!acknowledged}
					>
						Accept
					</button>
					<button
						class="confirmation-button"
						on:click={() => {
							// Confirm that storage cannot be used
							storageConsent.set(false);
							dialog.close();
						}}
						disabled={!acknowledged}
						aria-disabled={!acknowledged}
					>
						Decline
					</button>
				</div>
			{/if}
		</div>
	</dialog>
</div>

<style>
	dialog {
		display: flex;
		position: fixed;
		border: none;
		margin: 0;
		padding: 0;
		max-width: none;
		max-height: none;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.3);
		overflow: visible;
		z-index: 5;
	}

	.modal-content {
		--dialog-max-width: 520px;
		max-width: var(--dialog-max-width);
		width: 90%;
		max-height: 90vh;
		border: 1px solid var(--color-bg-2);
		border-radius: 8px;
		background-color: var(--color-bg-1);
		color: var(--color-text);
		margin-left: calc(100vw - 100%);
		padding: 1rem 1.5rem;
		overflow-x: hidden;
		overflow-y: auto;
	}

	@media (max-width: 600px) {
		.modal-content {
			max-width: none;
			margin-left: 0;
			width: 100vw;
			padding: 1rem 1rem;
		}
	}

	.close-button {
		margin: 0;
		border: 0;
		padding: 0;
		width: 24px;
		height: 24px;
		left: calc(100% - 24px);
		background-color: var(--color-bg-1);
		display: flex;
		position: relative;
		align-items: center;
		z-index: 10;
	}

	.confirmation-row {
		display: flex;
		/* margin-top: 0.5rem; */
		justify-content: space-evenly;
	}

	.confirmation-button {
		border-radius: 5px;
		border: 2px solid var(--color-border);
	}

	button:hover svg {
		opacity: 1;
	}

	button:disabled {
		color: var(--color-disabled-text);
		background-color: var(--color-disabled-bg);
	}

	button:disabled:hover {
		background-color: var(--color-disabled-bg);
	}

	input,
	input + label {
		cursor: pointer;
	}
</style>
