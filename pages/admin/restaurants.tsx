import { Button, Select, Table, Tag } from 'antd';
import { useState } from 'react';
import { Context } from 'vm';
import { Box, Loading, Spacer } from '../../components';
import { restaurantService } from '../../services';
import { Restaurant } from '../../types';
const { Option } = Select;

interface IRestaurantsAdminPage {
  categories: {
    id: string
    label: string
  }[]
}

function RestaurantsAdminPage(prop: IRestaurantsAdminPage) {

  // const dataSource = [
  //   {
  //     key: '1',
  //     name: 'Mike',
  //     age: 32,
  //     address: '10 Downing Street',
  //   },
  //   {
  //     key: '2',
  //     name: 'John',
  //     age: 42,
  //     address: '10 Downing Street',
  //   },
  // ];

  const renderLink = (label, url) => <Button onClick={() => { window.open(url, '_blank') }}>{label}</Button>

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Categories', dataIndex: 'categories', key: 'categories', render: categories => categories.map(category => <Tag>{category.name_en}</Tag>)},
    { title: 'Price Range', dataIndex: 'price_range', key: 'price_range' },
    { title: 'Likes', dataIndex: 'likes', key: 'likes' },
    { title: 'Image', dataIndex: 'cover_url', key: 'cover_url', render: url => url ? renderLink('Image', url) : 'n/a' },
    { title: 'Link', dataIndex: 'link', key: 'link', render: url => renderLink('Facebook', url) },
    { title: 'ID', dataIndex: '_id', key: '_id' },
  ];

  const [dataSource, setDataSource] = useState<any>([])
  const [loading, setLoading] = useState<string>('')
  const [categoriyIds, setCategoryIds] = useState<string[]>([])
  
  const setRestaurantDataSource = (restaurants: Restaurant[]) => {
    const newDataSource = restaurants.map((restaurant, index) => ({
      key: index.toString(),
      name: restaurant.name,
      categories: restaurant.profile.categories,
      price_range: restaurant.profile.price_range === -1 ? 'n/a' : '฿'.repeat(restaurant.profile.price_range),
      likes: restaurant.profile.likes ?? 'n/a',
      cover_url: restaurant.cover_url,
      link: restaurant.link,
      _id: restaurant._id
    }))
    setDataSource(newDataSource)
  }

  function handleChange(value) {
    // console.log(value);
    setCategoryIds(value.map(v => prop.categories.find(category => category.label === v).id))
    // console.log(value.map(v => prop.categories.find(category => category.label === v).id))
  }

  const handleSearch = () => {
    setLoading('Searching...')
    restaurantService.searchRestaurant({ 'categories': categoriyIds }).then((result) => {
      // console.log(result.data)
      setRestaurantDataSource(result.data)
      setLoading('')
    })
  }

  const handleGetAll = () => {
    setLoading('Getting all restaurants...')
    restaurantService.searchRestaurant({}).then((result) => {
      // console.log(result.data)
      setRestaurantDataSource(result.data)
      setLoading('')
    })
  }


  // style={{ width: '100%' }}

  return (
    <Box display="block" width="100%" padding="2rem">
      <Loading message={loading}/>
      <h1>Restaurants</h1>
      <Select mode="multiple" style={{ width: '100%' }} allowClear placeholder="Please select categories" onChange={handleChange}>
        {prop.categories.map(category => <Option key={category.id} value={category.label}>{category.label}</Option>)}
      </Select>
      <Spacer/>
      <Button onClick={handleSearch} type="primary" style={{ marginRight: '1rem' }}>Search</Button>
      <Button onClick={handleGetAll}>Get All</Button>
      <Spacer/>
      <h3>Total: {dataSource.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Restaurants </h3>
      <Table dataSource={dataSource} columns={columns} />
    </Box>
  )
}

RestaurantsAdminPage.getInitialProps = async (_: Context) => {
  const categoriesResult = await restaurantService.getCetegories()
  // console.log(categoriesResult.data)
  const categories = categoriesResult.data.map((category) => ({ id: category._id, label: category.name_en}))
  return { categories }
}

export default RestaurantsAdminPage