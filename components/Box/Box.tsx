import { CSSProperties, ReactNode } from "react"

interface IBox extends CSSProperties {
  children?: ReactNode
  onClick?: any
  className?: string
}

export const Box = (prop: IBox) => {
  return (
    <div className={prop.className} onClick={prop.onClick} style={prop}>
      {prop.children}
    </div>
  )
}