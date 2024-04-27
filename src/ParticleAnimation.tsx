import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Styled canvas component
const StyledCanvas = styled.canvas`
  width: 100vw; /* Set width to 100% of viewport width */
  height: 100vh; /* Set height to 100% of viewport height */
  background-color: ${(props) => props.backgroundColor};
  // background: linear-gradient(to right, #cc3300, #00ccff);
  background: ${(props) => props.backgroundColor};


`;

const ParticleCanvas: React.FC<{ backgroundColor: string; animate: boolean }> = ({ backgroundColor, animate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; color: string }[]>([]);
  const connectionsRef = useRef<Set<string>>(new Set()); // Set to store connected particle pairs
  const dpiRef = useRef<number>(1); // Set a default dpi

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpiRef.current;
      canvas.height = window.innerHeight * dpiRef.current;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };

    const calculateParticleSize = () => {
      const screenSize = Math.min(window.innerWidth, window.innerHeight);
      return Math.max(2, screenSize * 0.003 * dpiRef.current);
    };

    const initializeParticles = () => {
      const numParticles = animate ? (window.innerWidth > 768 ? 80 : 40) : 0; // Reduce particles on mobile devices if animation is off
      particlesRef.current = [];
      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          color: '#fff', // Initial color is white
        });
      }
    };

    const draw = () => {


      if (!animate) return; // Stop animation if not enabled
      connectionsRef.current.clear();
      const particles = particlesRef.current;
      const connections = connectionsRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle) => {
        const size = calculateParticleSize();
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw links
      particles.forEach((p1, index) => {
        particles.slice(index + 1).forEach((p2) => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`; // Set link color to golden
            ctx.lineWidth = 0.5 * dpiRef.current;
            ctx.stroke();

            // Update connection set
            connections.add(`${Math.round(p1.x)},${Math.round(p1.y)},${Math.round(p2.x)},${Math.round(p2.y)}`);
          }
        });
      });

      // Fill triangle space between connected particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          for (let k = j + 1; k < particles.length; k++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const p3 = particles[k];
            const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

            const d1 = Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2);
            const d2 = Math.sqrt((p3.y - p2.y) ** 2 + (p3.x - p2.x) ** 2);
            const d3 = Math.sqrt((p1.y - p3.y) ** 2 + (p1.x - p3.x) ** 2);

            if (d1 < 100 && d2 < 100 && d3 < 100) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineTo(p3.x, p3.y);
              ctx.closePath();
              ctx.fillStyle = `rgba(22, 22, 28, ${1 - distance / 100})`; // Light golden color with low opacity
              ctx.fill();
            }
          }
        }
      }

      particles.forEach((particle) => {
        particle.x += particle.vx * dpiRef.current;
        particle.y += particle.vy * dpiRef.current;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      particles.forEach((particle) => {
        particle.color = connections.has(`${Math.round(particle.x)},${Math.round(particle.y)}`) ? '#fff' : '#fff'; // Set color to golden if connected, otherwise white
      });

      requestAnimationFrame(draw);
    };

    if (typeof window !== 'undefined') {
      dpiRef.current = window.devicePixelRatio || 1;

      resizeCanvas();
      initializeParticles();
      draw();

      const handleResize = () => {
        dpiRef.current = window.devicePixelRatio || 1;
        resizeCanvas();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [animate]); // Include animate in the dependency array

  return <StyledCanvas ref={canvasRef} backgroundColor={backgroundColor} />;
};

export default ParticleCanvas;
