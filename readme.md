# Orbital challenge

A solution for Reaktor's [orbital challenge](https://reaktor.com/orbital-challenge/).

The task description was:

"Your task is to create an algorithm that can route phone calls through space across a network of satellites, much like the Iridium satellite constellation. Due to unfortunate circumstances that took place in the launch, our satellite constellation did not turn out as planned, but instead the satellites are scattered randomly across the globe at altitudes between 300-700km. Your algorithm should return the intermediate hops across satellites needed to transmit a signal from a starting point on the ground to an end point (also on the ground) in valid order (e.g. SAT10,SAT22,SAT7). No signal can travel through Earth, so all hops must be made between satellites that have an unobstructed line of sight between each other. It is possible, albeit very unlikely that a working route cannot be found for a given data file. The route you generate does not need to be the optimal one (i.e. least amount of hops or shortest), but our engineers will appreciate such a solution, as it’ll reduce the overall bandwidth needed."

This solution solves the challenge with a recursive algorithm, but isn't 100% guaranteed to find the optimal solution.

The code is published as is, in unfinalized form.