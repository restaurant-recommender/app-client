import { useRouter } from "next/router"
import { Button, Rate } from "antd"
import { IRestaurant } from "../../../types"

import { RestaurantCard, Spacer } from "../../../components"

const fakerestaurant: IRestaurant = {
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
}

export default function IndividualFinish() {
  const router = useRouter()

  const handleHome = () => {
    router.push("/home")
  }

  const rateDialog = (
    <div style={{background: '#ffffff3f', textAlign: 'center', padding: '1rem', marginTop: '1rem', marginBottom: '1rem', borderRadius: '8px'}}>
      <p style={{color: '#ffffff', marginBottom: '0'}}>Please rate this recommenation.</p>
      <Rate />
    </div>
  )

  return (
    <div className="container middle-flex" style={{background: '#F87400'}}>
      <Spacer />
      <h1 style={{color: 'white', textAlign: 'center', marginBottom: '1rem'}}><strong>Have a great meal!</strong></h1>
      <div style={{flexGrow: 1, overflow:'scroll', display: 'flex', borderRadius: '8px'}}>
        <RestaurantCard collapsable style={{margin: 'auto'}} restaurant={fakerestaurant} />
      </div>
      {rateDialog}
      <Button size="large" onClick={handleHome}>Home</Button>
    </div>
  )
}