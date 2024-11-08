### A Pluto.jl notebook ###
# v0.19.38

using Markdown
using InteractiveUtils

# ╔═╡ 94088d70-3247-11ef-18d0-f10f678d0bfb
begin
	using PlutoUI, Colors
end

# ╔═╡ e02359d8-95a2-4691-9045-c1efa9293bd1
md"""
# Light Chasing
"""

# ╔═╡ e9ee85fb-159b-4fc4-b43f-de776ebbb5a0
md"""
The purpose of this notebook is to find the moves used for the [Light Chasing algorithm](https://en.wikipedia.org/wiki/Lights_Out_(game)#Light_chasing) in Flippin.
"""

# ╔═╡ 34af4f57-669e-4dc0-8b02-503428f4dc5c
md"""
## Steps
"""

# ╔═╡ 466a6b16-99cc-4f24-ba49-ee7fc2cc5ebc
md"""
First, create a base board to use. Any other Flippin board will use the same results so picking one with all red tiles to make following along easier is fine.
"""

# ╔═╡ 493cd649-3d0a-4013-acd6-2afab3a58e41
basevector = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

# ╔═╡ 181aa016-e851-4c09-ba4b-992f995795d2
base = [basevector[i:(i+4)] for i in 1:5:25]

# ╔═╡ 8bcd7df0-b60f-4f57-a03c-90957233a244
md"""
Next, generate the opening gambits for the board. These are all possible tile flips that only use the first row of the board.
"""

# ╔═╡ 171250dc-c5b8-4d80-b080-1612e64615a0
gambits = [parse.(Int, collect(string(i, base=3, pad=5))) for i in 1:242]

# ╔═╡ 37771224-d5a5-43f9-9cea-182310f13a87
md"""
Now, execute the Light Chasing algorithm and keep track of which gambits map to which final row configurations.

There are 9 unique final row configurations (8 and a no-op). For later simplicity, only track the ones whose gambits require the least amount of tiles flipped.
"""

# ╔═╡ d6b51903-0737-41c5-a944-edd2c385a8d1
md"""
And that's it! The table below contains the tiles that need to be pressed on the top row to solve for a bottom row configuration at that step in the Light Chasing algorithm. Any of the gambits from the results will work, but I chose the ones I thought would be easiest to remember.
"""

# ╔═╡ b8d3dd64-5978-4464-a52d-d752064d037c
md"""
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
"""

# ╔═╡ 9803e0f1-1bf9-416d-9ebd-3dfe17f8a3a7
md"""
__Note:__ The "Bottom row offset" column in the table means how many places ahead in the color cycle the bottom row of the current board is from the bottom row of the end board.

For the following last row configurations,

End board:

🟦🟦🟦🟦🟦

Current board:

🟩🟩🟥🟩🟩

you would use the result associated with 2️⃣2️⃣1️⃣2️⃣2️⃣ (i.e. 1️⃣2️⃣0️⃣0️⃣0️⃣).
"""

# ╔═╡ 7c504330-b8f3-41a4-93bc-407dddc05404
md"""
# Notebook Functions
"""

# ╔═╡ eeb9ead2-2365-4d08-afcd-8ff7fb8d4e69
function invertline(line)
	return map(x -> (3 - x) % 3, line)
end

# ╔═╡ 7be45b75-0834-4fa5-b499-05d27c1b9a20
md"""
# Appendix
"""

# ╔═╡ b7101387-d58c-4175-a499-9c331cc6c181
"The color palette to use when displaying tiles."
palette = [
	colorant"red",
	colorant"green",
	colorant"blue",
]

# ╔═╡ ef01d7ed-9d75-4916-af77-72533c6468dc
"The relative coordinates for the cross-shaped flipping pattern."
flipcross = [(0, -1), (-1, 0), (0, 0), (1, 0), (0, 1)]

