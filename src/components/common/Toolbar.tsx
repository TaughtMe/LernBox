import { Bold, Italic, Strikethrough, List, ListOrdered } from "lucide-react"

export type Cmd = "bold" | "italic" | "strike" | "bullet" | "ordered"

type Props = {
  active: Partial<Record<Cmd, boolean>>
  onExec: (cmd: Cmd) => void
}

export function BottomBar({ active, onExec }: Props) {
  const items: Cmd[] = ["bold", "italic", "strike", "bullet", "ordered"]

  const renderIcon = (cmd: Cmd) => {
    switch (cmd) {
      case "bold": return <Bold strokeWidth={2} />
      case "italic": return <Italic strokeWidth={2} />
      case "strike": return <Strikethrough strokeWidth={2} />
      case "bullet": return <List strokeWidth={2} />
      case "ordered": return <ListOrdered strokeWidth={2} />
    }
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
      <nav
        role="toolbar"
        className="inline-flex items-center overflow-hidden
                   rounded-md border border-slate-300/70
                   shadow-md bg-slate-200/95 text-slate-800
                   backdrop-blur dark:bg-slate-200"
      >
        {items.map((cmd, i) => (
          <button
            key={cmd}
            type="button"
            aria-pressed={!!active[cmd]}
            aria-label={cmd}
            onClick={() => onExec(cmd)}
            className={[
              // <-- genau hier wird alles quadratisch
              "h-11 w-11 flex items-center justify-center",
              "hover:bg-white active:bg-white/80",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
              i !== items.length - 1 ? "border-r border-slate-300/70" : "",
              active[cmd] ? "bg-sky-100" : "",
            ].join(" ")}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              {renderIcon(cmd)}
            </div>
          </button>
        ))}
      </nav>
    </div>
  )
}
