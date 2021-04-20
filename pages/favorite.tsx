import { Button } from "antd";
import { Box, Loading, RestaurantList, Spacer } from "../components";
import { faEllipsisH, faCrown, faLink, faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from "next/router";
import { useFormatter } from "../utils";
import { useAuth } from "../utils/auth";
import { useEffect, useState } from "react";
import { Restaurant } from "../types";
import { favoriteService, trackingService } from "../services";
import { ActivityEvent } from "../utils/constant";

export default function FavoritePage () {

  const [restaurants, setRestaurants] = useState<Restaurant[]>()
  const [loading, setLoading] = useState<string>()

  const router = useRouter()
  const f = useFormatter()
  const auth = useAuth()

  useEffect(() => {
    setLoading(f('loading'))
    trackingService.track(ActivityEvent.FAVORITE_PAGE)
    favoriteService.get().then(response => {
      setRestaurants(response.data)
      setLoading('')
    })
  }, [])

  const handleBack = () => {
    router.push("/home")
  }

  return (
    <div className="container">
      <Loading message={loading} />
      <Box height="32px">
        <Button onClick={handleBack}><FontAwesomeIcon icon={faChevronLeft}/>&nbsp;&nbsp;{f('btn_back')}</Button>
        <Box marginTop="-32px" lineHeight="32px" textAlign="center" fontSize="1rem" fontWeight="bold">
          {f('favorite_title')}
        </Box>
      </Box>
      <Spacer rem={2} />
      <Box>
        { restaurants && restaurants.map(restaurant => <RestaurantList expandable restaurant={restaurant} style={{marginBottom: '1rem'}}/>) }
      </Box>
    </div>
  )
}