# ╔═╡ db3505f7-584a-4ccb-aaaa-35ea8d66fa81
"""
    numbertocolor(number)

Convert `number` to its appropriate color value in the default `palette`.

# Examples
```julia-repl
julia> numbertocolor(0)
palette[1]
```
"""
function numbertocolor(number)
	return palette[number + 1]
end

# ╔═╡ 9cea26ff-0b35-47db-8840-7955d072b1bf
"""
    numbertocolor(number, palette)

Convert `number` to its appropriate color value in `palette`.

# Examples
```julia-repl
julia> numbertocolor(0, [colorant"red", colorant"green", colorant"blue",])
colorant"red"
```
"""
function numbertocolor(number, palette)
	return palette[number + 1]
end

# ╔═╡ 66b25fd3-6300-4097-b26b-0a08228adfd1
"""
    vectortocolors(vector)

Convert `vector` elements to their appropriate color values in the default `palette`.

# Examples
```julia-repl
julia> vectortocolors([0 1 2])
[palette[1] palette[2] palette[3]]
```
"""
function vectortocolors(vector)
	return numbertocolor.(vector)
end

# ╔═╡ 8b7bb3a1-d838-4d50-b68e-341e56ebbd5e
"""
    vectortocolors(number, palette)

Convert `vector` elements to their appropriate color values in `palette`.

# Examples
```julia-repl
julia> vectortocolors([0 1 2], [colorant"red", colorant"green", colorant"blue",])
[colorant"red" colorant"green" colorant"blue"]
```
"""
function vectortocolors(vector, palette)
	return numbertocolor.(vector, palette)
end

# ╔═╡ cac9478c-2a13-4f0e-9a10-e032c7e6fc90
vectortocolors.(base)

# ╔═╡ c30c437d-1043-46d4-8e7a-18f62b832314
"""
    shouldbeflipped(row, col, targetrow, targetcol)

Checks if a tile with coordinates (`row`, `col`) should be flipped based on an interaction with a tile with coordinates (`targetrow`, `targetcol`).

# Examples
```julia-repl
julia> shouldbeflipped(1, 1, 1, 2)
true
```
"""
function shouldbeflipped(row, col, targetrow, targetcol)
	(row, col) in map(x -> x .+ (targetrow, targetcol), flipcross)
end

# ╔═╡ a434b22e-54c3-4575-bb0b-9c6c8e9e5dff
"""
    permutetile(matrix, targetrow, targetcol)

Flips all relevant tiles in `matrix` based on an interaction with a tile with coordinates (`targetrow`, `targetcol`).

# Examples
```julia-repl
julia> a = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
julia> permutetile(a, 2, 2)
[[0, 1, 0], [1, 1, 1], [0, 1, 0]]
```
"""
function permutetile(matrix, targetrow, targetcol)
	return map(((col, line), ) -> 
		map(((row, value), ) -> 
			shouldbeflipped(row, col, targetrow, targetcol) ? (value + 1) % 3 : value, enumerate(line)), enumerate(matrix))
end

# ╔═╡ bbabd25a-9061-437f-b9cd-2ab2f8993147
function permuteline(matrix, moves, lineindex)
	mut = map(copy, matrix)
	
	for (index, value) in enumerate(moves)
		for _ in 1:value
			mut = permutetile(mut, index, lineindex)
		end
	end
	
	return mut
end

# ╔═╡ 6f3c1ed9-1aff-410f-aa87-bf89cfff01d6
function generategambitboards(matrix, gambits, lineindex)
	dict = Dict()

	for gambit in 1:length(gambits)
		dict[gambits[gambit]] = permuteline(matrix, gambits[gambit], lineindex)
	end

	return dict
end

# ╔═╡ 65c84d09-0483-4bf1-97d4-97342e8b772e
function chaselights(matrix)
	mut = map(copy, matrix)
	
	for line in 1:4
		inverseline = invertline(mut[line])
		mut = permuteline(mut, inverseline, line + 1)
	end

	return mut
end

