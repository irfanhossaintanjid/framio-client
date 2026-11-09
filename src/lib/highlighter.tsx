import * as React from "react"
import { createHighlighter } from "shiki"

const languages = [
  "bash",
  "css",
  "html",
  "javascript",
  "json",
  "markdown",
  "python",
  "sql",
  "text",
  "tsx",
  "typescript",
] as const

type Language = (typeof languages)[number]

const aliases: Record<string, Language> = {
  js: "javascript",
  jsx: "tsx",
  md: "markdown",
  sh: "bash",
  shell: "bash",
  ts: "typescript",
  tsx: "tsx",
}

const highlighterPromise = createHighlighter({
  themes: ["github-dark"],
  langs: [...languages],
})

function resolveLanguage(language: string): Language {
  const normalized = language.trim().toLowerCase()
  if (languages.includes(normalized as Language)) {
    return normalized as Language
  }
  return aliases[normalized] ?? "text"
}

export async function loadHighlighter(language: string) {
  const highlighter = await highlighterPromise
  const resolvedLanguage = resolveLanguage(language)
  const options = {
    lang: resolvedLanguage,
    theme: "github-dark",
  } as Parameters<typeof highlighter.codeToTokens>[1]

  return {
    highlight(code: string, _state?: unknown) {
      const tokenLines = highlighter.codeToTokens(code, options).tokens
      const lines = tokenLines.map((tokens, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {tokens.length === 0
            ? ""
            : tokens.map((token, tokenIndex) => (
                <span
                  key={`${lineIndex}-${tokenIndex}`}
                  style={token.color ? { color: token.color } : undefined}
                >
                  {token.content}
                </span>
              ))}
        </React.Fragment>
      ))

      return { lines, state: _state }
    },
  }
}
