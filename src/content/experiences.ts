export const experiences = [
  {
    id: "home",
    label: "Hello",
    engine: "GSAP",
    color: "#b5a1f5",
    tip: "Welcome to Nirav’s corner. The opening shapes move with your pointer. GSAP gives the movement its soft, springy finish.",
  },
  {
    id: "play",
    label: "Play",
    engine: "Matter.js",
    color: "#d2ecd9",
    tip: "Grab a shape and let it go. These are real simulated bodies: weight, gravity, collisions. The buttons work without dragging, too.",
  },
  {
    id: "skills",
    label: "Toolkit",
    engine: "Motion",
    color: "#f8b591",
    tip: "Choose a technology. Motion rearranges the shared highlight and brings each detail into place. These are technologies Nirav actually uses.",
  },
  {
    id: "world",
    label: "Depth",
    engine: "Three.js",
    color: "#acbaff",
    tip: "A real-time 3D sculpture, made from geometry and a custom shader. Try a different finish or turn it with the slider. No video here.",
  },
  {
    id: "about",
    label: "Story",
    engine: "Anime.js",
    color: "#f2c8d4",
    tip: "The line draws as you scroll. Anime.js connects the points in Nirav’s story, with room for the next chapter.",
  },
  {
    id: "contact",
    label: "Say hello",
    engine: "canvas-confetti",
    color: "#d2ecd9",
    tip: "A small celebration, only if you ask for it. Email goes straight to Nirav. I’m a local guide, not a chatbot, and I don’t collect anything.",
  },
] as const;
