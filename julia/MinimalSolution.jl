### A Pluto.jl notebook ###
# v0.19.38

using Markdown
using InteractiveUtils

# ╔═╡ 091b1a10-50f7-11ef-20ae-27583309b911
begin
	using LinearAlgebra
end

# ╔═╡ ae1431ad-b2a4-40b7-9dd1-07b7bd676a94
md"""
# Minimal Solution
"""

# ╔═╡ f2aa234e-89dd-4c6e-b249-0af95e7f7075
md"""
The purpose of this notebook is to create a utility for finding the minimal solution of a Flippin puzzle (i.e. requires the fewest moves to solve).

This notebook expands on the results of the one describing how to find any solution to a Flippin puzzle if it exists. That notebook is found [here](https://github.com/flippin-dev/flippin/blob/main/julia/TileMatrixUtil.jl).
"""

# ╔═╡ 99cccd48-a664-492a-aa39-fb18d3f1b050
md"""
## Prerequisites
"""

# ╔═╡ 969033c8-0ac3-4b5f-9114-32ae27c16f30
md"""
Before doing anything, we will introduce the results from the notebook mentioned previously as constants.
"""

# ╔═╡ 68cd3319-4f02-425e-91cf-bdf9ba035b80
A = [
	1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0;
	1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0;
	0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0;
	0 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0;
	0 0 0 1 1 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0;
	1 0 0 0 0 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0;
	0 1 0 0 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0;
	0 0 1 0 0 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0;
	0 0 0 1 0 0 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0;
	0 0 0 0 1 0 0 0 1 1 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0;
	0 0 0 0 0 1 0 0 0 0 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0;
	0 0 0 0 0 0 1 0 0 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0;
	0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0;
	0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 0 0 1 0 0 0 0 0 0;
	0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 0 0 0 0 1 0 0 0 0 0;
	0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 1 0 0 0 1 0 0 0 0;
	0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 0 0 1 0 0 0;
	0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 0 0 1 0 0;
	0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 0 0 1 0;
	0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 0 0 0 0 1;
	0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 1 0 0 0;
	0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 0;
	0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 0;
	0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1;
	0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1;
]

# ╔═╡ 3aeeed01-32e9-4df9-9cc4-8a7a8d37643a
p = 3

# ╔═╡ feeee22d-3e6a-4299-a130-ba9fe7792766
md"""
## Steps
"""

# ╔═╡ 43e24968-99c0-462e-8732-94d754c16465
md"""
We start by defining the start state and end state for the puzzle we are trying to solve.
"""

# ╔═╡ c818d557-405e-4a8e-b828-aeda7b8ad753
startstate = [
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
	0;
]

# ╔═╡ 2118bcd3-dad1-472e-b725-7d60f4536459
endstate = [
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
	2;
]

# ╔═╡ bee44a99-af2b-45bd-857b-afbf9434b494
md"""
Now we need to consider the null space of ``A``. All the moves in the null space of ``A`` will result in no net change when applied to a board.

The nullity of ``A`` is 3 so we want to find 3 vectors in the null space of ``A`` that can form the basis for ``Null(A)``. The last 3 rows of the matrix ``S`` found in the other notebook will suffice.
"""

# ╔═╡ e6f09722-3e81-4cd1-a1c4-b51521a5ee12
md"""
Because ``v1``, ``v2``, and ``v3`` are in the null space of A, adding them (or any linear combination of them) to a solution will produce another valid solution.

Given a solution ``β``, there are 27 total solutions of the form ``β + c1v1 + c2v2 + c3v3 \pmod{3}`` where ``c1``, ``c2``, and ``c3`` are each either 0, 1, or 2.

Our approach will be to go through the 27 solutions and find the one that uses the fewest moves.
"""

# ╔═╡ 40656942-9faf-451e-b2cc-0b5db70601b7
md"""
The results below show the number of moves; coefficients for ``v1``, ``v2``, and ``v3``; and minimal solution for a given board.
"""

# ╔═╡ 72a6a65a-cc43-4fea-8fb7-02f5e903152a
md"""
# Notebook Functions
"""

# ╔═╡ f4086bda-633f-4f9d-9743-44bd9afce5c9
md"""
# Appendix
"""

