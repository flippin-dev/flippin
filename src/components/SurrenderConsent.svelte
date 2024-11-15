<!--
@component
A component to confirm that you want to surrender the current game.
-->

<script lang="ts">
	import Dialog from '$com/Dialog.svelte';
	import { gameMode, shouldSurrender } from '$src/stores/stores';

	const confirmationMessage = 'Do you still want to surrender?';
</script>

<Dialog
	confirmation={true}
	{confirmationMessage}
	confirmationStore={shouldSurrender}
	isStandalone={true}
>
	<svelte:fragment slot="title">Surrender Notice</svelte:fragment>

	<p>
		{#if $gameMode === 'daily'}
			<strong>Warning:</strong> Surrendering solves the current puzzle and does not
			count towards your historical stats. A flag icon will also appear in your share
			message signifying that you surrendered.
		{:else}
			<strong>Warning:</strong> Surrendering solves the current puzzle.
		{/if}
	</p>
</Dialog>

<style>
</style>