# ╔═╡ 6391fb66-a158-41ee-aa0e-9c673bfba5be
function uniquechaselights(matrix, gambits)
	results = Dict()
	
	gambits = generategambitboards(base, gambits, 1)
	
	for (key, value) in gambits
		lastrow = invertline(chaselights(value)[5])
		current = get(results, lastrow, [[3, 3, 3, 3, 3]])
		sumkey = sum(key)
		sumcurrent = sum(current[1])
		
		if sumkey < sumcurrent
			results[lastrow] = [key]
		elseif sumkey == sumcurrent
			push!(results[lastrow], key) 
		end
	end

	return results
end

# ╔═╡ cc87a221-6286-4e04-81a6-9b840d4a1634
results = uniquechaselights(base, gambits)

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
Colors = "5ae59095-9a9b-59fe-a467-6f913c188581"
PlutoUI = "7f904dfe-b85e-4ff6-b463-dae2292396a8"

[compat]
Colors = "~0.12.10"
PlutoUI = "~0.7.58"
"""

# ╔═╡ 00000000-0000-0000-0000-000000000002
PLUTO_MANIFEST_TOML_CONTENTS = """
# This file is machine-generated - editing it directly is not advised

julia_version = "1.9.3"
manifest_format = "2.0"
project_hash = "44c42660ce9324a67251bb899dc94f183047b83c"

[[deps.AbstractPlutoDingetjes]]
deps = ["Pkg"]
git-tree-sha1 = "0f748c81756f2e5e6854298f11ad8b2dfae6911a"
uuid = "6e696c72-6542-2067-7265-42206c756150"
version = "1.3.0"

[[deps.ArgTools]]
uuid = "0dad84c5-d112-42e6-8d28-ef12dabb789f"
version = "1.1.1"

[[deps.Artifacts]]
uuid = "56f22d72-fd6d-98f1-02f0-08ddc0907c33"

[[deps.Base64]]
uuid = "2a0f44e3-6c83-55bd-87e4-b1978d98bd5f"

[[deps.ColorTypes]]
deps = ["FixedPointNumbers", "Random"]
git-tree-sha1 = "eb7f0f8307f71fac7c606984ea5fb2817275d6e4"
uuid = "3da002f7-5984-5a60-b8a6-cbb66c0b333f"
version = "0.11.4"

[[deps.Colors]]
deps = ["ColorTypes", "FixedPointNumbers", "Reexport"]
git-tree-sha1 = "fc08e5930ee9a4e03f84bfb5211cb54e7769758a"
uuid = "5ae59095-9a9b-59fe-a467-6f913c188581"
version = "0.12.10"

[[deps.CompilerSupportLibraries_jll]]
deps = ["Artifacts", "Libdl"]
uuid = "e66e0078-7015-5450-92f7-15fbd957f2ae"
version = "1.0.5+0"

[[deps.Dates]]
deps = ["Printf"]
uuid = "ade2ca70-3891-5945-98fb-dc099432e06a"

[[deps.Downloads]]
deps = ["ArgTools", "FileWatching", "LibCURL", "NetworkOptions"]
uuid = "f43a241f-c20a-4ad4-852c-f6b1247861c6"
version = "1.6.0"

[[deps.FileWatching]]
uuid = "7b1f6079-737a-58dc-b8bc-7a2ca5c1b5ee"

[[deps.FixedPointNumbers]]
deps = ["Statistics"]
git-tree-sha1 = "335bfdceacc84c5cdf16aadc768aa5ddfc5383cc"
uuid = "53c48c17-4a7d-5ca2-90c5-79b7896eea93"
version = "0.8.4"

[[deps.Hyperscript]]
deps = ["Test"]
git-tree-sha1 = "179267cfa5e712760cd43dcae385d7ea90cc25a4"
uuid = "47d2ed2b-36de-50cf-bf87-49c2cf4b8b91"
version = "0.0.5"

