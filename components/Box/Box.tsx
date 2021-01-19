import { CSSProperties, ReactNode } from "react"

interface IBox extends CSSProperties {
  children?: ReactNode
}

export const Box = (prop: IBox) => {
  return (
    <div style={prop}>
      {prop.children}
    </div>
  )
}