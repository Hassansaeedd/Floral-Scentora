// Particles.casberry-like Flow Field Canvas Particle Simulation
// Creates a high-performance, elegant background of floating pastel vectors

class ParticleField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 180, active: false };
    this.pastelColors = [
      'rgba(252, 225, 228, 0.65)',  // Blush Pink
      'rgba(252, 246, 189, 0.65)',  // Soft Peach
      'rgba(216, 243, 220, 0.65)',  // Sage/Mint
      'rgba(232, 232, 255, 0.65)',  // Lavender
      'rgba(224, 242, 241, 0.65)'   // Pale Teal
    ];
    
    this.numberOfParticles = this.calculateParticleCount();
    this.flowAngleOffset = 0;
    this.animationFrameId = null;

    this.init();
    this.setupListeners();
    this.animate();
  }

  calculateParticleCount() {
    const area = window.innerWidth * window.innerHeight;
    // Standard desktop gets ~200 particles, mobile gets fewer to preserve battery & performance
    return Math.min(Math.floor(area / 6000), 220);
  }

  init() {
    this.resizeCanvas();
    this.particles = [];
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: Math.random() * 4 + 1.5,
      color: this.pastelColors[Math.floor(Math.random() * this.pastelColors.length)],
      speedX: 0,
      speedY: 0,
      baseSpeed: Math.random() * 0.4 + 0.1,
      angle: Math.random() * Math.PI * 2,
      // Randomize the wavy drift frequency
      noiseFrequency: Math.random() * 0.005 + 0.002,
      depth: Math.random() * 0.5 + 0.5 // Simulates 3D Z-depth for parallax sizing
    };
  }

  resizeCanvas() {
    const scale = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * scale;
    this.canvas.height = window.innerHeight * scale;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(scale, scale);
  }

  setupListeners() {
    window.addEventListener('resize', () => {
      this.numberOfParticles = this.calculateParticleCount();
      this.init();
    });

    // Track mouse positioning for interactive flow repulsion
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Touch support for mobile interaction
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.mouse.active = true;
      }
    });

    window.addEventListener('touchend', () => {
      this.mouse.active = false;
    });
  }

  animate() {
    // Semi-transparent overlay to create smooth, glowing tail vectors
    // Matches the alabaster background color (#FAF8F5 / #FDFBF7)
    this.ctx.fillStyle = 'rgba(253, 251, 247, 0.075)';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Slowly increment flow offsets for organic wind changes
    this.flowAngleOffset += 0.001;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // 1. Calculate Vector Flow Field Angle
      // Combines particle position, time (flowAngleOffset), and noise frequency
      // to create a swirling, organic breeze effect across the screen.
      const gridAngle = (Math.sin(p.x * p.noiseFrequency + this.flowAngleOffset) + 
                         Math.cos(p.y * p.noiseFrequency + this.flowAngleOffset)) * Math.PI;
      
      // Interpolate current particle angle towards flow angle for smoothness
      p.angle += (gridAngle - p.angle) * 0.05;

      // Update basic drift speeds
      p.speedX = Math.cos(p.angle) * p.baseSpeed * p.depth;
      p.speedY = Math.sin(p.angle) * p.baseSpeed * p.depth + 0.15; // Slow ambient downward drift

      // 2. Apply Interactive Mouse Forces
      if (this.mouse.active && this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          // Calculate force intensity (stronger when closer to mouse)
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          
          // Repulsion vectors
          const repelX = (dx / distance) * force * 1.8;
          const repelY = (dy / distance) * force * 1.8;
          
          // Add swirl force for a premium vortex feel
          const swirlX = (-dy / distance) * force * 0.8;
          const swirlY = (dx / distance) * force * 0.8;

          p.speedX += repelX + swirlX;
          p.speedY += repelY + swirlY;
        }
      }

      // 3. Move Particle
      p.x += p.speedX;
      p.y += p.speedY;

      // 4. Wrap around boundaries
      if (p.x < -20) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 20) p.x = -10;
      if (p.y < -20) {
        p.y = window.innerHeight + 10;
        p.x = Math.random() * window.innerWidth;
      }
      if (p.y > window.innerHeight + 20) {
        p.y = -10;
        p.x = Math.random() * window.innerWidth;
      }

      // 5. Draw Particle with Z-depth styling
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * p.depth, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      
      // Subtle shadow/glow for soft premium light dispersion
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      
      // Reset shadows for drawing performance
      this.ctx.shadowBlur = 0;
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Instantiate particles when window loads
window.addEventListener('DOMContentLoaded', () => {
  window.bgParticles = new ParticleField('particles-canvas');
});
