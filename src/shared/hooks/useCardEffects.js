import { useMotionValue, useMotionTemplate, useSpring } from "motion/react";
import { useTheme } from "../context/ThemeContext";

export const useCardEffects = ({
  tiltIntensity = 15,
  spotlightRadiusLight = 260,
  spotlightRadiusDark = 300,
}) => {
  const { theme } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(0, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 15 });

  const lightGradient = useMotionTemplate`
        radial-gradient(
            ${spotlightRadiusLight}px circle at ${mouseX}px ${mouseY}px,
            rgba(120, 140, 255, 0.35),
            rgba(170, 185, 255, 0.18) 40%,
            transparent 75%
        ),
        linear-gradient(
            135deg,
            rgba(248, 254, 255, 1),
            rgba(238, 240, 255, 1)
        )
    `;

  const darkGradient = useMotionTemplate`
        radial-gradient(
            ${spotlightRadiusDark}px circle at ${mouseX}px ${mouseY}px,
            rgba(120, 140, 255, 0.45),
            rgba(80, 90, 200, 0.25) 40%,
            transparent 75%
        ),
        linear-gradient(
            135deg,
            rgba(25, 28, 55, 1),
            rgba(15, 18, 35, 1)
        )
    `;

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;
    mouseX.set(x);
    mouseY.set(y);

    const centerX = width / 2;
    const centerY = height / 2;

    const rotateXValue = ((y - centerY) / height) * -tiltIntensity;
    const rotateYValue = ((x - centerX) / width) * tiltIntensity;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return {
    handleMouseMove,
    handleMouseLeave,
    cardStyle: {
      rotateX,
      rotateY,
      transformStyle: "preserve-3d",
    },
    overlayStyle: {
      background: theme === "dark" ? darkGradient : lightGradient,
    },
  };
};
