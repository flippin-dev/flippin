<!--
@component
A component to confirm that Flippin data can be stored locally.
-->

<script lang="ts">
	import Dialog from '$com/Dialog.svelte';
	import { storageConsent } from '$src/stores/stores';

	const confirmationMessage =
		"Do you consent to allowing Flippin to use your device's local storage for the reasons listed above?";
</script>

<Dialog
	confirmation={true}
	{confirmationMessage}
	confirmationStore={storageConsent}
>
	<svelte:fragment slot="title">Local Storage Notice</svelte:fragment>

	<p>
		Flippin can optionally use your device's local storage to keep track of the
		following information:
	</p>
	<ul>
		<li>Daily game progress</li>
		<li>Historical game stats</li>
		<li>Color theme selection</li>
		<li>Dark mode selection</li>
		<li>Reduced motion selection</li>
		<li>Custom color theme additions</li>
		<li>Custom puzzle additions</li>
	</ul>
	<p>
		<strong>Note:</strong> Dark mode is turned on by default and reduced motion defaults
		to your device's setting.
	</p>
	<p>
		Local storage use is <span class="underlined"><strong>not</strong></span> required
		to play Flippin, but the data listed above will not be preserved if you refresh
		or close the game.
	</p>
	<p>
		<strong>Warning:</strong> Declining local storage consent will also
		<strong>ERASE</strong> any currently saved local Flippin data.
	</p>
	<p>
		You may adjust your storage consent decision at any time through Flippin's
		settings panel.
	</p>
</Dialog>

<style>
</style>
