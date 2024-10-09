# An SPA webpage to demonstrate the Differential Equations in Image Processing and Computer Vision (DIC) course
Made with ❤️ by C. J. (Camilo & Jackie)

Credit goes to [Dr. Pascal Peter](https://www.mia.uni-saarland.de/peter/index.shtml) who delivered this awesome course
and our tutor: Sivakumaran Harishanth. 

## Image-Processing Features
### Diffusion-Algorithms
- [x] Homogeneous Diffusion
- [x] Homogeneous Diffusion Inpainting 
- [x] Nonlinear Isotropic Diffusion
  - [x] Perona-Malik Filter
  - [ ] Other ${g(|\nabla u|^2)}$ diffusivity functions
- [ ] Nonlinear Anisotropic Diffusion
  - [ ] Edge-Enhancing Anisotropic Diffusion
  - [ ] Coherence-Enhancing Anisotropic Diffusion
- [ ] Variational Methods
  - [ ] TV Regularisation, Primal–Dual Methods
  - [ ] Homogeneous Smoothing
  - [ ] Isotropic Non-Linear Smoothing
  - [ ] Anisotropic Linear Smoothing (similar to Optic-Flow Anisotropic Image-driven)
  - [ ] Anisotropic Non-Linear Smoothing
  - [ ] Mumford-Shah Functional
    - [ ] Ambrosio-Tortorelli Approximation
- [ ] Vector- and Matrix-Valued Images
      
### Image Sequence Analysis
- [ ] Optic-Flow
  - [ ] Homogeneous
  - [ ] Isotropic Image-driven
  - [ ] Anisotropic Image-driven
  - [ ] Isotropic Flow-driven
  - [ ] Anisotropic Flow-driven
    
### Morphology
- [ ] Osmosis
- [ ] Classical Discrete-Scale Morphology
  - [ ] Dilation / Erosion
  - [ ] Opening / Closing
  - [ ] Shock Filter
- [ ] Curvature-Based Morphology
  - [ ] Mean Curvature Motion
  - [ ] Self-Snakes and Active Contours
- [ ] Backward Parabolic PDEs and M-smoothers
- [ ] PDE-Based Image Compression
- [ ] PDEs with learnable Hyperparameters

## Quests
### Main Story
* [Render markdown](https://github.com/remarkjs/react-markdown)
* Use `<canvas>` to render images instead of `<img>`
### Side Quests
* Arrows are shifted after rotation
* Arrows have blur edges
* Form logic still crap, fix it
  * separate input tag from `InputField` component
  * auto generate input id with context hooks
  * what about select tag? how to composite it inside form field as it uses label as well

## Task Splits
* **C**
  * Diffusion Filters
  * Renderer
  * Blog
* **J**
  * Layouts & Routes
  * Renderer
  * Helper Components 

## License & Contact
© Camilo Martínez, <cama00005@stud.uni-saarland.de>

© Honglu Ma, <homa00001@stud.uni-saarland.de>

Distributed under the [MIT License](LICENSE).
