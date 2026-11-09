/*!
 * swarm-intro.js
 * Supplied by the portfolio owner. Integration: native scrolling, coordinated colors,
 * and opt-in choreography (stage groups, three-cursor crew, readable headline typing).
 * A small, dependency-free page-intro animation engine: multiplayer cursors, lightning, roots, webs and more
 * build your page on load. Original code written for this demo. It is not taken from the Swarm Rebuild extension.
 *
 * Usage (drop-in):
 *   <script src="swarm-intro.js" data-auto data-mode="storm" data-vibe="crimson"></script>
 *
 * Usage (manual):
 *   SwarmIntro.play({ mode: 'wireframe', vibe: 'cute', cursors: 6, speed: 1.5, ui: false });
 *   SwarmIntro.skip();  SwarmIntro.setSpeed(2);  SwarmIntro.running  // true while playing
 *
 *   mode: 'swarm'     cursors drag boxes out and type the text in
 *         'wireframe' sketch first (blueprint outlines), then paint the real page in
 *         'mycelium'  a glowing root network grows through a dark void and opens each block
 *         'web'       threads are shot at every component, which spring in from different sides
 *         'depth'     the components float apart in 3D, labelled like an exploded diagram, then snap back
 *         'storm'     lightning strings jump from piece to piece and a bolt strikes each one into place
 *         'magnet'    pieces drift about like iron filings until a horseshoe magnet sweeps over and snaps each home
 *         'glitch'    the page locks in out of static, RGB splits and torn scanlines
 *         'origami'   each piece unfolds from a creased flap while paper birds fly over the page
 *         'constellation'  stars join into lines and each little constellation lights up one piece
 *   vibe: 'classic' | 'cute' | 'sunset' | 'arcade' | 'neon' | 'forest' | 'ocean' | 'candy' | 'crimson'
 *         (also sets data-vibe on <html> so your own CSS can restyle the whole page to match)
 *
 *   random: true (default) rolls a new plan every run: start point, build order, colour order, timing, strike angles.
 *          Set random:false for the old fixed behaviour (start at the logo, build top to bottom).
 *   origin: 'auto' | 'logo' | 'corner' | 'center' | 'edge' | 'piece' | 'mouse'   (where the build starts)
 *   order:  'auto' | 'down' | 'up' | 'left' | 'right' | 'out' | 'in' | 'spin' | 'shuffle'   (which pieces come first)
 *   SwarmIntro.lastPlan tells you what the last run rolled.
 *
 * Script-tag attributes: data-auto, data-mode, data-vibe, data-random="false", data-origin, data-order, data-cursors, data-speed, data-ui="false", data-logo
 * Optional attributes on your own elements:
 *   data-swarm-logo     the element the cursors / lightning start from
 *   data-swarm-ignore   leave this element (and its children) alone
 */
