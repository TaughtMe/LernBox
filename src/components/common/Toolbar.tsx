import { type ReactNode } from "react"

export type Cmd = "bold" | "italic" | "strike" | "bullet" | "ordered"

type Props = {
  active: Partial<Record<Cmd, boolean>>
  onExec: (cmd: Cmd) => void
}

const icons: Record<Cmd, ReactNode> = {
  bold: <b>B</b>,
  italic: <i>I</i>,
  strike: <s>S</s>,
  bullet: <span>•</span>,
  ordered: <span>1.</span>,
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
