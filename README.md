# Flippin

Flip colorful tiles to match the image! Solve the daily puzzle or play old and custom puzzles in freeplay mode!

Daily puzzles are updated at **midnight Eastern Time**.

Puzzle difficulty increases throughout the week:

- **Easy** - Monday, Tuesday
- **Medium** - Wednesday, Thursday, Friday
- **Hard** - Saturday, Sunday

## [🟦 Play here]({https://flippin-dev.github.io/flippin/)

## Gameplay

- The goal of Flippin is to flip tiles on a starting board until they match a target end board.
- Press a tile to flip it and the surrounding tiles to the next color in the cycle.
- Tiles follow a 3 color cycle when flipped: 🟥 -> 🟩 -> 🟦 -> 🟥
- Press the restart button if you get stuck and want to start over.

## Tips

- If you make a move and want to undo it without resetting, press the tile 2 more times to undo it.
- Try looking at surrounding tiles and see if they all need to be flipped to match the end board.
- The order in which you flip tiles to solve the puzzle does not matter.
- If the flipping animations are intrusive, they can be disabled from the settings menu.

## Custom Themes

Custom color themes can be added through a prompt in the settings menu. They will then show up in the themes list also found in the settings menu. Colors are provided in 6-digit hex code format (e.g. #e92f3f). Any colors can be used, but it is recommended to choose colors that look good in either light mode or dark mode and are visually distinct from each other.

## Custom Puzzles

Custom puzzles can be added through a prompt in the settings menu. They will then show up in the freeplay puzzles list also found in the settings menu. A title, starting board state, and end board state must be provided for each puzzle. The board state values are provided as a string of 25 numbers (0, 1, or 2) read as the tile values left-to-right and row-by-row. The numbers 0, 1, and 2 represent the theme colors associated with each tile. For easier editing of the board states, try to first format them in a grid similar to how they would appear in the puzzle before making them match the expected format of the import prompt.

## Local Storage

Flippin can optionally use your device's local storage to keep track of the following information:

- Daily game progress
- Historical game stats
- Color theme selection
- Dark mode selection
- Reduced motion selection
- Custom color theme additions
- Custom puzzle additions

Local storage use is **not** required to play Flippin, but the data listed above will not be preserved if you refresh or close the game.

Your local storage consent decision can be updated at any time through the settings menu.

## Math Stuff

For more details on the puzzle creation process and how solvability is checked, look in the [julia folder](/julia/README.md) of this repository.

## Inspiration and Acknowledgments

For more details on the inspiration behind Flippin as well as some acknowledgments, look at the [humans.txt file](/static/humans.txt).

---

_Made with [SvelteKit](https://kit.svelte.dev/)_
