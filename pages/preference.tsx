import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Button, Input } from "antd";
import { DraggableArea, Spacer, FixedBottomButton } from "../components";

const fakeitems = [
  {
    id: '1',
    name: 'Thai',
    isSelected: false,
    order: -1,
  },
  {
    id: '2',
    name: 'Japanese',
    isSelected: false,
    order: -1,
  },
  {
    id: '3',
    name: 'Chinese',
    isSelected: false,
    order: -1,
  },
  {
    id: '4',
    name: 'Korean',
    isSelected: false,
    order: -1,
  },
  {
    id: '5',
    name: 'Italian',
    isSelected: false,
    order: -1,
  },
  {
    id: '6',
    name: 'Fast Food',
    isSelected: false,
    order: -1,
  },
  {
    id: '7',
    name: 'Buffet',
    isSelected: false,
    order: -1,
  },
  {
    id: '8',
    name: 'Seafood',
    isSelected: false,
    order: -1,
  },
  {
    id: '9',
    name: 'Noodle',
    isSelected: false,
    order: -1,
  },
  {
    id: '10',
    name: 'Steakhouse',
    isSelected: false,
    order: -1,
  },
  {
    id: '11',
    name: 'Shabu Shabu',
    isSelected: false,
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
  const isValid = () => (items.filter((item) => item.isSelected).length) === totalSelected;

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