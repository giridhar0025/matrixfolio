import { Fragment } from "react";
import { manifesto } from "@/lib/content";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="manifesto"
      aria-labelledby="manifesto-title"
      data-sim-intensity="0.68"
      data-sim-core="0.86"
    >
      <div className="manifesto-sticky">
        <div className="manifesto-inner page-pad">
          <aside className="manifesto-aside">
            <p className="section-label manifesto-label">
              <span>{manifesto.label}</span>
            </p>
            <div className="manifesto-aside-index" aria-hidden="true">
              03
            </div>
            <p className="manifesto-side-note">{manifesto.sideNote}</p>
          </aside>

          <div className="manifesto-main">
            <h2 id="manifesto-title" className="sr-only">
              Operating principles
            </h2>
            <div className="manifesto-words">
              {manifesto.words.map((line, lineIndex) => (
                <p
                  className={`manifesto-line${
                    lineIndex === 4 || lineIndex === 5 ? " is-accent" : ""
                  }`}
                  key={line}
                >
                  {line.split(" ").map((word, wordIndex) => (
                    <Fragment key={`${word}-${wordIndex}`}>
                      <span className="manifesto-word">{word}</span>
                      {wordIndex < line.split(" ").length - 1 ? " " : null}
                    </Fragment>
                  ))}
                </p>
              ))}
            </div>

            <div className="manifesto-detail">
              <p className="manifesto-body">{manifesto.body}</p>
              <dl className="manifesto-readout">
                {manifesto.readout.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
