import { Bold, Italic, Strikethrough, List, ListOrdered } from "lucide-react"

export type Cmd = "bold" | "italic" | "strike" | "bullet" | "ordered"

type Props = {
  active: Partial<Record<Cmd, boolean>>
  onExec: (cmd: Cmd) => void
}

const Icon = ({children}:{children: React.ReactNode}) => (
  <div className="text-slate-800">{children}</div>
)

export function BottomBar({ active, onExec }: Props) {
  const items: Cmd[] = ["bold","italic","strike","bullet","ordered"]
  const renderIcon = (cmd: Cmd) => {
    switch (cmd) {
      case "bold":    return <Bold   size={18} strokeWidth={2}/>
      case "italic":  return <Italic size={18} strokeWidth={2}/>
      case "strike":  return <Strikethrough size={18} strokeWidth={2}/>
      case "bullet":  return <List size={18} strokeWidth={2}/>
      case "ordered": return <ListOrdered size={18} strokeWidth={2}/>
    }
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
      <nav
        role="toolbar" aria-label="Textformatierung"
        className="inline-flex items-center overflow-hidden rounded-md border border-slate-300/70 shadow-md bg-slate-200/95 text-slate-800 backdrop-blur dark:bg-slate-200"
      >
        {items.map((cmd, i) => (
          <button
            key={cmd}
            type="button"
            aria-pressed={!!active[cmd]}
            aria-label={cmd}
            onClick={() => onExec(cmd)}
            className={[
              "h-10 w-10 md:h-11 md:w-11 flex items-center justify-center",
              "hover:bg-white active:bg-white/80",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
              i !== items.length - 1 ? "border-r border-slate-300/70" : "",
              active[cmd] ? "bg-sky-100" : "",
            ].join(" ")}
          >
            <Icon>{renderIcon(cmd)}</Icon>
          </button>
        ))}
      </nav>
    </div>
  )
}