[[deps.HypertextLiteral]]
deps = ["Tricks"]
git-tree-sha1 = "7134810b1afce04bbc1045ca1985fbe81ce17653"
uuid = "ac1192a8-f4b3-4bfe-ba22-af5b92cd3ab2"
version = "0.9.5"

[[deps.IOCapture]]
deps = ["Logging", "Random"]
git-tree-sha1 = "8b72179abc660bfab5e28472e019392b97d0985c"
uuid = "b5f81e59-6552-4d32-b1f0-c071b021bf89"
version = "0.2.4"

[[deps.InteractiveUtils]]
deps = ["Markdown"]
uuid = "b77e0a4c-d291-57a0-90e8-8db25a27a240"

[[deps.JSON]]
deps = ["Dates", "Mmap", "Parsers", "Unicode"]
git-tree-sha1 = "31e996f0a15c7b280ba9f76636b3ff9e2ae58c9a"
uuid = "682c06a0-de6a-54ab-a142-c8b1cf79cde6"
version = "0.21.4"

[[deps.LibCURL]]
deps = ["LibCURL_jll", "MozillaCACerts_jll"]
uuid = "b27032c2-a3e7-50c8-80cd-2d36dbcbfd21"
version = "0.6.3"

[[deps.LibCURL_jll]]
deps = ["Artifacts", "LibSSH2_jll", "Libdl", "MbedTLS_jll", "Zlib_jll", "nghttp2_jll"]
uuid = "deac9b47-8bc7-5906-a0fe-35ac56dc84c0"
version = "7.84.0+0"

[[deps.LibGit2]]
deps = ["Base64", "NetworkOptions", "Printf", "SHA"]
uuid = "76f85450-5226-5b5a-8eaa-529ad045b433"

[[deps.LibSSH2_jll]]
deps = ["Artifacts", "Libdl", "MbedTLS_jll"]
uuid = "29816b5a-b9ab-546f-933c-edad1886dfa8"
version = "1.10.2+0"

[[deps.Libdl]]
uuid = "8f399da3-3557-5675-b5ff-fb832c97cbdb"

[[deps.LinearAlgebra]]
deps = ["Libdl", "OpenBLAS_jll", "libblastrampoline_jll"]
uuid = "37e2e46d-f89d-539d-b4ee-838fcccc9c8e"

[[deps.Logging]]
uuid = "56ddb016-857b-54e1-b83d-db4d58db5568"

[[deps.MIMEs]]
git-tree-sha1 = "65f28ad4b594aebe22157d6fac869786a255b7eb"
uuid = "6c6e2e6c-3030-632d-7369-2d6c69616d65"
version = "0.1.4"

[[deps.Markdown]]
deps = ["Base64"]
uuid = "d6f4376e-aef5-505a-96c1-9c027394607a"

[[deps.MbedTLS_jll]]
deps = ["Artifacts", "Libdl"]
uuid = "c8ffd9c3-330d-5841-b78e-0817d7145fa1"
version = "2.28.2+0"

[[deps.Mmap]]
uuid = "a63ad114-7e13-5084-954f-fe012c677804"

[[deps.MozillaCACerts_jll]]
uuid = "14a3606d-f60d-562e-9121-12d972cd8159"
version = "2022.10.11"

[[deps.NetworkOptions]]
uuid = "ca575930-c2e3-43a9-ace4-1e988b2c1908"
version = "1.2.0"

[[deps.OpenBLAS_jll]]
deps = ["Artifacts", "CompilerSupportLibraries_jll", "Libdl"]
uuid = "4536629a-c528-5b80-bd46-f80d51c5b363"
version = "0.3.21+4"

[[deps.Parsers]]
deps = ["Dates", "PrecompileTools", "UUIDs"]
git-tree-sha1 = "8489905bcdbcfac64d1daa51ca07c0d8f0283821"
uuid = "69de0a69-1ddd-5017-9359-2bf0b02dc9f0"
version = "2.8.1"

