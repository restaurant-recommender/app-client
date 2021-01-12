import "react";

import "./FixedBottom.scss"

export const FixedBottom = (prop: any) => {
  return (
    <div className="fixed-bottom" style={prop.style}>
      {prop.children}
    </div>
  )
}