# ╔═╡ 91cf2fb9-9248-4a23-9784-0223791c3258
"""
    swaprows!(M::AbstractMatrix, i::Int64, j::Int64)

Swap rows `i` and `j` in `matrix`.

# Examples
```julia-repl
julia> a = [0 0; 0 1]
julia> swaprows!(a, 1, 2)
julia> a
[0 1; 0 0]
```
"""
function swaprows!(M::AbstractMatrix, i::Int64, j::Int64)
	i == j && return
    rows = axes(M, 1)
    @boundscheck i in rows || throw(BoundsError(M, (:,i)))
    @boundscheck j in rows || throw(BoundsError(M, (:,j)))
    for k in axes(M, 2)
        @inbounds M[i, k] ,M[j, k] = M[j, k], M[i, k]
    end
end

# ╔═╡ ee27438e-d5c0-4cf2-a147-b10692f0acd6
"""
    swapcols!(M::AbstractMatrix, i::Int64, j::Int64)

Swap columns `i` and `j` in `matrix`.

# Examples
```julia-repl
julia> a = [0 0; 0 1]
julia> swapcols!(a, 1, 2)
julia> a
[0 0; 1 0]
```
"""
function swapcols!(M::AbstractMatrix, i::Int64, j::Int64)
	i == j && return
    cols = axes(M, 2)
    @boundscheck i in cols || throw(BoundsError(M, (:,i)))
    @boundscheck j in cols || throw(BoundsError(M, (:,j)))
    for k in axes(M, 1)
        @inbounds M[k, i], M[k, j] = M[k, j], M[k, i]
    end
end

# ╔═╡ a0eb691e-f1e4-48b3-b52a-fa1e6aa10d5b
"""
    scalerowmodp!(p::Int64, M::AbstractMatrix, s::Int64, row::Int64)

Scale row `row` in `matrix` by `s` and mod the operation by `p`.

# Examples
```julia-repl
julia> a = [0 0; 0 1]
julia> scalerowmodp!(3, a, 4, 2)
julia> a
[0 0; 0 1]
```
"""
function scalerowmodp!(p::Int64, M::AbstractMatrix, s::Int64, row::Int64)
	sm = mod(s, p)
	sm == 1 && return
	rows = axes(M, 1)
	@boundscheck row in rows || throw(BoundsError(M, (:, row)))
	for col in axes(M, 2)
		@inbounds M[row, col] = mod(M[row, col] * sm, p)
	end
end

# ╔═╡ 77f1e73e-a47d-4038-ba71-d3e75e5758d5
"""
    scalecolmodp!(p::Int64, M::AbstractMatrix, s::Int64, col::Int64)

Scale column `col` in `matrix` by `s` and mod the operation by `p`.

# Examples
```julia-repl
julia> a = [0 0; 0 1]
julia> scalecolmodp!(3, a, 4, 2)
julia> a
[0 0; 0 1]
```
"""
function scalecolmodp!(p::Int64, M::AbstractMatrix, s::Int64, col::Int64)
	sm = mod(s, p)
	sm == 1 && return
	cols = axes(M, 2)
	@boundscheck col in cols || throw(BoundsError(M, (:, col)))
	for row in axes(M, 1)
		@inbounds M[row, col] = mod(M[row, col] * sm, p)
	end
end

# ╔═╡ 5045dde2-9b01-416d-94c3-86b6f9f63673
"""
    subtractrowmodp!(p::Int64, M::AbstractMatrix, j::Int64, i::Int64, s::Int64=1)

Subtract row `i` in `matrix` from row `j` in `matrix` after scaling `i` by `s` and mod the operation by `p`.

# Examples
```julia-repl
julia> a = [0 0; 0 1]
julia> subtractrowmodp!(3, a, 1, 2, 2)
julia> a
[0 1; 0 1]
```
"""
function subtractrowmodp!(p::Int64, M::AbstractMatrix, j::Int64, i::Int64, s::Int64=1)
	sm = mod(s, p)
	sm == 0 && return
	rows = axes(M, 1)
	@boundscheck i in rows || throw(BoundsError(M, (:,i)))
    @boundscheck j in rows || throw(BoundsError(M, (:,j)))
	for k in axes(M, 2)
		@inbounds M[j, k] = mod(M[j, k] - (sm * M[i, k]), p)
	end
end

