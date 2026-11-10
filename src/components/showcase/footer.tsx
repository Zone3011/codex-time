import { ClosingParallax } from "./closing-parallax";

export function Closing() {
  return (
    <section
      className="closing-section"
      id="contact"
      aria-labelledby="closing-heading"
    >
      <ClosingParallax>
        <span className="closing-background-word" aria-hidden="true">
          hello.
        </span>
        <div className="closing-orbit" aria-hidden="true">
          <span className="closing-orbit-line" />
          <span className="closing-spark">✳</span>
          <span className="closing-note">
            hello<span>↗</span>
          </span>
          <span className="closing-dot" />
        </div>
        <div className="closing-copy">
          <p className="section-eyebrow">KEEP IN TOUCH</p>
          <h2 id="closing-heading">
            It starts with
            <br />a little <em>hello.</em>
          </h2>
          <a
            className="closing-email"
            href="mailto:niravpatel1422004@gmail.com"
          >
            Email me <span aria-hidden="true">↗</span>
          </a>
        </div>
      </ClosingParallax>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-name" href="#home">
        Nirav Patel<span aria-hidden="true">✳</span>
      </a>
      <a className="footer-email" href="mailto:niravpatel1422004@gmail.com">
        niravpatel1422004@gmail.com
      </a>
      <a className="footer-top" href="#home">
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}