[[deps.Pkg]]
deps = ["Artifacts", "Dates", "Downloads", "FileWatching", "LibGit2", "Libdl", "Logging", "Markdown", "Printf", "REPL", "Random", "SHA", "Serialization", "TOML", "Tar", "UUIDs", "p7zip_jll"]
uuid = "44cfe95a-1eb2-52ea-b672-e2afdf69b78f"
version = "1.9.2"

[[deps.PlutoUI]]
deps = ["AbstractPlutoDingetjes", "Base64", "ColorTypes", "Dates", "FixedPointNumbers", "Hyperscript", "HypertextLiteral", "IOCapture", "InteractiveUtils", "JSON", "Logging", "MIMEs", "Markdown", "Random", "Reexport", "URIs", "UUIDs"]
git-tree-sha1 = "71a22244e352aa8c5f0f2adde4150f62368a3f2e"
uuid = "7f904dfe-b85e-4ff6-b463-dae2292396a8"
version = "0.7.58"

[[deps.PrecompileTools]]
deps = ["Preferences"]
git-tree-sha1 = "5aa36f7049a63a1528fe8f7c3f2113413ffd4e1f"
uuid = "aea7be01-6a6a-4083-8856-8a6e6704d82a"
version = "1.2.1"

[[deps.Preferences]]
deps = ["TOML"]
git-tree-sha1 = "9306f6085165d270f7e3db02af26a400d580f5c6"
uuid = "21216c6a-2e73-6563-6e65-726566657250"
version = "1.4.3"

[[deps.Printf]]
deps = ["Unicode"]
uuid = "de0858da-6303-5e67-8744-51eddeeeb8d7"

[[deps.REPL]]
deps = ["InteractiveUtils", "Markdown", "Sockets", "Unicode"]
uuid = "3fa0cd96-eef1-5676-8a61-b3b8758bbffb"

[[deps.Random]]
deps = ["SHA", "Serialization"]
uuid = "9a3f8284-a2c9-5f02-9a11-845980a1fd5c"

[[deps.Reexport]]
git-tree-sha1 = "45e428421666073eab6f2da5c9d310d99bb12f9b"
uuid = "189a3867-3050-52da-a836-e630ba90ab69"
version = "1.2.2"

[[deps.SHA]]
uuid = "ea8e919c-243c-51af-8825-aaa63cd721ce"
version = "0.7.0"

[[deps.Serialization]]
uuid = "9e88b42a-f829-5b0c-bbe9-9e923198166b"

[[deps.Sockets]]
uuid = "6462fe0b-24de-5631-8697-dd941f90decc"

[[deps.SparseArrays]]
deps = ["Libdl", "LinearAlgebra", "Random", "Serialization", "SuiteSparse_jll"]
uuid = "2f01184e-e22b-5df5-ae63-d93ebab69eaf"

[[deps.Statistics]]
deps = ["LinearAlgebra", "SparseArrays"]
uuid = "10745b16-79ce-11e8-11f9-7d13ad32a3b2"
version = "1.9.0"

[[deps.SuiteSparse_jll]]
deps = ["Artifacts", "Libdl", "Pkg", "libblastrampoline_jll"]
uuid = "bea87d4a-7f5b-5778-9afe-8cc45184846c"
version = "5.10.1+6"

[[deps.TOML]]
deps = ["Dates"]
uuid = "fa267f1f-6049-4f14-aa54-33bafae1ed76"
version = "1.0.3"

[[deps.Tar]]
deps = ["ArgTools", "SHA"]
uuid = "a4e569a6-e804-4fa4-b0f3-eef7a1d5b13e"
version = "1.10.0"

[[deps.Test]]
deps = ["InteractiveUtils", "Logging", "Random", "Serialization"]
uuid = "8dfed614-e22c-5e08-85e1-65c5234f0b40"

