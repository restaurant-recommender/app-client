import "react";
import { Button } from "antd";

import { FixedBottom } from "../";

interface IFixedBottomButton {
  title: string
  disabled?: boolean
  onClick?: any
}

export const FixedBottomButton = (prop: IFixedBottomButton) => {
  return (
    <FixedBottom>
      <Button onClick={prop.onClick} disabled={prop.disabled} type="primary" size="large" style={{width:'300px', margin:'auto'}}>{prop.title}</Button>
    </FixedBottom>
  )
}