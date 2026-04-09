import { useState } from "react";
import type { TranslationResult } from "../utils/api";

interface Props {
  result: TranslationResult;
  fromLang: string;
  toLang: string;
}

export function TranslationView({ result, fromLang, toLang }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(result.translatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="translation-view">
      {/* Summary */}
      <div className="summary-card">
        <h3 className="summary-title">Overview</h3>
        <p className="summary-text">{result.summary}</p>
      </div>

      {/* Three-column breakdown */}
      <div className="breakdown">
        <div className="breakdown-header">
          <div className="breakdown-col-header">{fromLang}</div>
          <div className="breakdown-col-header">
            {toLang}
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? "Copied" : "Copy all"}
            </button>
          </div>
          <div className="breakdown-col-header">Explanation</div>
        </div>
        {result.lines.map((line, i) => (
          <div key={i} className="breakdown-row">
            <div className="breakdown-cell diff-original">
              <pre><code>{line.original}</code></pre>
            </div>
            <div className="breakdown-cell diff-translated">
              <pre><code>{line.translated}</code></pre>
            </div>
            <div className="breakdown-cell explanation-cell">
              <p>{line.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
