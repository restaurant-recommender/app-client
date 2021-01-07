import "react";

interface ISpacer {
  rem?: number
  height?: number
}

export const Spacer = (prop: ISpacer) => {
  return (
    <div style={{
      height: prop.rem ? `${prop.rem}rem` : prop.height ? `${prop.height}px` : '1rem',
    }}/>
  )
}