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
# Tile Matrix Util
"""

# ╔═╡ f2aa234e-89dd-4c6e-b249-0af95e7f7075
md"""
The purpose of this notebook is to create a utility for finding the solvability of a Flippin puzzle.

The steps used largely follow the approach detailed [here](https://plzin.github.io/posts/linear-systems-mod-n) for solving a system of linear equations mod n.
"""

# ╔═╡ feeee22d-3e6a-4299-a130-ba9fe7792766
md"""
## Steps
"""

# ╔═╡ 135b3e2e-f854-4590-a90d-dfaf0a49e940
md"""
We start by defining a ``25\times 25`` matrix representing the ruleset of Flippin. Values of this matrix are elements of ``\mathbb{Z}_{3}``. In other words, they can hold the values ``0``, ``1``, or ``2`` as there are 3 possible color states for tiles and values wrap back around.

Each row of the matrix holds coefficients for an equation defining the current value of a tile on the board. The variables in those equations represent the number of actions taken on the corresponding tile. The first row of the matrix represents the value of the leftmost tile of the first row of the board. The sixth row of the matrix represents the value of the leftmost tile of the second row of the board. Columns of the matrix similarly enumerate tiles in the board moving left-to-right and row-by-row.

Taking the first row of the matrix as an example, the values in columns 1, 2, and 6 mean that the value of this upper leftmost tile of the board can be impacted by itself and the tiles directly to the right of it and below it. The coefficients are all ``1`` because every action on one of those tiles advances the state of this tile by 1.
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

# ╔═╡ b5e88cb3-9bb0-4d21-98a5-7a89cac6f388
md"""
Here we define the modulus for the calculations. The fact that this value is prime makes life a lot easier because it means that every value we will see in the matrix will have a corresponding (and easy to find) multiplicative inverse in ``\mathbb{Z}_{3}``.
"""

# ╔═╡ 3aeeed01-32e9-4df9-9cc4-8a7a8d37643a
p = 3

# ╔═╡ a150cfc5-2978-4561-8d0d-5d95bae3fb87
md"""
Given our ruleset matrix ``A``, the approach here is to find a diagonal matrix ``D`` and invertible matrices ``S`` and ``T`` such that ``D = SAT``. This will then allow us to confirm if a given starting board state can reach a given end board state.
"""

# ╔═╡ 992da7fc-5a1a-421e-b74f-4ee9570ee9c5
md"""
Do a quick sanity check here.
"""

# ╔═╡ 43e24968-99c0-462e-8732-94d754c16465
md"""
Now that we have the matrices, let's use them to solve our problem!

The linear system we are trying to solve looks like ``Ax\equiv b \pmod{3}`` where ``A`` is the ruleset matrix, ``x`` is the column vector that "*solves*" the system, and ``b`` is the column vector representing the desired end state of the board. Not every end state has a solution so we will have to plug any ``x`` values we find back into the equation to confirm that they work. There may also exist other solutions that solve the puzzle in fewer steps.

It is important to note that we cannot just plug any end state into the equation unless the start state is a column vector full of zeros. This is because the solution method assumes that we are starting from such a start state. In order to right this issue, we can take the difference of our desired end state and desired start state (mod 3 of course) and then use **that** as the value of ``b``.
"""

# ╔═╡ c818d557-405e-4a8e-b828-aeda7b8ad753
startstate = [
	0;
	2;
	2;
	1;
	0;
	2;
	2;
	1;
	1;
	1;
	1;
	2;
	0;
	0;
	1;
	0;
	1;
	1;
	1;
	2;
	2;
	0;
	1;
	0;
	0;
]

# ╔═╡ 2118bcd3-dad1-472e-b725-7d60f4536459
endstate = [
	2;
	1;
	2;
	1;
	2;
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
	2;
	0;
	0;
	0;
	2;
	2;
	2;
	0;
	2;
	2;
]

# ╔═╡ bee44a99-af2b-45bd-857b-afbf9434b494
md"""
Below we find the value of ``x`` using a series of substitions and matrix multiplications.

The [blog post](https://plzin.github.io/posts/linear-systems-mod-n) mentioned above does a good job of explaining the solution logic and I would highly recommend giving it a read.

Of note, I ensure that the values on the main diagonal of ``D`` are at most ``1`` to allow me to just mutilpy ``Sb`` by ``D`` to find `xm` (``x'`` in the blog post).
"""

# ╔═╡ 417b0837-b7e0-4240-9131-0a2c8a578d20
b = mod.(endstate - startstate, p)

# ╔═╡ 7ed5e73e-8436-4d48-b522-f0f8b3e19ede
md"""
Confirm that the found solution works.
"""

# ╔═╡ ad82643d-8214-433c-b877-6fca4a05721d
md"""
Now that we have a method for finding solutions, I wanted to be able to apply it easily in JavaScript.

In Julia, the column vector and matrix operations are fine (because the language is designed around doing mathy stuff), but basic JavaScript is not so well-equipped. The **basic** part is important because I do not want to download a bulky library for essentially a simple one-off action.

Using row vectors (essentially JavaScript arrays) seemed like it would be the easiest way to implement this solution but did require some adjustments to the matrices. Namely, I transposed the matrices and rearranged the equations to use left multiplication.
"""

# ╔═╡ 40656942-9faf-451e-b2cc-0b5db70601b7
md"""
Below are the transposed matrices I copied into my JavaScript code.
"""

# ╔═╡ 99c9da5d-3e84-45b1-ab3a-dfe4a6c568e6
println(A')

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

# ╔═╡ 67941354-ade2-4d75-87e4-cb5b761e388b
(S * A * T) .% p == D

# ╔═╡ 578df3c0-3b5e-450a-9d64-c8b3efb90ca5
sb = (S * b) .% p

# ╔═╡ 5ba4054b-d8b7-426e-b2eb-0bf1cc9fb759
xm = (D * sb) .% p

# ╔═╡ b7c17e96-4d87-4ac5-9cc1-0f552a9ae9ec
x = (T * xm) .% p

# ╔═╡ ae2f7158-6f49-4530-a0b5-f9efb4ca5848
(A * x) .% p == b

# ╔═╡ 548e4ba9-0bbb-438c-aa3e-f385440cc0e0
(x' * A') .% p == b'

# ╔═╡ 4ed11fc2-7cd5-4009-9124-b5ed85045f61
(T * D * S * b) .% p == x

# ╔═╡ a44d4d9d-6ce4-45ad-b0da-d0a2f4af5e00
(b' * S' * D' * T') .% p == x'

# ╔═╡ 9dae479c-1366-47d8-8850-c4c61bdd7219
println(D')

# ╔═╡ a2d894a1-bf0f-480a-a1aa-74281f21da15
println(S')

# ╔═╡ e886f2be-b75b-44f2-accd-b95533bd84dc
println(T')

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
# ╟─feeee22d-3e6a-4299-a130-ba9fe7792766
# ╠═135b3e2e-f854-4590-a90d-dfaf0a49e940
# ╠═68cd3319-4f02-425e-91cf-bdf9ba035b80
# ╟─b5e88cb3-9bb0-4d21-98a5-7a89cac6f388
# ╠═3aeeed01-32e9-4df9-9cc4-8a7a8d37643a
# ╟─a150cfc5-2978-4561-8d0d-5d95bae3fb87
# ╠═b63edb75-a4ba-41f4-9559-9f5cb1ba578c
# ╟─992da7fc-5a1a-421e-b74f-4ee9570ee9c5
# ╠═67941354-ade2-4d75-87e4-cb5b761e388b
# ╟─43e24968-99c0-462e-8732-94d754c16465
# ╠═c818d557-405e-4a8e-b828-aeda7b8ad753
# ╠═2118bcd3-dad1-472e-b725-7d60f4536459
# ╟─bee44a99-af2b-45bd-857b-afbf9434b494
# ╠═417b0837-b7e0-4240-9131-0a2c8a578d20
# ╠═578df3c0-3b5e-450a-9d64-c8b3efb90ca5
# ╠═5ba4054b-d8b7-426e-b2eb-0bf1cc9fb759
# ╠═b7c17e96-4d87-4ac5-9cc1-0f552a9ae9ec
# ╟─7ed5e73e-8436-4d48-b522-f0f8b3e19ede
# ╠═ae2f7158-6f49-4530-a0b5-f9efb4ca5848
# ╟─ad82643d-8214-433c-b877-6fca4a05721d
# ╠═4ed11fc2-7cd5-4009-9124-b5ed85045f61
# ╠═a44d4d9d-6ce4-45ad-b0da-d0a2f4af5e00
# ╠═548e4ba9-0bbb-438c-aa3e-f385440cc0e0
# ╟─40656942-9faf-451e-b2cc-0b5db70601b7
# ╠═99c9da5d-3e84-45b1-ab3a-dfe4a6c568e6
# ╠═9dae479c-1366-47d8-8850-c4c61bdd7219
# ╠═a2d894a1-bf0f-480a-a1aa-74281f21da15
# ╠═e886f2be-b75b-44f2-accd-b95533bd84dc
# ╟─f4086bda-633f-4f9d-9743-44bd9afce5c9
# ╟─91cf2fb9-9248-4a23-9784-0223791c3258
# ╟─ee27438e-d5c0-4cf2-a147-b10692f0acd6
# ╟─a0eb691e-f1e4-48b3-b52a-fa1e6aa10d5b
# ╟─77f1e73e-a47d-4038-ba71-d3e75e5758d5
# ╟─5045dde2-9b01-416d-94c3-86b6f9f63673
# ╟─1ac33725-f840-44a9-8b01-490ba91be138
# ╟─1945e70f-6f06-4455-b752-3aa0ab5bec42
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
