import React, { useEffect, useRef } from 'react';

const ParticlesBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Particles.casberry Luxury Color Palette
    const colors = [
      'rgba(229, 193, 88, 0.45)',   // Champagne Gold
      'rgba(232, 180, 184, 0.35)',  // Soft Botanical Rose
      'rgba(244, 214, 155, 0.40)',  // Luminous Gold
      'rgba(200, 180, 220, 0.25)',  // Subtle Lavender Sparkle
    ];

    const mouse = { x: null, y: null, radius: 200, active: false };

    const getParticleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      return Math.min(Math.floor(area / 9000), 120);
    };

    let particleCount = getParticleCount();
    let particles = [];

    const createParticle = () => {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: 0,
        vy: 0,
        baseSpeed: Math.random() * 0.5 + 0.2,
        noiseSeed: Math.random() * 100,
      };
    };

    const resizeCanvas = () => {
      const scale = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(scale, scale);
    };

    const init = () => {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const handleResize = () => {
      particleCount = getParticleCount();
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    init();

    const animate = () => {
      // Clear background completely each frame to preserve crisp dark backdrop
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      time += 0.003;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Trigonometric flow field angle
        const angle = (Math.sin(p.x * 0.003 + time + p.noiseSeed) + Math.cos(p.y * 0.003 + time)) * Math.PI;

        p.vx += Math.cos(angle) * 0.05;
        p.vy += Math.sin(angle) * 0.05 - 0.08; // Gentle upward drift

        // Friction dampening
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Mouse swirl physics (Particles.casberry interactive effect)
        if (mouse.active && mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angleToMouse = Math.atan2(dy, dx);
            const swirlAngle = angleToMouse + Math.PI / 2;

            p.vx += Math.cos(swirlAngle) * force * 1.2 + (dx / dist) * force * 0.8;
            p.vy += Math.sin(swirlAngle) * force * 1.2 + (dy / dist) * force * 0.8;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary wraparound
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;

        // Render particle node with soft glowing aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="particles-canvas" ref={canvasRef} />;
};

export default ParticlesBg;
