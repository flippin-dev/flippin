<!--
@component
A component containing the rules of Flippin.
-->

<script lang="ts">
	import Dialog from '$com/Dialog.svelte';
</script>

<Dialog>
	<svelte:fragment slot="title">How to Play</svelte:fragment>

	<p>Flip tiles to match the image!</p>
	<p>Tiles follow a 3 color cycle when flipped.</p>
	<div
		role="img"
		aria-label="the cycle is: color 1, color 2, color 3, and back to color 1"
		class="tutorial-row"
	>
		<div class="tile color1" />
		<svg
			role="presentation"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6 12 H18 M18 12 L13 7 M18 12 L13 17"
				stroke="var(--color-text)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<div class="tile color2" />
		<svg
			role="presentation"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6 12 H18 M18 12 L13 7 M18 12 L13 17"
				stroke="var(--color-text)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<div class="tile color3" />
		<svg
			role="presentation"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6 12 H18 M18 12 L13 7 M18 12 L13 17"
				stroke="var(--color-text)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<div class="tile color1" />
	</div>
	<p>
		Press a tile to flip it and the surrounding tiles to the next color in the
		cycle.
	</p>
	<div class="tutorial-row">
		<div
			role="table"
			class="board"
			aria-label="a 3 by 3 game board before the middle tile is pressed"
		>
			<div role="row" class="row" style:--numColumns="3">
				<div role="cell" class="tile color1" aria-label="color 1" />
				<div role="cell" class="tile color1" aria-label="color 1" />
				<div role="cell" class="tile color1" aria-label="color 1" />
			</div>
			<div role="row" class="row" style:--numColumns="3">
				<div role="cell" class="tile color2" aria-label="color 2" />
				<div
					role="cell"
					class="tile highlighted color2"
					aria-label="highlighted color 2"
				/>
				<div role="cell" class="tile color2" aria-label="color 2" />
			</div>
			<div role="row" class="row" style:--numColumns="3">
				<div role="cell" class="tile color3" aria-label="color 3" />
				<div role="cell" class="tile color3" aria-label="color 3" />
				<div role="cell" class="tile color3" aria-label="color 3" />
			</div>
		</div>
		<svg
			role="presentation"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6 12 H18 M18 12 L13 7 M18 12 L13 17"
				stroke="var(--color-text)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<div
			role="table"
			class="board"
			aria-label="the same board after the middle tile is pressed; every tile but the corners advance to the next color in the cycle"
		>
			<div role="row" class="row" style:--numColumns="3">
				<div role="cell" class="tile color1" aria-label="color 1" />
				<div
					role="cell"
					class="tile highlighted color2"
					aria-label="flipped color 2"
				/>
				<div role="cell" class="tile color1" aria-label="color 1" />
			</div>
			<div role="row" class="row" style:--numColumns="3">
				<div
					role="cell"
					class="tile highlighted color3"
					aria-label="flipped color 3"
				/>
				<div
					role="cell"
					class="tile highlighted color3"
					aria-label="flipped color 3"
				/>
				<div
					role="cell"
					class="tile highlighted color3"
					aria-label="flipped color 3"
				/>
			</div>
			<div role="row" class="row" style:--numColumns="3">
				<div role="cell" class="tile color3" aria-label="color 3" />
				<div
					role="cell"
					class="tile highlighted color1"
					aria-label="flipped color 1"
				/>
				<div role="cell" class="tile color3" aria-label="color 3" />
			</div>
		</div>
	</div>
	<p>If you get stuck:</p>
	<ul>
		<li>Press the restart button (upper-right corner) to start over.</li>
		<li>Press the hint button (lower-left corner) for a hint.</li>
		<li>Press the surrender button (lower-right corner) to surrender.</li>
	</ul>
	<p>
		<strong>Warning:</strong> Surrendering solves the current puzzle and does not
		count towards your historical stats. A flag icon will also appear in your share
		message signifying that you surrendered.
	</p>

	<hr />

	<p>
		For more information about Flippin, check out the official <a
			href="https://github.com/flippin-dev/flippin">repository</a
		>.
	</p>
</Dialog>

<style>
	.tutorial-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	svg {
		width: 50px;
	}

	.tutorial-row > .tile {
		width: 65px;
	}

	.board {
		width: 225px;
	}

	.tile {
		border: 5px solid var(--color-border);
	}

	.tile.highlighted {
		border: 5px solid var(--color-selected);
	}
</style>
