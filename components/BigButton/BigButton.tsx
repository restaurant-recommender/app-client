import "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spacer } from "../../components"

import "./BigButton.scss"
import { icon } from "@fortawesome/fontawesome-svg-core";

interface IBigButton {
  title: string
  onClick?: any
  icon: any
  iconColor?: string
  color?: string
  background?: string
  bold?: boolean
}

export const BigButton = (prop: IBigButton) => {
  return (
    <div onClick={prop.onClick} className="big-button" style={{background: prop.background ?? 'white'}}>
      <FontAwesomeIcon style={{fontSize: '48px', margin: 'auto', color: prop.iconColor ?? 'gray'}} icon={prop.icon} />
      <Spacer height={14} />
      <div style={{textAlign: 'center', color: prop.color ?? 'black', fontWeight: prop.bold ? 'bold' : 'normal'}}>{prop.title}</div>
    </div>
  )
}