import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/router"

import { DraggableArea, Spacer, FixedBottomButton } from "../../../components"

const fakeitems = [
  {
    id: '1',
    name: 'ปังกะโหลก',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '2',
    name: 'ชาบูนางใน',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '3',
    name: 'มีข้าวมีเตี๋ยว',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '4',
    name: 'KFC MaxValue',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '5',
    name: 'ลานไม้',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '6',
    name: 'ลาบยโส',
    isSeleceted: false,
    order: -1,
  }
]

export default function GroupStart() {
  const [items, setItems] = useState(fakeitems)
  const router = useRouter()
  const { id } = router.query

  const totalSelected = items.length;
  const isValid = () => (items.filter((item) => item.isSeleceted).length) === totalSelected;

  const setItemsCallback = useCallback((newItems) => {
    setItems(newItems)
    console.log(newItems)
  }, [])

  const handleNext = () => {
    if (isValid()) {
      router.push("/group/finish/fakegrouprecommendationid")
    }
  }

  return (
    <div className="container">
      {/* {id} */}
      <h1>Restaurants</h1>
      <p>Please order given restaurants by your preferences. Drag all {totalSelected} restaurants into <strong>Love box</strong> and <strong>order</strong> them as your wish.</p>
      <DraggableArea availableItems={items} selectedTitle="Love" setAvailableItemsCallback={setItemsCallback}/>
      <Spacer height={100} />
      <FixedBottomButton disabled={!isValid()} title={isValid() ? 'Finish' : 'Please order all restaurants.'} onClick={handleNext}/>
    </div>
  )
}