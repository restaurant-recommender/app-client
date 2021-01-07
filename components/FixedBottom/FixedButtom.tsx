import "react";

import "./FixedBottom.scss"

export const FixedBottom = (prop: any) => {
  return (
    <div className="fixed-bottom">
      {prop.children}
    </div>
  )
}