import "react";

interface ISpacer {
  rem?: number
  height?: number
  width?: number
  line?: boolean
}

export const Spacer = (prop: ISpacer) => {
  return (
    <div style={{
      width: prop.width ? `${prop.width}px` : 'unset',
      height: prop.rem ? `${prop.rem}rem` : prop.height ? `${prop.height}px` :  prop.line ? '2rem' : '1rem',
      display: 'flex',
    }}>
      {prop.line && <div style={{height: '2px', background: '#e0e0e0', margin: 'auto', width: '100%'}}/>}
    </div>
  )
}