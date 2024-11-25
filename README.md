# Flippin

Flip colorful tiles to match the image! Solve the daily puzzle or play old and custom puzzles in freeplay mode!

![Flippin main screen.](/img/main-screen.png "Flippin main screen")

Daily puzzles are updated at **midnight Eastern Time**.

Puzzle difficulty increases throughout the week:

- **Easy** - Monday, Tuesday
- **Medium** - Wednesday, Thursday, Friday
- **Hard** - Saturday, Sunday

## [🟥🟩🟦 Play Flippin here!](https://flippin-dev.github.io/flippin/)

### [📃 Changelog](CHANGELOG.md) | [🧬 Design](ARCHITECTURE.md) | [🐞 Bug Report](https://github.com/flippin-dev/flippin/issues/new?assignees=flippin-dev&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D) | [💡 Feature Suggestion](https://github.com/flippin-dev/flippin/issues/new?assignees=flippin-dev&labels=enhancement&projects=&template=feature_request.md&title=%5BSUGGESTION%5D) | [💬 Discussion](https://github.com/flippin-dev/flippin/discussions/new/choose) | [📑 License](LICENSE) | [🙏 Acknowledgments](/static/humans.txt)

---

## Table of Contents

- [Gameplay](#gameplay)
  - [Tips](#tips)
- [Local Storage](#local-storage)
- [Tutorial Menu](#tutorial-menu)
- [Settings Menu](#settings-menu)
  - [Dark Mode](#dark-mode)
  - [Color Themes](#color-themes)
  - [Freeplay Mode](#freeplay-mode)
  - [Reduced Motion](#reduced-motion)
  - [Storage Consent](#storage-consent)
- [Stats Menu](#stats-menu)
  - [Import/Export Stats](#importexport-stats)

## Gameplay

The goal of Flippin is to flip tiles on a starting board until they match a target end board. Press a tile to flip it and the surrounding tiles to the next color in the cycle.

Tiles follow a 3 color cycle when flipped: 🟥 -> 🟩 -> 🟦 -> 🟥

![Tiles flip in a cross-shaped pattern and follow color cycle.](/img/flipping.gif "Flip those tiles!")

Press the restart button if you get stuck and want to start over.

![Restart button is in the upper-right corner of the game area.](/img/reset.png "Restart")

Press the hint button if you want a hint.

![Hint button is in the lower-left corner of the game area.](/img/hint.png "Hint")

Press the surrender button if you want to give up. Surrendered daily puzzles will not count towards your stats!

![Surrender button is in the lower-right corner of the game area.](/img/surrender.png "Surrender")

### Tips

- The order in which you flip tiles to solve the puzzle does not matter.
- Try looking at surrounding tiles and see if they all need to be flipped to match the end board.
- If you make a move and want to undo it without resetting, press the tile 2 more times to undo it.
- Don't be afraid of resetting if you get stuck!
- For an algorithmic approach, check out the [Light Chasing algorithm](/julia/README.md#light-chasing)!

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

## Tutorial Menu

The tutorial menu can be opened by pressing the question mark icon above the game board.

Inside is a brief explanation of how to play Flippin as well as a link to this repository.

**Note:** The daily puzzle is paused while this menu is open.

## Settings Menu

The settings menu can be opened by pressing the gear icon above the game board.

Inside are various options for modifying the game including:
- Dark mode
- Color themes
- Freeplay mode
- Custom puzzles
- Reduced motion
- Storage consent

**Note:** The daily puzzle is paused while this menu is open.

### Dark Mode

Toggling on dark mode will change many colors used by the game to ones more suitable for a dark screen.

**Note:** This will not impact theme colors in any way. If you would like to change the color theme to another one you prefer for a dark screen, use a preexisting theme or import a custom theme.

### Color Themes

Color themes can be selected from a dropdown list. Default themes are listed under the **DEFAULT** heading while custom themes are listed under the **CUSTOM** heading.

![Colors change after selecting a new theme.](/img/theme-change.gif "Try a different theme")

Custom color themes can be added by clicking the **Import Custom Themes** button and following the instructions listed. They will then show up in the themes list after being imported. Some sample themes are provided to better demonstrate the expected import format.

![Theme import prompt can help you figure out the expected format.](/img/theme-import.png "A theme of my own")

Colors are provided in 6-digit hex code format (e.g. #e92f3f). Any colors can be used, but it is recommended to choose colors that look good in either light mode or dark mode and are visually distinct from each other.

Saved custom color themes can be exported by clicking the **Export Custom Themes** button and then clicking the **Copy Themes** button.

### Freeplay Mode

Toggling on freeplay mode will pause the daily puzzle and load the currently set freeplay puzzle. Toggling freeplay mode off returns to the saved daily puzzle.

Freeplay puzzles can be selected from a dropdown list. Past daily puzzles are listed under the **DAILY** heading while custom puzzles are listed under the **CUSTOM** heading. Selecting a new puzzle erases any progress on the current freeplay puzzle.

![Freeplay mode is good for practicing past puzzles.](/img/freeplay.png "More puzzles to play")

Time is not tracked in freeplay mode and there is no share button provided after winning. After winning in freeplay mode, the reset button remains enabled.

Stats are **NOT** impacted while in freeplay mode.

Custom puzzles can be added by clicking the **Import Custom Puzzles** button and following the instructions listed. They will then show up in the freeplay puzzles list after being imported. A sample puzzle is provided to better demonstrate the expected import format.

![Puzzle import prompt can help you figure out the expected format.](/img/puzzle-import.png "Can't wait for tomorrow")

A title, starting board state, and end board state must be provided for each puzzle. The board state values are provided as a string of 25 numbers (0, 1, or 2) read as the tile values left-to-right and row-by-row. The numbers 0, 1, and 2 represent the theme colors associated with each tile. For easier editing of the board states, try to first format them in a grid similar to how they would appear in the puzzle before making them match the expected format of the import prompt.

Saved custom puzzles can be exported by clicking the **Export Custom Puzzles** button and then clicking the **Copy Puzzles** button.

### Reduced Motion

Toggling on reduced motion will remove the tile flipping effect used when a tile is pressed and when a puzzle is completed. It will also remove the reveal effect for the share button and daily puzzle countdown timer.

### Storage Consent

Your current storage consent choice is listed here. By clicking the **Update Storage Consent** button, you will be presented with the local storage notice that shows when Flippin is first opened. Here you can change your storage consent choice if desired.

## Stats Menu

The stats menu can be opened by pressing the bar chart icon above the game board.

Inside is your historical game stats as well as option for importing and exporting them.

Games won, fastest game time, and fewest moves used to solve are tracked.

**Note:** The daily puzzle is paused while this menu is open.

### Import/Export Stats

Stats can be imported by clicking the **Import Stats** button and following the instructions listed. Sample stats are provided to better demonstrate the expected import format.

![Stats import prompt can help you figure out the expected format.](/img/stats-import.png "Track your games")

Saved stats can be exported by clicking the **Export Stats** button and then clicking the **Copy Stats** button.

---

_Made with [SvelteKit](https://kit.svelte.dev/)_
