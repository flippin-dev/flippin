# Flippin: Design

## Overview

The purpose of this document is to cover the background, guiding design considerations, and structure of the Flippin project.

Flippin was designed as a daily game I could share with family and friends for mutual enjoyment. While the list of daily games we were playing was large and diverse, I wanted to make one that was simple in premise, tactile, and beautiful (results may vary). Most of the games we were playing were word or letter based so I wanted to do something more visual/artsy. I remembered playing similar sorts of tile-based puzzles in the past that seemed like they would be a good fit (I learned about [Lights Out](https://en.wikipedia.org/wiki/Lights_Out_%28game%29) much later in the development process which was probably inspiration for many of those puzzles). With a direction in mind, I looked at existing projects (daily games or otherwise) and frameworks I could use to make the game I had in mind. I eventually landed on [Svelte](https://kit.svelte.dev/) and got to work.

## Table of Contents

- [Game Design](#game-design)
- [Puzzle Considerations](#puzzle-considerations)
- [UI](#ui)
- [User Data](#user-data)
- [Accessibility](#accessibility)
- [Code Structure](#code-structure)
  - [Components](#components)
  - [Utility](#utility)
  - [Other](#other)
- [Math Stuff](#math-stuff)
- [Changes](#changes)
- [Contributing](#contributing)
- [Inspiration and Acknowledgments](#inspiration-and-acknowledgments)

## Game Design

Of the similar puzzles I had played in the past, I would say that most followed the formula of having two states for the cells (i.e. on/off) and had a goal of making all cells have the same state. I'm sure there were exceptions with different board layouts or different ways to show states or more than two states (although I don't think I ever personally played any with more than three) or different end goals or different move footprints, but the underlying design was the same. Flippin plays with three states, a 5x5 board, a cross-shaped move pattern that does not wrap around the edges of the board, and the goal of recreating a picture. Each of these design decisions is explained in the table below.

| Feature | Reasoning |
| --- | --- |
| States | The number of states used wasn't too hard to come to. Two felt too limiting on the art front and four felt too complex on the gameplay front, so I split the difference. The amount of distinct artworks you can represent with three states versus two states is huge (especially when your art skills are limited). I also believe it is (arguably) still fairly reasonable for the average person to keep track of a looping 3-element cycle whereas I thought a 4-element cycle would turn people off as too complex. That isn't to say using three states *isn't* complex (there are plenty of puzzles that still take me a while to solve), but it remains doable and more importantly *believably* doable to a player. There are also some math considerations behind the decision to use three states (check out this [notebook](/julia/TileMatrixUtil.jl) for more info), but they are more of an added bonus than a driving reason.<br><br>The choice to represent states as colorful tiles that need to be flipped was also pretty easy to land on. Tile-based images are easy to represent in a share message (see [Wordle](https://www.nytimes.com/games/wordle)) due to the wide availability of square emojis. Having three states also made the popular RGB color triplet an obvious choice for the colors to use. Tiles and flipping seemed like a natural noun-verb combo based on physical tile games I had played (plus a rotating animation is not very hard to program). |
| Board | A 5x5 board seemed like the best fit for Flippin. A square board is a good frame for the pictures, can be easily placed anywhere on a page, and looks clean in a share message. A width/height of five tiles is large enough to have some details in the pictures (and a visible center) while also being small enough that the tiles won't appear tiny on a mobile screen. It's also small enough that the game shouldn't feel impossibly complex to players. |
| Move pattern | The cross-shaped move pattern felt the most consistent with what I had seen in other versions of this puzzle genre. It also paired well with my idea for the tiles flipping when pressed as it's analagous to a ripple/shockwave emanating from the pressed tile. The decision to stop the move on the edges of the board (instead of having the game played on a torus or something similar) was done for simplicity's sake (both in a gameplay and programming sense). |
| End goal | I think that having the end goal be matching a picture rather than making the board one color makes the game much more interesting. It gives me the ability to add some more character to the puzzles through the artwork. From a daily game standpoint, this is nice as it adds variety. From a puzzle design standpoint, this is nice as it means I need to worry *less* about variety in the puzzles themselves. What I mean by that is that I could have two puzzles with identical moves to solve but different pictures and the majority of players probably won't notice that they're essentially solving a puzzle they've already done before. The picture itself becomes an enjoyable aspect of the puzzle beyond the physical solving of it. The best part is that this approach adds no new major mathematical complexity (see the small operation with the start and end vectors shown [here](/julia/TileMatrixUtil.jl) when defining `b` before solving). The approaches to solutions are still the same and any findings that apply to other variants of this puzzle genre apply here as well. All that's being done is morphing the solution into a form that's more visually interesting than a solid color. Many of these puzzles wouldn't even be solvable on a one-color style board (due to the move pattern restricting what board variants you can reach through tile presses alone). This has the added benefit of making the game seem more expansive than other variants in the genre. |

## Puzzle Considerations

Puzzles are designed in one-week intervals around a theme or some other unifying concept. I find it easier to come up with puzzle ideas in chunks like this. I try to keep the pictures distinct where possible to avoid a feeling of repetition. Due to the limited space and palette, the puzzle title also ends up doing a lot to help players visualize the picture. The themes and pictures should be appropriate for a large audience.

Puzzles increase in difficulty throughout the week. Difficulty here just means the number of moves required to solve the puzzle.

## UI

The goal of the UI design was to make it clean, easy-to-navigate, and mobile-friendly. The icons and information presented on the main screen are meant to be minimal so as not to distract from the game itself. All buttons and tiles should be large enough to press on small screens (i.e. mobile). Most colored UI elements are tied to the central color theme for a unified look. Screen elements follow a vertical layout that works for both desktop and mobile devices.

## User Data

The guiding principle for tracking user data is to make that an opt-in feature rather than a requirement. Flippin can optionally use players' device's local storage to keep track of the following information:

- Daily game progress
- Historical game stats
- Color theme selection
- Dark mode selection
- Reduced motion selection
- Custom color theme additions
- Custom puzzle additions

Local storage use is **not** required to play Flippin, but the data listed above will not be preserved if the game is refreshed or closed. The local storage consent decision can be updated at any time through the settings menu. Because this action has potential for lasting consequences (e.g. lost custom data and stats), a multi-phase approval is used.

Local storage is handled through the use of a custom Svelte store/controller implementation. The controller checks if a flag has been set on your device on page load. If that flag is set to `true`, local storage is allowed and the relevant data in memory is persisted to storage. If that flag is not present, local storage is not allowed, relevant data will only be stored in memory, and existing data in local storage (whether manually set by a user or some holdover from a previous session) will be wiped.

Dark mode and reduced motion are special exceptions to the usual local storage pattern. Dark mode defaults to `true`. I have it set up this way because the page takes a second to apply the appropriate theme and a flash of a dark theme when a light one is expected is much less jarring than the converse. Reduced motion is set up to initially defer to the device's default setting via a media query. That setting can then be manually adjusted in the game and the locally stored value will then be used on the next load.

I try to limit the data that's stored locally where possible. All locally storable data is capable of being initialized through user input besides the current daily game stats. This means that it's not very difficult to migrate player information between devices with a few copies/pastes. Daily games *can* technically be played multiple times outside of freeplay mode if local storage is not allowed. This is because when you refresh or open Flippin without local storage you are assumed to be playing for the first time.

## Accessibility

I have tried to make Flippin accessible to the best of my abilities. Things like color contrast, text size, and duration of toast messages have been considered. I have tried to organize screen elements in ways that make sense to both players and screen readers. Keyboard alternatives to navigation are also available where I felt it made sense to do so. There is a reduced motion option for users with motion sensitivity. There are various alternative color themes (as well as the ability to add custom ones) for both style and accessibility purposes.

## Code Structure

The general structure of the Flippin project is a split between Svelte components and TypeScript utility files. Communication between components is handled by Svelte stores. `+layout.svelte` and `+page.svelte` are the main files for page structure and then have secondary components included in them. The tables below describe some key files in the codebase.

### Components

| File | Description |
| --- | --- |
| [Controls.svelte](/src/components/Controls.svelte) | The `Controls` component contains the set of buttons (how to play, settings, stats, and reset) as well as the timer above the game board. The timer is handled separately in the `Timer` component. The buttons here are keyboard navigable using the arrow keys and wrap around once either end is reached. |
| [Countdown.svelte](/src/components/Countdown.svelte) | The `Countdown` component contains the countdown timer displayed once a puzzle is solved. This timer shows the amount of time remaining until the next daily puzzle or a message once that timer expires. |
| [Dialog.svelte](/src/components/Dialog.svelte) | The `Dialog` component acts as a general abstraction for UI elements that should be presented in a dialog box. This includes informational panels (e.g. the tutorial) as well as confirmations. The game timer should be paused while a dialog is open and the background elements shound be inactive. Normal dialogs can be closed by clicking the button in the upper-right corner, clicking outside the main dialog area, or by pressing the `Escape` key. Confirmation dialogs can be closed by completing the confirmation. |
| [ExtraControls.svelte](/src/components/ExtraControls.svelte) | The `ExtraControls` component contains the set of buttons (hint and surrender) below the game board. The buttons here are keyboard navigable using the arrow keys and wrap around once either end is reached. |
| [GameOverBlock.svelte](/src/components/GameOverBlock.svelte) | The `GameOverBlock` component contains post-game information including game stats (daily only), the daily puzzle countdown (handled in the `Countdown` component), and the share results button (daily only). This component appears on game completion after a flipping animation (unless reduced motion is enabled). The message presented after completing a daily puzzle varies depending on game stats. |
| [Settings.svelte](/src/components/Settings.svelte) | The `Settings` component is a dialog box that contains various game settings including dark mode, color theme, custom color themes, freeplay mode, custom puzzles, reduced motion, and local storage consent. This component is rather large and contains a lot of logic for the options and their subsections. The custom data sections provide both an import feature for bringing in new data as well as an export feature for copying current values. The import prompt automatically verifies the data before allowing it to be imported. The local storage consent section allows a user to update their storage decision and opens in a new confirmation dialog (handled in the `StorageConsent` component). |
| [Stats.svelte](/src/components/Stats.svelte) | The `Stats` component is a dialog box that contains a visual representation of historical game stats as well as a section to import and export that data. The import prompt automatically verifies the data before allowing it to be imported. The visual display is synced with the theme colors. |
| [StorageConsent.svelte](/src/components/StorageConsent.svelte) | The `StorageConsent` component is a confirmation dialog box that presents users with information regarding locally stored data and allows them to opt in or opt out of that feature. This component is displayed on the initial play of the game (and subsequent ones if the user opts out of local storage) as well as when it is manually opened through the setting menu (handled in the `Settings` component). |
| [SurrenderConsent.svelte](/src/components/SurrenderConsent.svelte) | The `SurrenderConsent` component is a confirmation dialog box that allows users to give up on a puzzle. This component is displayed when the surrender button is pressed (handled in the `ExtraControls` component). |
| [Timer.svelte](/src/components/Timer.svelte) | The `Timer` component contains the game timer used for daily puzzles. This timer should stop when a dialog box is open and continue once the game board is available again. The timer also stops on puzzle completion. The timer will resume from where it left off if a user goes from freeplay mode back to daily mode as well as on page load (if local storage is turned on). Once the time "limit" is reached, a message is displayed instead of a time and the timer will no longer update. |
| [Title.svelte](/src/components/Title.svelte) | The `Title` component contains the Flippin logo (synced with the theme colors) as well as the puzzle title (and game number in daily mode). |
| [Tutorial.svelte](/src/components/Tutorial.svelte) | The `Tutorial` component is a dialog box containing information on how to play Flippin. This component is displayed on page load (displayed after the `StorageConsent` component if applicable). A link to the code repository is also provided at the bottom of the component. |

### Utility

| File | Description |
| --- | --- |
| [game.ts](/src/lib/game.ts) | The `game` file contains logic for managing game state in Flippin. This includes logic for handling tile presses as well as serializing game state information. |
| [math.ts](/src/lib/math.ts) | The `math` file contains logic for applying the modulo operation to numbers and vectors, checking puzzle solvability, and finding the minimal solution for puzzles. See the [Math Stuff](#math-stuff) section for a link to the Julia files where the constants used here are derived. |
| [page-utilities.ts](/src/lib/page-utilities.ts) | The `page-utilities` file contains functions to augment page navigation and accessibility. This includes logic for handling toast messages (the visual display as well as the hidden alert for screen readers) as well as better keyboard navigation in the UI. |
| [puzzles.ts](/src/lib/puzzles.ts) | The `puzzles` file contains definitions for all the daily puzzles as well as for the default freeplay puzzles. |
| [stats.ts](/src/lib/stats.ts) | The `stats` file contains type definitions for daily game details and historical stats. |
| [store-utilities.ts](/src/lib/store-utilities.ts) | The `store-utilities` file contains logic for the custom Svelte stores used to handle local storage of data. |
| [themes.ts](/src/lib/themes.ts) | The `themes` file contains definitions for all the default color themes as well as logic for updating the theme colors on the page. |
| [time.ts](/src/lib/time.ts) | The `time` file contains constants related to time (e.g. timezone information) as well as logic to determine which daily puzzle should be used. |

### Other

| File | Description |
| --- | --- |
| [+error.svelte](/src/routes/+error.svelte) | This file describes the page that should be displayed if an error occurs. |
| [+layout.svelte](/src/routes/+layout.svelte) | This file describes the encompassing layout for the main game page. The script here contains logic for updating the color theme, updating dark mode, and setting reduced motion on the first play. The layout for the toast container, alert box, and all dialogs are defined here. |
| [+page.svelte](/src/routes/+page.svelte) | This file describes the main game page of Flippin. All non-dialog components are outlined here. The game board and game logic are also defined here. The main game board is keyboard navigable using the arrow keys and wraps around in both the horizontal and vertical directions. |
| [app.html](/src/app.html) | This file contains all the meta tags for the page. |
| [service-worker.ts](/src/service-worker.ts) | This file contains the service worker definition used to enable PWA functionality (i.e. allows Flippin to be downloaded as a standalone application from supporting browsers). |
| [stores.ts](/src/stores/stores.ts) | This file contains the Svelte stores used to communicate between components. |
| [styles.css](/src/routes/styles.css) | This file contains CSS variable declarations as well as general style information for UI components. More detailed style information is included in some components to override or enhance what's defined here. |

## Math Stuff

For more details on the puzzle creation process, solvability, and other math stuff, look in the [Julia folder](/julia/README.md) of this repository.

## Changes

All notable changes to this project will be documented in the [CHANGELOG](CHANGELOG.md) file. The file lists the newest changes first and older changes under them. Unreleased changes are listed at the top of the file.

Before changes get merged into the main branch, I make a feature specific branch (prefixed with something meaningful like `feature/` or `bugfix/` or `doc/`) to work on. I manually test the changes for a bit in my browser (Firefox via `npm run dev` command). Firefox provides a responsive design mode as well so I can see what the changes will probably look and behave like on mobile devices (not foolproof but it helps for sanity). Once I'm happy with the changes, I make sure they match the style of the codebase (`npm run format` and `npm run lint`). Then, I adjust the automated tests as needed and run them (`npm run test`). These test cases are not comprehensive, but they provide some smoke testing so that I can hopefully catch any breaking bugs. Next, I run the commands `npm run build` and `npm run preview` to make sure the project builds properly. If everything looks good, I update the unreleased changes section of the changelog and merge the feature branch into the staging branch. Once there are enough changes in the staging branch, I prepare to merge them into the main branch. I update the version info in the relevant locations of the codebase including the unreleased section of the changelog. I open a pull request with a description of the changes in the notes and merge the changes. An automated build pipeline takes over once changes are made to the main branch and deploys the new code to production.

## Contributing

Flippin is a personal project I created as a way to explore the daily game concept and share my work with family and friends. As such, I'm not *currently* looking for or expecting major contributions from other people. Anyone is free to fork the repository and explore the codebase, but they'll need to figure out how to set it up on their personal devices. With that being said, I am very open to bug reports, feature suggestions, and general discussions about Flippin. Below are some links for those:

- [🐞 Bug Report](https://github.com/flippin-dev/flippin/issues/new?assignees=flippin-dev&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D)
- [💡 Feature Suggestion](https://github.com/flippin-dev/flippin/issues/new?assignees=flippin-dev&labels=enhancement&projects=&template=feature_request.md&title=%5BSUGGESTION%5D)
- [💬 Discussion](https://github.com/flippin-dev/flippin/discussions/new/choose)

## Inspiration and Acknowledgments

For more details on the inspiration behind Flippin as well as some acknowledgments, look at the [humans.txt file](/static/humans.txt).