# ╔═╡ 1ac33725-f840-44a9-8b01-490ba91be138
"""
    subtractcolmodp!(p::Int64, M::AbstractMatrix, j::Int64, i::Int64, s::Int64=1)

Subtract column `i` in `matrix` from column `j` in `matrix` after scaling `i` by `s` and mod the operation by `p`.

# Examples
```julia-repl
julia> a = [0 0; 0 1]
julia> subtractcolmodp!(3, a, 1, 2, 2)
julia> a
[0 0; 1 1]
```
"""
function subtractcolmodp!(p::Int64, M::AbstractMatrix, j::Int64, i::Int64, s::Int64=1)
	sm = mod(s, p)
	sm == 0 && return
	cols = axes(M, 2)
	@boundscheck i in cols || throw(BoundsError(M, (:,i)))
    @boundscheck j in cols || throw(BoundsError(M, (:,j)))
	for k in axes(M, 1)
		@inbounds M[k, j] = mod(M[k, j] - (sm * M[k, i]), p)
	end
end

# ╔═╡ 1945e70f-6f06-4455-b752-3aa0ab5bec42
"""
    finddiagonalmodp(p::Int64, M::AbstractMatrix)

Given matrix `M`, find a diagonal matrix ``D`` and invertible matrices ``S`` and ``T`` such that ``D\\equiv SMT \\pmod{p}``. `p` should be a prime number to ensure appropriate results.

# Examples
```julia-repl
julia> a = [1 1; 1 1]
julia> finddiagonalmodp(3, a)
julia> a
[[1 0; 0 0], [1 0; 2 1], [1 2; 0 1]]
```
"""
function finddiagonalmodp(p::Int64, M::AbstractMatrix)
	A = copy(M) .% p
	dim = size(A, 1)
	S = Matrix{Int64}(I, dim, dim)
	T = Matrix{Int64}(I, dim, dim)

	# Loop for each value on the main diagonal
	for d in 1:dim
		pivotcol = 0

		# Find a column that has a value in row d
		for col in d:dim
			if A[d, col] != 0
				pivotcol = col
				break
			end
		end

		# Skip if no column has a non-zero value in row d
		if pivotcol == 0
			continue
		end

		# Swap pivotcol with column d if different
		if pivotcol != d
			swapcols!(A, d, pivotcol)
			swapcols!(T, d, pivotcol)
			# Now d is the pivot column
		end

		# Scale pivot column so that value in row d is 1
		if A[d, d] != 1
			s = invmod(A[d, d], p)
			scalecolmodp!(p, A, s, d)
			scalecolmodp!(p, T, s, d)
		end

		# Clear out row value in non-pivot columns
		for col in (d + 1):dim
			s = A[d, col]
			
			# Skip columns where row value is 0
			if s == 0
				continue
			end

			# Subtract the scaled pivot column to clear row value
			subtractcolmodp!(p, A, col, d, s)
			subtractcolmodp!(p, T, col, d, s)
		end

		# Clear out column value in non-pivot rows
		for row in (d + 1):dim
			s = A[row, d]

			# Skip rows where column value is 0
			if s == 0
				continue
			end

			# Subtract the scaled pivot row to clear column value
			subtractrowmodp!(p, A, row, d, s)
			subtractrowmodp!(p, S, row, d, s)
		end
	end
	
	D = (S * M * T) .% p
	return [D, S, T]
end

# ╔═╡ b63edb75-a4ba-41f4-9559-9f5cb1ba578c
D, S, T = finddiagonalmodp(p, A)

# ╔═╡ c99664dd-2c4b-4ace-97b8-32adbb99ab9e
S

# ╔═╡ 026c741f-7dc1-4701-9732-290da467b33c
v1 = S[23, :]

# ╔═╡ 8ae5fe63-d196-4a0e-bcf0-739a64bff205
v2 = S[24, :]

# ╔═╡ 36d9143d-94b6-4820-bc54-11ad5bc50e99
v3 = S[25, :]

# ╔═╡ 5f21cc6c-cdb3-4f3a-b943-b131fc75eab2
function findsolution(startstate, endstate)
	b = mod.(endstate - startstate, p)
	sb = (S * b) .% p
	xm = (D * sb) .% p
	x = (T * xm) .% p

	if (A * x) .% p == b
		return x
	else
		return nothing
	end
end

# ╔═╡ 07a6131a-245a-477f-9014-f747219d094b
function findminimalsolution(startstate, endstate)
	β = findsolution(startstate, endstate)
	solution = β

	if isnothing(β)
		return nothing
	else
		coefficients = [0, 0, 0]
		fewestmoves = sum(β)

		for i in 1:26
			c1, c2, c3 = parse.(Int, collect(string(i, base=3, pad=3)))
			potentialsolution = (β + (c1 * v1) + (c2 * v2) + (c3 * v3)) .% 3
			movecount = sum(potentialsolution)

			if movecount < fewestmoves
				fewestmoves = movecount
				coefficients = [c1, c2, c3]
				solution = potentialsolution
			end
		end

		return [fewestmoves, coefficients, solution]
	end
