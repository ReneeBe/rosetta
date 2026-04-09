import { LANGUAGES } from "../utils/languages";

interface Props {
  code: string;
  fromLang: string;
  toLang: string;
  onCodeChange: (code: string) => void;
  onFromLangChange: (lang: string) => void;
  onToLangChange: (lang: string) => void;
  onTranslate: () => void;
  loading: boolean;
  canSubmit: boolean;
}

export function CodeInput({
  code,
  fromLang,
  toLang,
  onCodeChange,
  onFromLangChange,
  onToLangChange,
  onTranslate,
  loading,
  canSubmit,
}: Props) {
  return (
    <div className="code-input">
      <div className="lang-selectors">
        <div className="lang-group">
          <label className="lang-label">From</label>
          <select
            className="lang-select"
            value={fromLang}
            onChange={(e) => onFromLangChange(e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <span className="arrow">→</span>
        <div className="lang-group">
          <label className="lang-label">To</label>
          <select
            className="lang-select"
            value={toLang}
            onChange={(e) => onToLangChange(e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>
      <textarea
        className="code-textarea"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Paste your code here..."
        spellCheck={false}
      />
      <button
        className="translate-btn"
        onClick={onTranslate}
        disabled={!canSubmit || loading}
      >
        {loading ? <span className="spinner" /> : "Translate"}
      </button>
    </div>
  );
}
