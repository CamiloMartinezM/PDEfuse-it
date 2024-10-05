Perona-Malik diffusion with Catte regularization is an edge-preserving smoothing technique. It's based on the equation:

$$\frac{\partial u}{\partial t} = \text{div}(g(|\nabla u_\sigma|^2)\nabla u)$$

where $g$ is a decreasing function and $u_\sigma$ is a smoothed version of $u$. This process reduces noise while preserving important edges in the image.

- Lambda ($\lambda$) controls the sensitivity to edges.
- Sigma ($\sigma$) determines the scale of the pre-smoothing Gaussian filter.