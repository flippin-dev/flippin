# Flippin: Julia Stuff

## Overview

The files in this folder were written in [Julia](https://julialang.org/) using [Pluto](https://plutojl.org/) notebooks. For fully interactable code, try opening the `.jl` files with Pluto. `.html` equivalents are also provided that can be downloaded and opened in browser with less interactability. `.pdf` equivalents provided as well.

## Table of Contents

- [Tile Scrambler](#tile-scrambler)
- [Tile Matrix Util](#tile-matrix-util)
- [Light Chasing](#light-chasing)


## Tile Scrambler

[TileScrambler.jl](TileScrambler.jl)

The purpose of this notebook is to create a utility that takes a grid of tiles and permutes it based on the tile flipping rules of Flippin.

This is what I use to create the starting states for puzzles.

## Tile Matrix Util

[TileMatrixUtil.jl](TileMatrixUtil.jl)

The purpose of this notebook is to create a utility for finding the solvability of a Flippin puzzle.

The steps used largely follow the approach detailed [here](https://plzin.github.io/posts/linear-systems-mod-n) for solving a system of linear equations mod n.

This is what I used to create the matrix constants used when determining whether or not a user-defined puzzle is solvable.

## Light Chasing

[LightChasing.jl](LightChasing.jl)

The purpose of this notebook is to find the moves used for the [Light Chasing algorithm](https://en.wikipedia.org/wiki/Lights_Out_(game)#Light_chasing) in Flippin.

The table below contains the tiles that need to be pressed on the top row to solve for a bottom row configuration at that step in the Light Chasing algorithm. Any of the gambits from the results will work, but I chose the ones I thought would be easiest to remember.

| Bottom row offset | Press on top row |
| :---------------: | :--------------: |
| 1️⃣0️⃣2️⃣0️⃣1️⃣             | 0️⃣1️⃣0️⃣1️⃣0️⃣            |
| 2️⃣1️⃣1️⃣1️⃣2️⃣             | 0️⃣0️⃣1️⃣0️⃣0️⃣            |
| 2️⃣0️⃣1️⃣0️⃣2️⃣             | 0️⃣1️⃣0️⃣0️⃣0️⃣            |
| 1️⃣2️⃣2️⃣2️⃣1️⃣             | 1️⃣0️⃣0️⃣0️⃣0️⃣            |
| 0️⃣2️⃣0️⃣2️⃣0️⃣             | 1️⃣1️⃣0️⃣0️⃣0️⃣            |
| 0️⃣1️⃣0️⃣1️⃣0️⃣             | 0️⃣1️⃣1️⃣1️⃣0️⃣            |
| 1️⃣1️⃣2️⃣1️⃣1️⃣             | 0️⃣1️⃣1️⃣0️⃣0️⃣            |
| 2️⃣2️⃣1️⃣2️⃣2️⃣             | 1️⃣2️⃣0️⃣0️⃣0️⃣            |

__Note:__ The "Bottom row offset" column in the table means how many places ahead in the color cycle the bottom row of the current board is from the bottom row of the end board.

For the following last row configurations,

End board:

🟦🟦🟦🟦🟦

Current board:

🟩🟩🟥🟩🟩

you would use the result associated with 2️⃣2️⃣1️⃣2️⃣2️⃣ (i.e. 1️⃣2️⃣0️⃣0️⃣0️⃣).