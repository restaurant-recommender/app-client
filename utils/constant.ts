import { SelectItem } from '../types'

export const typeSelection: SelectItem[] = [
    { name: 'select_restaurant', value: 'restaurant' },
    { name: 'select_dessert', value: 'dessert' },
]

export const typeSelectionDefault: SelectItem = typeSelection[0]

export const preferPriceSelection: SelectItem[] = [
    { name: 'select_b', value: 1 },
    { name: 'select_bb', value: 2 },
    { name: 'select_bbb', value: 3 },
    { name: 'select_bbbb', value: 4 },
]

export const defaultLocation: [number, number] = [13.736717, 100.523186]