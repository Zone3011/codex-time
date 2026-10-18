export const experiences = [
  {
    id: "home",
    label: "Hello",
    engine: "Three.js + GSAP",
    color: "#ffcf00",
    tip: "An original N built from connected dots. Scroll to travel around it, or unfold the network with the button. Three.js renders the scene; GSAP handles the introduction.",
  },
  {
    id: "play",
    label: "Play",
    engine: "Matter.js",
    color: "#ff4b24",
    tip: "Grab a shape and let it go. These are real simulated bodies: weight, gravity, collisions. The buttons work without dragging, too.",
  },
  {
    id: "skills",
    label: "Toolkit",
    engine: "Motion",
    color: "#f33294",
    tip: "Choose a technology. Motion rearranges the shared highlight and brings each detail into place. These are technologies Nirav actually uses.",
  },
  {
    id: "world",
    label: "Depth",
    engine: "Three.js",
    color: "#183df5",
    tip: "A real-time 3D sculpture, made from geometry and a custom shader. Try a different finish or turn it with the slider. No video here.",
  },
  {
    id: "about",
    label: "Story",
    engine: "Anime.js",
    color: "#19bda5",
    tip: "A few real details about Nirav. Use Trace the line to draw the connection yourself. The page does not animate it as you scroll.",
  },
  {
    id: "contact",
    label: "Say hello",
    engine: "canvas-confetti",
    color: "#ff4b24",
    tip: "A small celebration, only if you ask for it. Email goes straight to Nirav. I’m a local guide, not a chatbot, and I don’t collect anything.",
  },
] as const;
