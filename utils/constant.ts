import { SelectItem } from '../types'

export const ActivityEvent = {
    // Page Open
    LOGIN_PAGE: 1,
    REGISTER_PAGE: 2,
    HOME_PAGE: 3,
    PREFERENCE_PAGE: 4,
    FAVORITE_PAGE: 5,
    INDIVIDUAL_CONFIRM_PAGE: 6,
    GROUP_CONFIRM_PAGE: 7,
    INDIVIDUAL_RECCOMMENDATION_PAGE: 8,
    GROUP_RECOMMENDATION_PAGE: 9,
    INDIVIDUAL_SUCCESS_PAGE: 10,
    GROUP_SUCCESS_PAGE: 11,

    // Event
    REGISTER_COMPLETE: 101,
    INDIVIDUAL_CLICK: 102,
    CREATE_GROUP_CLICK: 103,
    JOIN_GROUP_CLICK: 104,
    CHANGE_LOCATION: 105,
    CHANGE_SHOP_TYPE: 106,
    CHANGE_PREFER_PRICE: 107,
    SHARE_CLICK: 108,
    EXPAND_RESTAURANT_DETAIL: 109,
    SAVE_FAVORITE_CLICK: 110,
    SUMMARY_CLICK: 111,
    CHANGE_LANGUAGE_CLICK: 112,
    LOGOUT_CLICK: 113,
    FACEBOOK_LINK_CLICK: 114,
    MAP_LINK_CLICK: 115,
    REFRESH_CLICK: 116,
    INDIVIDUAL_LOAD_MORE_CLICK: 117,

    // Session
    INDIVIDUAL_START: 501,
    INDIVIDUAL_END: 502,
    GROUP_START: 503,
    GROUP_END: 504,

    // MISC
    WANT_TO_USE_AGAIN: 1001,

    // System
    ERROR: 2001,
}

export const typeSelection: SelectItem[] = [
    { name: 'select_restaurant', value: 'restaurant' },
    { name: 'select_dessert', value: 'dessert' },
    { name: 'select_bar', value: 'bar' },
]

export const typeSelectionDefault: SelectItem = typeSelection[0]

export const preferPriceSelection: SelectItem[] = [
    { name: 'select_b', value: 1 },
    { name: 'select_bb', value: 2 },
    { name: 'select_bbb', value: 3 },
    { name: 'select_bbbb', value: 4 },
]

export const TutorialEvent = {
    CREATE_GROUP: {
        NAME: 'tutorial_create_group',
        PAGES: ['group-1', 'group-2', 'group-3'],
        PAGES_TH: ['group-1-th', 'group-2-th', 'group-3-th'],
    },
}

export const defaultLocation: [number, number] = [13.736717, 100.523186]