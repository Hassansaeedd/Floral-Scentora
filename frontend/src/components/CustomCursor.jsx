import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let outerX = 0, outerY = 0;
    let targetX = 0, targetY = 0;
    let animationFrameId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);

      // Move inner dot instantly
      if (innerRef.current) {
        innerRef.current.style.left = `${targetX}px`;
        innerRef.current.style.top = `${targetY}px`;
      }
    };

    const updatePosition = () => {
      // Elastic lag logic
      outerX += (targetX - outerX) * 0.15;
      outerY += (targetY - outerY) * 0.15;

      if (outerRef.current) {
        outerRef.current.style.left = `${outerX}px`;
        outerRef.current.style.top = `${outerY}px`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const addHoverClass = () => setHovered(true);
    const removeHoverClass = () => setHovered(false);

    const setupInteractions = () => {
      const clickables = document.querySelectorAll(
        'a, button, select, input, textarea, .interactive-card, .clickable, .pyramid-tier, .note-checkbox-label'
      );
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', addHoverClass);
        el.addEventListener('mouseleave', removeHoverClass);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);

    // Initial setup for existing DOM elements
    setupInteractions();

    // Re-run setup interactions when URL changes or DOM mutations happen
    const observer = new MutationObserver(setupInteractions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={outerRef}
        className={`custom-cursor ${hovered ? 'cursor-hover' : ''}`}
      />
      <div
        ref={innerRef}
        className="custom-cursor-dot"
      />
    </>
  );
};

export default CustomCursor;
