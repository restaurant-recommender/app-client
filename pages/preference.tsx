import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Input } from "antd";
import { DraggableArea, Spacer, FixedBottomButton, Loading } from "../components";
import { getToken, useAuth } from "../utils/auth";
import { AvailableItem, CommonCetegory, Preference } from "../types";
import { restaurantService, userService } from "../services";

const generateAvailableItem = (cetegories: CommonCetegory[], userPreferences: Preference[]): AvailableItem[] => cetegories.map((category) => {
  const userPreference = userPreferences && userPreferences.find((preference) => preference._id === category._id)
  return {
    id: category._id, 
    name: category.name,
    isSelected: userPreference ? true : false,
    order: userPreference ? userPreference.order : category.order,
  } as AvailableItem
})

export default function Register() {

  const auth = useAuth()
  const router = useRouter();

  const [categories, setCategories] = useState<CommonCetegory[]>()
  const [items, setItems] = useState<AvailableItem[]>();
  const [loading, setLoading] = useState<string>('')

  const setItemsCallback = useCallback((newItems) => {
    setItems(newItems)
    console.log(newItems)
  }, [])

  useEffect(() => {
    auth()
    restaurantService.getCommonCetegories(router.locale).then((response) => {
      const commonCetegories = response.data.data
      userService.getPreferences().then((response) => {
        const userPreferences: Preference[] = response.data
        console.log(userPreferences)
        console.log(generateAvailableItem(commonCetegories, userPreferences))
        setCategories(commonCetegories)
        setItems(generateAvailableItem(commonCetegories, userPreferences))
      })
    })
  }, [])
  
  const totalSelected = 5;
  const isValid = () => items && (items.filter((item) => item.isSelected).length) === totalSelected;

  const handleNext = () => {
    if (isValid()) {
      setLoading('Saving your preferences')
      const preferences: Preference[] = items.filter((item) => item.isSelected).map((item) => ({
        _id: item.id,
        name_en: categories.find((category) => category._id === item.id).name_en,
        order: item.order,
      }))
      console.log(preferences)
      userService.updatePreferences({ preferences }).then((result) => {
        if (result.data.status) {
          router.push("/home").then(_ => {
            setLoading('')
          })
        }
      }).catch((error) => { alert(error) }) 
    }
  }

  return (
    <div className="container preference-page">
      <Loading message={loading} />
      <h1>Preference</h1>
      <p>Please select your restaurant preferences. Drag {totalSelected} preferences into <strong>Love box</strong> and <strong>order</strong> them by your preference.</p>
      { items && <DraggableArea availableItems={items} selectedTitle="Love" setAvailableItemsCallback={setItemsCallback}/> }
      <Spacer height={100} />
      <FixedBottomButton disabled={!isValid()} title={isValid() ? 'Done' : 'Please select 5 preferences.'} onClick={handleNext}/>
    </div>
  )
}