end

# ╔═╡ 9d7df5e4-f627-4ba0-a3a4-ce19071ac85a
findminimalsolution(startstate, endstate)

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
LinearAlgebra = "37e2e46d-f89d-539d-b4ee-838fcccc9c8e"
"""

# ╔═╡ 00000000-0000-0000-0000-000000000002
PLUTO_MANIFEST_TOML_CONTENTS = """
# This file is machine-generated - editing it directly is not advised

julia_version = "1.9.3"
manifest_format = "2.0"
project_hash = "ac1187e548c6ab173ac57d4e72da1620216bce54"

[[deps.Artifacts]]
uuid = "56f22d72-fd6d-98f1-02f0-08ddc0907c33"

[[deps.CompilerSupportLibraries_jll]]
deps = ["Artifacts", "Libdl"]
uuid = "e66e0078-7015-5450-92f7-15fbd957f2ae"
version = "1.0.5+0"

[[deps.Libdl]]
uuid = "8f399da3-3557-5675-b5ff-fb832c97cbdb"

[[deps.LinearAlgebra]]
deps = ["Libdl", "OpenBLAS_jll", "libblastrampoline_jll"]
uuid = "37e2e46d-f89d-539d-b4ee-838fcccc9c8e"

[[deps.OpenBLAS_jll]]
deps = ["Artifacts", "CompilerSupportLibraries_jll", "Libdl"]
uuid = "4536629a-c528-5b80-bd46-f80d51c5b363"
version = "0.3.21+4"

[[deps.libblastrampoline_jll]]
deps = ["Artifacts", "Libdl"]
uuid = "8e850b90-86db-534c-a0d3-1478176c7d93"
version = "5.8.0+0"
"""

# ╔═╡ Cell order:
# ╠═091b1a10-50f7-11ef-20ae-27583309b911
# ╟─ae1431ad-b2a4-40b7-9dd1-07b7bd676a94
# ╟─f2aa234e-89dd-4c6e-b249-0af95e7f7075
# ╟─99cccd48-a664-492a-aa39-fb18d3f1b050
# ╟─969033c8-0ac3-4b5f-9114-32ae27c16f30
# ╠═68cd3319-4f02-425e-91cf-bdf9ba035b80
# ╠═3aeeed01-32e9-4df9-9cc4-8a7a8d37643a
# ╠═b63edb75-a4ba-41f4-9559-9f5cb1ba578c
# ╟─feeee22d-3e6a-4299-a130-ba9fe7792766
# ╟─43e24968-99c0-462e-8732-94d754c16465
# ╠═c818d557-405e-4a8e-b828-aeda7b8ad753
# ╠═2118bcd3-dad1-472e-b725-7d60f4536459
# ╟─bee44a99-af2b-45bd-857b-afbf9434b494
# ╠═c99664dd-2c4b-4ace-97b8-32adbb99ab9e
# ╠═026c741f-7dc1-4701-9732-290da467b33c
# ╠═8ae5fe63-d196-4a0e-bcf0-739a64bff205
# ╠═36d9143d-94b6-4820-bc54-11ad5bc50e99
# ╟─e6f09722-3e81-4cd1-a1c4-b51521a5ee12
# ╟─40656942-9faf-451e-b2cc-0b5db70601b7
# ╠═9d7df5e4-f627-4ba0-a3a4-ce19071ac85a
# ╟─72a6a65a-cc43-4fea-8fb7-02f5e903152a
# ╠═5f21cc6c-cdb3-4f3a-b943-b131fc75eab2
# ╠═07a6131a-245a-477f-9014-f747219d094b
# ╟─f4086bda-633f-4f9d-9743-44bd9afce5c9
# ╠═91cf2fb9-9248-4a23-9784-0223791c3258
# ╠═ee27438e-d5c0-4cf2-a147-b10692f0acd6
# ╠═a0eb691e-f1e4-48b3-b52a-fa1e6aa10d5b
# ╠═77f1e73e-a47d-4038-ba71-d3e75e5758d5
# ╠═5045dde2-9b01-416d-94c3-86b6f9f63673
# ╠═1ac33725-f840-44a9-8b01-490ba91be138
# ╠═1945e70f-6f06-4455-b752-3aa0ab5bec42
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
