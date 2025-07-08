import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export const ParticlesBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      init={particlesInit}
      className="absolute top-0 left-0 w-full h-full -z-10"
      options={{
        fullScreen: false,
        background: { color: { value: "#ffffff" } },
        fpsLimit: 60,
        particles: {
          number: {
            value: 140,
            density: { enable: true, area: 700 },
          },
          color: {
            value: ["#f472b6", "#93c5fd", "#c4b5fd", "#6ee7b7", "#fdba74"], // rosa, azul, lila, menta, durazno
          },
          shape: { type: "circle" },
          opacity: {
            value: 0.5,
            random: true,
          },
          size: {
            value: { min: 2, max: 6 },
            random: true,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            outModes: { default: "out" },
            straight: false,
          },
          links: {
            enable: false,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse", // efecto al pasar el mouse
            },
            onClick: {
              enable: false,
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 80,
              duration: 0.3,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};