(function (global) {
  'use strict';

  var NAMES = ['Mira', 'Dev', 'Kai', 'Zoe', 'Arjun', 'Lena', 'Theo', 'Noor'];
  var COLORS = ['#7650e8', '#d6469f', '#db852b', '#398ac6', '#9b59cb', '#e26866', '#478c9b', '#b47b38'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, HEAD: 1, META: 1, LINK: 1, BR: 1, WBR: 1, OPTION: 1, OPTGROUP: 1, SOURCE: 1, TRACK: 1, AREA: 1, MAP: 1 };
  var MEDIA = { IMG: 1, SVG: 1, VIDEO: 1, CANVAS: 1, IFRAME: 1, INPUT: 1, TEXTAREA: 1, SELECT: 1 };
  var NS = 'http://www.w3.org/2000/svg';
  // looks: 'classic' (crisp neon on night), 'cute' (pastel + flowers), 'sunset' (lo-fi dusk), 'arcade' (8-bit pixels), 'neon' (synthwave)
  var PAL = {
    classic: {
      label: 'Classic', fx: 'glow', sky: 'night', fly: false, sw: '#0a62c9,#0e8f7e', names: NAMES, colors: COLORS,
      vein: [[61, 245, 255], [255, 79, 216], [182, 255, 61], [255, 177, 61], [154, 107, 255]],
      ink: '22,40,58', shadow: '15,31,44', motes: ['10,98,201', '14,143,126'], spore: '170,215,255', comp: 'lighter'
    },
    cute: {
      label: 'Cute', fx: 'cute', sky: 'pastel', fly: false, sw: '#ff7eb0,#9b7dff', names: ['Mochi', 'Boba', 'Pixel', 'Cloud', 'Peach', 'Bun', 'Luna', 'Kiwi'],
      colors: ['#ff6fa5', '#9b7dff', '#2fc08f', '#3ba7ff', '#ff9a3d', '#f2b705', '#ff7a8a', '#5b8def'],
      vein: [[255, 111, 165], [155, 125, 255], [47, 192, 143], [59, 167, 255], [255, 154, 61]],
      ink: '196,70,128', shadow: '150,80,170', motes: ['255,111,165', '155,125,255'], spore: '255,255,255', comp: 'source-over'
    },
    sunset: {
      label: 'Lo-fi sunset', fx: 'glow', sky: 'sunset', fly: true, sw: '#ff9a62,#7a3b8f', names: ['Dusk', 'Ember', 'Mango', 'Haze', 'Coral', 'Lumen', 'Amber', 'Plum'],
      colors: ['#e4703c', '#d6456f', '#c98a1a', '#9a56d6', '#d9553a', '#c77a2a', '#c24a82', '#b88a00'],
      vein: [[255, 154, 98], [255, 111, 145], [255, 198, 110], [199, 125, 255], [255, 122, 89]],
      ink: '255,205,170', shadow: '10,0,30', motes: ['255,154,98', '199,125,255'], spore: '255,210,160', comp: 'lighter'
    },
    arcade: {
      label: 'Retro arcade', fx: 'pixel', sky: 'pixel', fly: false, sw: '#ffd23f,#3bf2a0', names: ['P1', 'P2', 'CPU', 'NPC', 'Boss', 'Wizard', 'Rogue', 'Bard'],
      colors: ['#e63956', '#d68c00', '#0fa56b', '#1b8fd1', '#8a5cf0', '#e8590c', '#0b9e7a', '#d6246f'],
      vein: [[255, 77, 109], [255, 210, 63], [59, 242, 160], [76, 201, 240], [179, 136, 255]],
      ink: '244,241,222', shadow: '0,0,0', motes: ['255,210,63', '59,242,160'], spore: '255,255,255', comp: 'source-over'
    },
    neon: {
      label: 'Dark neon', fx: 'glow', sky: 'grid', fly: false, sw: '#00f0ff,#ff2bd6', names: ['Volt', 'Glitch', 'Nyx', 'Echo', 'Pulse', 'Zero', 'Byte', 'Flux'],
      colors: ['#0a9fb0', '#e0149d', '#6a4cff', '#6aa800', '#e0305f', '#00a870', '#b89700', '#3a62e0'],
      vein: [[0, 240, 255], [255, 43, 214], [122, 92, 255], [182, 255, 61], [255, 61, 113]],
      ink: '127,250,255', shadow: '0,0,0', motes: ['0,240,255', '255,43,214'], spore: '120,250,255', comp: 'lighter'
    },
    forest: {
      label: 'Cozy forest', fx: 'vine', sky: 'forest', fly: true, sw: '#e9b44c,#2f6b3f', names: ['Moss', 'Fern', 'Acorn', 'Willow', 'Pip', 'Bramble', 'Maple', 'Clover'],
      colors: ['#3f8f4f', '#b9722a', '#7a5a2a', '#2f8a74', '#c0553a', '#5b7a2f', '#a05a2b', '#4a8a3a'],
      vein: [[123, 196, 127], [233, 180, 76], [160, 210, 110], [205, 140, 85], [110, 180, 160]],
      ink: '243,234,210', shadow: '0,0,0', motes: ['233,180,76', '123,196,127'], spore: '255,226,140', comp: 'source-over'
    },
    ocean: {
      label: 'Ocean', fx: 'glow', sky: 'ocean', fly: false, bubble: true, sw: '#35d0e6,#0b5d85', names: ['Reef', 'Pearl', 'Kelp', 'Tide', 'Coral', 'Squid', 'Shelly', 'Wave'],
      colors: ['#0b86a8', '#e8573f', '#1f9d6b', '#5a67d8', '#d6489a', '#c98a00', '#0e9aa7', '#3f7be0'],
      vein: [[53, 230, 255], [255, 122, 107], [120, 255, 200], [170, 140, 255], [255, 214, 102]],
      ink: '8,50,74', shadow: '6,60,90', motes: ['11,134,168', '255,122,107'], spore: '120,225,255', comp: 'lighter'
    },
    candy: {
      label: 'Candy', fx: 'candy', sky: 'candy', fly: false, sw: '#ff6bb0,#3fe0b5', names: ['Gummy', 'Taffy', 'Jelly', 'Fudge', 'Sprinkle', 'Choco', 'Mint', 'Candy'],
      colors: ['#e0338a', '#7c4dff', '#0fae84', '#1e88e5', '#f07a1a', '#b88a00', '#e5484d', '#8e44ad'],
      vein: [[255, 77, 157], [63, 224, 181], [255, 217, 59], [139, 92, 246], [255, 138, 61]],
      ink: '45,27,78', shadow: '90,40,140', motes: ['255,77,157', '139,92,246'], spore: '255,255,255', comp: 'source-over'
    }
  };
  PAL.crimson = {
    label: 'Red lightning', fx: 'bolt', sky: 'crimson', fly: true, sw: '#ff1f3d,#14070a', names: ['Surge', 'Arc', 'Havoc', 'Ember', 'Razor', 'Bolt', 'Vex', 'Storm'],
    colors: ['#d1102d', '#b5122b', '#e5483f', '#9c0f24', '#d63a1f', '#c2185b', '#a8102a', '#e0301e'],
    vein: [[255, 31, 61], [255, 90, 60], [255, 60, 120], [255, 140, 60], [255, 180, 170]],
    ink: '255,120,130', shadow: '0,0,0', motes: ['255,31,61', '255,120,60'], spore: '255,110,90', comp: 'lighter'
  };
  var VIBES = ['classic', 'cute', 'sunset', 'arcade', 'neon', 'forest', 'ocean', 'candy', 'crimson'];
  var P = PAL.classic;

  var DEFAULTS = { mode: 'swarm', vibe: 'classic', random: true, origin: 'auto', order: 'auto', cursors: 6, speed: 2, ui: true, maxTasks: 160, root: null, logo: null, onDone: null, force: false };

  var state = { speed: DEFAULTS.speed, mouse: { x: innerWidth / 2, y: innerHeight / 2 }, opts: null };
  var current = null;
  var root = null;
  var ui = null;

  /* ---------- styles ---------- */

  var CSS = [
    'html.sw-boot body{opacity:0!important}',
    '.sw-hide-box{background-color:transparent!important;background-image:none!important;border-color:transparent!important;box-shadow:none!important;outline-color:transparent!important}',
    '.sw-hide-media{opacity:0!important}',
    '#sw-root{position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden;font:12px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',
    '#sw-root *{box-sizing:border-box}',
    '.sw-cur{position:absolute;left:0;top:0;opacity:0;transition:opacity .35s;will-change:transform}',
    '.sw-cur svg{display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}',
    '.sw-cross{display:none;position:absolute;left:-9.5px;top:-9.5px}',
    '.sw-cur.sw-crosshair .sw-arrow{display:none}',
    '.sw-cur.sw-crosshair .sw-cross{display:block}',
    '.sw-tag{position:absolute;left:13px;top:19px;padding:3px 7px;border-radius:999px;color:#fff;font-weight:600;font-size:11px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.25)}',
    '.sw-sel{position:absolute;left:0;top:0;border:1px solid;background:rgba(30,167,253,.07);background:color-mix(in srgb,currentColor 8%,transparent);transition:opacity .3s}',
    '.sw-sel i{position:absolute;width:7px;height:7px;background:#fff;border:1px solid currentColor}',
    '.sw-sel i:nth-child(1){left:-4px;top:-4px}.sw-sel i:nth-child(2){right:-4px;top:-4px}',
    '.sw-sel i:nth-child(3){left:-4px;bottom:-4px}.sw-sel i:nth-child(4){right:-4px;bottom:-4px}',
    '.sw-badge{position:absolute;left:0;top:0;padding:3px 6px;border-radius:4px;color:#fff;font-size:11px;font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}',
    '.sw-caret{position:absolute;left:0;top:0;width:2px;animation:sw-blink .8s steps(1) infinite}',
    '@keyframes sw-blink{50%{opacity:0}}',
    '.sw-ui{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:flex;align-items:center;gap:6px;padding:6px 8px 6px 14px;border-radius:999px;background:#14141c;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,.28);pointer-events:auto;white-space:nowrap}',
    '.sw-ui b{font-weight:600;margin-right:6px;opacity:.85}',
    '.sw-ui button{font:inherit;font-weight:600;color:#fff;background:transparent;border:0;border-radius:999px;padding:7px 11px;cursor:pointer}',
    '.sw-ui button:hover{background:rgba(255,255,255,.12)}',
    '.sw-ui button:focus-visible{outline:2px solid #8ab4ff;outline-offset:1px}',
    '.sw-ui button.on{background:rgba(255,255,255,.2)}',
    '.sw-ui .sw-main{background:#fff;color:#14141c;padding:7px 14px}',
    '.sw-ui .sw-main:hover{background:#e8e8f2}',
    '.sw-grid{position:absolute;inset:0;opacity:0;transition:opacity .7s;background-image:radial-gradient(circle,rgba(110,125,145,.38) 1px,transparent 1.4px);background-size:24px 24px}',
    '.sw-wf{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}',
    '.sw-wf *{transition:opacity .45s}',
    '.sw-ripple{position:absolute;width:64px;height:64px;border:2px solid;border-radius:50%;transform:translate(-50%,-50%) scale(.2);animation:sw-rip .65s ease-out forwards}',
    '@keyframes sw-rip{to{transform:translate(-50%,-50%) scale(1.7);opacity:0}}',
    '.sw-ui .sw-sep{width:1px;height:18px;background:rgba(255,255,255,.22);margin:0 2px}',
    '.sw-cv{position:absolute;left:0;top:0;width:100%;height:100%}',
    '#sw-root.sw-v-cute{font-family:"Fredoka","Nunito",ui-rounded,system-ui,sans-serif}',
    '#sw-root.sw-v-cute .sw-grid{background-image:radial-gradient(circle,rgba(255,111,165,.5) 1.2px,transparent 1.9px)}',
    '#sw-root.sw-v-cute .sw-ui{background:#fff;color:#5a3a6e;box-shadow:0 10px 30px rgba(255,111,165,.35),0 0 0 2px #ffd3e4}',
    '#sw-root.sw-v-cute .sw-ui button{color:#5a3a6e}',
    '#sw-root.sw-v-cute .sw-ui button:hover{background:rgba(255,111,165,.14)}',
    '#sw-root.sw-v-cute .sw-ui button.on{background:#ffd9e8;color:#b8286a}',
    '#sw-root.sw-v-cute .sw-ui .sw-main{background:#ff6fa5;color:#fff}',
    '#sw-root.sw-v-cute .sw-ui .sw-main:hover{background:#ff5496}',
    '#sw-root.sw-v-cute .sw-ui .sw-sep{background:rgba(90,58,110,.2)}',
    '#sw-root.sw-v-cute .sw-badge{border-radius:999px;padding:3px 9px}',
    '.sw-vibes{display:inline-flex;align-items:center;gap:7px;margin:0 3px}',
    '#sw-root .sw-ui .sw-dot{width:18px;height:18px;padding:0;border-radius:50%;background:linear-gradient(135deg,var(--a),var(--b))!important;box-shadow:0 0 0 1px rgba(128,128,128,.45)}',
    '#sw-root .sw-ui .sw-dot.on{transform:scale(1.22);box-shadow:0 0 0 2px currentColor}',
    '#sw-root.sw-v-sunset{font-family:"DM Sans",system-ui,sans-serif}',
    '#sw-root.sw-v-sunset .sw-grid{background-image:radial-gradient(circle,rgba(255,154,98,.5) 1px,transparent 1.5px)}',
    '#sw-root.sw-v-sunset .sw-ui{background:#2c1d45;color:#ffe9d6;box-shadow:0 10px 30px rgba(255,120,80,.35),0 0 0 1px rgba(255,170,120,.3)}',
    '#sw-root.sw-v-sunset .sw-ui button{color:#ffe9d6}',
    '#sw-root.sw-v-sunset .sw-ui button:hover{background:rgba(255,154,98,.18)}',
    '#sw-root.sw-v-sunset .sw-ui button.on{background:rgba(255,154,98,.3)}',
    '#sw-root.sw-v-sunset .sw-ui .sw-main{background:#ff9a62;color:#2a1236}',
    '#sw-root.sw-v-sunset .sw-ui .sw-main:hover{background:#ffb07f}',
    '#sw-root.sw-v-arcade{font-family:"Press Start 2P",ui-monospace,monospace;font-size:9px}',
    '#sw-root.sw-v-arcade .sw-grid{background-image:linear-gradient(rgba(255,210,63,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(255,210,63,.22) 1px,transparent 1px);background-size:24px 24px}',
    '#sw-root.sw-v-arcade .sw-ui{background:#14122b;color:#f4f1de;border-radius:0;border:3px solid #ffd23f;box-shadow:5px 5px 0 #ff4d6d}',
    '#sw-root.sw-v-arcade .sw-ui button{color:#f4f1de;border-radius:0;font-weight:400;padding:8px 9px}',
    '#sw-root.sw-v-arcade .sw-ui button:hover{background:rgba(255,210,63,.18)}',
    '#sw-root.sw-v-arcade .sw-ui button.on{background:#ffd23f;color:#14122b}',
    '#sw-root.sw-v-arcade .sw-ui .sw-main{background:#3bf2a0;color:#14122b}',
    '#sw-root.sw-v-arcade .sw-ui .sw-main:hover{background:#7dffc6}',
    '#sw-root.sw-v-arcade .sw-ui .sw-dot{border-radius:0;padding:0}',
    '#sw-root.sw-v-arcade .sw-ui .sw-sep{background:rgba(244,241,222,.3)}',
    '#sw-root.sw-v-arcade .sw-tag,#sw-root.sw-v-arcade .sw-badge{border-radius:0;font-weight:400;font-size:8px;padding:4px 6px;box-shadow:2px 2px 0 rgba(0,0,0,.6)}',
    '#sw-root.sw-v-arcade .sw-sel{border-width:2px;border-style:solid}',
    '#sw-root.sw-v-neon{font-family:"Chakra Petch",system-ui,sans-serif}',
    '#sw-root.sw-v-neon .sw-grid{background-image:linear-gradient(rgba(0,240,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,43,214,.25) 1px,transparent 1px);background-size:32px 32px}',
    '#sw-root.sw-v-neon .sw-ui{background:#0b0818;color:#e9f1ff;box-shadow:0 0 0 1px #00f0ff,0 0 22px rgba(0,240,255,.5),0 0 46px rgba(255,43,214,.28)}',
    '#sw-root.sw-v-neon .sw-ui button{color:#e9f1ff}',
    '#sw-root.sw-v-neon .sw-ui button:hover{background:rgba(0,240,255,.14)}',
    '#sw-root.sw-v-neon .sw-ui button.on{background:rgba(0,240,255,.2);color:#7ffaff}',
    '#sw-root.sw-v-neon .sw-ui .sw-main{background:#ff2bd6;color:#fff;box-shadow:0 0 14px rgba(255,43,214,.7)}',
    '#sw-root.sw-v-neon .sw-ui .sw-main:hover{background:#ff59e0}',
    '#sw-root.sw-v-neon .sw-ui .sw-sep{background:rgba(0,240,255,.35)}',
    '#sw-root.sw-v-forest{font-family:"Nunito",system-ui,sans-serif}',
    '#sw-root.sw-v-forest .sw-grid{background-image:radial-gradient(circle,rgba(233,180,76,.45) 1px,transparent 1.5px)}',
    '#sw-root.sw-v-forest .sw-ui{background:#1d3228;color:#f3ead2;box-shadow:0 10px 30px rgba(0,0,0,.4),0 0 0 1px rgba(233,180,76,.4),0 0 24px rgba(233,180,76,.18)}',
    '#sw-root.sw-v-forest .sw-ui button{color:#f3ead2}',
    '#sw-root.sw-v-forest .sw-ui button:hover{background:rgba(233,180,76,.16)}',
    '#sw-root.sw-v-forest .sw-ui button.on{background:rgba(233,180,76,.28)}',
    '#sw-root.sw-v-forest .sw-ui .sw-main{background:#e9b44c;color:#1b2a1f}',
    '#sw-root.sw-v-forest .sw-ui .sw-main:hover{background:#f2c668}',
    '#sw-root.sw-v-ocean{font-family:"Quicksand","Nunito",system-ui,sans-serif}',
    '#sw-root.sw-v-ocean .sw-grid{background-image:radial-gradient(circle,rgba(11,134,168,.4) 1.2px,transparent 1.8px)}',
    '#sw-root.sw-v-ocean .sw-ui{background:#08324a;color:#e6fbff;box-shadow:0 10px 30px rgba(8,50,74,.4),0 0 0 1px rgba(53,208,230,.5)}',
    '#sw-root.sw-v-ocean .sw-ui button{color:#e6fbff}',
    '#sw-root.sw-v-ocean .sw-ui button:hover{background:rgba(53,208,230,.16)}',
    '#sw-root.sw-v-ocean .sw-ui button.on{background:rgba(53,208,230,.3)}',
    '#sw-root.sw-v-ocean .sw-ui .sw-main{background:#35d0e6;color:#04283a}',
    '#sw-root.sw-v-ocean .sw-ui .sw-main:hover{background:#6fe3f3}',
    '#sw-root.sw-v-candy{font-family:"Baloo 2","Nunito",system-ui,sans-serif}',
    '#sw-root.sw-v-candy .sw-grid{background-image:radial-gradient(circle,rgba(255,77,157,.5) 2px,transparent 2.6px)}',
    '#sw-root.sw-v-candy .sw-ui{background:#fff;color:#2d1b4e;border:3px solid #2d1b4e;box-shadow:5px 5px 0 #ff6bb0}',
    '#sw-root.sw-v-candy .sw-ui button{color:#2d1b4e;font-weight:800}',
    '#sw-root.sw-v-candy .sw-ui button:hover{background:rgba(255,107,176,.2)}',
    '#sw-root.sw-v-candy .sw-ui button.on{background:#ffd93b}',
    '#sw-root.sw-v-candy .sw-ui .sw-main{background:#ff6bb0;color:#2d1b4e}',
    '#sw-root.sw-v-candy .sw-ui .sw-main:hover{background:#ff8cc3}',
    '#sw-root.sw-v-candy .sw-ui .sw-sep{background:rgba(45,27,78,.3)}',
    '#sw-root.sw-v-candy .sw-tag,#sw-root.sw-v-candy .sw-badge{border:2px solid #2d1b4e;font-weight:800}',
    '#sw-root.sw-v-crimson{font-family:"Barlow",system-ui,sans-serif}',
    '#sw-root.sw-v-crimson .sw-grid{background-image:linear-gradient(rgba(255,31,61,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(255,31,61,.22) 1px,transparent 1px);background-size:28px 28px}',
    '#sw-root.sw-v-crimson .sw-ui{background:#0a0506;color:#f4eceb;border-radius:8px;box-shadow:0 0 0 1px #ff1f3d,0 0 26px rgba(255,31,61,.5)}',
    '#sw-root.sw-v-crimson .sw-ui button{color:#f4eceb;border-radius:4px;text-transform:uppercase;letter-spacing:.06em;font-size:11px}',
    '#sw-root.sw-v-crimson .sw-ui button:hover{background:rgba(255,31,61,.18)}',
    '#sw-root.sw-v-crimson .sw-ui button.on{background:rgba(255,31,61,.3);color:#ff8a98}',
    '#sw-root.sw-v-crimson .sw-ui .sw-main{background:#ff1f3d;color:#fff;box-shadow:0 0 14px rgba(255,31,61,.7)}',
    '#sw-root.sw-v-crimson .sw-ui .sw-main:hover{background:#ff4a63}',
    '#sw-root.sw-v-crimson .sw-ui .sw-sep{background:rgba(255,31,61,.4)}',
    '#sw-root.sw-v-crimson .sw-tag,#sw-root.sw-v-crimson .sw-badge{border-radius:2px;text-transform:uppercase;letter-spacing:.05em}',
    '.sw-ui .sw-br{display:none}',
    '@media (max-width:1360px){.sw-ui b{display:none}.sw-ui{flex-wrap:wrap;justify-content:center;border-radius:22px;max-width:calc(100vw - 24px)}.sw-ui .sw-br{display:block;flex-basis:100%;height:0}.sw-ui .sw-br+.sw-sep{display:none}}',
    '@media (max-width:560px){.sw-ui b,.sw-ui .sw-speeds,.sw-ui .sw-sep{display:none}.sw-ui{padding:6px 8px;flex-wrap:wrap;justify-content:center;border-radius:20px;max-width:calc(100vw - 16px)}.sw-ui button{padding:7px 9px}}'
  ].join('\n');

  function ensureStyle() {
    if (document.getElementById('sw-style')) return;
    var s = document.createElement('style');
    s.id = 'sw-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function mk(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function ensureRoot() {
    if (root && root.parentNode) return root;
    root = document.getElementById('sw-root');
    if (!root) {
      root = mk('div');
      root.id = 'sw-root';
      document.body.appendChild(root);
    }
    return root;
  }

  /* ---------- scanning the page ---------- */

  function visibleColor(c) {
    if (!c || c === 'transparent') return false;
    if (/rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*0\s*\)/.test(c)) return false;
    if (/\/\s*0\s*\)\s*$/.test(c)) return false;
    return true;
  }

  function hasBox(cs) {
    if (cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text') return false;
    if (visibleColor(cs.backgroundColor) || cs.backgroundImage !== 'none') return true;
    if (cs.boxShadow !== 'none') return true;
    var sides = ['Top', 'Right', 'Bottom', 'Left'];
    for (var i = 0; i < 4; i++) {
      var s = sides[i];
      var st = cs['border' + s + 'Style'];
      if (parseFloat(cs['border' + s + 'Width']) > 0 && st !== 'none' && st !== 'hidden' && visibleColor(cs['border' + s + 'Color'])) return true;
    }
    return false;
  }

  function depthOf(el) {
    var d = 0;
    for (var p = el; p; p = p.parentElement) d++;
    return d;
  }

  function clampRect(r) {
    var vw = innerWidth, vh = innerHeight;
    var l = Math.max(0, r.left), t = Math.max(0, r.top);
    var rr = Math.min(vw, r.right), bb = Math.min(vh, r.bottom);
    return { l: l, t: t, w: Math.max(1, rr - l), h: Math.max(1, bb - t) };
  }

  function radiusOf(cs, w, h) {
    var v = (cs.borderTopLeftRadius || '0').split(' ')[0], n = parseFloat(v) || 0;
    if (/%/.test(v)) n = Math.min(w, h) * n / 100;
    return Math.max(0, Math.min(n, Math.min(w, h) / 2));
  }

  // Merge the many small text boxes the browser reports into one box per visual line.
  function clusterLines(rs) {
    rs = rs.slice().sort(function (a, b) { return (a.t - b.t) || (a.l - b.l); });
    var lines = [];
    rs.forEach(function (r) {
      var cy = (r.t + r.b) / 2, ln = null;
      for (var i = lines.length - 1; i >= 0 && i >= lines.length - 3; i--) {
        if (cy > lines[i].t && cy < lines[i].b) { ln = lines[i]; break; }
      }
      if (!ln) lines.push({ l: r.l, t: r.t, r: r.r, b: r.b });
      else { ln.l = Math.min(ln.l, r.l); ln.r = Math.max(ln.r, r.r); ln.t = Math.min(ln.t, r.t); ln.b = Math.max(ln.b, r.b); }
    });
    return lines.map(function (L) { return { l: L.l, t: L.t, w: L.r - L.l, h: L.b - L.t }; });
  }

  function scan(rootEl) {
    var tasks = [];
    var vw = innerWidth, vh = innerHeight;
    var all = rootEl.querySelectorAll('*');
    var i, el;

    // boxes and media
    for (i = 0; i < all.length; i++) {
      el = all[i];
      var tag = el.tagName.toUpperCase();
      if (SKIP[tag] || el.ownerSVGElement) continue;
      if (el.closest('#sw-root,[data-swarm-ignore]')) continue;
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) continue;
      var type = null;
      if (MEDIA[tag]) type = 'media';
      else if (el !== document.body && el !== document.documentElement && hasBox(cs)) type = 'rect';
      if (type) tasks.push({
        type: type, el: el, rect: clampRect(r), depth: depthOf(el), parent: null, state: 0,
        full: { l: r.left, t: r.top, w: r.width, h: r.height }, rx: radiusOf(cs, r.width, r.height)
      });
    }

    // text, grouped by the nearest non-inline element
    var walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
    var groups = new Map();
    var range = document.createRange();
    var node;
    while ((node = walker.nextNode())) {
      if (!/\S/.test(node.nodeValue)) continue;
      var pe = node.parentElement;
      if (!pe || SKIP[pe.tagName.toUpperCase()] || pe.ownerSVGElement) continue;
      if (pe.closest('#sw-root,[data-swarm-ignore],textarea,select,button[disabled] > svg')) continue;
      range.selectNodeContents(node);
      var rects = range.getClientRects();
      if (!rects.length) continue;
      var inView = false;
      for (var k = 0; k < rects.length; k++) {
        var q = rects[k];
        if (q.width > 0 && q.height > 0 && q.top < vh && q.bottom > 0 && q.left < vw && q.right > 0) inView = true;
      }
      if (!inView) continue;
      var owner = pe;
      while (owner.parentElement && owner !== rootEl && getComputedStyle(owner).display === 'inline') owner = owner.parentElement;
      var ocs = getComputedStyle(owner);
      if (ocs.display === 'none' || ocs.visibility === 'hidden' || +ocs.opacity === 0) continue;
      var g = groups.get(owner);
      if (!g) { g = { el: owner, nodes: [], rects: [], l: 1e9, t: 1e9, r: -1e9, b: -1e9, chars: 0 }; groups.set(owner, g); }
      g.nodes.push(node);
      g.chars += node.nodeValue.trim().length;
      for (var m = 0; m < rects.length; m++) {
        var u = rects[m];
        if (u.width <= 0 || u.height <= 0) continue;
        g.l = Math.min(g.l, u.left); g.t = Math.min(g.t, u.top);
        g.r = Math.max(g.r, u.right); g.b = Math.max(g.b, u.bottom);
        g.rects.push({ l: u.left, t: u.top, r: u.right, b: u.bottom });
      }
    }
    groups.forEach(function (g) {
      if (g.r < g.l) return;
      tasks.push({
        type: 'text', el: g.el, nodes: g.nodes, short: g.chars <= 28,
        rect: clampRect({ left: g.l, top: g.t, right: g.r, bottom: g.b }),
        lines: clusterLines(g.rects),
        depth: depthOf(g.el) + 0.5, parent: null, state: 0
      });
    });

    return tasks;
  }

  function orderAndLink(tasks, max) {
    tasks.sort(function (a, b) {
      return (a.rect.t - b.rect.t) || (a.depth - b.depth) || (a.rect.l - b.rect.l);
    });
    if (tasks.length > max) tasks.length = max;
    var byEl = new Map();
    tasks.forEach(function (t) { if (t.type === 'rect') byEl.set(t.el, t); });
    tasks.forEach(function (t) {
      var p = t.type === 'text' ? t.el : t.el.parentElement;
      while (p) {
        var pt = byEl.get(p);
        if (pt && pt !== t) { t.parent = pt; break; }
        p = p.parentElement;
      }
    });
    return tasks;
  }

  /* Wrap text in hidden spans so it can be typed in without moving the layout. */
  function wrapText(t, fade) {
    t.units = [];
    t.wraps = [];
    t.nodes.forEach(function (node) {
      var parent = node.parentNode;
      if (!parent) return;
      var wrap = mk('span', 'sw-w');
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { wrap.appendChild(document.createTextNode(part)); return; }
        var pieces = t.short ? Array.from(part) : [part];
        pieces.forEach(function (ch) {
          var s = mk('span');
          s.style.visibility = 'hidden';
          if (fade) { s.style.opacity = '0'; s.style.transition = 'opacity .4s ease'; }
          s.textContent = ch;
          wrap.appendChild(s);
          t.units.push(s);
        });
      });
      parent.replaceChild(wrap, node);
      t.wraps.push({ wrap: wrap, node: node });
    });
  }

  function prepare(tasks, fade) {
    tasks.forEach(function (t) {
      if (t.type === 'rect') t.el.classList.add('sw-hide-box');
      else if (t.type === 'media') t.el.classList.add('sw-hide-media');
      else wrapText(t, fade);
    });
  }

  /* ---------- cursors ---------- */

  function makeCursor(i, n) {
    var off = state.coff || 0, color = P.colors[(i + off) % P.colors.length], name = P.names[(i + off) % P.names.length];
    var el = mk('div', 'sw-cur');
    el.innerHTML =
      '<svg class="sw-arrow" width="16" height="22" viewBox="0 0 16 22" aria-hidden="true"><path d="M1.5 1.5v16l4.2-3.9 3 7 3-1.3-3-6.8h5.6z" fill="' + color + '" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg>' +
      '<svg class="sw-cross" width="19" height="19" viewBox="0 0 19 19" aria-hidden="true"><path d="M9.5 0v19M0 9.5h19" stroke="#fff" stroke-width="3.2"/><path d="M9.5 0v19M0 9.5h19" stroke="' + color + '" stroke-width="1.3"/></svg>' +
      '<span class="sw-tag" style="background:' + color + '">' + name + '</span>';
    return {
      el: el, color: color, name: name, x: 0, y: 0, bend: 0,
      angle: (i / n) * Math.PI * 2,
      set: function (x, y) {
        this.x = x; this.y = y;
        el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      },
      mode: function (m) { el.classList.toggle('sw-crosshair', m === 'cross'); }
    };
  }

  /* ---------- the intro itself ---------- */

  function ready() {
    return new Promise(function (resolve) {
      void document.body.offsetWidth;   // flush a just-switched theme so fonts start loading
      var done = false;
      function go() { if (!done) { done = true; resolve(); } }
      var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      var load = document.readyState === 'complete' ? Promise.resolve() : new Promise(function (r) { addEventListener('load', r, { once: true }); });
      Promise.all([fonts, load]).then(go);
      setTimeout(go, 1500);
    });
  }

  async function runIntro(opts) {
    var R = { dead: false, skip: null };
    current = R;
    var rootEl = ensureRoot();
    var cursors = [];
    var tasks = [];
    var n = Math.max(1, Math.min(8, opts.cursors | 0));
    var PL = null;   // this run's plan: where it starts, which way it builds, and a few dice rolls
    if (opts.random !== false && !opts.choreography) n = Math.max(2, Math.min(8, n + Math.round((Math.random() - 0.5) * 4)));
    var finishResolve;
    var finished = new Promise(function (res) { finishResolve = res; });

    function sleep(ms) { return new Promise(function (res) { setTimeout(res, ms / state.speed); }); }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }


    // Rolls the dice for this run: where the build starts, in which order the pieces arrive, and a few smaller variations.
    // opts.random:false gives the old fixed behaviour (start at the logo, build top to bottom).
    function makePlan() {
      var W = innerWidth, H = innerHeight, rnd = opts.random !== false, pl = { rnd: rnd };
      function pickW(pairs) {
        var tot = 0, r, i;
        pairs.forEach(function (q) { tot += q[1]; });
        r = Math.random() * tot;
        for (i = 0; i < pairs.length; i++) { r -= pairs[i][1]; if (r <= 0) return pairs[i][0]; }
        return pairs[0][0];
      }
      function clampX(v) { return Math.max(24, Math.min(W - 24, v)); }
      function clampY(v) { return Math.max(24, Math.min(H - 24, v)); }

      var ok = opts.origin && opts.origin !== 'auto' ? opts.origin : (rnd ? pickW([['logo', 3], ['corner', 3], ['center', 1.5], ['edge', 1.5], ['piece', 2], ['mouse', 1]]) : 'logo');
      var o = null;
      if (ok === 'corner') {
        var cs = [[44, 44], [W - 44, 44], [44, H - 44], [W - 44, H - 44]][Math.floor(Math.random() * 4)];
        o = { x: cs[0], y: cs[1] };
      } else if (ok === 'center') {
        o = { x: W / 2, y: H / 2 };
      } else if (ok === 'edge') {
        var es = Math.floor(Math.random() * 4);
        o = es === 0 ? { x: rand(W * 0.2, W * 0.8), y: 28 } : es === 1 ? { x: rand(W * 0.2, W * 0.8), y: H - 28 } : es === 2 ? { x: 28, y: rand(H * 0.2, H * 0.8) } : { x: W - 28, y: rand(H * 0.2, H * 0.8) };
      } else if (ok === 'mouse') {
        o = { x: clampX(state.mouse.x), y: clampY(state.mouse.y) };
      } else if (ok === 'piece') {
        var bigs = tasks.filter(function (t) { return t.rect.w * t.rect.h > 2500; });
        if (bigs.length) { var bt = bigs[Math.floor(Math.random() * bigs.length)]; o = { x: clampX(bt.rect.l + bt.rect.w / 2), y: clampY(bt.rect.t + bt.rect.h / 2) }; }
      }
      if (!o) { o = logoPoint(); ok = 'logo'; }
      pl.origin = o;
      pl.originKind = ok;

      var kind = opts.order && opts.order !== 'auto' ? opts.order : (rnd ? pickW([['sweep', 4], ['out', 3], ['in', 0.8], ['spin', 1], ['shuffle', 1.2]]) : 'down');
      var ang = null;
      if (kind === 'down') { kind = 'sweep'; ang = Math.PI / 2; }
      else if (kind === 'up') { kind = 'sweep'; ang = -Math.PI / 2; }
      else if (kind === 'right') { kind = 'sweep'; ang = 0; }
      else if (kind === 'left') { kind = 'sweep'; ang = Math.PI; }
      if (kind === 'sweep' && ang === null) {   // sweep away from where it starts, across the page
        ang = Math.hypot(W / 2 - o.x, H / 2 - o.y) > Math.min(W, H) * 0.18 ? Math.atan2(H / 2 - o.y, W / 2 - o.x) + rand(-0.5, 0.5) : Math.floor(Math.random() * 8) * Math.PI / 4;
      }
      var a0 = rand(0, 6.2832), dir = Math.random() < 0.5 ? -1 : 1;
      pl.kind = kind;
      function keyOf(x, y) {
        if (kind === 'sweep') return x * Math.cos(ang) + y * Math.sin(ang);
        if (kind === 'out') return Math.hypot(x - o.x, y - o.y) + Math.random() * 14;
        if (kind === 'in') return -Math.hypot(x - o.x, y - o.y) + Math.random() * 14;
        if (kind === 'spin') return (((Math.atan2(y - o.y, x - o.x) - a0) * dir) % 6.2832 + 6.2832) % 6.2832;
        return Math.random();
      }
      pl.sort = function (list, centerOf) {
        var ks = new Map();
        list.forEach(function (it) { var c = centerOf(it); ks.set(it, keyOf(c[0], c[1])); });
        return list.sort(function (a, b) { return ks.get(a) - ks.get(b); });
      };

      pl.cofs = rnd ? Math.floor(Math.random() * 5) : 0;          // which palette colour leads
      pl.sideOff = rnd ? Math.floor(Math.random() * 4) : 0;       // which side the first cursor comes from
      pl.span = rnd ? rand(1.0, 1.9) : 1.3;                       // how long the web volley takes to start
      pl.strike = rnd ? pickW([['sky', 4], ['sides', 2], ['mixed', 2]]) : 'sky';
      pl.farPoint = function (p) { return { x: clampX(W - p.x + rand(-80, 80)), y: clampY(H - p.y + rand(-60, 60)) }; };
      state.lastPlan = { start: ok, order: kind, strikes: pl.strike };
      return pl;
    }

    function moveTo(c, x, y, dur) {
      return new Promise(function (res) {
        var sx = c.x, sy = c.y, dx = x - sx, dy = y - sy, dist = Math.hypot(dx, dy);
        if (dist < 1) return res();
        var d = (dur || Math.min(650, 150 + dist * 0.45)) / state.speed;
        var nx = -dy / dist, ny = dx / dist;
        var bend = rand(-1, 1) * Math.min(dist * 0.18, 80);
        var t0 = performance.now();
        (function step(now) {
          if (R.dead) return res();
          var p = Math.min(1, (now - t0) / d), e = ease(p), off = Math.sin(Math.PI * p) * bend;
          c.set(sx + dx * e + nx * off, sy + dy * e + ny * off);
          if (p < 1) requestAnimationFrame(step); else res();
        })(t0);
      });
    }

    function dragBox(c, r, dashed) {
      return new Promise(function (res) {
        var sel = mk('div', 'sw-sel');
        sel.style.color = c.color;
        if (dashed) sel.style.borderStyle = 'dashed'; else sel.innerHTML = '<i></i><i></i><i></i><i></i>';
        var badge = mk('div', 'sw-badge');
        badge.style.background = c.color;
        rootEl.appendChild(sel);
        rootEl.appendChild(badge);
        var d = Math.min(650, 220 + Math.hypot(r.w, r.h) * 0.35) / state.speed;
        var t0 = performance.now();
        var handle = {
          done: function () {
            badge.remove();
            sel.style.opacity = '0';
            setTimeout(function () { sel.remove(); }, 350);
          }
        };
        (function step(now) {
          if (R.dead) return res(handle);
          var p = Math.min(1, (now - t0) / d), e = ease(p), w = r.w * e, h = r.h * e;
          sel.style.transform = 'translate3d(' + r.l + 'px,' + r.t + 'px,0)';
          sel.style.width = w + 'px';
          sel.style.height = h + 'px';
          badge.textContent = Math.round(w) + ' × ' + Math.round(h);
          var bx = Math.min(r.l + w + 8, innerWidth - 90), by = Math.min(r.t + h + 10, innerHeight - 26);
          badge.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0)';
          c.set(r.l + w, r.t + h);
          if (p < 1) requestAnimationFrame(step); else res(handle);
        })(t0);
      });
    }

    function reveal(t) {
      var el = t.el;
      t.prevTransition = el.style.transition;
      if (t.type === 'rect') {
        el.style.transition = 'background-color .5s,border-color .5s,box-shadow .5s,outline-color .5s';
        el.classList.remove('sw-hide-box');
      } else {
        el.style.transition = 'opacity .5s ease';
        el.classList.remove('sw-hide-media');
      }
      setTimeout(function () { el.style.transition = t.prevTransition; }, 700);
    }

    async function doBox(c, t) {
      await moveTo(c, t.rect.l, t.rect.t);
      if (R.dead) return;
      c.mode('cross');
      var g = await dragBox(c, t.rect, false);
      if (R.dead) return;
      await sleep(60);
      reveal(t);
      g.done();
      c.mode('arrow');
      await sleep(rand(30, 90));
    }

    function placeCaret(caret, u, atStart) {
      var rs = u.getClientRects();
      var b = atStart ? rs[0] : rs[rs.length - 1];
      if (!b) return { x: 0, y: 0, h: 0 };
      var x = atStart ? b.left : b.right;
      caret.style.height = b.height + 'px';
      caret.style.transform = 'translate3d(' + x + 'px,' + b.top + 'px,0)';
      return { x: x, y: b.top, h: b.height };
    }

    async function doText(c, t) {
      await moveTo(c, t.rect.l, t.rect.t);
      if (R.dead) return;
      c.mode('cross');
      var g = await dragBox(c, t.rect, true);
      if (R.dead) return;
      c.mode('arrow');
      var caret = mk('div', 'sw-caret');
      caret.style.background = c.color;
      rootEl.appendChild(caret);
      var base = opts.choreography ? (t.el.closest('.opening-title') ? 180 : 80) : (t.short ? 28 : 48);
      placeCaret(caret, t.units[0], true);
      for (var i = 0; i < t.units.length; i++) {
        if (R.dead) break;
        t.units[i].style.visibility = 'visible';
        var b = placeCaret(caret, t.units[i], false);
        c.set(b.x + 6, b.y + b.h * 0.6);
        await sleep(base * rand(0.6, 1.5));
      }
      caret.remove();
      g.done();
      await sleep(rand(30, 90));
    }

    // Cursors only look a few tasks ahead, so the page fills in from the top down.
    function pick(useParent) {
      var seen = 0, win = n + 4, i, t;
      var stage = Infinity;
      if (opts.choreography) tasks.forEach(function (q) { if (q.state !== 2) stage = Math.min(stage, q.stage); });
      for (i = 0; i < tasks.length; i++) {
        t = tasks[i];
        if (t.state !== 0 || (opts.choreography && t.stage !== stage)) continue;
        if (seen++ >= win) break;
        if (!useParent || !t.parent || t.parent.state === 2) return t;
      }
      for (i = 0; i < tasks.length; i++) {   // safety net so nothing can stall
        t = tasks[i];
        if (t.state === 0 && (!opts.choreography || t.stage === stage) && (!useParent || !t.parent || t.parent.state === 2)) return t;
      }
      return null;
    }

    async function worker(c, fn, useParent) {
      while (!R.dead) {
        var t = pick(useParent);
        if (!t) {
          if (tasks.every(function (x) { return x.state !== 0; })) break;
          await sleep(40);
          continue;
        }
        t.state = 1;
        await fn(c, t);
        t.state = 2;
      }
    }

    function runPhase(fn, useParent) {
      return Promise.all(cursors.map(function (c) { return worker(c, fn, useParent); }));
    }

    function buildTask(c, t) { return t.type === 'text' ? doText(c, t) : doBox(c, t); }

    /* ----- wireframe mode: sketch outlines first, then paint the real page in ----- */

    var wf = null, grid = null;

    function svgEl(name, attrs) {
      var e = document.createElementNS(NS, name);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }
    function clampPt(x, y) { return [Math.max(0, Math.min(innerWidth, x)), Math.max(0, Math.min(innerHeight, y))]; }
    function perimPoint(f, p) {
      var s = p * 2 * (f.w + f.h);
      if (s < f.w) return [f.l + s, f.t];
      s -= f.w;
      if (s < f.h) return [f.l + f.w, f.t + s];
      s -= f.h;
      if (s < f.w) return [f.l + f.w - s, f.t + f.h];
      s -= f.w;
      return [f.l, f.t + f.h - s];
    }
    function tween(ms, fn) {
      return new Promise(function (res) {
        var t0 = performance.now(), d = ms / state.speed;
        (function step(now) {
          if (R.dead) return res();
          var p = Math.min(1, (now - t0) / d);
          fn(ease(p));
          if (p < 1) requestAnimationFrame(step); else res();
        })(t0);
      });
    }

    async function sketchBox(c, t) {
      var f = t.full;
      var path = svgEl('rect', {
        x: f.l + 0.75, y: f.t + 0.75, width: Math.max(1, f.w - 1.5), height: Math.max(1, f.h - 1.5), rx: t.rx,
        pathLength: 1, fill: 'none', stroke: c.color, 'stroke-width': 1.5,
        'stroke-dasharray': 1, 'stroke-dashoffset': 1, 'stroke-linecap': 'round'
      });
      wf.appendChild(path);
      t.shapes.push(path);
      var s = clampPt(f.l, f.t);
      await moveTo(c, s[0], s[1], 220);
      if (R.dead) return;
      c.mode('cross');
      var badge = mk('div', 'sw-badge');
      badge.style.background = c.color;
      badge.textContent = Math.round(f.w) + ' × ' + Math.round(f.h);
      rootEl.appendChild(badge);
      await tween(Math.min(900, 240 + (f.w + f.h)), function (e) {
        path.setAttribute('stroke-dashoffset', 1 - e);
        var pt = clampPt.apply(null, perimPoint(f, e));
        c.set(pt[0], pt[1]);
        var bx = Math.min(Math.max(pt[0] + 10, 4), innerWidth - 90), by = Math.min(pt[1] + 14, innerHeight - 26);
        badge.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0)';
      });
      badge.remove();
      if (R.dead) return;
      if (t.type === 'media' && Math.min(f.w, f.h) >= 28) {
        var x = svgEl('path', {
          d: 'M' + f.l + ' ' + f.t + 'L' + (f.l + f.w) + ' ' + (f.t + f.h) + 'M' + (f.l + f.w) + ' ' + f.t + 'L' + f.l + ' ' + (f.t + f.h),
          pathLength: 1, fill: 'none', stroke: c.color, 'stroke-opacity': 0.45, 'stroke-width': 1,
          'stroke-dasharray': 1, 'stroke-dashoffset': 1
        });
        wf.appendChild(x);
        t.shapes.push(x);
        await tween(260, function (e) { x.setAttribute('stroke-dashoffset', 1 - e); });
      }
      c.mode('arrow');
      await sleep(rand(20, 60));
    }

    async function sketchText(c, t) {
      var lines = t.lines || [];
      for (var i = 0; i < lines.length; i++) {
        var ln = lines[i];
        if (R.dead) return;
        if (ln.t >= innerHeight || ln.t + ln.h <= 0) continue;
        var cy = ln.t + ln.h / 2, bh = Math.max(5, Math.min(14, ln.h * 0.42));
        var bar = svgEl('rect', { x: ln.l, y: cy - bh / 2, width: 0, height: bh, rx: Math.min(4, bh / 2), fill: c.color, 'fill-opacity': 0.26 });
        wf.appendChild(bar);
        t.shapes.push(bar);
        var s = clampPt(ln.l, cy);
        await moveTo(c, s[0], s[1], 170);
        if (R.dead) return;
        await tween(Math.min(700, 110 + ln.w * 0.6), function (e) {
          bar.setAttribute('width', Math.max(0, ln.w * e));
          var pt = clampPt(ln.l + ln.w * e, cy);
          c.set(pt[0], pt[1]);
        });
      }
      await sleep(rand(20, 60));
    }

    function sketchTask(c, t) { return t.type === 'text' ? sketchText(c, t) : sketchBox(c, t); }

    function ripple(x, y, color) {
      var e = mk('div', 'sw-ripple');
      e.style.left = x + 'px';
      e.style.top = y + 'px';
      e.style.borderColor = color;
      rootEl.appendChild(e);
      setTimeout(function () { e.remove(); }, 700);
    }

    async function paintTask(c, t) {
      var p = clampPt(t.rect.l + t.rect.w / 2, t.rect.t + t.rect.h / 2);
      await moveTo(c, p[0], p[1], 240);
      if (R.dead) return;
      ripple(p[0], p[1], c.color);
      if (t.type === 'text') {
        var step = Math.min(18, 450 / t.units.length);
        t.units.forEach(function (u, i) {
          setTimeout(function () { u.style.visibility = 'visible'; u.style.opacity = '1'; }, i * step / state.speed);
        });
      } else {
        reveal(t);
      }
      (t.shapes || []).forEach(function (s) { s.style.opacity = '0'; });
      setTimeout(function () { (t.shapes || []).forEach(function (s) { s.remove(); }); }, 700);
      await sleep(rand(20, 60));
    }

    async function wireframeRun() {
      grid = mk('div', 'sw-grid');
      wf = document.createElementNS(NS, 'svg');
      wf.setAttribute('class', 'sw-wf');
      rootEl.insertBefore(wf, rootEl.firstChild);
      rootEl.insertBefore(grid, wf);
      requestAnimationFrame(function () { grid.style.opacity = '1'; });
      tasks.forEach(function (t) { t.shapes = []; });
      await runPhase(sketchTask, false);
      if (R.dead) return;
      tasks.forEach(function (t) { t.state = 0; });
      await sleep(350);
      await runPhase(paintTask, false);
      if (R.dead) return;
      grid.style.opacity = '0';
      await sleep(600);
    }

    /* ----- mycelium mode: a glowing network grows through a dark void and opens the page ----- */

    var VEIN = P.vein;

    function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

    function roundRectPath(g, x, y, w, h, r) {
      r = Math.max(0, Math.min(r, w / 2, h / 2));
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }

    function glowDot(g, x, y, r, c, a) {
      if (P.fx === 'pixel') {
        var q = Math.max(4, Math.round(r / 4) * 4);
        g.fillStyle = rgba(c, a);
        g.fillRect(Math.round(x - q / 2), Math.round(y - q / 2), q, q);
        g.fillStyle = 'rgba(255,255,255,' + a + ')';
        g.fillRect(Math.round(x - q / 4), Math.round(y - q / 4), q / 2, q / 2);
        return;
      }
      var gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,' + a + ')');
      gr.addColorStop(0.3, rgba(c, a * 0.55));
      gr.addColorStop(1, rgba(c, 0));
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, r, 0, 6.2832);
      g.fill();
    }

    function sparkle(g, x, y, r, style) {
      g.fillStyle = style;
      g.beginPath();
      g.moveTo(x, y - r);
      g.quadraticCurveTo(x, y, x + r, y);
      g.quadraticCurveTo(x, y, x, y + r);
      g.quadraticCurveTo(x, y, x - r, y);
      g.quadraticCurveTo(x, y, x, y - r);
      g.fill();
    }

    function heartPath(g, s) {
      g.beginPath();
      g.moveTo(0, s * 0.35);
      g.bezierCurveTo(-s * 1.1, -s * 0.3, -s * 0.5, -s * 1.0, 0, -s * 0.4);
      g.bezierCurveTo(s * 0.5, -s * 1.0, s * 1.1, -s * 0.3, 0, s * 0.35);
      g.closePath();
    }

    function drawFlower(g, x, y, r, rot, color, a) {
      g.save();
      g.translate(x, y);
      g.rotate(rot);
      g.globalAlpha = a;
      g.fillStyle = rgba(color, 1);
      g.strokeStyle = 'rgba(255,255,255,.9)';
      g.lineWidth = 1;
      for (var i = 0; i < 5; i++) {
        g.save();
        g.rotate(i * 1.2566);
        g.beginPath();
        g.ellipse(0, -r * 0.62, r * 0.46, r * 0.62, 0, 0, 6.2832);
        g.fill();
        g.stroke();
        g.restore();
      }
      g.fillStyle = '#fff6b8';
      g.beginPath(); g.arc(0, 0, r * 0.3, 0, 6.2832); g.fill();
      g.fillStyle = '#ffb02e';
      g.beginPath(); g.arc(0, 0, r * 0.14, 0, 6.2832); g.fill();
      g.restore();
    }

    function drawShroom(g, x, y, r, rot, color, a) {
      var cap = ['#e0483a', '#f2a03d', '#d96aa0'][Math.floor(rot) % 3];
      g.save();
      g.translate(x, y);
      g.globalAlpha = a;
      g.fillStyle = '#f6ecd8';
      g.fillRect(-r * 0.22, -r * 0.1, r * 0.44, r * 0.95);
      g.fillStyle = cap;
      g.beginPath(); g.arc(0, 0, r, Math.PI, 0); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(20,10,0,.35)'; g.lineWidth = 1; g.stroke();
      g.fillStyle = '#fff';
      [[-0.45, -0.35, 0.16], [0.15, -0.6, 0.2], [0.5, -0.25, 0.13]].forEach(function (d) {
        g.beginPath(); g.arc(d[0] * r, d[1] * r, d[2] * r, 0, 6.2832); g.fill();
      });
      g.restore();
    }

    function drawLolly(g, x, y, r, rot, color, a) {
      g.save();
      g.translate(x, y);
      g.rotate((rot % 1) * 0.5 - 0.25);
      g.globalAlpha = a;
      g.lineCap = 'round';
      g.strokeStyle = '#2d1b4e'; g.lineWidth = r * 0.3; g.beginPath(); g.moveTo(0, r * 0.6); g.lineTo(0, r * 2); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = r * 0.16; g.beginPath(); g.moveTo(0, r * 0.6); g.lineTo(0, r * 2); g.stroke();
      g.fillStyle = rgba(color, 1);
      g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill();
      g.strokeStyle = '#fff'; g.lineWidth = Math.max(1.5, r * 0.16);
      g.beginPath();
      for (var th = 0; th < 12.5; th += 0.3) {
        var rr = r * 0.9 * th / 12.5;
        if (th === 0) g.moveTo(0, 0); else g.lineTo(Math.cos(th) * rr, Math.sin(th) * rr);
      }
      g.stroke();
      g.strokeStyle = '#2d1b4e'; g.lineWidth = Math.max(1.5, r * 0.18);
      g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.stroke();
      g.restore();
    }

    function hrand(n) { var v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }

    // the "void" the network has to eat through: one painter per look
    function paintSky(g, W, H) {
      var i, x, y, gr, k;
      if (P.sky === 'pastel') {
        gr = g.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, Math.max(W, H) * 0.8);
        gr.addColorStop(0, '#ffe6f3'); gr.addColorStop(0.55, '#ebe0ff'); gr.addColorStop(1, '#d3e3ff');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        [[0.12, 0.18, '255,170,205'], [0.88, 0.3, '170,200,255'], [0.72, 0.92, '255,205,160'], [0.18, 0.86, '175,240,210'], [0.5, 0.05, '215,190,255']].forEach(function (b) {
          var cx = b[0] * W, cy = b[1] * H, cg = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.38);
          cg.addColorStop(0, 'rgba(' + b[2] + ',0.75)');
          cg.addColorStop(1, 'rgba(' + b[2] + ',0)');
          g.fillStyle = cg; g.fillRect(0, 0, W, H);
        });
        for (i = 0; i < 70; i++) {
          g.fillStyle = 'rgba(255,255,255,' + rand(0.5, 0.95) + ')';
          g.beginPath(); g.arc(rand(0, W), rand(0, H), rand(0.8, 2.2), 0, 6.2832); g.fill();
        }
      } else if (P.sky === 'sunset') {
        gr = g.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, '#1b1036'); gr.addColorStop(0.38, '#4a1f66'); gr.addColorStop(0.72, '#c24d6c'); gr.addColorStop(1, '#ff9a62');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        for (i = 0; i < 70; i++) {
          y = rand(0, H * 0.5);
          g.fillStyle = 'rgba(255,240,230,' + (rand(0.25, 0.8) * (1 - y / (H * 0.55))) + ')';
          g.beginPath(); g.arc(rand(0, W), y, rand(0.6, 1.6), 0, 6.2832); g.fill();
        }
        var sx = W * 0.74, sy = H * 0.7, sr = Math.min(W, H) * 0.17;
        gr = g.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * 3.2);
        gr.addColorStop(0, 'rgba(255,190,110,.65)'); gr.addColorStop(1, 'rgba(255,154,98,0)');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        gr = g.createLinearGradient(0, sy - sr, 0, sy + sr);
        gr.addColorStop(0, '#ffe29a'); gr.addColorStop(1, '#ff6f61');
        g.fillStyle = gr; g.beginPath(); g.arc(sx, sy, sr, 0, 6.2832); g.fill();
        [[0.84, '#4a1d5e', 22, 0.006, 1.3], [0.92, '#240f38', 28, 0.009, 4.1]].forEach(function (L) {
          g.fillStyle = L[1]; g.beginPath(); g.moveTo(0, H);
          for (x = 0; x <= W; x += 8) g.lineTo(x, H * L[0] + Math.sin(x * L[3] + L[4]) * L[2] + Math.sin(x * L[3] * 2.3 + L[4]) * L[2] * 0.4);
          g.lineTo(W, H); g.closePath(); g.fill();
        });
      } else if (P.sky === 'pixel') {
        g.fillStyle = '#0d0b22'; g.fillRect(0, 0, W, H);
        g.fillStyle = 'rgba(255,255,255,0.04)';
        for (x = 0; x < W; x += 24) g.fillRect(x, 0, 1, H);
        for (y = 0; y < H; y += 24) g.fillRect(0, y, W, 1);
        var pc = ['#ffd23f', '#3bf2a0', '#4cc9f0', '#ff4d6d', '#ffffff'];
        for (i = 0; i < 60; i++) {
          g.fillStyle = pc[i % 5]; g.globalAlpha = rand(0.35, 0.9); k = Math.random() < 0.2 ? 8 : 4;
          g.fillRect(Math.round(rand(0, W) / 4) * 4, Math.round(rand(0, H) / 4) * 4, k, k);
        }
        g.globalAlpha = 1;
        g.fillStyle = 'rgba(0,0,0,0.22)';
        for (y = 0; y < H; y += 4) g.fillRect(0, y, W, 2);
      } else if (P.sky === 'grid') {
        gr = g.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, '#05040d'); gr.addColorStop(0.6, '#1b0a3a'); gr.addColorStop(1, '#0a0420');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        var hz = H * 0.6, cx2 = W / 2, rs = Math.min(W, H) * 0.2, cy2 = hz - rs * 0.35;
        g.save();
        g.beginPath(); g.rect(0, 0, W, hz); g.clip();
        gr = g.createLinearGradient(0, cy2 - rs, 0, cy2 + rs);
        gr.addColorStop(0, '#ffe14d'); gr.addColorStop(0.5, '#ff5fa2'); gr.addColorStop(1, '#ff2bd6');
        g.fillStyle = gr; g.beginPath(); g.arc(cx2, cy2, rs, 0, 6.2832); g.fill();
        g.fillStyle = '#14092e';
        for (i = 0; i < 6; i++) g.fillRect(cx2 - rs, cy2 + rs * 0.1 + i * rs * 0.17, rs * 2, 2 + i * 1.6);
        g.restore();
        g.fillStyle = '#0a0420'; g.fillRect(0, hz, W, H - hz);
        g.strokeStyle = 'rgba(255,43,214,.6)'; g.lineWidth = 1;
        for (i = 1; i <= 14; i++) {
          y = hz + Math.pow(i / 14, 2.2) * (H - hz);
          g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
        }
        for (i = -14; i <= 14; i++) {
          g.beginPath(); g.moveTo(cx2 + i * 6, hz); g.lineTo(cx2 + i * W * 0.22, H); g.stroke();
        }
        g.strokeStyle = 'rgba(0,240,255,.85)'; g.lineWidth = 1.5;
        g.beginPath(); g.moveTo(0, hz); g.lineTo(W, hz); g.stroke();
      } else if (P.sky === 'crimson') {
        g.fillStyle = '#050203'; g.fillRect(0, 0, W, H);
        [[0.2, 0.0, 0.55, '120,0,18', 0.55], [0.8, 0.05, 0.5, '150,10,30', 0.45], [0.5, 1.0, 0.7, '110,0,16', 0.5], [0.05, 0.7, 0.4, '90,0,12', 0.4]].forEach(function (b) {
          var cx = b[0] * W, cy = b[1] * H, cg = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * b[2]);
          cg.addColorStop(0, 'rgba(' + b[3] + ',' + b[4] + ')'); cg.addColorStop(1, 'rgba(' + b[3] + ',0)');
          g.fillStyle = cg; g.fillRect(0, 0, W, H);
        });
        g.strokeStyle = 'rgba(255,40,60,.16)'; g.lineWidth = 1;
        for (i = 0; i < 9; i++) {
          x = rand(0, W); y = -5; k = H * rand(0.3, 0.9);
          g.beginPath(); g.moveTo(x, y);
          while (y < k) { x += rand(-22, 22); y += rand(14, 34); g.lineTo(x, y); }
          g.stroke();
        }
        g.fillStyle = 'rgba(0,0,0,.25)';
        for (y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
      } else if (P.sky === 'forest') {
        gr = g.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, '#0b1f1f'); gr.addColorStop(0.55, '#17382f'); gr.addColorStop(1, '#2c5a3d');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        for (i = 0; i < 50; i++) {
          g.fillStyle = 'rgba(255,248,220,' + rand(0.2, 0.7) + ')';
          g.beginPath(); g.arc(rand(0, W), rand(0, H * 0.45), rand(0.6, 1.5), 0, 6.2832); g.fill();
        }
        var mx = W * 0.8, my = H * 0.2, mr = Math.min(W, H) * 0.055;
        gr = g.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 6);
        gr.addColorStop(0, 'rgba(255,244,200,.45)'); gr.addColorStop(1, 'rgba(255,244,200,0)');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        g.fillStyle = '#fff4c8'; g.beginPath(); g.arc(mx, my, mr, 0, 6.2832); g.fill();
        [[0.88, '#143328', 0.2, 0.3, 70], [1.0, '#0b1f19', 0.3, 0.46, 110]].forEach(function (L) {
          g.fillStyle = L[1];
          for (x = -40; x < W + 60; x += L[4] * rand(0.7, 1.2)) {
            var hh = H * rand(L[2], L[3]), ww = hh * 0.42, by = H * L[0];
            g.beginPath();
            g.moveTo(x, by - hh);
            g.lineTo(x + ww * 0.3, by - hh * 0.62); g.lineTo(x + ww * 0.16, by - hh * 0.62);
            g.lineTo(x + ww * 0.42, by - hh * 0.3); g.lineTo(x + ww * 0.2, by - hh * 0.3);
            g.lineTo(x + ww * 0.5, by); g.lineTo(x - ww * 0.5, by);
            g.lineTo(x - ww * 0.2, by - hh * 0.3); g.lineTo(x - ww * 0.42, by - hh * 0.3);
            g.lineTo(x - ww * 0.16, by - hh * 0.62); g.lineTo(x - ww * 0.3, by - hh * 0.62);
            g.closePath(); g.fill();
          }
          g.fillRect(0, H * L[0] - 2, W, H);
        });
      } else if (P.sky === 'ocean') {
        gr = g.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, '#2bb3d6'); gr.addColorStop(0.35, '#0e6d98'); gr.addColorStop(1, '#02182c');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        for (i = 0; i < 6; i++) {
          x = rand(0, W);
          gr = g.createLinearGradient(0, 0, 0, H * 0.9);
          gr.addColorStop(0, 'rgba(200,250,255,.28)'); gr.addColorStop(1, 'rgba(200,250,255,0)');
          g.fillStyle = gr;
          g.beginPath(); g.moveTo(x - 20, 0); g.lineTo(x + 30, 0); g.lineTo(x + 230, H * 0.9); g.lineTo(x + 40, H * 0.9); g.closePath(); g.fill();
        }
        for (i = 0; i < 60; i++) {
          x = rand(0, W); y = rand(0, H); k = rand(2, 8);
          g.strokeStyle = 'rgba(220,250,255,' + rand(0.2, 0.5) + ')'; g.lineWidth = 1;
          g.beginPath(); g.arc(x, y, k, 0, 6.2832); g.stroke();
          g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(x - k * 0.35, y - k * 0.35, Math.max(0.6, k * 0.18), 0, 6.2832); g.fill();
        }
        for (i = 0; i < 8; i++) {
          x = rand(0, W); k = H * rand(0.12, 0.26);
          g.strokeStyle = 'rgba(30,160,130,.55)'; g.lineWidth = 6; g.lineCap = 'round';
          g.beginPath(); g.moveTo(x, H + 4); g.quadraticCurveTo(x + rand(-30, 30), H - k * 0.5, x + rand(-18, 18), H - k); g.stroke();
        }
        g.fillStyle = '#031a2c'; g.beginPath(); g.moveTo(0, H);
        for (x = 0; x <= W; x += 8) g.lineTo(x, H * 0.95 + Math.sin(x * 0.007 + 1) * 14);
        g.lineTo(W, H); g.closePath(); g.fill();
      } else if (P.sky === 'candy') {
        g.fillStyle = '#ff5fa8'; g.fillRect(0, 0, W, H);
        g.save();
        g.translate(W / 2, H / 2); g.rotate(-0.6);
        g.fillStyle = '#ff8cc3';
        var span = Math.hypot(W, H);
        for (x = -span; x < span; x += 88) g.fillRect(x, -span, 44, span * 2);
        g.restore();
        var sc = ['#ffffff', '#ffd93b', '#3fe0b5', '#8b5cf6', '#ff8a3d'];
        g.lineCap = 'round';
        for (i = 0; i < 90; i++) {
          g.save(); g.translate(rand(0, W), rand(0, H)); g.rotate(rand(0, 3.14));
          g.strokeStyle = sc[i % 5]; g.lineWidth = 4;
          g.beginPath(); g.moveTo(-6, 0); g.lineTo(6, 0); g.stroke(); g.restore();
        }
      } else {
        gr = g.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, Math.max(W, H) * 0.8);
        gr.addColorStop(0, '#0b1224'); gr.addColorStop(1, '#03050a');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
      }
    }

    async function myceliumRun() {
      var dpr = Math.min(2, window.devicePixelRatio || 1), W = innerWidth, H = innerHeight;
      function layer() {
        var c = mk('canvas', 'sw-cv');
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
        var g = c.getContext('2d');
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { c: c, g: g };
      }
      var dark = layer(), glow = layer();
      rootEl.insertBefore(glow.c, rootEl.firstChild);
      rootEl.insertBefore(dark.c, glow.c);
      paintSky(dark.g, W, H);
      await new Promise(function (res) { requestAnimationFrame(function () { requestAnimationFrame(res); }); });
      document.documentElement.classList.remove('sw-boot');
      if (R.dead) return;

      // the blocks of the page the network has to reach: biggest first, skipping anything inside a bigger box
      var pad = 6, targets = [];
      tasks.slice().sort(function (a, b) { return b.rect.w * b.rect.h - a.rect.w * a.rect.h; }).forEach(function (t) {
        var r = t.rect;
        var box = { l: Math.max(0, r.l - pad), t: Math.max(0, r.t - pad), type: t.type, done: false, claimed: false, rx: t.type === 'text' ? 8 : (t.rx || 0) + 2 };
        box.w = Math.min(W, r.l + r.w + pad) - box.l;
        box.h = Math.min(H, r.t + r.h + pad) - box.t;
        var inside = targets.some(function (o) {
          return o.type !== 'text' && box.l >= o.l - 2 && box.t >= o.t - 2 && box.l + box.w <= o.l + o.w + 2 && box.t + box.h <= o.t + o.h + 2;
        });
        if (inside) return;
        box.cx = box.l + box.w / 2;
        box.cy = box.t + box.h / 2;
        targets.push(box);
      });

      var origin = PL.origin, seeds = [origin];
      if (PL.rnd && Math.random() < 0.35) seeds.push(PL.farPoint(origin));     // sometimes a second seed far away
      var tips = [], sparks = [], rings = [], blooms = [], spores = [], flowers = [], strikes = [], zaps = [];
      var colorIdx = 1, lastPt = { x: origin.x, y: origin.y }, rescueIn = 0;
      var time = 0, last = performance.now(), phase = 'seed', dawn = 0, darkFading = false;
      for (var si = 0; si < 46; si++) spores.push({ x: rand(0, W), y: rand(0, H), r: rand(0.6, 1.8), vy: rand(6, 20), ph: rand(0, 6.28), ci: si % 5 });

      function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
      function inBox(T, x, y, m) { return x >= T.l - m && x <= T.l + T.w + m && y >= T.t - m && y <= T.t + T.h + m; }
      function nearestPoint(T, x, y) { return [Math.max(T.l, Math.min(T.l + T.w, x)), Math.max(T.t, Math.min(T.t + T.h, y))]; }
      function nearestOpen(x, y, claim) {
        var best = null, bd = 1e9;
        targets.forEach(function (T) {
          if (T.done || T.claimed) return;
          var d = dist(x, y, T.cx, T.cy);
          if (d < bd) { bd = d; best = T; }
        });
        if (best && claim) best.claimed = true;
        return best;
      }

      // closest point on the network so far: new roots branch off from there
      function nearestVein(x, y) {
        var best = null, bd = 1e9;
        seeds.forEach(function (sd) {
          var d0 = Math.abs(sd.x - x) + Math.abs(sd.y - y);
          if (d0 < bd) { bd = d0; best = { x: sd.x, y: sd.y, color: VEIN[0] }; }
        });
        tips.forEach(function (t) {
          for (var i = 0; i < t.path.length; i += 2) {
            var p = t.path[i], d = Math.abs(p[0] - x) + Math.abs(p[1] - y);
            if (d < bd) { bd = d; best = { x: p[0], y: p[1], color: t.color }; }
          }
        });
        return best;
      }

      function newTip(x, y, a, w, color, target) {
        var t = {
          x: x, y: y, a: a, w: w, color: color, target: target || null, path: [[x, y]], dead: false,
          seed: Math.random() * 10, age: 0, vis: 1, wander: !target, ttl: rand(0.5, 1.4),
          core: [(color[0] + 255) >> 1, (color[1] + 255) >> 1, (color[2] + 255) >> 1]
        };
        tips.push(t);
        return t;
      }

      function spawnFrom(x, y, color, count) {
        for (var i = 0; i < count; i++) {
          var T = nearestOpen(x, y, true);
          if (!T) break;
          var src = nearestVein(T.cx, T.cy);
          var a = Math.atan2(T.cy - src.y, T.cx - src.x) + rand(-1.2, 1.2);
          var col = Math.random() < 0.3 ? VEIN[(colorIdx++) % VEIN.length] : src.color;
          newTip(src.x, src.y, a, rand(1.8, 2.6), col, T);
        }
      }

      function makeStrike(x, y) {
        var x0 = x + rand(-70, 70), pts = [[x0, -10]], n = 12, i, f, px, py;
        for (i = 1; i < n; i++) { f = i / n; pts.push([x0 + (x - x0) * f + rand(-26, 26) * (1 - f * 0.6), -10 + (y + 10) * f]); }
        pts.push([x, y]);
        var forks = [];
        for (i = 2; i < n - 1; i += 3) {
          var b = pts[i], dir = Math.random() < 0.5 ? -1 : 1, fk = [b];
          px = b[0]; py = b[1];
          for (var j = 0; j < 3; j++) { px += dir * rand(8, 22); py += rand(10, 26); fk.push([px, py]); }
          forks.push(fk);
        }
        return { pts: pts, forks: forks, t: 0 };
      }

      function bloom(T, x, y, color) {
        if (T.done) return;
        T.done = true;
        lastPt = { x: x, y: y };
        var far = Math.max(dist(x, y, T.l, T.t), dist(x, y, T.l + T.w, T.t), dist(x, y, T.l, T.t + T.h), dist(x, y, T.l + T.w, T.t + T.h)) + 24;
        blooms.push({ T: T, x: x, y: y, max: far, dur: 0.8, t: 0 });
        rings.push({ x: x, y: y, r: 4, life: 0, color: color });
        if (P.fx === 'bolt') {   // a bolt hits the block, and its outline flashes
          zaps.push({ T: T, t: 0 });
          if (Math.random() < 0.5) strikes.push(makeStrike(x, y));
        }
        if (P.fx === 'cute') {
          flowers.push({ x: x, y: y, color: color, t: 0, r: rand(11, 16), rot: rand(0, 6.28) });
          for (var j = 0; j < 16; j++) {
            var b = rand(0, 6.2832), q = rand(50, 210);
            sparks.push({ x: x, y: y, vx: Math.cos(b) * q, vy: Math.sin(b) * q - 40, life: 0, max: rand(0.9, 1.6), color: j % 5 === 0 ? VEIN[(j + 1) % VEIN.length] : color, kind: j % 4 === 0 ? 2 : 1, rot: rand(0, 6.28), vr: rand(-5, 5), s: rand(4, 8) });
          }
        } else if (P.fx === 'vine') {
          flowers.push({ x: x, y: y, color: color, t: 0, r: rand(10, 14), rot: rand(0, 6.28), shroom: true });
          for (var j2 = 0; j2 < 12; j2++) {
            var b2 = rand(0, 6.2832), q2 = rand(40, 150);
            sparks.push({ x: x, y: y, vx: Math.cos(b2) * q2, vy: Math.sin(b2) * q2 - 50, life: 0, max: rand(1.2, 2.0), color: VEIN[j2 % 5], kind: 3, rot: rand(0, 6.28), vr: rand(-4, 4), s: rand(5, 9) });
          }
        } else if (P.fx === 'candy') {
          flowers.push({ x: x, y: y, color: color, t: 0, r: rand(11, 15), rot: rand(0, 6.28), lolly: true });
          for (var j3 = 0; j3 < 22; j3++) {
            var b3 = rand(0, 6.2832), q3 = rand(80, 300);
            sparks.push({ x: x, y: y, vx: Math.cos(b3) * q3, vy: Math.sin(b3) * q3 - 60, life: 0, max: rand(0.9, 1.5), color: VEIN[j3 % 5], kind: 5, rot: rand(0, 6.28), vr: rand(-9, 9), s: rand(4, 7) });
          }
        } else if (P.bubble) {
          for (var j4 = 0; j4 < 14; j4++) {
            var b4 = rand(0, 6.2832), q4 = rand(30, 130);
            sparks.push({ x: x, y: y, vx: Math.cos(b4) * q4, vy: Math.sin(b4) * q4 - 60, life: 0, max: rand(1.0, 1.8), color: VEIN[j4 % 5], kind: 4, rot: rand(0, 6.28), vr: 0, s: rand(3, 9) });
          }
        } else {
          for (var i = 0; i < 26; i++) {
            var a = rand(0, 6.2832), sp = rand(60, 260);
            sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.5, 1.1), color: color });
          }
        }
        spawnFrom(x, y, color, 3);
      }

      // opens a hole in the dark layer, growing out from where the root touched the block
      function eraseBloom(b, dt) {
        b.t += dt;
        var p = Math.min(1, b.t / b.dur), e = 1 - Math.pow(1 - p, 3), r = Math.max(1, b.max * e), T = b.T, g = dark.g;
        g.save();
        g.globalCompositeOperation = 'destination-out';
        roundRectPath(g, T.l, T.t, T.w, T.h, T.rx);
        g.clip();
        if (p >= 1) {
          g.fillStyle = '#000';
          g.fillRect(T.l, T.t, T.w, T.h);
        } else {
          var gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
          gr.addColorStop(0, 'rgba(0,0,0,1)');
          gr.addColorStop(0.8, 'rgba(0,0,0,1)');
          gr.addColorStop(1, 'rgba(0,0,0,0)');
          g.fillStyle = gr;
          g.fillRect(T.l, T.t, T.w, T.h);
        }
        g.restore();
        return p >= 1;
      }

      function stepTip(t, dt) {
        t.age += dt;
        if (t.wander && t.age > t.ttl) {
          t.dead = true;
          if ((P.fx === 'cute' || P.fx === 'vine' || P.fx === 'candy') && t.path.length > 3) flowers.push({ x: t.x, y: t.y, color: t.color, t: 0, r: rand(4.5, 7), rot: rand(0, 6.28), shroom: P.fx === 'vine', lolly: P.fx === 'candy' });
          return;
        }
        if (t.target && t.target.done) t.target = nearestOpen(t.x, t.y, true);
        var T = t.target, noise = 1;
        if (T) {
          var np = nearestPoint(T, t.x, t.y), d = dist(t.x, t.y, np[0], np[1]);
          var diff = Math.atan2(np[1] - t.y, np[0] - t.x) - t.a;
          while (diff > Math.PI) diff -= 6.2832;
          while (diff < -Math.PI) diff += 6.2832;
          var turn = 3 + 14 * (1 - Math.min(1, d / 160));
          t.a += Math.max(-turn * dt, Math.min(turn * dt, diff));
          if (d < 90) noise = 0.15;
          if (t.age > 7) { bloom(T, np[0], np[1], t.color); t.dead = true; return; }   // never let one root stall
        }
        t.a += (Math.sin(time * 2.3 + t.seed) * 1.9 + Math.sin(time * 5.1 + t.seed * 1.7) * 0.9) * dt * noise;
        var sp = 230;
        t.x += Math.cos(t.a) * sp * dt;
        t.y += Math.sin(t.a) * sp * dt;
        if (t.x < 2 || t.x > W - 2 || t.y < 2 || t.y > H - 2) {
          t.x = Math.max(2, Math.min(W - 2, t.x));
          t.y = Math.max(2, Math.min(H - 2, t.y));
          t.a += 2;
        }
        var lp = t.path[t.path.length - 1];
        if (dist(t.x, t.y, lp[0], lp[1]) >= 5) t.path.push([t.x, t.y]);
        if (!t.wander && tips.length < 80 && Math.random() < dt * 1.1) {   // only main roots sprout short side branches
          newTip(t.x, t.y, t.a + (Math.random() < 0.5 ? -1 : 1) * rand(0.5, 1.1), t.w * 0.6, t.color, null);
        }
        for (var i = 0; i < targets.length; i++) {
          var X = targets[i];
          if (!X.done && inBox(X, t.x, t.y, 3)) {
            bloom(X, t.x, t.y, t.color);
            if (X === t.target) t.dead = true;
            break;
          }
        }
      }

      return new Promise(function (resolve) {
        function frame(now) {
          if (R.dead) return resolve();
          var dt = Math.min(0.05, (now - last) / 1000) * state.speed;
          last = now;
          time += dt;

          if (phase === 'seed' && time > 0.7) {
            if (targets.length) { phase = 'grow'; spawnFrom(origin.x, origin.y, VEIN[0], PL.rnd ? 3 + Math.floor(Math.random() * 3) : 4); if (seeds.length > 1) spawnFrom(seeds[1].x, seeds[1].y, VEIN[1], 2); }
            else { phase = 'dawn'; dawn = 0; }
          }
          if (phase === 'grow') {
            var n = tips.length;
            for (var i = 0; i < n; i++) if (!tips[i].dead) stepTip(tips[i], dt);
            var open = targets.some(function (T) { return !T.done; });
            rescueIn -= dt;
            if (open && rescueIn <= 0) {
              rescueIn = 0.4;
              if (!tips.some(function (t) { return !t.dead && t.target && !t.target.done; })) {
                targets.forEach(function (T) { if (!T.done) T.claimed = false; });
                spawnFrom(lastPt.x, lastPt.y, VEIN[(colorIdx++) % VEIN.length], 2);
              }
            }
            if (open && time > 12) targets.forEach(function (T) { if (!T.done) bloom(T, T.cx, T.cy, VEIN[0]); });
            blooms = blooms.filter(function (b) { return !eraseBloom(b, dt); });
            if (!open && !blooms.length) { phase = 'dawn'; dawn = 0; }
          } else {
            blooms = blooms.filter(function (b) { return !eraseBloom(b, dt); });
          }
          if (phase === 'dawn') {
            dawn += dt;
            var p = Math.min(1, dawn / 1.2), e = p * p * (3 - 2 * p);
            tips.forEach(function (t) { t.vis = 1 - e; t.dead = true; });
            if (dawn > 0.25 && !darkFading) {
              darkFading = true;
              dark.c.style.transition = 'opacity .9s ease';
              dark.c.style.opacity = '0';
            }
            if (dawn > 1.8) return resolve();
          }

          // ---- draw ----
          var g = glow.g;
          g.clearRect(0, 0, W, H);
          g.globalCompositeOperation = P.comp;
          g.lineCap = 'round';
          g.lineJoin = 'round';
          var fade = phase === 'dawn' ? Math.max(0, 1 - dawn / 0.8) : 1;

          spores.forEach(function (s) {
            s.y -= s.vy * dt;
            if (s.y < -4) { s.y = H + 4; s.x = rand(0, W); }
            var a = (0.18 + 0.22 * Math.sin(time * 2 + s.ph)) * fade;
            if (a <= 0) return;
            if (P.fx === 'candy') {
              g.save();
              g.translate(s.x + Math.sin(time + s.ph) * 6, s.y);
              g.rotate(time * 0.8 + s.ph);
              g.strokeStyle = rgba(VEIN[s.ci], Math.min(1, a * 2.6)); g.lineWidth = 3;
              g.beginPath(); g.moveTo(-5, 0); g.lineTo(5, 0); g.stroke();
              g.restore();
              return;
            }
            if (P.bubble) {
              var bx = s.x + Math.sin(time + s.ph) * 8, br = 2 + s.r * 3, ba = Math.min(1, a * 2.4);
              g.strokeStyle = 'rgba(' + P.spore + ',' + ba + ')'; g.lineWidth = 1;
              g.beginPath(); g.arc(bx, s.y, br, 0, 6.2832); g.stroke();
              g.fillStyle = 'rgba(' + P.spore + ',' + ba + ')';
              g.beginPath(); g.arc(bx - br * 0.35, s.y - br * 0.35, Math.max(0.6, br * 0.18), 0, 6.2832); g.fill();
              return;
            }
            if (P.fx === 'pixel') {
              g.fillStyle = rgba(VEIN[s.ci], Math.min(1, a * 2.6));
              g.fillRect(Math.round((s.x + Math.sin(time + s.ph) * 6) / 4) * 4, Math.round(s.y / 4) * 4, 4, 4);
              return;
            }
            if (P.fly) {
              glowDot(g, s.x + Math.sin(time + s.ph) * 10, s.y, 5 + s.r * 3, VEIN[s.ci], Math.min(1, a * 3));
              return;
            }
            if (P.fx === 'cute') {
              sparkle(g, s.x + Math.sin(time + s.ph) * 6, s.y, s.r * (2.6 + 2.4 * Math.sin(time * 3 + s.ph)), rgba(VEIN[s.ci], Math.min(1, a * 2.6)));
              return;
            }
            g.fillStyle = 'rgba(' + P.spore + ',' + a + ')';
            g.beginPath();
            g.arc(s.x + Math.sin(time + s.ph) * 6, s.y, s.r, 0, 6.2832);
            g.fill();
          });

          var coreR = (phase === 'seed' ? 6 + 26 * Math.min(1, time / 0.7) : 26) * fade * (1 + 0.12 * Math.sin(time * 6));
          if (coreR > 0.5) seeds.forEach(function (sd) { glowDot(g, sd.x, sd.y, coreR, VEIN[0], 0.9); });

          tips.forEach(function (t) {
            var cnt = Math.floor(t.path.length * t.vis);
            if (cnt < 2) return;
            var path = new Path2D();
            path.moveTo(t.path[0][0], t.path[0][1]);
            for (var k = 1; k < cnt; k++) path.lineTo(t.path[k][0], t.path[k][1]);
            if (P.fx === 'pixel') {
              var pp = new Path2D(), qx = Math.round(t.path[0][0] / 6) * 6, qy = Math.round(t.path[0][1] / 6) * 6, nx, ny;
              pp.moveTo(qx, qy);
              for (var k2 = 1; k2 < cnt; k2++) {
                nx = Math.round(t.path[k2][0] / 6) * 6; ny = Math.round(t.path[k2][1] / 6) * 6;
                if (nx !== qx || ny !== qy) { pp.lineTo(nx, qy); pp.lineTo(nx, ny); qx = nx; qy = ny; }
              }
              g.lineCap = 'butt'; g.lineJoin = 'miter';
              g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = Math.max(6, t.w * 2 + 4); g.stroke(pp);
              g.strokeStyle = rgba(t.color, 1); g.lineWidth = Math.max(3, t.w * 1.2); g.stroke(pp);
            } else if (P.fx === 'bolt') {
              var bjf = Math.floor(time * 16), bp = new Path2D(), bfl = 0.75 + 0.25 * hrand(bjf * 1.7 + t.seed);
              bp.moveTo(t.path[0][0], t.path[0][1]);
              for (var bk = 1; bk < cnt; bk++) {
                var bpn = t.path[Math.min(cnt - 1, bk + 1)], bpp = t.path[bk - 1], bdy = bpn[1] - bpp[1], bdx = bpn[0] - bpp[0], bln = Math.hypot(bdx, bdy) || 1;
                var bof = (hrand(bk * 3.7 + t.seed * 11 + bjf * 5.3) - 0.5) * 11 * Math.min(1, bk / 4);
                var bmx = t.path[bk][0] + bdy / bln * bof, bmy = t.path[bk][1] - bdx / bln * bof;
                bp.lineTo(bmx, bmy);
                if (bk % 9 === 0 && hrand(bk + t.seed * 5) > 0.55) {   // little forks off the main bolt
                  var bta = Math.atan2(bdy, bdx) + (hrand(bk * 1.3 + t.seed) > 0.5 ? 0.9 : -0.9), bfx = bmx, bfy = bmy;
                  for (var bq = 0; bq < 3; bq++) {
                    bta += (hrand(bk * 2 + bq + bjf) - 0.5) * 0.9;
                    bfx += Math.cos(bta) * 9; bfy += Math.sin(bta) * 9;
                    bp.lineTo(bfx, bfy);
                  }
                  bp.moveTo(bmx, bmy);
                }
              }
              g.strokeStyle = rgba(t.color, 0.12 * bfl); g.lineWidth = t.w * 7; g.stroke(bp);
              g.strokeStyle = rgba(t.color, 0.35 * bfl); g.lineWidth = t.w * 3; g.stroke(bp);
              g.strokeStyle = 'rgba(255,225,225,' + (0.95 * bfl) + ')'; g.lineWidth = Math.max(1, t.w * 0.7); g.stroke(bp);
            } else if (P.fx === 'vine') {
              g.strokeStyle = 'rgba(8,24,16,0.55)'; g.lineWidth = t.w * 2 + 3; g.stroke(path);
              g.strokeStyle = rgba(t.color, 1); g.lineWidth = Math.max(2, t.w * 1.2); g.stroke(path);
              var LC = [[96, 170, 90], [140, 200, 100], [70, 140, 90]], lsz = 0.6 + t.w * 0.3;
              for (var lk = 6; lk < cnt; lk += 7) {
                var la = t.path[lk - 1], lb = t.path[lk], lr = Math.abs(Math.sin(lk * 12.9898 + t.seed * 78.233) * 43758.5453) % 1;
                var lang = Math.atan2(lb[1] - la[1], lb[0] - la[0]) + ((lk / 7 | 0) % 2 ? 1 : -1) * 1.0, ls = (3.5 + lr * 4) * Math.min(1.3, lsz) * Math.min(1, (cnt - lk) / 6);
                g.save(); g.translate(lb[0], lb[1]); g.rotate(lang);
                g.fillStyle = rgba(LC[lk % 3], 1);
                g.beginPath(); g.ellipse(ls, 0, ls, ls * 0.45, 0, 0, 6.2832); g.fill();
                g.restore();
              }
            } else if (P.fx === 'candy') {
              var cw = Math.max(4, t.w * 2.6);
              g.strokeStyle = '#2d1b4e'; g.lineWidth = cw + 4; g.stroke(path);
              g.strokeStyle = rgba(t.color, 1); g.lineWidth = cw; g.stroke(path);
              g.lineCap = 'butt'; g.setLineDash([cw * 1.1, cw * 2.2]); g.lineDashOffset = -time * 40;
              g.strokeStyle = 'rgba(255,255,255,0.92)'; g.lineWidth = cw; g.stroke(path);
              g.setLineDash([]); g.lineCap = 'round';
            } else if (P.fx === 'cute') {
              g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = t.w * 3.4; g.stroke(path);
              g.strokeStyle = rgba(t.color, 0.95); g.lineWidth = Math.max(1.5, t.w * 1.4); g.stroke(path);
            } else {
              g.strokeStyle = rgba(t.color, 0.10); g.lineWidth = t.w * 6; g.stroke(path);
              g.strokeStyle = rgba(t.color, 0.24); g.lineWidth = t.w * 2.8; g.stroke(path);
              g.strokeStyle = rgba(t.core, 0.95); g.lineWidth = Math.max(1, t.w * 0.8); g.stroke(path);
            }
            if (cnt > 12) {
              var pt = t.path[Math.min(cnt - 1, Math.floor(((time * 0.7 + t.seed) % 1) * cnt))];
              glowDot(g, pt[0], pt[1], 5 + t.w * 2, t.color, 0.8);
            }
            if (!t.dead) glowDot(g, t.x, t.y, 7 + t.w * 2.2, t.color, 1);
          });

          flowers.forEach(function (f) {
            f.t += dt;
            if (fade <= 0) return;
            var k = Math.min(1, f.t / 0.55), sc = 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2);
            (f.shroom ? drawShroom : f.lolly ? drawLolly : drawFlower)(g, f.x, f.y, f.r * Math.max(0.01, sc), f.shroom || f.lolly ? f.rot : f.rot + (1 - k) * 1.6, f.color, fade);
          });

          strikes = strikes.filter(function (st) {
            st.t += dt;
            var sal = 1 - st.t / 0.26;
            if (sal <= 0) return false;
            var sp = new Path2D();
            sp.moveTo(st.pts[0][0], st.pts[0][1]);
            for (var i2 = 1; i2 < st.pts.length; i2++) sp.lineTo(st.pts[i2][0], st.pts[i2][1]);
            st.forks.forEach(function (fk) {
              sp.moveTo(fk[0][0], fk[0][1]);
              for (var q2 = 1; q2 < fk.length; q2++) sp.lineTo(fk[q2][0], fk[q2][1]);
            });
            g.strokeStyle = 'rgba(255,31,61,' + 0.25 * sal + ')'; g.lineWidth = 12; g.stroke(sp);
            g.strokeStyle = 'rgba(255,90,90,' + 0.6 * sal + ')'; g.lineWidth = 4; g.stroke(sp);
            g.strokeStyle = 'rgba(255,240,240,' + sal + ')'; g.lineWidth = 1.6; g.stroke(sp);
            return true;
          });

          zaps = zaps.filter(function (zp) {
            zp.t += dt;
            var zal = 1 - zp.t / 0.6;
            if (zal <= 0) return false;
            roundRectPath(g, zp.T.l, zp.T.t, zp.T.w, zp.T.h, zp.T.rx);
            g.strokeStyle = 'rgba(255,31,61,' + 0.25 * zal + ')'; g.lineWidth = 8; g.stroke();
            g.strokeStyle = 'rgba(255,120,120,' + 0.9 * zal + ')'; g.lineWidth = 1.5; g.stroke();
            return true;
          });

          rings = rings.filter(function (r) {
            r.life += dt;
            r.r += 420 * dt;
            var a = 1 - r.life / 0.75;
            if (a <= 0) return false;
            g.strokeStyle = rgba(r.color, a * 0.9);
            g.lineWidth = 2.2;
            if (P.fx === 'pixel') {
              g.lineWidth = 3;
              g.strokeRect(Math.round(r.x - r.r), Math.round(r.y - r.r), Math.round(r.r * 2), Math.round(r.r * 2));
            } else {
              g.beginPath();
              g.arc(r.x, r.y, r.r, 0, 6.2832);
              g.stroke();
            }
            return true;
          });

          sparks = sparks.filter(function (s) {
            s.life += dt;
            if (s.life > s.max) return false;
            s.x += s.vx * dt; s.y += s.vy * dt;
            s.vx *= 1 - 2.2 * dt; s.vy *= 1 - 2.2 * dt;
            if (P.fx === 'pixel') {   // arcade: chunky falling pixels that blink out
              s.vy += 160 * dt;
              var lf = s.life / s.max;
              if (lf < 0.6 || Math.floor(s.life * 22) % 2) {
                g.fillStyle = rgba(s.color, 1);
                g.fillRect(Math.round(s.x / 4) * 4, Math.round(s.y / 4) * 4, 4, 4);
              }
              return true;
            }
            if (s.kind) {   // tumbling petals, hearts, leaves, bubbles and sprinkles
              var kd = s.kind;
              if (kd === 4) { s.vy -= 140 * dt; s.vx += Math.sin(time * 6 + s.rot) * 40 * dt; }
              else if (kd === 3) { s.vy += 40 * dt; s.vx += Math.sin(time * 5 + s.rot) * 120 * dt; }
              else if (kd === 5) s.vy += 220 * dt;
              else s.vy += 90 * dt;
              s.rot += s.vr * dt;
              g.save();
              g.translate(s.x, s.y);
              g.rotate(s.rot);
              g.globalAlpha = Math.min(1, (1 - s.life / s.max) * 1.6);
              g.fillStyle = rgba(s.color, 1);
              if (kd === 2) { heartPath(g, s.s * 1.3); g.fill(); }
              else if (kd === 3) {
                g.beginPath(); g.ellipse(0, 0, s.s * 1.3, s.s * 0.6, 0, 0, 6.2832); g.fill();
                g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-s.s * 1.3, 0); g.lineTo(s.s * 1.3, 0); g.stroke();
              } else if (kd === 4) {
                g.strokeStyle = rgba(s.color, 0.95); g.lineWidth = 1.6;
                g.fillStyle = rgba(s.color, 0.15);
                g.beginPath(); g.arc(0, 0, s.s, 0, 6.2832); g.fill(); g.stroke();
              } else if (kd === 5) {
                g.strokeStyle = rgba(s.color, 1); g.lineWidth = s.s * 0.55; g.lineCap = 'round';
                g.beginPath(); g.moveTo(-s.s, 0); g.lineTo(s.s, 0); g.stroke();
              } else { g.beginPath(); g.ellipse(0, 0, s.s, s.s * 0.5, 0, 0, 6.2832); g.fill(); }
              g.restore();
              return true;
            }
            g.strokeStyle = rgba(s.color, 1 - s.life / s.max);
            g.lineWidth = 1.6;
            g.beginPath();
            g.moveTo(s.x, s.y);
            g.lineTo(s.x - s.vx * 0.04, s.y - s.vy * 0.04);
            g.stroke();
            return true;
          });

          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }

    /* ----- web mode: a web is shot at every component and reels it in from a different direction ----- */

    var movers = [], htmlSaved = null;

    function restoreWeb() {
      movers.forEach(function (m) {
        var s = m.el.style, v = m.saved;
        s.transform = v.transform;
        s.transformOrigin = v.origin;
        s.willChange = v.will;
        s.transition = v.transition;
        s.visibility = v.visibility;
        if (v.filter !== undefined) { s.filter = v.filter; s.opacity = v.opacity; }
        if (v.clip !== undefined) { s.clipPath = v.clip; s.backfaceVisibility = v.bf; }
      });
      if (htmlSaved !== null) {
        document.documentElement.style.overflowX = htmlSaved;
        htmlSaved = null;
      }
    }

    // a small spider-web patch: spokes plus sagging rings
    function drawWeb(g, x, y, r, rot, a) {
      var n = 8, i, j, path = new Path2D();
      for (i = 0; i < n; i++) {
        var an = rot + i * 6.2832 / n;
        path.moveTo(x, y);
        path.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r);
      }
      for (j = 1; j <= 3; j++) {
        var rr = r * j / 3;
        for (i = 0; i < n; i++) {
          var a1 = rot + i * 6.2832 / n, a2 = a1 + 6.2832 / n, am = (a1 + a2) / 2;
          if (i === 0) path.moveTo(x + Math.cos(a1) * rr, y + Math.sin(a1) * rr);
          path.quadraticCurveTo(x + Math.cos(am) * rr * 0.82, y + Math.sin(am) * rr * 0.82, x + Math.cos(a2) * rr, y + Math.sin(a2) * rr);
        }
      }
      g.lineJoin = 'round';
      g.lineCap = 'round';
      g.strokeStyle = 'rgba(255,255,255,' + 0.7 * a + ')'; g.lineWidth = 2.8; g.stroke(path);
      g.strokeStyle = 'rgba(' + P.ink + ',' + 0.85 * a + ')'; g.lineWidth = 1; g.stroke(path);
    }

    async function webRun() {
      var W = innerWidth, H = innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
      var docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
      function byPos(a, b) { return (a.rect.t - b.rect.t) || (a.rect.l - b.rect.l); }
      function tf(x, y, th) { return 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) rotate(' + th.toFixed(4) + 'rad)'; }

      // 1. the components that fly: the page's own boxes, nested up to three levels (children wait for their parent)
      var seen = new Set(), list = [];
      tasks.forEach(function (t) {
        if (seen.has(t.el)) return;
        seen.add(t.el);
        if (!MEDIA[t.el.tagName.toUpperCase()] && getComputedStyle(t.el).display === 'inline') return;   // inline boxes cannot be transformed
        list.push(t.el);
      });
      list.sort(function (a, b) { return depthOf(a) - depthOf(b); });
      var byEl = new Map();
      list.forEach(function (el) {
        var p = el.parentElement, par = null;
        while (p) { if (byEl.has(p)) { par = byEl.get(p); break; } p = p.parentElement; }
        var level = par ? par.level + 1 : 0;
        if (level > 2) return;
        var r = el.getBoundingClientRect();
        var m = {
          el: el, parent: par, level: level, children: [],
          rect: { l: r.left, t: r.top, w: r.width, h: r.height },
          saved: { transform: el.style.transform, origin: el.style.transformOrigin, will: el.style.willChange, transition: el.style.transition, visibility: el.style.visibility },
          live: false, landed: false, settled: false, finished: false, off: [0, 0],
          seed: Math.random() * 10, bowSign: Math.random() < 0.5 ? -1 : 1
        };
        byEl.set(el, m);
        movers.push(m);
        if (par) par.children.push(m);
      });
      if (!movers.length) return;

      // 2. where each one comes from, and how its spring behaves
      function plan(m) {
        var r = m.rect, margin = m.level ? 90 : 50, cands = [];
        cands.push({ ox: -(r.l + r.w + margin), oy: 0 });
        cands.push({ ox: (W - r.l) + margin, oy: 0 });
        cands.push({ ox: 0, oy: -(r.t + r.h + margin) });
        if (H + margin + r.h <= docH) cands.push({ ox: 0, oy: (H - r.t) + margin });   // from below only if the page is tall enough not to grow
        cands.forEach(function (c) { c.mag = Math.hypot(c.ox, c.oy); });
        cands.sort(function (a, b) { return a.mag - b.mag; });
        var limit = Math.max(900, cands[0].mag);
        var pool = cands.filter(function (c) { return c.mag <= limit; });
        var c1 = Math.random() < 0.55 ? pool[0] : pool[Math.floor(Math.random() * pool.length)];
        var ox = c1.ox, oy = c1.oy;
        if (c1.ox === 0) ox = rand(-1, 1) * 140; else oy = rand(-1, 1) * 140;     // arrive on a slant
        if (Math.random() < 0.3) {                                                  // sometimes truly diagonal
          var c2 = pool.filter(function (c) { return (c1.ox === 0) !== (c.ox === 0); })[0];
          if (c2) { ox = c1.ox !== 0 ? c1.ox : c2.ox; oy = c1.oy !== 0 ? c1.oy : c2.oy; }
        }
        var d0 = Math.hypot(ox, oy);
        var x = Math.log(Math.max(d0, 60) / 22);                                    // pick damping so the overshoot is about 22px
        var zeta = clamp(x / Math.sqrt(9.8696 + x * x), 0.4, 0.88);
        var wn = clamp(6667 / d0, 4.5, 9.5);                                        // keep the peak speed sane for long throws
        var big = Math.max(r.w, r.h);
        var rotMax = 22 * clamp(220 / big, 0.06, 1) * Math.PI / 180;                // big things barely tilt
        m.p = { ox: ox, oy: oy, d0: d0, zeta: zeta, wn: wn, wd: wn * Math.sqrt(1 - zeta * zeta), th0: (Math.random() < 0.5 ? -1 : 1) * rand(0.35, 1) * rotMax };
        m.cx = r.l + r.w / 2;
        m.cy = r.t + r.h / 2;
        m.ax = clamp(m.cx, 8, W - 8);
        m.ay = clamp(m.cy, 8, H - 8);
        m.big = r.w * r.h > 6000;
      }

      // 3. schedule: top-level pieces first, each group of children starts once its parent has landed
      var roots = movers.filter(function (m) { return !m.parent; });
      PL.sort(roots, function (m) { return [m.rect.l + m.rect.w / 2, m.rect.t + m.rect.h / 2]; });
      roots.forEach(function (m, i) { m.start = (i / roots.length) * PL.span + rand(0, 0.12); });
      movers.forEach(function (m) {
        PL.sort(m.children, function (c) { return [c.rect.l + c.rect.w / 2, c.rect.t + c.rect.h / 2]; });
        m.children.forEach(function (c, i) { c.start = m.start + 1.15 + (i / m.children.length) * 0.55 + rand(0, 0.1); });
      });

      // 4. park everything off screen
      htmlSaved = document.documentElement.style.overflowX;
      document.documentElement.style.overflowX = 'hidden';
      movers.forEach(function (m) {
        plan(m);
        var s = m.el.style;
        s.transition = 'none';
        s.transformOrigin = '50% 50%';
        s.willChange = 'transform';
        if (m.level === 0) s.transform = tf(m.p.ox, m.p.oy, m.p.th0); else s.visibility = 'hidden';
      });

      var c = mk('canvas', 'sw-cv');
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      var g = c.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      rootEl.insertBefore(c, rootEl.firstChild);
      await new Promise(function (res) { requestAnimationFrame(function () { requestAnimationFrame(res); }); });
      document.documentElement.classList.remove('sw-boot');
      if (R.dead) return;

      var time = 0, last = performance.now(), imps = [];
      return new Promise(function (resolve) {
        function frame(now) {
          if (R.dead) return resolve();
          var dt = Math.min(0.05, (now - last) / 1000) * state.speed;
          last = now;
          time += dt;
          g.clearRect(0, 0, W, H);

          movers.forEach(function (m) {
            if (m.finished) return;
            var tt = time - m.start;
            if (tt < 0) return;
            if (!m.live) {
              m.live = true;
              if (m.level) { m.el.style.transform = tf(m.p.ox, m.p.oy, m.p.th0); m.el.style.visibility = m.saved.visibility; }
            }
            var p = m.p, pt = tt - 0.18, ox = p.ox, oy = p.oy, th = p.th0, f = 1;
            if (pt >= 0) {
              f = Math.exp(-p.zeta * p.wn * pt) * (Math.cos(p.wd * pt) + (p.zeta * p.wn / p.wd) * Math.sin(p.wd * pt));
              var sway = Math.exp(-3.15 * pt) * (Math.cos(6.25 * pt) + 0.504 * Math.sin(6.25 * pt));
              ox = p.ox * f; oy = p.oy * f; th = p.th0 * sway;
            }
            var sp = Math.hypot(ox - m.off[0], oy - m.off[1]) / Math.max(dt, 0.001);
            m.off = [ox, oy];

            if (!m.settled) {
              m.el.style.transform = tf(ox, oy, th);
              if (pt > 0 && !m.landed && f <= 0) {
                m.landed = true;
                m.landT = time;
                if (m.big) imps.push({ x: m.ax, y: m.ay, life: 0, max: clamp(20 + Math.max(m.rect.w, m.rect.h) * 0.1, 26, 64) });
              }
              if ((pt > 0.6 && Math.abs(f) * p.d0 < 0.5 && Math.abs(th) < 0.0015) || pt > 3) {
                m.settled = true;
                m.endT = time;
                var s = m.el.style, v = m.saved;
                s.transform = v.transform; s.transformOrigin = v.origin; s.willChange = v.will; s.transition = v.transition;
              }
            }

            // the web strand from where the piece belongs to the piece itself
            var fade = m.settled ? 1 - (time - m.endT) / 0.45 : 1;
            if (fade <= 0) { m.finished = true; return; }
            var Px, Py;
            if (pt < 0) {
              var k = 1 - Math.pow(1 - clamp(tt / 0.18, 0, 1), 3);              // the shot: the strand flies out to the piece
              Px = m.ax + (m.cx + p.ox - m.ax) * k;
              Py = m.ay + (m.cy + p.oy - m.ay) * k;
            } else {
              Px = m.cx + ox;
              Py = m.cy + oy;
            }
            var dx = Px - m.ax, dy = Py - m.ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
            var tau = m.landed ? time - m.landT : -1;
            var bow = m.bowSign * Math.min(40, len * 0.05) + Math.sin(time * 34 + m.seed) * Math.min(5, sp / 500) +
              (tau >= 0 ? 26 * Math.exp(-2.6 * tau) * Math.sin(15 * tau + m.seed) : 0);
            var strand = new Path2D();
            strand.moveTo(m.ax, m.ay);
            strand.quadraticCurveTo((m.ax + Px) / 2 + nx * bow, (m.ay + Py) / 2 + ny * bow, Px, Py);
            g.lineCap = 'round';
            g.strokeStyle = 'rgba(255,255,255,' + 0.65 * fade + ')'; g.lineWidth = 3; g.stroke(strand);
            g.strokeStyle = 'rgba(' + P.ink + ',' + 0.85 * fade + ')'; g.lineWidth = 1.2; g.stroke(strand);

            var hubA = fade * (1 - clamp(pt / 0.6, 0, 1)) * 0.8;          // the anchor patch is only seen until the piece covers it
            if (m.big && hubA > 0.02) drawWeb(g, m.ax, m.ay, clamp(0.2 * Math.min(m.rect.w, m.rect.h) + 8, 12, 24) * Math.min(1, tt / 0.15), m.seed, hubA);
            if (pt >= 0) {
              var knotA = fade * (tau >= 0 ? Math.max(0, 1 - tau / 0.4) : 1);
              if (m.big && knotA > 0.02) drawWeb(g, Px, Py, clamp(0.18 * Math.min(m.rect.w, m.rect.h) + 6, 10, 22), th + m.seed, knotA * 0.9);
            } else {
              g.fillStyle = 'rgba(255,255,255,0.95)';
              g.strokeStyle = 'rgba(' + P.ink + ',0.9)';
              g.lineWidth = 1.4;
              g.beginPath();
              g.arc(Px, Py, 4, 0, 6.2832);
              g.fill();
              g.stroke();
            }
          });

          imps = imps.filter(function (im) {
            im.life += dt;
            var k = im.life / 0.5;
            if (k >= 1) return false;
            var r = im.max * (1 - Math.pow(1 - k, 3));
            g.strokeStyle = 'rgba(255,255,255,' + 0.45 * (1 - k) + ')'; g.lineWidth = 3;
            g.beginPath(); g.arc(im.x, im.y, r, 0, 6.2832); g.stroke();
            g.strokeStyle = 'rgba(' + P.ink + ',' + 0.5 * (1 - k) + ')'; g.lineWidth = 1.2;
            g.beginPath(); g.arc(im.x, im.y, r, 0, 6.2832); g.stroke();
            return true;
          });

          if ((movers.every(function (m) { return m.finished; }) && !imps.length) || time > 16) return resolve();
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }

    /* ----- depth mode: the components float apart in 3D space, then snap back together ----- */

    async function depthRun() {
      var W = innerWidth, H = innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1), Ox = W / 2, Oy = H / 2, D = 1400;
      var docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      var zNear = docH > H * 1.5 ? 420 : 0;      // only come toward the camera if the page is tall enough not to grow
      var T_POP = 0.5, T_I = PL.rnd ? rand(2.2, 3.2) : 2.6, Y0 = PL.rnd ? (Math.random() < 0.5 ? -1 : 1) * rand(13, 24) : -18, Y1 = PL.rnd ? -(Y0 < 0 ? -1 : 1) * rand(6, 14) : 10, PA = PL.rnd ? rand(3, 9) : 6, KLO = PL.rnd ? rand(0.12, 0.3) : 0.25, KHI = PL.rnd ? rand(0.45, 0.75) : 0.6;                // seconds: popping in, then floating until the snap-back starts
      function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
      function spring(t, z, w) { var wd = w * Math.sqrt(1 - z * z); return Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); }
      function labelOf(el) {
        var s = el.tagName.toLowerCase();
        if (el.id) s += '#' + el.id; else if (el.classList && el.classList.length) s += '.' + el.classList[0];
        return s;
      }

      // 1. the components: the page's top-level boxes (their children travel with them)
      var seen = new Set(), list = [];
      tasks.forEach(function (t) {
        if (seen.has(t.el)) return;
        seen.add(t.el);
        if (!MEDIA[t.el.tagName.toUpperCase()] && getComputedStyle(t.el).display === 'inline') return;
        list.push(t.el);
      });
      list.sort(function (a, b) { return depthOf(a) - depthOf(b); });
      var byEl = new Map();
      list.forEach(function (el) {
        for (var p = el.parentElement; p; p = p.parentElement) if (byEl.has(p)) return;
        var r = el.getBoundingClientRect();
        var m = {
          el: el, rect: { l: r.left, t: r.top, w: r.width, h: r.height }, label: labelOf(el), seed: Math.random() * 10,
          saved: { transform: el.style.transform, origin: el.style.transformOrigin, will: el.style.willChange, transition: el.style.transition, visibility: el.style.visibility, filter: el.style.filter, opacity: el.style.opacity }
        };
        byEl.set(el, m);
        movers.push(m);
      });
      if (!movers.length) return;

      // 2. where each one floats: pushed outward from the centre of the screen, at its own depth and tilt
      movers.forEach(function (m) {
        var r = m.rect, big = Math.max(r.w, r.h), rs = clamp(300 / big, 0.25, 1), k = rand(KLO, KHI);
        m.cx = r.l + r.w / 2; m.cy = r.t + r.h / 2;
        m.Cx = m.cx - Ox; m.Cy = m.cy - Oy;
        m.q = { tx: m.Cx * k + rand(-80, 80), ty: m.Cy * k + rand(-70, 70), tz: rand(-1100, zNear), rx: rand(-34, 34) * rs, ry: rand(-40, 40) * rs, rz: rand(-12, 12) * rs };
        m.zeta = rand(0.5, 0.72);
        m.wn = rand(6, 8);
        m.M = Math.max(Math.abs(m.q.tx), Math.abs(m.q.ty), Math.abs(m.q.tz) * 0.35, Math.max(Math.abs(m.q.rx), Math.abs(m.q.ry), Math.abs(m.q.rz)) * big / 57);
      });
      var order = movers.slice().sort(function (a, b) { return a.q.tz - b.q.tz; });     // far ones snap back first
      order.forEach(function (m, i) { m.start = T_I + i * 0.06 + rand(0, 0.08); });
      PL.sort(movers.slice(), function (m) { return [m.cx, m.cy]; }).forEach(function (m, i) { m.pop = i * 0.045 + rand(0, 0.06); });

      function camAt(time) {
        var h = Math.min(time, T_I);
        var yaw = Y0 + (Y1 - Y0) * (h / T_I), pitch = PA * Math.sin(h * 0.9);
        if (time > T_I + 0.1) {
          var f = spring(time - T_I - 0.1, 0.6, 5);
          yaw = Y1 * f;
          pitch = PA * Math.sin(T_I * 0.9) * f;
        }
        var tl = time - (T_I + 0.95);
        if (tl > 0) yaw += 0.8 * Math.exp(-9 * tl) * Math.sin(55 * tl);        // the kick when everything lands
        return { yaw: yaw, pitch: pitch };
      }
      function project(x, y, z, cam) {
        var a = cam.yaw * Math.PI / 180, b = cam.pitch * Math.PI / 180;
        var x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a);
        var y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
        var sc = D / (D - z2);
        return { x: Ox + x1 * sc, y: Oy + y2 * sc };
      }
      function tf3(m, s, cam, sc, fy, fz) {
        var q = m.q;
        return 'perspective(' + D + 'px) rotateX(' + cam.pitch.toFixed(3) + 'deg) rotateY(' + cam.yaw.toFixed(3) + 'deg) ' +
          'translate3d(' + (m.Cx + q.tx * s).toFixed(2) + 'px,' + (m.Cy + q.ty * s + (fy || 0)).toFixed(2) + 'px,' + (q.tz * s).toFixed(1) + 'px) ' +
          'rotateX(' + (q.rx * s).toFixed(3) + 'deg) rotateY(' + (q.ry * s).toFixed(3) + 'deg) rotateZ(' + (q.rz * s + (fz || 0)).toFixed(3) + 'deg) ' +
          'scale(' + sc.toFixed(4) + ') translate3d(' + (-m.Cx).toFixed(2) + 'px,' + (-m.Cy).toFixed(2) + 'px,0)';
      }
      function depthFilter(z) {
        var b = Math.min(5.5, Math.abs(z) / 260), sh = Math.min(1, Math.abs(z) / 500), f = '';
        if (b > 0.3) f += 'blur(' + b.toFixed(1) + 'px) ';
        if (sh > 0.05) f += 'drop-shadow(0 ' + (sh * 26).toFixed(0) + 'px ' + (sh * 22).toFixed(0) + 'px rgba(' + P.shadow + ',' + (0.18 * sh).toFixed(2) + '))';
        return f || 'none';
      }

      // 3. park everything in its floating pose, invisible until it pops in
      htmlSaved = document.documentElement.style.overflowX;
      document.documentElement.style.overflowX = 'hidden';
      var cam0 = camAt(0);
      movers.forEach(function (m) {
        var s = m.el.style;
        s.transition = 'none';
        s.transformOrigin = (Ox - m.rect.l) + 'px ' + (Oy - m.rect.t) + 'px';
        s.willChange = 'transform, filter, opacity';
        s.opacity = '0';
        s.transform = tf3(m, 1, cam0, 0.65);
      });

      var cv = mk('canvas', 'sw-cv');
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      var g = cv.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      rootEl.insertBefore(cv, rootEl.firstChild);
      await new Promise(function (res) { requestAnimationFrame(function () { requestAnimationFrame(res); }); });
      document.documentElement.classList.remove('sw-boot');
      if (R.dead) return;

      var motes = [], rings = [], ringsMade = false, si;
      for (si = 0; si < 64; si++) motes.push({ x: rand(0, W), y: rand(0, H), d: rand(0.2, 1), ph: rand(0, 6.28), hue: P.motes[Math.random() < 0.5 ? 0 : 1] });
      var time = 0, last = performance.now();
      var INK = P.ink;

      return new Promise(function (resolve) {
        function frame(now) {
          if (R.dead) return resolve();
          var dt = Math.min(0.05, (now - last) / 1000) * state.speed;
          last = now;
          time += dt;
          var cam = camAt(time), allSettled = true;
          g.clearRect(0, 0, W, H);

          // dust at different depths, shifting with the camera
          var dustA = time < T_I + 1.2 ? 1 : Math.max(0, 1 - (time - T_I - 1.2) / 0.8);
          if (dustA > 0) {
            motes.forEach(function (p) {
              p.y -= 10 * p.d * dt;
              if (p.y < -4) { p.y = H + 4; p.x = rand(0, W); }
              var px = p.x + cam.yaw * 16 * p.d + Math.sin(time * 0.7 + p.ph) * 8 * p.d;
              g.fillStyle = 'rgba(' + p.hue + ',' + (0.1 + 0.28 * p.d) * dustA + ')';
              g.beginPath();
              g.arc(px, p.y, 0.8 + 2.4 * p.d, 0, 6.2832);
              g.fill();
            });
          }

          movers.forEach(function (m) {
            var q = m.q, u = time - m.start, s;
            if (u < 0) s = 1;
            else if (u < 0.25) s = 1 + 0.12 * (1 - Math.pow(1 - u / 0.25, 3));                 // a short wind-up
            else s = 1.12 * spring(u - 0.25, m.zeta, m.wn);
            var settled = u > 0.8 && Math.abs(s) * m.M < 0.4;
            if (!settled) allSettled = false;
            var pop = clamp((time - m.pop) / 0.35, 0, 1), e = 1 - Math.pow(1 - pop, 3);
            // gentle drift while floating
            var drift = u < 0 ? 1 : Math.max(0, 1 - u / 0.4);
            var fy = Math.sin(time * 0.9 + m.seed) * 9 * drift, fz = Math.sin(time * 0.7 + m.seed * 1.3) * 2.2 * drift;
            var st = m.el.style;
            st.opacity = e.toFixed(3);
            st.transform = tf3(m, s, cam, 0.65 + 0.35 * e, fy, fz);
            st.filter = depthFilter(q.tz * s);

            // blueprint label while floating
            var la = time < T_I ? clamp((time - m.pop - 0.35) / 0.3, 0, 1) : Math.max(0, 1 - (time - T_I) / 0.35);
            if (la > 0.02) {
              var pp = project(m.Cx + q.tx * s, m.Cy + q.ty * s + fy, q.tz * s, cam);
              var txt = m.label + '   z ' + Math.round(q.tz * s);
              g.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
              var tw = g.measureText(txt).width + 16, lx = clamp(pp.x + 20, 6, W - tw - 6), ly = clamp(pp.y - 34, 6, H - 28);
              g.lineCap = 'round';
              g.beginPath(); g.moveTo(pp.x, pp.y); g.lineTo(lx, ly + 10);
              g.strokeStyle = 'rgba(255,255,255,' + 0.7 * la + ')'; g.lineWidth = 3; g.stroke();
              g.strokeStyle = 'rgba(' + INK + ',' + 0.8 * la + ')'; g.lineWidth = 1; g.stroke();
              g.beginPath(); g.moveTo(pp.x - 5, pp.y); g.lineTo(pp.x + 5, pp.y); g.moveTo(pp.x, pp.y - 5); g.lineTo(pp.x, pp.y + 5);
              g.strokeStyle = 'rgba(' + INK + ',' + 0.9 * la + ')'; g.lineWidth = 1.2; g.stroke();
              roundRectPath(g, lx, ly, tw, 20, 10);
              g.fillStyle = 'rgba(255,255,255,' + 0.94 * la + ')'; g.fill();
              g.strokeStyle = 'rgba(' + INK + ',' + 0.75 * la + ')'; g.lineWidth = 1; g.stroke();
              g.fillStyle = 'rgba(' + INK + ',' + la + ')';
              g.textBaseline = 'middle';
              g.fillText(txt, lx + 8, ly + 10.5);
            }
          });

          if (!ringsMade && time > T_I + 0.95) {
            ringsMade = true;
            rings.push({ life: 0, max: Math.max(W, H) * 0.55, delay: 0 }, { life: -0.12, max: Math.max(W, H) * 0.4, delay: 0.12 });
          }
          rings = rings.filter(function (r) {
            r.life += dt;
            if (r.life < 0) return true;
            var k = r.life / 0.7;
            if (k >= 1) return false;
            var rad = r.max * (1 - Math.pow(1 - k, 3));
            g.strokeStyle = 'rgba(255,255,255,' + 0.5 * (1 - k) + ')'; g.lineWidth = 4;
            g.beginPath(); g.arc(Ox, Oy, rad, 0, 6.2832); g.stroke();
            g.strokeStyle = 'rgba(' + INK + ',' + 0.45 * (1 - k) + ')'; g.lineWidth = 1.3;
            g.beginPath(); g.arc(Ox, Oy, rad, 0, 6.2832); g.stroke();
            return true;
          });

          var camDone = time > T_I + 0.1 + 2.2 && Math.abs(cam.yaw) < 0.03 && Math.abs(cam.pitch) < 0.03;
          if ((allSettled && camDone && !rings.length) || time > T_I + 7) return resolve();
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }

    /* ----- storm mode: lightning strings jump from piece to piece and a bolt strikes each one into place ----- */

    async function stormRun() {
      var W = innerWidth, H = innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1), VEINS = VEIN;
      function byPos(a, b) { return (a.rect.t - b.rect.t) || (a.rect.l - b.rect.l); }
      function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
      function bolt(x0, y0, x1, y1, seg, jag) {
        var dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, pts = [[x0, y0]], i, f, o;
        for (i = 1; i < seg; i++) {
          f = i / seg; o = (Math.random() - 0.5) * jag;
          pts.push([x0 + dx * f + nx * o, y0 + dy * f + ny * o]);
        }
        pts.push([x1, y1]);
        return pts;
      }
      function forksOf(pts) {
        var out = [], i, j, b, dir, px, py, fk;
        for (i = 2; i < pts.length - 1; i += 3) {
          b = pts[i]; dir = Math.random() < 0.5 ? -1 : 1; fk = [b]; px = b[0]; py = b[1];
          for (j = 0; j < 3; j++) { px += dir * rand(8, 22); py += rand(10, 26); fk.push([px, py]); }
          out.push(fk);
        }
        return out;
      }
      function pathOf(pts, frac, forks) {
        var p = new Path2D(), n = (pts.length - 1) * frac, full = Math.floor(n), i;
        p.moveTo(pts[0][0], pts[0][1]);
        for (i = 1; i <= full && i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
        if (full < pts.length - 1) { var r = n - full, a = pts[full], b = pts[full + 1]; p.lineTo(a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r); }
        if (forks) forks.forEach(function (fk) { p.moveTo(fk[0][0], fk[0][1]); for (var q = 1; q < fk.length; q++) p.lineTo(fk[q][0], fk[q][1]); });
        return p;
      }
      function zapLine(g, p, col, al, w) {
        g.strokeStyle = rgba(col, 0.16 * al); g.lineWidth = 14 * w; g.stroke(p);
        g.strokeStyle = rgba(col, 0.5 * al); g.lineWidth = 5 * w; g.stroke(p);
        g.strokeStyle = 'rgba(255,238,238,' + Math.min(1, 0.98 * al) + ')'; g.lineWidth = 1.9 * w; g.stroke(p);
      }

      // 1. the components: the page's top-level boxes that are on screen
      var seen = new Set(), list = [], inList = new Set();
      tasks.forEach(function (t) {
        if (seen.has(t.el)) return;
        seen.add(t.el);
        if (!MEDIA[t.el.tagName.toUpperCase()] && getComputedStyle(t.el).display === 'inline') return;
        list.push(t.el);
      });
      list.sort(function (a, b) { return depthOf(a) - depthOf(b); });
      list.forEach(function (el) {
        for (var p = el.parentElement; p; p = p.parentElement) if (inList.has(p)) return;
        inList.add(el);
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W || r.width < 2 || r.height < 2) return;
        var m = {
          el: el, rect: { l: r.left, t: r.top, w: r.width, h: r.height }, seed: Math.random() * 10,
          saved: { transform: el.style.transform, origin: el.style.transformOrigin, will: el.style.willChange, transition: el.style.transition, visibility: el.style.visibility, filter: el.style.filter, opacity: el.style.opacity }
        };
        m.ax = clamp(r.left + r.width / 2, 8, W - 8);
        m.ay = clamp(r.top + r.height / 2, 8, H - 8);
        movers.push(m);
      });
      if (!movers.length) return;
      PL.sort(movers, function (m) { return [m.ax, m.ay]; });

      // 2. schedule: one strike per piece, in this run's order
      var origin = PL.origin, gap = Math.min(0.24, 3.8 / movers.length) * (PL.rnd ? rand(0.7, 1.2) : 1), CH = 0.22, HOLD = 0.7;
      movers.forEach(function (m, i) { m.start = 0.55 + i * gap + rand(0, 0.05); });
      var tEnd = movers[movers.length - 1].start + CH + HOLD + 0.25, tFinish = tEnd + 1.1;

      // 3. park everything invisible until its bolt lands
      htmlSaved = document.documentElement.style.overflowX;
      document.documentElement.style.overflowX = 'hidden';
      movers.forEach(function (m) {
        var st = m.el.style;
        st.transition = 'none';
        st.willChange = 'transform, opacity, filter';
        st.opacity = '0';
      });

      function layer() {
        var c = mk('canvas', 'sw-cv');
        c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
        var cg = c.getContext('2d');
        cg.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { c: c, g: cg };
      }
      var vg = layer(), fx = layer(), g = fx.g;
      rootEl.insertBefore(fx.c, rootEl.firstChild);
      rootEl.insertBefore(vg.c, fx.c);
      var vr = vg.g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.hypot(W, H) * 0.62);
      vr.addColorStop(0, 'rgba(' + P.shadow + ',0)'); vr.addColorStop(1, 'rgba(' + P.shadow + ',0.5)');
      vg.g.fillStyle = vr; vg.g.fillRect(0, 0, W, H);
      await new Promise(function (res) { requestAnimationFrame(function () { requestAnimationFrame(res); }); });
      document.documentElement.classList.remove('sw-boot');
      if (R.dead) return;

      var strikes = [], rings = [], sparks = [], outlines = [], embers = [], si;
      for (si = 0; si < 36; si++) embers.push({ x: rand(0, W), y: rand(0, H), vy: rand(10, 34), ph: rand(0, 6.28), ci: si % VEINS.length, r: rand(0.6, 1.8) });
      var time = 0, last = performance.now(), vgFaded = false;

      function impact(m, i) {
        var x = m.ax, y = m.ay, col = VEINS[i % VEINS.length], k;
        var src = PL.strike === 'sky' ? 0 : PL.strike === 'sides' ? (Math.random() < 0.5 ? 1 : 2) : Math.floor(Math.random() * 4);
        var bx0 = src === 1 ? -10 : src === 2 ? W + 10 : x + rand(-90, 90), by0 = src === 0 ? -10 : src === 3 ? H + 10 : y + rand(-60, 60);
        var pts = bolt(bx0, by0, x, y, 14, 46);
        strikes.push({ pts: pts, forks: forksOf(pts), t: 0, col: col });
        rings.push({ x: x, y: y, r: 6, life: 0, col: col });
        outlines.push({ l: m.rect.l, t: m.rect.t, w: m.rect.w, h: m.rect.h, t0: 0, col: col });
        for (k = 0; k < 14; k++) {
          var a = rand(0, 6.2832), sp = rand(80, 300);
          sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.4, 0.9), col: col });
        }
      }

      return new Promise(function (resolve) {
        function frame(now) {
          if (R.dead) return resolve();
          var dt = Math.min(0.05, (now - last) / 1000) * state.speed;
          last = now;
          time += dt;
          var jf = Math.floor(time * 18);

          // components: flicker on, glitch, and cool down from white-hot
          movers.forEach(function (m, i) {
            var a = time - m.start;
            if (a < CH) return;
            if (!m.hit) { m.hit = true; impact(m, i); }
            var u = a - CH, st = m.el.style;
            if (u >= HOLD) {
              if (!m.done) { m.done = true; st.opacity = '1'; st.filter = 'none'; st.transform = m.saved.transform; }
              return;
            }
            var d = 1 - u / HOLD, flick = u < 0.14 && Math.floor(u * 60) % 2 ? 0.25 : 1;
            var gx = u < 0.3 ? (hrand(Math.floor(u * 50) + m.seed) - 0.5) * 16 * d : 0;
            st.opacity = String(flick);
            st.filter = 'brightness(' + (1 + 2.2 * d * d).toFixed(2) + ') drop-shadow(0 0 ' + (26 * d).toFixed(0) + 'px ' + rgba(VEINS[0], 0.85 * d) + ')';
            st.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + (gx * 0.3).toFixed(1) + 'px,0) scale(' + (1 + 0.035 * d).toFixed(4) + ')';
          });

          if (time > tEnd && !vgFaded) {
            vgFaded = true;
            vg.c.style.transition = 'opacity .9s ease';
            vg.c.style.opacity = '0';
          }

          // ---- draw ----
          g.clearRect(0, 0, W, H);
          g.globalCompositeOperation = P.comp;
          g.lineCap = 'round';
          g.lineJoin = 'round';
          var fadeOut = time > tEnd ? Math.max(0, 1 - (time - tEnd) / 1.0) : 1;
          var flare = time > tEnd - 0.15 && time < tEnd + 0.2 ? 2.2 : 1;

          embers.forEach(function (e) {
            e.y -= e.vy * dt;
            if (e.y < -4) { e.y = H + 4; e.x = rand(0, W); }
            var ea = (0.35 + 0.35 * Math.sin(time * 3 + e.ph)) * fadeOut;
            if (ea > 0.02) glowDot(g, e.x + Math.sin(time + e.ph) * 8, e.y, 4 + e.r * 2.5, VEINS[e.ci], ea);
          });

          // the strings: a growing, crackling arc to the next piece, which stays behind as a dim link
          movers.forEach(function (m, i) {
            var a = time - m.start;
            if (a < 0) return;
            var fp = i ? [movers[i - 1].ax, movers[i - 1].ay] : [origin.x, origin.y];
            if (m.arcJf !== jf) {
              var dd = Math.hypot(m.ax - fp[0], m.ay - fp[1]);
              m.arc = bolt(fp[0], fp[1], m.ax, m.ay, Math.max(8, Math.round(dd / 26)), 26);
              m.arcFk = forksOf(m.arc);
              m.arcJf = jf;
            }
            var al = (a < CH ? 0.75 + 0.25 * hrand(jf + i) : 0.5 * flare * (0.7 + 0.3 * hrand(jf * 1.3 + i))) * fadeOut;
            if (al > 0.01) zapLine(g, pathOf(m.arc, Math.min(1, a / 0.16), m.arcFk), VEINS[i % VEINS.length], al, a < CH ? 1.1 : 0.75);
          });

          strikes = strikes.filter(function (sk) {
            sk.t += dt;
            var al = 1 - sk.t / 0.34, hit = sk.pts[sk.pts.length - 1];
            if (al <= 0) return false;
            zapLine(g, pathOf(sk.pts, 1, sk.forks), sk.col, al, 1.5);
            glowDot(g, hit[0], hit[1], 40 + 70 * al, sk.col, al * 0.9);
            return true;
          });

          outlines = outlines.filter(function (o) {
            o.t0 += dt;
            var al = 1 - o.t0 / 0.6;
            if (al <= 0) return false;
            roundRectPath(g, o.l, o.t, o.w, o.h, 6);
            g.strokeStyle = rgba(o.col, 0.25 * al); g.lineWidth = 8; g.stroke();
            g.strokeStyle = 'rgba(255,235,235,' + 0.9 * al + ')'; g.lineWidth = 1.5; g.stroke();
            return true;
          });

          rings = rings.filter(function (r) {
            r.life += dt; r.r += 420 * dt;
            var al = 1 - r.life / 0.7;
            if (al <= 0) return false;
            g.strokeStyle = rgba(r.col, al * 0.9); g.lineWidth = 2.2;
            g.beginPath(); g.arc(r.x, r.y, r.r, 0, 6.2832); g.stroke();
            return true;
          });

          sparks = sparks.filter(function (sp) {
            sp.life += dt;
            if (sp.life > sp.max) return false;
            sp.x += sp.vx * dt; sp.y += sp.vy * dt;
            sp.vx *= 1 - 2.4 * dt; sp.vy *= 1 - 2.4 * dt;
            g.strokeStyle = rgba(sp.col, 1 - sp.life / sp.max); g.lineWidth = 1.6;
            g.beginPath(); g.moveTo(sp.x, sp.y); g.lineTo(sp.x - sp.vx * 0.04, sp.y - sp.vy * 0.04); g.stroke();
            return true;
          });

          if (time > tFinish) return resolve();
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }

    /* ----- four more piece-based modes: magnet, glitch, origami, constellation ----- */

    function pageIsDark() {
      var els = [document.body, document.documentElement], i, d, c, x;
      for (i = 0; i < els.length; i++) {
        try {
          c = document.createElement('canvas'); c.width = c.height = 1;
          x = c.getContext('2d');
          x.clearRect(0, 0, 1, 1);
          x.fillStyle = getComputedStyle(els[i]).backgroundColor;
          x.fillRect(0, 0, 1, 1);
          d = x.getImageData(0, 0, 1, 1).data;
          if (d[3] > 128) return (0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]) < 128;
        } catch (e) { /* ignore */ }
      }
      return false;
    }

    async function pieceRun(kind) {
      var W = innerWidth, H = innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1), VEINS = VEIN, NV = VEINS.length;
      var dark = pageIsDark(), comp = dark ? 'lighter' : 'source-over', core = dark ? '255,255,255' : '34,30,52';
      function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
      function col(i, a) {
        var c = VEINS[((i % NV) + NV) % NV];
        return dark ? rgba(c, a) : rgba([(c[0] * 0.72) | 0, (c[1] * 0.72) | 0, (c[2] * 0.72) | 0], a);
      }
      function glow(g, x, y, r, i, a) {
        if (P.fx === 'pixel') { glowDot(g, x, y, r, VEINS[((i % NV) + NV) % NV], a); return; }
        var gr = g.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, 'rgba(' + core + ',' + a + ')');
        gr.addColorStop(0.3, col(i, a * 0.55));
        gr.addColorStop(1, col(i, 0));
        g.fillStyle = gr;
        g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
      }
      function star(g, x, y, s, i, a) {
        glow(g, x, y, s * 4, i, a * 0.9);
        g.strokeStyle = 'rgba(' + core + ',' + Math.min(1, a) + ')'; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(x - s * 1.7, y); g.lineTo(x + s * 1.7, y); g.moveTo(x, y - s * 1.7); g.lineTo(x, y + s * 1.7); g.stroke();
      }
      function settle(m) {
        if (m.done) return;
        m.done = true;
        var st = m.el.style, v = m.saved;
        st.opacity = v.opacity; st.filter = v.filter; st.transform = v.transform;
        st.clipPath = v.clip; st.backfaceVisibility = v.bf; st.transformOrigin = v.origin;
      }

      // 1. the components: the page's top-level boxes that are on screen
      var seen = new Set(), list = [], inList = new Set();
      tasks.forEach(function (t) {
        if (seen.has(t.el)) return;
        seen.add(t.el);
        if (!MEDIA[t.el.tagName.toUpperCase()] && getComputedStyle(t.el).display === 'inline') return;
        list.push(t.el);
      });
      list.sort(function (a, b) { return depthOf(a) - depthOf(b); });
      list.forEach(function (el) {
        for (var p = el.parentElement; p; p = p.parentElement) if (inList.has(p)) return;
        inList.add(el);
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W || r.width < 2 || r.height < 2) return;
        var m = {
          el: el, rect: { l: r.left, t: r.top, w: r.width, h: r.height }, seed: Math.random() * 10,
          saved: { transform: el.style.transform, origin: el.style.transformOrigin, will: el.style.willChange, transition: el.style.transition, visibility: el.style.visibility, filter: el.style.filter, opacity: el.style.opacity, clip: el.style.clipPath, bf: el.style.backfaceVisibility }
        };
        m.ax = clamp(r.left + r.width / 2, 8, W - 8);
        m.ay = clamp(r.top + r.height / 2, 8, H - 8);
        movers.push(m);
      });
      if (!movers.length) return;
      PL.sort(movers, function (m) { return [m.ax, m.ay]; });
      var origin = PL.origin, NM = movers.length;

      // 2. park everything invisible until its turn
      htmlSaved = document.documentElement.style.overflowX;
      document.documentElement.style.overflowX = 'hidden';
      movers.forEach(function (m) {
        var st = m.el.style;
        st.transition = 'none';
        st.willChange = 'transform, opacity, filter';
        st.opacity = '0';
      });

      var cv = mk('canvas', 'sw-cv');
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      var g = cv.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      rootEl.insertBefore(cv, rootEl.firstChild);

      // a guide (magnet, paper bird) that visits every piece in this run's order
      var pathPts = [[origin.x, origin.y]].concat(movers.map(function (m) { return [m.ax, m.ay]; }));
      if (pathPts.length < 2) pathPts.push([origin.x + 1, origin.y + 1]);
      var gT0 = 0, gGap = 0.25;
      function guide(time, delay) {
        var f = (time - delay - gT0) / gGap, a, b, k, r, e;
        if (f <= 0) { a = pathPts[0]; b = pathPts[1]; return { x: a[0], y: a[1], ang: Math.atan2(b[1] - a[1], b[0] - a[0]), f: f }; }
        k = Math.min(NM - 1, Math.floor(f)); r = Math.min(1, f - k); e = r * r * (3 - 2 * r);
        a = pathPts[k]; b = pathPts[k + 1];
        return { x: a[0] + (b[0] - a[0]) * e, y: a[1] + (b[1] - a[1]) * e, ang: Math.atan2(b[1] - a[1], b[0] - a[0]), f: f };
      }
      var rings = [], sparks = [], S;

      function burst(x, y, i, n) {
        rings.push({ x: x, y: y, r: 6, life: 0, i: i });
        for (var k = 0; k < n; k++) {
          var a = rand(0, 6.2832), sp = rand(70, 240);
          sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.35, 0.8), i: i + k });
        }
      }
      function drawBursts(g, dt, fade) {
        rings = rings.filter(function (r) {
          r.life += dt; r.r += 380 * dt;
          var al = 1 - r.life / 0.65;
          if (al <= 0) return false;
          g.strokeStyle = col(r.i, al * 0.85 * fade); g.lineWidth = 2;
          g.beginPath(); g.arc(r.x, r.y, r.r, 0, 6.2832); g.stroke();
          return true;
        });
        sparks = sparks.filter(function (sp) {
          sp.life += dt;
          if (sp.life > sp.max) return false;
          sp.x += sp.vx * dt; sp.y += sp.vy * dt; sp.vx *= 1 - 2.6 * dt; sp.vy *= 1 - 2.6 * dt;
          g.strokeStyle = col(sp.i, (1 - sp.life / sp.max) * fade); g.lineWidth = 1.6;
          g.beginPath(); g.moveTo(sp.x, sp.y); g.lineTo(sp.x - sp.vx * 0.04, sp.y - sp.vy * 0.04); g.stroke();
          return true;
        });
      }

      /* ---- MAGNET: the pieces float about like iron filings; a magnet sweeps over the page and snaps each one home ---- */
      function magnetScene() {
        var gap = Math.min(0.26, 4 / NM) * (PL.rnd ? rand(0.8, 1.2) : 1), t0 = 1.0, NF = 96, ZE = 0.5, OM = 9, OD = OM * Math.sqrt(1 - ZE * ZE);
        gT0 = t0; gGap = gap;
        movers.forEach(function (m, i) {
          m.start = t0 + (i - 0.4) * gap;
          var an = rand(0, 6.2832), dist = rand(0.2, 0.46) * Math.min(W, H) + 70;
          m.ox = clamp(m.ax + Math.cos(an) * dist, 40, W - 40) - m.ax;
          m.oy = clamp(m.ay + Math.sin(an) * dist, 40, H - 40) - m.ay;
          m.rot0 = rand(-34, 34) * Math.min(1, 380 / Math.max(m.rect.w, m.rect.h));
          m.sc0 = rand(0.55, 0.85);
          m.pop = rand(0, 0.55);
          m.cx = m.ax + m.ox; m.cy = m.ay + m.oy; m.u = -1;
        });
        function spring(u) { return Math.exp(-ZE * OM * u) * (Math.cos(OD * u) + (ZE * OM / OD) * Math.sin(OD * u)); }
        var tEnd = movers[NM - 1].start + 1.3;
        return {
          tFinish: tEnd + 0.5,
          step: function (m, i, time) {
            var st = m.el.style, a = time - m.start, vis = clamp((time - m.pop) / 0.45, 0, 1), s;
            if (vis <= 0) return;
            if (a < 0) {
              var near = clamp(1 + a / 0.35, 0, 1), fk = Math.floor(time * 40);
              var jx = Math.sin(time * 1.7 + m.seed) * 6 + (hrand(fk + m.seed) - 0.5) * 9 * near;
              var jy = Math.cos(time * 1.3 + m.seed) * 5 + (hrand(fk + m.seed * 2) - 0.5) * 9 * near;
              st.opacity = String(0.5 * vis);
              st.transform = 'translate3d(' + (m.ox + jx).toFixed(1) + 'px,' + (m.oy + jy).toFixed(1) + 'px,0) rotate(' + m.rot0.toFixed(2) + 'deg) scale(' + m.sc0.toFixed(3) + ')';
              return;
            }
            if (a > 1.3) { settle(m); return; }
            s = spring(a);
            m.u = a; m.cx = m.ax + m.ox * s; m.cy = m.ay + m.oy * s;
            st.opacity = String(0.5 + 0.5 * clamp(a / 0.2, 0, 1));
            st.filter = a < 0.45 ? 'brightness(' + (1 + 0.5 * (1 - a / 0.45)).toFixed(2) + ')' : m.saved.filter;
            st.transform = 'translate3d(' + (m.ox * s).toFixed(1) + 'px,' + (m.oy * s).toFixed(1) + 'px,0) rotate(' + (m.rot0 * s).toFixed(2) + 'deg) scale(' + (1 + (m.sc0 - 1) * s).toFixed(4) + ')';
            if (!m.hit && a > 0.34) { m.hit = true; burst(m.ax, m.ay, m.index, 8); }
          },
          draw: function (g, time, dt) {
            var gp = guide(time, 0), magA = clamp((time - 0.2) / 0.5, 0, 1) * (1 - clamp((time - (tEnd - 0.4)) / 0.5, 0, 1)), k;
            if (magA > 0.01) {
              // iron filings that line up along the field of a bar magnet (dipole direction)
              g.lineWidth = 1.5; g.lineCap = 'round';
              for (k = 0; k < NF; k++) {
                var th = k * 2.399963 + Math.sin(time * 0.8 + k) * 0.06, rr = 22 + 170 * Math.pow(hrand(k * 7.7), 1.4);
                var an = gp.ang + th, px = gp.x + Math.cos(an) * rr, py = gp.y + Math.sin(an) * rr;
                var dir = an + Math.atan2(Math.sin(th), 2 * Math.cos(th)), al = (1 - rr / 192) * 0.8 * magA, len = 4 + 5 * (1 - rr / 192);
                if (al < 0.04) continue;
                g.strokeStyle = k % 3 === 0 ? col(k, al) : 'rgba(' + core + ',' + (al * 0.8) + ')';
                g.beginPath(); g.moveTo(px - Math.cos(dir) * len, py - Math.sin(dir) * len); g.lineTo(px + Math.cos(dir) * len, py + Math.sin(dir) * len); g.stroke();
              }
              var ph = (time * 1.3) % 1;
              g.strokeStyle = col(0, (1 - ph) * 0.4 * magA); g.lineWidth = 1.5;
              g.beginPath(); g.arc(gp.x, gp.y, 20 + 90 * ph, 0, 6.2832); g.stroke();
              glow(g, gp.x, gp.y, 64, 0, 0.5 * magA);
            }
            // beams from the magnet to the pieces being pulled
            movers.forEach(function (m, i) {
              if (m.done || m.u < 0 || m.u > 0.7) return;
              var al = 1 - m.u / 0.7, mx = (gp.x + m.cx) / 2, my = (gp.y + m.cy) / 2, nx = -(m.cy - gp.y), ny = m.cx - gp.x, nl = Math.hypot(nx, ny) || 1, bend = 46 * Math.sin(m.seed * 3 + time * 3);
              g.beginPath(); g.moveTo(gp.x, gp.y); g.quadraticCurveTo(mx + nx / nl * bend, my + ny / nl * bend, m.cx, m.cy);
              g.strokeStyle = col(i, 0.16 * al); g.lineWidth = 7; g.stroke();
              g.strokeStyle = col(i, 0.8 * al); g.lineWidth = 1.6; g.stroke();
            });
            drawBursts(g, dt, 1);
            // the horseshoe magnet itself
            if (magA > 0.01) {
              g.save();
              g.globalCompositeOperation = 'source-over';
              g.translate(gp.x, gp.y); g.rotate(gp.ang); g.scale(1.25 * magA, 1.25 * magA);
              g.lineCap = 'butt'; g.lineWidth = 8;
              g.strokeStyle = dark ? 'rgba(228,230,242,0.97)' : 'rgba(58,54,84,0.97)';
              g.beginPath(); g.arc(0, 0, 12, Math.PI / 2, Math.PI * 1.5); g.moveTo(0, 12); g.lineTo(17, 12); g.moveTo(0, -12); g.lineTo(17, -12); g.stroke();
              g.strokeStyle = rgba(VEINS[0], 1); g.beginPath(); g.moveTo(11, -12); g.lineTo(17, -12); g.stroke();
              g.strokeStyle = rgba(VEINS[1 % NV], 1); g.beginPath(); g.moveTo(11, 12); g.lineTo(17, 12); g.stroke();
              g.restore();
            }
          }
        };
      }

      /* ---- GLITCH: the page locks in out of static, RGB splits and torn scanlines, like a tape finding its signal ---- */
      function glitchScene() {
        var gap = Math.min(0.2, 3.4 / NM) * (PL.rnd ? rand(0.75, 1.2) : 1), G = 0.75, T0 = 0.85, outlines = [];
        movers.forEach(function (m, i) { m.start = T0 + i * gap + rand(0, 0.05); });
        var tEnd = movers[NM - 1].start + G;
        function split(dx) { return 'drop-shadow(' + dx.toFixed(1) + 'px 0 0 ' + col(0, 0.9) + ') drop-shadow(' + (-dx).toFixed(1) + 'px 0 0 ' + col(1, 0.9) + ')'; }
        return {
          tFinish: tEnd + 0.8,
          step: function (m, i, time) {
            var st = m.el.style, a = time - m.start;
            if (a < 0) return;
            if (a >= G) {
              if (!m.hit) { m.hit = true; outlines.push({ r: m.rect, t: 0, i: i }); }
              settle(m); return;
            }
            var u = a / G, fk = Math.floor(time * 24), r1 = hrand(fk * 3.17 + m.seed), r2 = hrand(fk * 1.91 + m.seed * 2), r3 = hrand(fk * 5.3 + m.seed * 3);
            if (r1 < u * u * 1.1) {          // a clean frame: the picture holds for a moment
              st.clipPath = 'none'; st.opacity = '1';
              st.transform = 'translate3d(' + ((r2 - 0.5) * 6 * (1 - u)).toFixed(1) + 'px,0,0)';
              st.filter = split(2.5 * (1 - u)) + ' brightness(' + (1 + 0.5 * (1 - u)).toFixed(2) + ')';
            } else {                         // a torn frame: a band of the picture, shoved sideways
              var top = r2 * 80, h = 6 + r3 * 38;
              st.clipPath = r3 < 0.55 ? 'inset(' + top.toFixed(1) + '% 0 ' + Math.max(0, 100 - top - h).toFixed(1) + '% 0)' : 'none';
              st.opacity = r2 < 0.12 * (1 - u) ? '0' : '1';
              st.transform = 'translate3d(' + ((r1 - 0.5) * 70 * (1 - u * 0.5)).toFixed(1) + 'px,' + ((r3 - 0.5) * 6).toFixed(1) + 'px,0) skewX(' + ((r2 - 0.5) * 14 * (1 - u)).toFixed(1) + 'deg)';
              st.filter = split(4 + 12 * (1 - u) * r3) + ' brightness(' + (1.1 + 0.9 * (1 - u)).toFixed(2) + ')' + (r2 > 0.82 ? ' hue-rotate(' + Math.round(r1 * 180) + 'deg)' : '');
            }
          },
          draw: function (g, time, dt) {
            var fk = Math.floor(time * 24), fade = 1 - clamp((time - tEnd) / 0.7, 0, 1), q, y;
            if (time < T0 + 0.15) {            // static while the signal is found, with a lock-on cross at the start point
              var amt = 1 - time / (T0 + 0.15);
              for (q = 0; q < 80; q++) {
                g.fillStyle = q % 3 === 0 ? col(0, 0.5 * amt) : q % 3 === 1 ? col(1, 0.5 * amt) : 'rgba(' + core + ',' + 0.3 * amt + ')';
                g.fillRect(hrand(fk * 13.1 + q) * W, hrand(fk * 7.7 + q * 3) * H, 6 + hrand(q + fk) * 70, 2 + hrand(q * 5 + fk) * 5);
              }
              g.fillStyle = col(0, 0.7 * amt);
              g.fillRect(0, origin.y + (hrand(fk) - 0.5) * 4, W, 1.5); g.fillRect(origin.x + (hrand(fk + 4) - 0.5) * 4, 0, 1.5, H);
            }
            if (fade > 0.01) {                 // scanlines and a slow tracking bar
              g.fillStyle = 'rgba(' + core + ',' + 0.05 * fade + ')';
              g.beginPath();
              for (y = fk % 4; y < H; y += 4) g.rect(0, y, W, 1);
              g.fill();
              var by = ((time * 0.6) % 1.25) * H - 0.1 * H;
              g.fillStyle = 'rgba(' + core + ',' + 0.05 * fade + ')'; g.fillRect(0, by, W, 36);
              g.fillStyle = col(1, 0.4 * fade); g.fillRect(hrand(fk) * W * 0.5, by + 36, W * 0.5, 2);
              g.fillStyle = col(0, 0.4 * fade); g.fillRect(hrand(fk + 9) * W * 0.5, by + 40, W * 0.4, 1.5);
            }
            movers.forEach(function (m, i) {  // blocky corruption around the pieces that are locking in
              var a = time - m.start;
              if (a < 0 || a >= G) return;
              for (var k = 0; k < 3; k++) {
                g.fillStyle = k % 2 ? col(0, 0.55) : col(1, 0.55);
                g.fillRect(m.rect.l + hrand(fk * 3 + k + m.seed) * m.rect.w, m.rect.t + hrand(fk * 5 + k * 2 + m.seed) * m.rect.h, 20 + hrand(fk + k + m.seed) * 120, 2 + hrand(fk * 2 + k) * 8);
              }
            });
            outlines = outlines.filter(function (o) {
              o.t += dt;
              var al = 1 - o.t / 0.4;
              if (al <= 0) return false;
              g.strokeStyle = col(o.i, al); g.lineWidth = 2; g.strokeRect(o.r.l - 2, o.r.t - 2, o.r.w + 4, o.r.h + 4);
              g.strokeStyle = 'rgba(' + core + ',' + 0.6 * al + ')'; g.lineWidth = 1; g.strokeRect(o.r.l + 1, o.r.t + 1, o.r.w - 2, o.r.h - 2);
              return true;
            });
          }
        };
      }

      /* ---- ORIGAMI: each piece unfolds from a creased flap while a flock of paper birds flies over the page ---- */
      function origamiScene() {
        var gap = Math.min(0.24, 3.8 / NM) * (PL.rnd ? rand(0.8, 1.2) : 1), U = 0.9, T0 = 0.9, bits = [], creases = [];
        gT0 = T0; gGap = gap;
        var HIN = [['50% 0%', 'X', -1], ['50% 100%', 'X', 1], ['0% 50%', 'Y', 1], ['100% 50%', 'Y', -1]];
        movers.forEach(function (m, i) {
          m.start = T0 + i * gap + rand(0, 0.04);
          m.hin = HIN[Math.floor(Math.random() * 4)];
          m.sec = (Math.random() < 0.5 ? -1 : 1) * rand(8, 16);
          m.persp = Math.max(1400, 2.2 * Math.max(m.rect.w, m.rect.h));
          m.el.style.transformOrigin = m.hin[0];
          m.el.style.backfaceVisibility = 'hidden';
        });
        var tEnd = movers[NM - 1].start + U + 0.3;
        function bird(g, x, y, ang, s, flap, k, al) {
          var wy = s * (0.25 + 0.9 * flap);
          g.save(); g.translate(x, y); g.rotate(ang);
          g.fillStyle = col(k + 1, 0.85 * al); g.beginPath(); g.moveTo(s * 0.3, -s * 0.08); g.lineTo(-s * 0.55, -s * 0.08); g.lineTo(-s * 0.2, -wy); g.closePath(); g.fill();
          g.fillStyle = col(k, al); g.beginPath(); g.moveTo(s * 1.1, 0); g.lineTo(0, -s * 0.24); g.lineTo(-s, s * 0.05); g.closePath(); g.fill();
          g.fillStyle = 'rgba(0,0,0,' + 0.2 * al + ')'; g.beginPath(); g.moveTo(s * 1.1, 0); g.lineTo(-s, s * 0.05); g.lineTo(0, s * 0.26); g.closePath(); g.fill();
          g.fillStyle = col(k + 1, 0.85 * al); g.beginPath(); g.moveTo(s * 0.3, s * 0.08); g.lineTo(-s * 0.55, s * 0.08); g.lineTo(-s * 0.2, wy); g.closePath(); g.fill();
          g.fillStyle = 'rgba(0,0,0,' + 0.16 * al + ')'; g.fill();
          g.restore();
        }
        return {
          tFinish: tEnd + 0.9,
          step: function (m, i, time) {
            var st = m.el.style, a = time - m.start;
            if (a < 0) return;
            if (a >= U) { settle(m); return; }
            var p = a / U, c3 = 2.2, e = 1 + c3 * Math.pow(p - 1, 3) + (c3 - 1) * Math.pow(p - 1, 2);
            var ang = m.hin[2] * 92 * (1 - e), sec = m.sec * (1 - Math.min(1, p * 1.25)), q = 1 - p;
            st.opacity = '1';
            st.filter = 'brightness(' + (0.5 + 0.5 * Math.min(1, p * 1.3)).toFixed(2) + ') drop-shadow(0 ' + (16 * q).toFixed(1) + 'px ' + (18 * q).toFixed(1) + 'px rgba(0,0,0,' + (0.3 * q).toFixed(2) + '))';
            st.transform = 'perspective(' + m.persp + 'px) rotate' + m.hin[1] + '(' + ang.toFixed(2) + 'deg) rotate' + (m.hin[1] === 'X' ? 'Y' : 'X') + '(' + sec.toFixed(2) + 'deg)';
            if (!m.hit && p > 0.5) {
              m.hit = true;
              var r = m.rect, seg = m.hin[0] === '50% 0%' ? [r.l, r.t, r.l + r.w, r.t] : m.hin[0] === '50% 100%' ? [r.l, r.t + r.h, r.l + r.w, r.t + r.h] : m.hin[0] === '0% 50%' ? [r.l, r.t, r.l, r.t + r.h] : [r.l + r.w, r.t, r.l + r.w, r.t + r.h];
              creases.push({ s: seg, t: 0, i: i });
              for (var k = 0; k < 7; k++) {
                var f = rand(0, 1), bx = seg[0] + (seg[2] - seg[0]) * f, by = seg[1] + (seg[3] - seg[1]) * f, an = rand(0, 6.2832);
                bits.push({ x: bx, y: by, vx: Math.cos(an) * rand(30, 120), vy: Math.sin(an) * rand(30, 120) - 40, rot: rand(0, 6.28), vr: rand(-6, 6), s: rand(4, 9), life: 0, max: rand(0.8, 1.5), i: i + k });
              }
            }
          },
          draw: function (g, time, dt) {
            var fade = 1 - clamp((time - tEnd) / 0.8, 0, 1);
            creases = creases.filter(function (c) {
              c.t += dt;
              var al = 1 - c.t / 0.55;
              if (al <= 0) return false;
              g.lineCap = 'round';
              g.strokeStyle = col(c.i, 0.35 * al); g.lineWidth = 8; g.beginPath(); g.moveTo(c.s[0], c.s[1]); g.lineTo(c.s[2], c.s[3]); g.stroke();
              g.strokeStyle = 'rgba(' + core + ',' + 0.9 * al + ')'; g.lineWidth = 1.4; g.stroke();
              return true;
            });
            g.save();
            g.globalCompositeOperation = 'source-over';
            bits = bits.filter(function (b) {
              b.life += dt;
              if (b.life > b.max) return false;
              b.vy += 120 * dt; b.vx *= 1 - 1.2 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.rot += b.vr * dt;
              var al = 1 - b.life / b.max, flip = Math.cos(b.life * 9 + b.i);
              g.save(); g.translate(b.x, b.y); g.rotate(b.rot); g.scale(1, flip);
              g.fillStyle = col(b.i, 0.95 * al); g.beginPath(); g.moveTo(0, -b.s); g.lineTo(b.s * 0.86, b.s * 0.5); g.lineTo(-b.s * 0.86, b.s * 0.5); g.closePath(); g.fill();
              g.fillStyle = 'rgba(0,0,0,' + 0.2 * al + ')'; g.beginPath(); g.moveTo(0, -b.s); g.lineTo(b.s * 0.86, b.s * 0.5); g.lineTo(0, b.s * 0.5); g.closePath(); g.fill();
              g.restore();
              return true;
            });
            var bi, bal = clamp((time - 0.2) / 0.4, 0, 1) * fade;
            if (bal > 0.01) {
              for (bi = 2; bi >= 0; bi--) {
                var gp = guide(time, bi * 0.14), lat = Math.sin(time * 3 + bi * 2) * 18 * bi;
                bird(g, gp.x + Math.cos(gp.ang + 1.5708) * lat, gp.y + Math.sin(gp.ang + 1.5708) * lat, gp.ang, bi ? 11 : 17, 0.5 + 0.5 * Math.sin(time * 15 + bi), bi, bal);
              }
            }
            g.restore();
          }
        };
      }

      /* ---- CONSTELLATION: stars appear, join into lines, and each little constellation lights up one piece of the page ---- */
      function constScene() {
        var gap = Math.min(0.26, 4.2 / NM) * (PL.rnd ? rand(0.8, 1.2) : 1), T0 = 0.9, REV = 0.55, RD = 0.6, bg = [], shoots = [], nextShoot = 1.0, q;
        for (q = 0; q < 110; q++) bg.push({ x: rand(0, W), y: rand(0, H), r: rand(0.6, 1.7), ph: rand(0, 6.28), sp: rand(1, 3) });
        movers.forEach(function (m, i) {
          m.start = T0 + i * gap + rand(0, 0.04);
          var l = clamp(m.rect.l, 12, W - 12), t = clamp(m.rect.t, 12, H - 12), r = clamp(m.rect.l + m.rect.w, 12, W - 12), b = clamp(m.rect.t + m.rect.h, 12, H - 12);
          m.nodes = [[l, t], [r, t], [r, b], [l, b]];
          m.from = i ? [movers[i - 1].ax, movers[i - 1].ay] : [origin.x, origin.y];
          m.alt = null;
          var best = 1e9, j;
          for (j = 0; j < i - 1; j++) {
            var d = Math.hypot(movers[j].ax - m.ax, movers[j].ay - m.ay);
            if (d < best) { best = d; m.alt = [movers[j].ax, movers[j].ay]; }
          }
        });
        var tEnd = movers[NM - 1].start + REV + RD + 0.5;
        function seg(g, a, b, f) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); g.stroke(); }
        function line(g, a, b, f, i, al) {
          if (f <= 0 || al <= 0.01) return;
          g.strokeStyle = col(i, 0.12 * al); g.lineWidth = 5; seg(g, a, b, f);
          g.strokeStyle = col(i, 0.85 * al); g.lineWidth = 1.2; seg(g, a, b, f);
        }
        return {
          tFinish: tEnd + 1.0,
          step: function (m, i, time) {
            var st = m.el.style, a = time - m.start - REV;
            if (a < 0) return;
            var ru = a / RD;
            if (ru >= 1) { settle(m); return; }
            st.opacity = String(ru);
            st.filter = 'blur(' + (10 * (1 - ru)).toFixed(1) + 'px) brightness(' + (1 + 1.4 * (1 - ru)).toFixed(2) + ')';
            st.transform = 'scale(' + (0.96 + 0.04 * ru).toFixed(4) + ')';
          },
          draw: function (g, time, dt) {
            var fade = 1 - clamp((time - tEnd) / 1.0, 0, 1), bgA = clamp(time / 0.8, 0, 1) * fade, k;
            g.lineCap = 'round';
            var shown = movers.filter(function (m) { return time - m.start - REV > 0.15; });
            bg.forEach(function (s) {
              var al = (0.3 + 0.5 * Math.sin(time * s.sp + s.ph)) * bgA * 0.7, hidden = false, z;
              if (al < 0.03) return;
              for (z = 0; z < shown.length; z++) {
                var rc = shown[z].rect;
                if (s.x > rc.l && s.x < rc.l + rc.w && s.y > rc.t && s.y < rc.t + rc.h) { hidden = true; break; }
              }
              if (hidden) return;
              g.fillStyle = 'rgba(' + core + ',' + al + ')';
              g.beginPath(); g.arc(s.x, s.y, s.r, 0, 6.2832); g.fill();
            });
            // the guiding star at the start point
            var oa = clamp(time / 0.5, 0, 1) * fade;
            if (oa > 0.02) star(g, origin.x, origin.y, 7 + Math.sin(time * 4) * 1.4, 0, oa);
            movers.forEach(function (m, i) {
              var a = time - m.start;
              if (a < 0) return;
              var dim = a > 1.2 ? Math.max(0.2, 1 - (a - 1.2) * 0.7) : 1, al = fade * dim;
              line(g, m.from, [m.ax, m.ay], clamp(a / 0.22, 0, 1), i, al);
              if (m.alt) line(g, m.alt, [m.ax, m.ay], clamp((a - 0.12) / 0.25, 0, 1), i + 1, al * 0.6);
              var sf = clamp((a - 0.1) / 0.4, 0, 1) * 4;
              for (k = 0; k < 4; k++) {
                var pop = clamp((a - 0.1 - k * 0.06) / 0.1, 0, 1), n2 = m.nodes[(k + 1) % 4];
                if (pop > 0) {
                  line(g, [m.ax, m.ay], m.nodes[k], pop, i, al * 0.35);
                  star(g, m.nodes[k][0], m.nodes[k][1], 2.6 * pop + 0.4, i + k, al * pop);
                }
                line(g, m.nodes[k], n2, clamp(sf - k, 0, 1), i, al);
              }
              star(g, m.ax, m.ay, 4.5 * clamp(a / 0.15, 0, 1), i, al);
              var fl = (a - REV) / 0.3;
              if (fl > 0 && fl < 1) {
                g.strokeStyle = 'rgba(' + core + ',' + (1 - fl) * 0.8 * fade + ')'; g.lineWidth = 2;
                g.strokeRect(m.rect.l, m.rect.t, m.rect.w, m.rect.h);
              }
            });
            // a few shooting stars
            if (time > nextShoot && time < tEnd) {
              nextShoot = time + rand(0.7, 1.4);
              var sa = rand(0.35, 0.8);
              shoots.push({ x: rand(0, W * 0.8), y: rand(0, H * 0.4), vx: Math.cos(sa) * 900, vy: Math.sin(sa) * 900, t: 0 });
            }
            shoots = shoots.filter(function (s) {
              s.t += dt;
              if (s.t > 0.5) return false;
              s.x += s.vx * dt; s.y += s.vy * dt;
              var al = (1 - s.t / 0.5) * fade;
              g.strokeStyle = col(0, 0.3 * al); g.lineWidth = 5; g.beginPath(); g.moveTo(s.x - s.vx * 0.12, s.y - s.vy * 0.12); g.lineTo(s.x, s.y); g.stroke();
              g.strokeStyle = 'rgba(' + core + ',' + al + ')'; g.lineWidth = 1.5; g.stroke();
              return true;
            });
          }
        };
      }

      movers.forEach(function (m, i) { m.index = i; });
      S = kind === 'magnet' ? magnetScene() : kind === 'glitch' ? glitchScene() : kind === 'origami' ? origamiScene() : constScene();
      await new Promise(function (res) { requestAnimationFrame(function () { requestAnimationFrame(res); }); });
      document.documentElement.classList.remove('sw-boot');
      if (R.dead) return;

      var time = 0, last = performance.now();
      return new Promise(function (resolve) {
        function frame(now) {
          if (R.dead) return resolve();
          var dt = Math.min(0.05, (now - last) / 1000) * state.speed;
          last = now;
          time += dt;
          movers.forEach(function (m, i) { if (!m.done) S.step(m, i, time); });
          g.clearRect(0, 0, W, H);
          g.globalCompositeOperation = comp;
          g.lineCap = 'round'; g.lineJoin = 'round';
          S.draw(g, time, dt);
          if (time > S.tFinish) { movers.forEach(settle); return resolve(); }
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }

    function orbit(center, ms) {
      return new Promise(function (res) {
        var t0 = performance.now(), d = ms / state.speed;
        (function step(now) {
          if (R.dead) return res();
          var p = Math.min(1, (now - t0) / d), ctr = center();
          cursors.forEach(function (c) {
            var a = c.angle + p * 2.4, rad = 56 + 14 * Math.sin(p * 6);
            c.set(ctr.x + Math.cos(a) * rad, ctr.y + Math.sin(a) * rad * 0.8);
          });
          if (p < 1) requestAnimationFrame(step); else res();
        })(t0);
      });
    }

    function logoPoint() {
      var sel = opts.logo || '[data-swarm-logo], header svg, header img, nav svg, nav img';
      var el = document.querySelector(sel);
      if (el) {
        var r = el.getBoundingClientRect();
        if (r.width && r.bottom > 0 && r.top < innerHeight) return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      if (tasks[0]) return { x: tasks[0].rect.l + tasks[0].rect.w / 2, y: tasks[0].rect.t + tasks[0].rect.h / 2 };
      return { x: innerWidth / 2, y: innerHeight / 2 };
    }

    function cleanup() {
      tasks.forEach(function (t) {
        if (t.type === 'rect') t.el.classList.remove('sw-hide-box');
        else if (t.type === 'media') t.el.classList.remove('sw-hide-media');
        else if (t.wraps) t.wraps.forEach(function (w) { if (w.wrap.parentNode) w.wrap.parentNode.replaceChild(w.node, w.wrap); });
        if (t.prevTransition !== undefined) t.el.style.transition = t.prevTransition;
      });
      cursors.forEach(function (c) { c.el.remove(); });
      Array.prototype.forEach.call(rootEl.querySelectorAll('.sw-sel,.sw-badge,.sw-caret,.sw-wf,.sw-grid,.sw-ripple,.sw-cv'), function (e) { e.remove(); });
      restoreWeb();

      document.documentElement.classList.remove('sw-boot');
    }

    function end(completed) {
      if (R.dead) return;
      R.dead = true;
      cleanup();
      if (current === R) current = null;
      setUI(false);
      if (completed && typeof opts.onDone === 'function') { try { opts.onDone(); } catch (e) { /* ignore */ } }
      finishResolve();
    }
    R.skip = function () { end(false); };

    try {
      setUI(true);
      await ready();
      if (R.dead) return finished;

      // Portfolio integration: preserve native scrolling.

      tasks = orderAndLink(scan(opts.root || document.body), opts.maxTasks);
      PL = makePlan();
      PL.sort(tasks, function (t) { return [t.rect.l + t.rect.w / 2, t.rect.t + t.rect.h / 2]; });
      // Portfolio choreography: complete each visual group before handing off to the next.
      // The random plan still orders tasks within each group.
      if (opts.choreography) {
        tasks.forEach(function (t) {
          var group = t.el.closest('[data-swarm-stage]');
          t.stage = group ? Number(group.getAttribute('data-swarm-stage')) : 0;
        });
        tasks.sort(function (a, b) { return a.stage - b.stage; });
      }
      state.coff = PL.cofs;
      VEIN = VEIN.slice(PL.cofs).concat(VEIN.slice(0, PL.cofs));
      if (ui) ui.querySelector('[data-act="rand"]').title = 'Random: this run started from ' + PL.originKind + ' and built in ' + PL.kind + ' order';
      if (opts.mode === 'depth') {
        await depthRun();
        if (R.dead) return finished;
        end(true);
        return finished;
      }
      if (opts.mode === 'web') {
        await webRun();
        if (R.dead) return finished;
        end(true);
        return finished;
      }
      if (opts.mode === 'storm') {
        await stormRun();
        if (R.dead) return finished;
        end(true);
        return finished;
      }
      if (opts.mode === 'magnet' || opts.mode === 'glitch' || opts.mode === 'origami' || opts.mode === 'constellation') {
        await pieceRun(opts.mode);
        if (R.dead) return finished;
        end(true);
        return finished;
      }
      if (opts.mode === 'mycelium') {
        // this mode never touches the page itself: it covers it with a dark canvas and opens holes in it
        await myceliumRun();
        if (R.dead) return finished;
        end(true);
        return finished;
      }
      prepare(tasks, opts.mode === 'wireframe');
      document.documentElement.classList.remove('sw-boot');

      for (var i = 0; i < n; i++) {
        var c = makeCursor(i, n);
        var W = innerWidth, H = innerHeight;
        var spawn = [[rand(0, W), -50], [W + 50, rand(0, H)], [rand(0, W), H + 50], [-50, rand(0, H)]][(i + PL.sideOff) % 4];
        c.set(spawn[0], spawn[1]);
        rootEl.appendChild(c.el);
        cursors.push(c);
      }
      // let the browser paint the blank canvas first
      await new Promise(function (res) { requestAnimationFrame(function () { requestAnimationFrame(res); }); });
      cursors.forEach(function (c) { c.el.style.opacity = '1'; });

      var lp = PL.origin;
      await Promise.all(cursors.map(function (c, i) {
        return sleep(i * 70).then(function () {
          return moveTo(c, lp.x + Math.cos(c.angle) * 56, lp.y + Math.sin(c.angle) * 56 * 0.8, 800);
        });
      }));
      await orbit(function () { return lp; }, 800);
      if (R.dead) return finished;

      if (opts.mode === 'wireframe') await wireframeRun();
      else await runPhase(buildTask, true);
      if (R.dead) return finished;

      await Promise.all(cursors.map(function (c, i) {
        return sleep(i * 50).then(function () {
          var m = state.mouse;
          return moveTo(c, m.x + Math.cos(c.angle) * 56, m.y + Math.sin(c.angle) * 56 * 0.8, 600);
        });
      }));
      await orbit(function () { return state.mouse; }, 900);
      if (R.dead) return finished;
      cursors.forEach(function (c) { c.el.style.opacity = '0'; });
      await sleep(400);
      end(true);
    } catch (err) {
      end(false);
      if (global.console) console.error('[swarm-intro]', err);
    }
    return finished;
  }

  /* ---------- small control bar (demo only, turn off with ui:false) ---------- */

  var SPEEDS = [1, 1.5, 2, 3];

  function ensureUI() {
    if (ui || !state.opts || !state.opts.ui) return;
    ui = mk('div', 'sw-ui');
    ui.setAttribute('role', 'group');
    ui.setAttribute('aria-label', 'Intro animation controls');
    ui.innerHTML = '<b>Swarm intro</b>' +
      '<button type="button" data-mode="swarm">Swarm</button><button type="button" data-mode="wireframe">Wireframe</button><button type="button" data-mode="mycelium">Mycelium</button><button type="button" data-mode="web">Web</button><button type="button" data-mode="depth">Depth</button><button type="button" data-mode="storm">Storm</button><button type="button" data-mode="magnet">Magnet</button><button type="button" data-mode="glitch">Glitch</button><button type="button" data-mode="origami">Origami</button><button type="button" data-mode="constellation">Stars</button>' +
      '<span class="sw-sep"></span><button type="button" data-act="rand" aria-pressed="true" title="A different start point and build order every time">Random</button><span class="sw-br"></span>' +
      '<span class="sw-sep"></span><span class="sw-vibes">' + VIBES.map(function (v) { var c = PAL[v].sw.split(','); return '<button type="button" class="sw-dot" data-vibe="' + v + '" style="--a:' + c[0] + ';--b:' + c[1] + '" title="' + PAL[v].label + '" aria-label="' + PAL[v].label + ' look"></button>'; }).join('') + '</span>' +
      '<span class="sw-sep"></span><span class="sw-speeds">' +
      SPEEDS.map(function (s) { return '<button type="button" data-sp="' + s + '" aria-label="Speed ' + s + ' times">' + s + '×</button>'; }).join('') +
      '</span><button type="button" class="sw-main" data-act="main">Skip</button>';
    ui.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.sp) { state.speed = parseFloat(b.dataset.sp); paintUI(); }
      else if (b.dataset.mode) api.play({ mode: b.dataset.mode, force: true });
      else if (b.dataset.vibe) api.play({ vibe: b.dataset.vibe, force: true });
      else if (b.dataset.act === 'rand') api.play({ random: !!(state.opts && state.opts.random === false), force: true });
      else if (current) api.skip();
      else api.play({ force: true });
    });
    ensureRoot().appendChild(ui);
  }

  function paintUI() {
    if (!ui) return;
    Array.prototype.forEach.call(ui.querySelectorAll('[data-sp]'), function (b) {
      b.classList.toggle('on', parseFloat(b.dataset.sp) === state.speed);
    });
    Array.prototype.forEach.call(ui.querySelectorAll('[data-mode]'), function (b) {
      b.classList.toggle('on', !!state.opts && b.dataset.mode === state.opts.mode);
    });
    var rb = ui.querySelector('[data-act="rand"]');
    if (rb) {
      var ron = !(state.opts && state.opts.random === false);
      rb.classList.toggle('on', ron);
      rb.setAttribute('aria-pressed', ron ? 'true' : 'false');
    }
    Array.prototype.forEach.call(ui.querySelectorAll('[data-vibe]'), function (b) {
      var on = !!state.opts && b.dataset.vibe === state.opts.vibe;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function setUI(running) {
    ensureUI();
    if (!ui) return;
    ui.querySelector('.sw-main').textContent = running ? 'Skip' : 'Replay';
    paintUI();
  }

  /* ---------- public API ---------- */

  var api = {
    play: function (o) {
      var opts = {};
      var k;
      for (k in DEFAULTS) opts[k] = DEFAULTS[k];
      if (state.opts) for (k in state.opts) opts[k] = state.opts[k];
      for (k in (o || {})) opts[k] = o[k];
      if (current) current.skip();
      ensureStyle();
      ensureRoot();
      if (['wireframe', 'mycelium', 'web', 'depth', 'storm', 'magnet', 'glitch', 'origami', 'constellation'].indexOf(opts.mode) < 0) opts.mode = 'swarm';
      if (!PAL.hasOwnProperty(opts.vibe)) opts.vibe = 'classic';
      P = PAL[opts.vibe];
      document.documentElement.setAttribute('data-vibe', opts.vibe);
      VIBES.forEach(function (v) { ensureRoot().classList.toggle('sw-v-' + v, v === opts.vibe); });
      state.opts = opts;
      state.speed = opts.speed || state.speed;
      var reduced = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced && !opts.force) {
        document.documentElement.classList.remove('sw-boot');
        setUI(false);
        return Promise.resolve();
      }
      return runIntro(opts);
    },
    skip: function () { if (current) current.skip(); },
    setSpeed: function (s) { state.speed = s; paintUI(); },
    get running() { return !!current; },
    get lastPlan() { return state.lastPlan || null; }
  };

  addEventListener('mousemove', function (e) { state.mouse.x = e.clientX; state.mouse.y = e.clientY; }, { passive: true });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && current) current.skip(); });

  global.SwarmIntro = api;

  // <script src="swarm-intro.js" data-auto data-cursors="6" data-speed="1.5" data-ui="false">
  var me = document.currentScript;
  if (me && me.hasAttribute('data-auto')) {
    var o = {};
    if (me.dataset.cursors) o.cursors = parseInt(me.dataset.cursors, 10);
    if (me.dataset.speed) o.speed = parseFloat(me.dataset.speed);
    if (me.dataset.mode) o.mode = me.dataset.mode;
    if (me.dataset.vibe) o.vibe = me.dataset.vibe;
    if (me.dataset.random === 'false') o.random = false;
    if (me.dataset.origin) o.origin = me.dataset.origin;
    if (me.dataset.order) o.order = me.dataset.order;
    if (me.dataset.ui === 'false') o.ui = false;
    if (me.dataset.logo) o.logo = me.dataset.logo;
    api.play(o);
  }
})(window);
