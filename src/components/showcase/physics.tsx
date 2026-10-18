"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useExperience, usePageVisible } from "./experience-context";
import type Matter from "matter-js";
export function PhysicsPlayground() {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<{ shuffle: () => void; gravity: () => void } | null>(
    null,
  );
  const gravityDirection = useRef(1);
  const [reversed, setReversed] = useState(false);
  const [ready, setReady] = useState(false);
  const inView = useInView(host, { margin: "100px" });
  const visible = usePageVisible();
  const { enabled } = useExperience();
  useEffect(() => {
    if (!host.current || !inView) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    void import("matter-js").then((module) => {
      if (cancelled || !host.current) return;
      const M = module.default;
      const element = host.current;
      const w = element.clientWidth,
        h = element.clientHeight;
      const engine = M.Engine.create({
        gravity: { x: 0, y: gravityDirection.current },
      });
      const render = M.Render.create({
        element,
        engine,
        options: {
          width: w,
          height: h,
          wireframes: false,
          background: "transparent",
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        },
      });
      render.canvas.setAttribute("aria-hidden", "true");
      const scale = Math.min(w / 650, 1);
      const palette = [
        "#7460c5",
        "#fbbe9d",
        "#f5f0df",
        "#a4c9a8",
        "#2c544b",
        "#d5b7e5",
      ];
      const labels = ["curiosity", "PHP", "play", "Next.js", "Flutter", ".NET"];
      const bodies = labels.map((label, i) => {
        const x = w * (0.2 + (i % 3) * 0.3),
          y = 60 + Math.floor(i / 3) * 115;
        const options = {
          restitution: 0.72,
          friction: 0.15,
          render: {
            fillStyle: palette[i],
            strokeStyle: "#263b3015",
            lineWidth: 1,
          },
          label,
        };
        return i % 2
          ? M.Bodies.polygon(x, y, i === 3 ? 6 : 4, 58 * scale, {
              ...options,
              chamfer: { radius: 12 * scale },
            })
          : M.Bodies.circle(x, y, 55 * scale, options);
      });
      const walls = [
        M.Bodies.rectangle(w / 2, h + 30, w + 100, 60, {
          isStatic: true,
          render: { visible: false },
        }),
        M.Bodies.rectangle(-30, h / 2, 60, h * 3, {
          isStatic: true,
          render: { visible: false },
        }),
        M.Bodies.rectangle(w + 30, h / 2, 60, h * 3, {
          isStatic: true,
          render: { visible: false },
        }),
        M.Bodies.rectangle(w / 2, -30, w + 100, 60, {
          isStatic: true,
          render: { visible: false },
        }),
      ];
      M.Composite.add(engine.world, [...bodies, ...walls]);
      const mouse = M.Mouse.create(render.canvas);
      // Let the page keep wheel scrolling while the canvas handles drag gestures.
      mouse.element.removeEventListener(
        "wheel",
        (mouse as Matter.Mouse & { mousewheel: EventListener }).mousewheel,
      );
      const constraint = M.MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.15, render: { visible: false } },
      });
      M.Composite.add(engine.world, constraint);
      const draw = () => {
        const ctx = render.context;
        ctx.save();
        ctx.setTransform(
          render.options.pixelRatio || 1,
          0,
          0,
          render.options.pixelRatio || 1,
          0,
          0,
        );
        bodies.forEach((body, i) => {
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          ctx.fillStyle = i === 0 || i === 4 ? "#fff" : "#24362b";
          ctx.font = `500 ${Math.max(12, 15 * scale)}px "Space Grotesk Variable", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(labels[i], 0, 0);
          ctx.restore();
        });
        ctx.restore();
      };
      M.Events.on(render, "afterRender", draw);
      const runner = M.Runner.create();
      if (enabled && visible) {
        M.Runner.run(runner, engine);
        M.Render.run(render);
      } else {
        M.Engine.update(engine, 16);
        M.Render.world(render);
      }
      controls.current = {
        shuffle: () => {
          bodies.forEach((body, i) => {
            M.Body.setPosition(body, {
              x: element.clientWidth * (0.2 + (i % 3) * 0.3),
              y: 65 + Math.floor(i / 3) * 110,
            });
            M.Body.setVelocity(body, { x: (Math.random() - 0.5) * 12, y: -5 });
          });
          if (!enabled) M.Render.world(render);
        },
        gravity: () => {
          engine.gravity.y *= -1;
          gravityDirection.current = engine.gravity.y;
        },
      };
      setReady(true);
      const resize = new ResizeObserver(() => {
        const nw = element.clientWidth;
        M.Render.setSize(render, nw, element.clientHeight);
        M.Body.setPosition(walls[2], {
          x: nw + 30,
          y: element.clientHeight / 2,
        });
        M.Body.setPosition(walls[0], {
          x: nw / 2,
          y: element.clientHeight + 30,
        });
        bodies.forEach((body) => {
          if (body.position.x > nw - 45)
            M.Body.setPosition(body, { x: nw / 2, y: body.position.y });
        });
        if (!enabled) M.Render.world(render);
      });
      resize.observe(element);
      dispose = () => {
        controls.current = null;
        resize.disconnect();
        M.Runner.stop(runner);
        M.Render.stop(render);
        M.Events.off(render, "afterRender", draw);
        M.Mouse.clearSourceEvents(mouse);
        M.Composite.clear(engine.world, false);
        M.Engine.clear(engine);
        render.canvas.remove();
      };
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [inView, enabled, visible]);
  return (
    <div className="physics-experiment">
      <div
        className="physics-stage"
        ref={host}
        role="img"
        aria-label="A physics playground with draggable shapes labeled PHP, Next.js, Flutter and .NET"
      >
        {!ready && (
          <div className="physics-placeholder" aria-hidden="true">
            <span>PHP</span>
            <span>Next.js</span>
            <span>Flutter</span>
          </div>
        )}
      </div>
      <div className="experiment-controls">
        <span>
          {enabled ? "Grab. Drag. Let go." : "Motion paused. Take your time."}
        </span>
        <div>
          <button onClick={() => controls.current?.shuffle()} disabled={!ready}>
            Shuffle ↻
          </button>
          <button
            onClick={() => {
              controls.current?.gravity();
              setReversed((value) => !value);
            }}
            aria-pressed={reversed}
            disabled={!ready || !enabled}
          >
            Reverse gravity ↑
          </button>
        </div>
      </div>
    </div>
  );
}
