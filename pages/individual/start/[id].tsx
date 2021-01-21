import { Button, Modal } from "antd"
import { CSSProperties, useState } from "react"
import { faFrown, faGrinStars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCookies } from "react-cookie"

import { Spacer, RestaurantCard, Box, FloatButton } from "../../../components"
import { IRestaurant } from "../../../types"
import { Color } from "../../../utils"
import { useRouter } from "next/router"
import { ModalFuncProps } from "antd/lib/modal"

const fakerestaurant: IRestaurant[] = [
  {
      "_id": "5fa42615a72cb5000a4a3c7c",
      "is_active": true,
      "name": "Gurugyuu สาขานางลิ้นจี่ บุฟเฟ่ต์ปิ้งย่างขั้นเทพกูรูกิว",
      "profile": {
          "categories": [
              {
                  "_id": "5fa425a4a72cb5000a4a3b6d",
                  "is_active": true,
                  "name_th": "Japanese Restaurant",
                  "name_en": "Japanese Restaurant",
                  "ref_id": "199035016778342",
                  "is_visible": true,
                  "__v": 0
              },
              {
                  "_id": "5fa425c8a72cb5000a4a3bc9",
                  "is_active": true,
                  "name_th": "Buffet Restaurant",
                  "name_en": "Buffet Restaurant",
                  "ref_id": "176007949109829",
                  "is_visible": true,
                  "__v": 0
              },
              {
                  "_id": "5fa425d1a72cb5000a4a3bda",
                  "is_active": true,
                  "name_th": "Barbecue Restaurant",
                  "name_en": "Barbecue Restaurant",
                  "ref_id": "150534008338515",
                  "is_visible": true,
                  "__v": 0
              }
          ],
          "price_range": 3,
          "rating": 5,
          "likes": 2086
      },
      "address": "88/59 อาคารพีพีมอลล์ ห้อง B5-B9 ถนนนางลิ้นจี่ แขวงช่องนนทรี เขตยานนาวา, Bangkok, Thailand 10120",
      "has_profile": true,
      "location": {
          "coordinates": [
              100.54373848556,
              13.705925409476
          ],
          "type": "Point"
      },
      "open_hours": [
          {
              "key": "tue_1_open",
              "value": "11:00"
          },
          {
              "key": "tue_1_close",
              "value": "23:00"
          },
          {
              "key": "wed_1_open",
              "value": "11:00"
          },
          {
              "key": "wed_1_close",
              "value": "23:00"
          },
          {
              "key": "thu_1_open",
              "value": "11:00"
          },
          {
              "key": "thu_1_close",
              "value": "23:00"
          },
          {
              "key": "fri_1_open",
              "value": "11:00"
          },
          {
              "key": "fri_1_close",
              "value": "23:00"
          },
          {
              "key": "sat_1_open",
              "value": "11:00"
          },
          {
              "key": "sat_1_close",
              "value": "23:00"
          },
          {
              "key": "sun_1_open",
              "value": "11:00"
          },
          {
              "key": "sun_1_close",
              "value": "23:00"
          }
      ],
      "phone_no": null,
      "cover_url": "https://scontent.fbkk2-6.fna.fbcdn.net/v/t1.0-0/p180x540/79859730_610999399659558_8194576440017027072_o.jpg?_nc_cat=107&ccb=2&_nc_sid=dd9801&_nc_eui2=AeFThx9SGaqax09wAh2ovARlNzu5AQKsbRc3O7kBAqxtF0-tjU8uLp6Pl6PU9gpa90etGAG88fBVBpzDLXO--uT-&_nc_ohc=gEegMFWgnTcAX8jN-Gh&_nc_ht=scontent.fbkk2-6.fna&tp=6&oh=eae5e223363c9265fb08f0bd20735907&oe=5FB757DE",
      "ref": "facebook",
      "ref_id": "332609847498516",
      "link": "https://www.facebook.com/332609844165183",
      "__v": 0,
      "dist": {
          "calculated": 11.362938235803254
      }
  },
  {
      "_id": "5fa43b1fa72cb5000a4a6202",
      "is_active": true,
      "name": "A Ramen - ราเมงข้อสอบ",
      "profile": {
          "categories": [
              {
                  "_id": "5fa425e9a72cb5000a4a3c17",
                  "is_active": true,
                  "name_th": "Ramen Restaurant",
                  "name_en": "Ramen Restaurant",
                  "ref_id": "218838724804749",
                  "is_visible": true,
                  "__v": 0
              }
          ],
          "price_range": 1,
          "rating": 4.8,
          "likes": 5076
      },
      "address": "TTN Avenue, กรุงเทพมหานคร 10120",
      "has_profile": true,
      "location": {
          "coordinates": [
              100.54357051849,
              13.706001550331
          ],
          "type": "Point"
      },
      "open_hours": null,
      "phone_no": "+66972188477",
      "cover_url": "https://scontent.fbkk2-3.fna.fbcdn.net/v/t31.0-0/p480x480/21994489_1133841240081320_3470365641169824454_o.jpg?_nc_cat=111&ccb=2&_nc_sid=dd9801&_nc_ohc=AHTfC-mB5P8AX-diE_d&_nc_ht=scontent.fbkk2-3.fna&tp=6&oh=02068d9d95c159073387b6d5317f6562&oe=5FB9B19C",
      "ref": "facebook",
      "ref_id": "637878856601136",
      "link": "https://www.facebook.com/617194305336258",
      "__v": 0,
      "dist": {
          "calculated": 19.98949909126745
      }
  },
  {
      "_id": "5fa43cdaa72cb5000a4a6515",
      "is_active": true,
      "name": "Casa Blue Craft Brews & Delicacies",
      "profile": {
          "categories": [
              {
                  "_id": "5fa425a1a72cb5000a4a3b63",
                  "is_active": true,
                  "name_th": "Restaurant",
                  "name_en": "Restaurant",
                  "ref_id": "273819889375819",
                  "is_visible": true,
                  "__v": 0
              },
              {
                  "_id": "5fa425c2a72cb5000a4a3bbd",
                  "is_active": true,
                  "name_th": "Wine, Beer & Spirits Store",
                  "name_en": "Wine, Beer & Spirits Store",
                  "ref_id": "199833073363963",
                  "is_visible": true,
                  "__v": 0
              },
              {
                  "_id": "5fa425caa72cb5000a4a3bcf",
                  "is_active": true,
                  "name_th": "Pub",
                  "name_en": "Pub",
                  "ref_id": "218693881483234",
                  "is_visible": true,
                  "__v": 0
              }
          ],
          "price_range": 2,
          "rating": 4.9,
          "likes": 13794
      },
      "address": "88 โครงการ TTN ห้อง AA ถนนนางลิ้นจี่, Bangkok, Thailand 10120",
      "has_profile": true,
      "location": {
          "coordinates": [
              100.54393529892,
              13.706157900154
          ],
          "type": "Point"
      },
      "open_hours": [
          {
              "key": "mon_1_open",
              "value": "08:00"
          },
          {
              "key": "mon_1_close",
              "value": "00:00"
          },
          {
              "key": "wed_1_open",
              "value": "08:00"
          },
          {
              "key": "wed_1_close",
              "value": "00:00"
          },
          {
              "key": "thu_1_open",
              "value": "08:00"
          },
          {
              "key": "thu_1_close",
              "value": "00:00"
          },
          {
              "key": "fri_1_open",
              "value": "08:00"
          },
          {
              "key": "fri_1_close",
              "value": "00:00"
          },
          {
              "key": "sat_1_open",
              "value": "08:00"
          },
          {
              "key": "sat_1_close",
              "value": "00:00"
          },
          {
              "key": "sun_1_open",
              "value": "08:00"
          },
          {
              "key": "sun_1_close",
              "value": "00:00"
          }
      ],
      "phone_no": "0994492233",
      "cover_url": "https://scontent.fbkk2-3.fna.fbcdn.net/v/t1.0-9/p720x720/61867410_1336495513180277_7328511068056059904_n.jpg?_nc_cat=111&ccb=2&_nc_sid=dd9801&_nc_eui2=AeHcieEv00NXNqe5j16nWrn18OfzUS-uG_fw5_NRL64b9z8gBhxU3Rqj9Wg3HfYKxKxLKFZY4U2uWE0TyHWpVrw5&_nc_ohc=LiqjxzDzyNsAX956jvx&_nc_ht=scontent.fbkk2-3.fna&tp=6&oh=823d327b47d2bd50c7ad61010b87bd07&oe=5FBA818D",
      "ref": "facebook",
      "ref_id": "811111959051971",
      "link": "https://www.facebook.com/811111909051976",
      "__v": 0,
      "dist": {
          "calculated": 24.50446085860543
      }
  },
  {
      "_id": "5fa43b1fa72cb5000a4a6204",
      "is_active": true,
      "name": "ราเมนข้อสอบนางลิ้นจี่",
      "profile": {
          "categories": [
              {
                  "_id": "5fa425a4a72cb5000a4a3b6d",
                  "is_active": true,
                  "name_th": "Japanese Restaurant",
                  "name_en": "Japanese Restaurant",
                  "ref_id": "199035016778342",
                  "is_visible": true,
                  "__v": 0
              }
          ],
          "price_range": -1,
          "rating": 5,
          "likes": 4
      },
      "address": "นางลิ้นจี่, กรุงเทพมหานคร",
      "has_profile": true,
      "location": {
          "coordinates": [
              100.5435333,
              13.7059354
          ],
          "type": "Point"
      },
      "open_hours": null,
      "phone_no": null,
      "cover_url": null,
      "ref": "facebook",
      "ref_id": "566872597072669",
      "link": "https://www.facebook.com/566872590406003",
      "__v": 0,
      "dist": {
          "calculated": 25.88748577875412
      }
  },
  {
      "_id": "5fa43988a72cb5000a4a5f10",
      "is_active": true,
      "name": "เลิฟมีเทนเดอร์เลอบิสโทร",
      "profile": {
          "categories": [
              {
                  "_id": "5fa425a1a72cb5000a4a3b63",
                  "is_active": true,
                  "name_th": "Restaurant",
                  "name_en": "Restaurant",
                  "ref_id": "273819889375819",
                  "is_visible": true,
                  "__v": 0
              }
          ],
          "price_range": -1,
          "rating": null,
          "likes": 0
      },
      "address": "ถนน นางลิ้นจี่, กรุงเทพมหานคร 10120",
      "has_profile": true,
      "location": {
          "coordinates": [
              100.54399,
              13.70621
          ],
          "type": "Point"
      },
      "open_hours": null,
      "phone_no": "+6626782048",
      "cover_url": null,
      "ref": "facebook",
      "ref_id": "2012187905666811",
      "link": "https://www.facebook.com/2012187899000145",
      "__v": 0,
      "dist": {
          "calculated": 32.73229068870611
      }
  },
  {
      "_id": "5fa43988a72cb5000a4a5f11",
      "is_active": true,
      "name": "Lovemetender Thailand",
      "profile": {
          "categories": [
              {
                  "_id": "5fa425bba72cb5000a4a3baa",
                  "is_active": true,
                  "name_th": "French Restaurant",
                  "name_en": "French Restaurant",
                  "ref_id": "168976549819329",
                  "is_visible": true,
                  "__v": 0
              },
              {
                  "_id": "5fa425c3a72cb5000a4a3bbf",
                  "is_active": true,
                  "name_th": "European Restaurant",
                  "name_en": "European Restaurant",
                  "ref_id": "1508025966158640",
                  "is_visible": true,
                  "__v": 0
              }
          ],
          "price_range": 3,
          "rating": 5,
          "likes": 102
      },
      "address": "TTN Avenue 2nd Floor, 88 Nang Linchi Road, Chongnonsi, Yannawa, กรุงเทพมหานคร 10120",
      "has_profile": true,
      "location": {
          "coordinates": [
              100.543804,
              13.706317
          ],
          "type": "Point"
      },
      "open_hours": [
          {
              "key": "mon_1_open",
              "value": "11:00"
          },
          {
              "key": "mon_1_close",
              "value": "14:30"
          },
          {
              "key": "mon_2_open",
              "value": "17:30"
          },
          {
              "key": "mon_2_close",
              "value": "22:00"
          },
          {
              "key": "wed_1_open",
              "value": "11:00"
          },
          {
              "key": "wed_1_close",
              "value": "14:30"
          },
          {
              "key": "wed_2_open",
              "value": "17:30"
          },
          {
              "key": "wed_2_close",
              "value": "22:00"
          },
          {
              "key": "thu_1_open",
              "value": "11:00"
          },
          {
              "key": "thu_1_close",
              "value": "14:30"
          },
          {
              "key": "thu_2_open",
              "value": "17:30"
          },
          {
              "key": "thu_2_close",
              "value": "22:00"
          },
          {
              "key": "fri_1_open",
              "value": "11:00"
          },
          {
              "key": "fri_1_close",
              "value": "14:30"
          },
          {
              "key": "fri_2_open",
              "value": "17:30"
          },
          {
              "key": "fri_2_close",
              "value": "22:00"
          },
          {
              "key": "sat_1_open",
              "value": "11:00"
          },
          {
              "key": "sat_1_close",
              "value": "14:30"
          },
          {
              "key": "sat_2_open",
              "value": "17:30"
          },
          {
              "key": "sat_2_close",
              "value": "22:00"
          },
          {
              "key": "sun_1_open",
              "value": "11:00"
          },
          {
              "key": "sun_1_close",
              "value": "14:30"
          },
          {
              "key": "sun_2_open",
              "value": "17:30"
          },
          {
              "key": "sun_2_close",
              "value": "22:00"
          }
      ],
      "phone_no": "(66)2-678-2048",
      "cover_url": null,
      "ref": "facebook",
      "ref_id": "189412074979680",
      "link": "https://www.facebook.com/189412028313018",
      "__v": 0,
      "dist": {
          "calculated": 32.80276302845284
      }
  }
]

