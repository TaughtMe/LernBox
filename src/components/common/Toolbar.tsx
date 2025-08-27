import { type ReactNode } from "react"

export type Cmd = "bold" | "italic" | "strike" | "bullet" | "ordered"

type Props = {
  active: Partial<Record<Cmd, boolean>>
  onExec: (cmd: Cmd) => void
}

const icons: Record<Cmd, ReactNode> = {
  bold: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M7 5h6a4 4 0 0 1 0 8H7V5zm0 8h7a4 4 0 0 1 0 8H7v-8z" fill="currentColor"/>
    </svg>
  ),
  italic: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M10 5h9v2h-3.9l-3.2 10H16v2H7v-2h3.9l3.2-10H10z" fill="currentColor"/>
    </svg>
  ),
  strike: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M3 12h18v2H3zM7 9c0-2.5 2.3-4 5-4 2 0 3.9.7 5 2l-1.8 1.2C14.5 7.5 13.3 7 12 7c-1.6 0-3 .7-3 2 0 1.6 1.6 2.3 4 3H9.6C8 11 7 10.1 7 9zm10 6c0 2.3-2 4-5 4-2.1 0-4.4-.8-5.4-2.1l1.7-1.1c.7.8 2.2 1.4 3.7 1.4 1.8 0 3-.8 3-2 0-1.5-1.6-2.2-4.1-3H14c2 .8 3 1.8 3 2.8z" fill="currentColor"/>
    </svg>
  ),
  bullet: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="6" cy="7" r="2" fill="currentColor"/>
      <path d="M10 6h8v2h-8zM10 11h8v2h-8zM10 16h8v2h-8z" fill="currentColor"/>
      <circle cx="6" cy="12" r="2" fill="currentColor"/>
      <circle cx="6" cy="17" r="2" fill="currentColor"/>
    </svg>
  ),
  ordered: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4 6h2V4H4v2zm0 6h3v-2H4v2zm0 6h4v-2H4v2zM10 6h10v2H10zM10 11h10v2H10zM10 16h10v2H10z" fill="currentColor"/>
    </svg>
  ),
}

export function BottomBar({ active, onExec }: Props) {
  const items: Cmd[] = ["bold", "italic", "strike", "bullet", "ordered"]
  return (
    <nav
      role="toolbar"
      aria-label="Textformatierung"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/85 backdrop-blur border-t border-white/10 px-3 py-2 flex items-center justify-between gap-1"
    >
      {items.map((cmd) => (
        <button
          key={cmd}
          type="button"
          aria-pressed={!!active[cmd]}
          onClick={() => onExec(cmd)}
          className={[
            "h-11 w-11 flex items-center justify-center rounded-xl",
            "text-slate-100/90",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
            active[cmd] ? "bg-white/15" : "active:bg-white/10",
          ].join(" ")}
        >
          {icons[cmd]}
          <span className="sr-only">{cmd}</span>
        </button>
      ))}
    </nav>
  )
}
