# Flippin: Julia Stuff

## Overview

The files in this folder were written in [Julia](https://julialang.org/) using [Pluto](https://plutojl.org/) notebooks. For fully interactable code, try opening the `.jl` files with Pluto. `.html` equivalents are also provided that can be opened in browser with less interactability.

## Table of Contents

- [Tile Scrambler](#tile-scrambler)
- [Tile Matrix Util](#tile-matrix-util)


## Tile Scrambler

[TileScrambler.jl](TileScrambler.jl)

The purpose of this notebook is to create a utility that takes a grid of tiles and permutes it based on the tile flipping rules of Flippin.

This is what I use to create the starting states for puzzles.

## Tile Matrix Util

[TileMatrixUtil.jl](TileMatrixUtil.jl)

The purpose of this notebook is to create a utility for finding the solvability of a Flippin puzzle.

The steps used largely follow the approach detailed [here](https://plzin.github.io/posts/linear-systems-mod-n) for solving a system of linear equations mod n.

This is what I used to create the matrix constants used when determining whether or not a user-defined puzzle is solvable.