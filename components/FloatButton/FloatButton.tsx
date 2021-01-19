import { CSSProperties, ReactNode } from "react"
import { Color } from "../../utils"
import "./FloatButton.scss"

interface IFloatButton {
  type: 'primary' | 'secondary'
  children?: ReactNode
  onClick?: any
}

const primaryStyle: CSSProperties = {
  background: Color.orange
}

const secondaryStyle: CSSProperties = {
  background: Color.blue
}

export const FloatButton = (prop: IFloatButton) => {
  return (
    <div onClick={prop.onClick} className="float-button" style={prop.type === 'primary' ? primaryStyle : secondaryStyle}>
      {prop.children}
    </div>
  )
}