const fadeWhite = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)'

export default function IndividualStart() {

  const [cookie, setCookie] = useCookies(['user'])
  const [modal, contextHolder] = Modal.useModal();

  const router = useRouter()
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState<number>(0)
  
  const handleSkip = () => {
    // console.log('test')
    // const user = cookie.user
    // console.log(user)
    setCurrentRestaurantIndex(currentRestaurantIndex + 1)
  }

  const handleLove = () => {
    router.push('/individual/finish/faketoken')
  }

  const handleHome = () => {
    // setCookie('user', 'testcookie')
  }

  const cancelModalConfig: ModalFuncProps = {
    title: 'Go Home?',
    content: (
      <>
        Do you want to cancel the recommendation and go back to home page?
      </>
    ),
    okText: 'Yes, go home',
    cancelText: 'No',
    onOk: () => {
      router.push('/home')
    },
  };

  const handleCancel = () => {
    modal.confirm(cancelModalConfig)
  }

  return (
    <div className="container">
      <Box display="flex" justifyContent="space-between" marginBottom="1rem">
        <Button onClick={handleCancel} danger>Back</Button>
        <Button>Setting</Button>
      </Box>

      <Spacer />
      <RestaurantCard style={{margin: 'auto'}} restaurant={fakerestaurant[currentRestaurantIndex]} />
      <Box height="120px" />
      
      <Box position="fixed" bottom="0" left="0" height="120px" display="flex" width="100%" background={fadeWhite}>
        <Box margin="auto" display="flex" width="100%" justifyContent="space-around">
          <FloatButton onClick={handleSkip} type="secondary"><FontAwesomeIcon icon={faFrown}/>&nbsp;&nbsp;Nah</FloatButton>
          <FloatButton onClick={handleLove} type="primary"><FontAwesomeIcon icon={faGrinStars}/>&nbsp;&nbsp;Love</FloatButton>
        </Box>
      </Box>
      {contextHolder}
    </div>
  )
}