import "react"

import "./CardList.scss"

interface ICardList {
  children?: any
}

export const CardList = (prop: ICardList) => {
  return (
    <div className="card-list">
      {prop.children}
    </div>
  )
}