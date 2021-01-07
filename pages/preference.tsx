import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Button, Input } from "antd";
import { DraggableArea, Spacer, FixedBottomButton } from "../components";

const fakeitems = [
  {
    id: '1',
    name: 'Thai',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '2',
    name: 'Japanese',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '3',
    name: 'Chinese',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '4',
    name: 'Korean',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '5',
    name: 'Italian',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '6',
    name: 'Fast Food',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '7',
    name: 'Buffet',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '8',
    name: 'Seafood',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '9',
    name: 'Noodle',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '10',
    name: 'Steakhouse',
    isSeleceted: false,
    order: -1,
  },
  {
    id: '11',
    name: 'Shabu Shabu',
    isSeleceted: false,
    order: -1,
  },
]

export default function Register() {

  const [items, setItems] = useState(fakeitems);

  const setItemsCallback = useCallback((newItems) => {
    setItems(newItems)
    console.log(newItems)
  }, [])

  const router = useRouter();

  const totalSelected = 5;
  const isValid = () => (items.filter((item) => item.isSeleceted).length) === totalSelected;

  const handleNext = () => {
    if (isValid()) {
      router.push("/home")
    }
  }

  return (
    <div className="container preference-page">
      <h1>Preference</h1>
      <p>Please select your restaurant preferences. Drag {totalSelected} preferences into <strong>Love box</strong> and <strong>order</strong> them by your preference.</p>
      <DraggableArea availableItems={items} selectedTitle="Love" setAvailableItemsCallback={setItemsCallback}/>
      <Spacer height={100} />
      <FixedBottomButton disabled={!isValid()} title={isValid() ? 'Next' : 'Please select 5 preferences.'} onClick={handleNext}/>
    </div>
  )
}