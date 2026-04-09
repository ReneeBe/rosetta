import { useState, useRef } from "react";
import { CodeInput } from "./components/CodeInput";
import { TranslationView } from "./components/TranslationView";
import { AuthSection } from "./components/AuthSection";
import { translateCode, type TranslationResult } from "./utils/api";
import "./App.css";

declare global {
  interface Window {
    magiclink?: { hasToken: boolean };
  }
}

type Status = "idle" | "loading" | "done" | "error";

export default function App() {
  const [code, setCode] = useState("");
  const [fromLang, setFromLang] = useState("JavaScript");
  const [toLang, setToLang] = useState("Python");
  const [apiKey, setApiKey] = useState(
    () => sessionStorage.getItem("rosetta-api-key") ?? ""
  );
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasMagicLink = !!window.magiclink?.hasToken;

  function saveApiKey(val: string) {
    setApiKey(val);
    if (val) sessionStorage.setItem("rosetta-api-key", val);
    else sessionStorage.removeItem("rosetta-api-key");
  }

  async function handleTranslate() {
    if (!code.trim() || fromLang === toLang) return;
    if (!hasMagicLink && !apiKey.trim()) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError("");

    try {
      const res = await translateCode({
        code,
        fromLang,
        toLang,
        apiKey,
        hasMagicLink,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setResult(res);
      setStatus("done");
      if (res.remaining !== null) setRemaining(res.remaining);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const canSubmit =
    code.trim().length > 0 &&
    fromLang !== toLang &&
    (hasMagicLink || apiKey.trim().length > 0);

  return (
    <div className="container">
      <div className="bg-circle bg-circle-1" />
      <div className="bg-circle bg-circle-2" />

      <main className="main">
        <header className="header">
          <p className="label">day 18 / 50 projects</p>
          <h1 className="title">
            rosetta<span className="accent">.</span>
          </h1>
          <p className="tagline">code translator</p>
          <p className="subtitle">
            Translate code between languages and learn the differences line by
            line. Not just a translator, but a teacher.
          </p>
        </header>

        <AuthSection
          hasMagicLink={hasMagicLink}
          apiKey={apiKey}
          onApiKeyChange={saveApiKey}
          remaining={remaining}
        />

        <CodeInput
          code={code}
          fromLang={fromLang}
          toLang={toLang}
          onCodeChange={setCode}
          onFromLangChange={setFromLang}
          onToLangChange={setToLang}
          onTranslate={handleTranslate}
          loading={status === "loading"}
          canSubmit={canSubmit}
        />

        {status === "error" && (
          <div className="error-card">
            <p>{error}</p>
          </div>
        )}

        {result && status === "done" && (
          <TranslationView
            result={result}
            fromLang={fromLang}
            toLang={toLang}
          />
        )}

        <footer className="footer">
          <a
            href="https://github.com/ReneeBe/rosetta"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="dot">·</span>
          <a
            href="https://reneebe.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            reneebe.github.io
          </a>
        </footer>
      </main>
    </div>
  );
}