[[deps.Tricks]]
git-tree-sha1 = "eae1bb484cd63b36999ee58be2de6c178105112f"
uuid = "410a4b4d-49e4-4fbc-ab6d-cb71b17b3775"
version = "0.1.8"

[[deps.URIs]]
git-tree-sha1 = "67db6cc7b3821e19ebe75791a9dd19c9b1188f2b"
uuid = "5c2747f8-b7ea-4ff2-ba2e-563bfd36b1d4"
version = "1.5.1"

[[deps.UUIDs]]
deps = ["Random", "SHA"]
uuid = "cf7118a7-6976-5b1a-9a39-7adc72f591a4"

[[deps.Unicode]]
uuid = "4ec0a83e-493e-50e2-b9ac-8f72acf5a8f5"

[[deps.Zlib_jll]]
deps = ["Libdl"]
uuid = "83775a58-1f1d-513f-b197-d71354ab007a"
version = "1.2.13+0"

[[deps.libblastrampoline_jll]]
deps = ["Artifacts", "Libdl"]
uuid = "8e850b90-86db-534c-a0d3-1478176c7d93"
version = "5.8.0+0"

[[deps.nghttp2_jll]]
deps = ["Artifacts", "Libdl"]
uuid = "8e850ede-7688-5339-a07c-302acd2aaf8d"
version = "1.48.0+0"

[[deps.p7zip_jll]]
deps = ["Artifacts", "Libdl"]
uuid = "3f19e933-33d8-53b3-aaab-bd5110c3b7a0"
version = "17.4.0+0"
"""

# ╔═╡ Cell order:
# ╠═94088d70-3247-11ef-18d0-f10f678d0bfb
# ╟─e02359d8-95a2-4691-9045-c1efa9293bd1
# ╟─e9ee85fb-159b-4fc4-b43f-de776ebbb5a0
# ╟─34af4f57-669e-4dc0-8b02-503428f4dc5c
# ╟─466a6b16-99cc-4f24-ba49-ee7fc2cc5ebc
# ╟─493cd649-3d0a-4013-acd6-2afab3a58e41
# ╟─181aa016-e851-4c09-ba4b-992f995795d2
# ╟─cac9478c-2a13-4f0e-9a10-e032c7e6fc90
# ╟─8bcd7df0-b60f-4f57-a03c-90957233a244
# ╠═171250dc-c5b8-4d80-b080-1612e64615a0
# ╟─37771224-d5a5-43f9-9cea-182310f13a87
# ╟─cc87a221-6286-4e04-81a6-9b840d4a1634
# ╟─d6b51903-0737-41c5-a944-edd2c385a8d1
# ╟─b8d3dd64-5978-4464-a52d-d752064d037c
# ╟─9803e0f1-1bf9-416d-9ebd-3dfe17f8a3a7
# ╟─7c504330-b8f3-41a4-93bc-407dddc05404
# ╟─bbabd25a-9061-437f-b9cd-2ab2f8993147
# ╟─6f3c1ed9-1aff-410f-aa87-bf89cfff01d6
# ╟─eeb9ead2-2365-4d08-afcd-8ff7fb8d4e69
# ╟─65c84d09-0483-4bf1-97d4-97342e8b772e
# ╟─6391fb66-a158-41ee-aa0e-9c673bfba5be
# ╟─7be45b75-0834-4fa5-b499-05d27c1b9a20
# ╟─b7101387-d58c-4175-a499-9c331cc6c181
# ╟─ef01d7ed-9d75-4916-af77-72533c6468dc
# ╟─db3505f7-584a-4ccb-aaaa-35ea8d66fa81
# ╟─9cea26ff-0b35-47db-8840-7955d072b1bf
# ╟─66b25fd3-6300-4097-b26b-0a08228adfd1
# ╟─8b7bb3a1-d838-4d50-b68e-341e56ebbd5e
# ╟─c30c437d-1043-46d4-8e7a-18f62b832314
# ╟─a434b22e-54c3-4575-bb0b-9c6c8e9e5dff
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
