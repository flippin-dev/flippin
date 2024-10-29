<script lang="ts">
	import Dialog from '$com/Dialog.svelte';
</script>

<Dialog>
	<svelte:fragment slot="title">My Title</svelte:fragment>
	<p data-testid="content">This is my content.</p>
</Dialog>
