interface Props {
  hasMagicLink: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  remaining: number | null;
}

export function AuthSection({ hasMagicLink, apiKey, onApiKeyChange, remaining }: Props) {
  if (hasMagicLink) {
    return (
      <div className="demo-banner">
        <p className="demo-label">Demo mode active</p>
        <p className="demo-sub">
          {remaining !== null
            ? `${remaining} translation${remaining !== 1 ? "s" : ""} remaining`
            : "You have 5 uses. No API key needed."}
        </p>
      </div>
    );
  }

  return (
    <div className="api-key-area">
      <label className="api-key-label">Claude API Key</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="sk-ant-..."
        className="api-key-input"
      />
      <p className="api-key-hint">
        Stored in session only.{" "}
        <a
          href="https://magiclink.reneebe.workers.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get a MagicLink
        </a>{" "}
        to try it free.
      </p>
    </div>
  );
}
