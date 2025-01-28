# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2025-01-27

### Added

- Navigation buttons in freeplay mode to quickly change the puzzle.
- Random puzzle button next to freeplay puzzle select list.
- Button to start a random freeplay puzzle under daily puzzle recap details.
- Freeplay puzzle recap details.
- 42 new daily puzzles.

### Changed

- Updated README and ARCHITECTURE files with new freeplay info and images.
- Updated format of share message to include star next to move count for perfect games.

### Fixed

- Double tap triggering extra click on reset button.
- Custom puzzles requiring no moves to solve could be imported.
- Daily puzzle countdown link too large.
- Homepage redirect links missing part of path.
- Overscrolling refreshing page on some devices.
- Outlines of "Games Won" values on stats page applied in wrong order on some devices.
- First "Heart" daily puzzle renamed "Favorite" so that both "Heart" puzzles appear in freeplay.

## [1.2.0] - 2024-11-25

### Added

- 35 new daily puzzles.
- 1 new freeplay puzzle.
- Documentation on Light Chasing algorithm.
- PDF versions of all Julia files.
- Documentation on finding minimal solution.
- Hint feature.
- Surrender feature.
- Hint and surrender tracking.
- More daily puzzle recap details.
- ARCHITECTURE file.

### Changed

- Updated the names of 6 daily puzzles to better fit weekly theme.
- Updated .gitattributes file to have Linguist ignore Julia PDF pages in language calculations.
- Updated tutorial with hint and surrender info.
- Updated display style of bulleted items in lists.
- Overhauled README so that it's easier to digest.

### Fixed

- Sticky hover visual for reset button on touchscreen devices.
- Timer showing a time instead of a message when reloading a daily game after winning in more than 10 minutes.

## [1.1.0] - 2024-11-01

### Added

- CHANGELOG file.
- 21 new daily puzzles.
- Added .gitattributes file to have Linguist ignore Julia HTML pages in language calculations.
- Static error page for Github Pages to serve.
- Move count and reset count tracking.
- More verbose README sections on the various menus.

### Changed

- Updated .prettierignore to ignore Github files.
- Updated format of share message to include move count, reset count, and game URL.

### Fixed

- Missing reset icon in Safari browser (#4).

## [1.0.0] - 2024-10-28