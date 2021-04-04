import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd-next"
import { faBars, faHeart, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RestaurantList } from '../../components'

import { AvailableItem, RestaurantAvailableItem } from "../../types"
import { Spacer, Box } from "../"

import "./RestaurantListArea.scss"
import { useFormatter } from "../../utils";

// const imageurl = "https://media-cdn.tripadvisor.com/media/photo-o/0e/cc/0a/dc/restaurant-chocolat.jpg"

interface IRestaurantListArea {
  availableItems: RestaurantAvailableItem[]
  selectedTitle?: string
  setAvailableItemsCallback: any
  clickOnIdCallback?: any // id: string
  hasThumnail?: boolean
  disabled?: boolean
  selectedCount?: number
  type: 'drag' | 'checkbox'
  fixedBox?: boolean
}

// Test URL: http://localhost:3000/group/start/603dfacc3bf9035d7746a11b

const thumbnailSize = "84px"

const getAvailableItems = (selected: RestaurantAvailableItem[], items: RestaurantAvailableItem[]): RestaurantAvailableItem[] => {
  const orderedSelected = selected.map((item, index) => ({
    restaurant: item.restaurant,
    isSelected: true,
    order: index + 1,
  }))
  const orderedItems= items.map((item, index) => ({
    restaurant: item.restaurant,
    isSelected: false,
    order: index + 1,
  }))
  return orderedSelected.concat(orderedItems)
}

const reorder = (list, startIndex, endIndex): RestaurantAvailableItem[] => {
  const result = Array.from(list) as RestaurantAvailableItem[];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8

// const getItemStyle = (isDragging, draggableStyle, isLast, hasThumnail) => ({
//   // some basic styles to make the items look a bit nicer
//   userSelect: 'none',
//   display: 'flex',
//   justifyContent: 'space-between',
//   padding: hasThumnail ? 0 : grid * 2,
//   margin: !isLast ? `0 0 ${grid}px 0` : '0',
//   borderRadius: '8px',

//   height: hasThumnail ? thumbnailSize : 'unset',

//   // change background colour if dragging
//   background: isDragging ? '#bae7ff' : '#ffffff',
//   boxShadow: isDragging ? "0 0 0 4pt #1890ff" : 'none',
//   position: 'relative',
//   // styles we need to apply on draggables
//   ...draggableStyle
// });

const getListStyle = (isDraggingOver, hasTitle) => ({
  borderRadius: '14px',
  background: isDraggingOver ? '#ffe7ba' : '#e5e5e5',
  boxShadow: hasTitle ? '0 0 0 4px #fe8019' : 'none',
  padding: grid,
  marginTop: '-12px',
  width: '100%',
});

const getItemsFromAvailables = (availables: RestaurantAvailableItem[]) => (
  availables.filter(a => !a.isSelected)
)

const getSelectedFromAvailables = (availables: RestaurantAvailableItem[]) => (
  availables.filter(a => a.isSelected)
)

export const RestaurantListArea = (prop: IRestaurantListArea) => {
  const getBoxHeight = (): number => document.getElementById('pin-box').clientHeight

  const [boxHeight, setBoxHeight] = useState<number>(0)
  const [items, setItems] = useState<RestaurantAvailableItem[]>(prop.availableItems.filter(a => !a.isSelected).sort((a, b) => a.order - b.order))
  const [selected, setSelected] = useState<RestaurantAvailableItem[]>(prop.availableItems.filter(a => a.isSelected).sort((a, b) => a.order - b.order))

  const f = useFormatter()

  useEffect(() => {
    setBoxHeight(getBoxHeight())
    console.log(getBoxHeight())
  }, [items, selected])

  useEffect(() => {
    const newAvailableItems = getAvailableItems(selected, items)
    console.log(newAvailableItems)
    prop.setAvailableItemsCallback(newAvailableItems)
  }, [items, selected])

  // useEffect(() => {
  //   setItems(getItemsFromAvailables(prop.availableItems).sort((a, b) => a.order - b.order))
  //   setSelected(getSelectedFromAvailables(prop.availableItems).sort((a, b) => a.order - b.order))
  // }, [prop.availableItems])

  const getList = (id) => {
    switch (id) {
      case 'itemsDropableId':
        return items;
      case 'selectedDropableId':
        return selected;
    }
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const newItems: RestaurantAvailableItem[] = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      )

      if (source.droppableId === 'itemsDropableId') {
        setItems(newItems)
      } else {
        setSelected(newItems)
      }

    } else {
      const result: any = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setItems(result.itemsDropableId)
      setSelected(result.selectedDropableId)
    }
  };

  const handleCheckbox = (restaurantId: string) => {
    const filteredItems = items.filter((item) => item.restaurant._id === restaurantId)
    const filteredSelected = selected.filter((item) => item.restaurant._id === restaurantId)
    console.log('------------------------')
    console.log(filteredItems)
    console.log(filteredSelected)
    if (filteredItems.length) {
      const item = filteredItems[0]
      selected.push({
        restaurant: item.restaurant,
        isSelected: true,
        order: items.length,
      })
      setItems(items.filter((item) => item.restaurant._id !== restaurantId))
      setSelected(selected)
    }
    else if (filteredSelected.length) {
      const item = filteredSelected[0]
      items.push({
        restaurant: item.restaurant,
        isSelected: false,
        order: selected.length,
      })
      setSelected(selected.filter((item) => item.restaurant._id !== restaurantId))
      setItems(items)
    }
  }

  const itemComponent = (item: RestaurantAvailableItem, index, showRanking, isLast) => (
    <Draggable
      key={item.restaurant._id}
      draggableId={item.restaurant._id}
      index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          {/* marginBottom: isLast ? '0': '8px',  */}
          <RestaurantList expandable restaurant={item.restaurant} style={{background: snapshot.isDragging ? '#bae7ff' : '#ffffff', boxShadow: snapshot.isDragging ? "0 0 0 4pt #1890ff" : 'none', position: 'relative'}}>
            {
              !prop.disabled && 
              prop.type === 'drag' ?
              <div {...provided.dragHandleProps} style={{width: '100%', height: '100%', display:'flex'}}>
                <Box background="#ffffff" borderRadius="50%" width="32px" height="32px" margin="auto" display="flex">
                  <FontAwesomeIcon icon={faBars} style={{margin: 'auto'}}/>
                </Box>
              </div>
              :
              <Box onClick={() => { handleCheckbox(item.restaurant._id) }} width="24px" height="24px" margin="auto" background={item.isSelected ? '#fe8019' : '#e0e0e0'} borderRadius="4px" display="flex" boxShadow="0 0 0 4px white">
                <FontAwesomeIcon icon={faCheck} style={{color: item.isSelected ? '#ffffff' : '#afafaf', margin: 'auto'}}/>
                <div {...provided.dragHandleProps} style={{display: 'none'}} />
              </Box>
            }
          </RestaurantList>
          {!isLast && <Spacer height={8}/>}
          {/* <div /> */}
        </div>
        // snapshot.isDragging, provided.draggableProps.style
        // prop.hasThumnail ? 
        // (<div onClick={() => {prop.clickOnIdCallback && prop.clickOnIdCallback(item.id)}} ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, isLast, prop.hasThumnail)}>
        //   <Box width={thumbnailSize} height={thumbnailSize} background="#fe8019" flexShrink={0} borderRadius="8px 0 0 8px" overflow="hidden">
        //     <img src={item.image} width={thumbnailSize} height={thumbnailSize} style={{objectFit: 'cover', zoom: '2', transform: 'translate(-25%, -25%)'}} />
        //   </Box>
        //   {showRanking && (<Box display="flex" zIndex={100} width={thumbnailSize} height={thumbnailSize} background="#00000050" flexShrink={0} borderRadius="8px 0 0 8px" marginLeft={'-' + thumbnailSize}>
        //     <div className="rank-badge" style={{background: "white", color: "#101010", margin:"auto", zIndex: 101}}>{index + 1}</div>
        //   </Box>)}
        //   <Box display="flex" flexGrow={1} >
        //     <Box margin="auto 1rem">{item.name}</Box>
        //   </Box>
        //   {!prop.disabled && <FontAwesomeIcon icon={faBars} style={{marginTop: 'auto', marginBottom: 'auto', marginLeft: '1rem', marginRight: '1rem'}}/>}
        //   {!prop.disabled && <div className="draggable-knob" {...provided.dragHandleProps}/>}
        // </div>)
        // :
        // (<div onClick={() => {prop.clickOnIdCallback && prop.clickOnIdCallback(item.id)}} ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, isLast, prop.hasThumnail)}>
        //   {showRanking && <div className="rank-badge">{index + 1}</div>}
        //   <div style={{flexGrow: 1, maxWidth: '75%'}}>{item.name}</div>
        //   {!prop.disabled && <FontAwesomeIcon icon={faBars} style={{marginTop: 'auto', marginBottom: 'auto', marginLeft: '1rem'}}/>}
        //   {!prop.disabled && <div className="draggable-knob" {...provided.dragHandleProps}/>}
        // </div>)
      )}
    </Draggable>
  )

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box id="pin-box" zIndex={100} position={prop.fixedBox ? 'fixed' : 'relative'} width={prop.fixedBox ? 'calc(100% - 3rem)' : '100%'} boxShadow={ prop.fixedBox ? '0px 6px 40px 0px rgba(0,0,0,0.2)' : ''}>
        <div className="list-title" style={{boxShadow: '0 0 0 4px #fe8019'}}>
          {prop.selectedTitle}&nbsp;&nbsp;<FontAwesomeIcon icon={faHeart} />
          {prop.selectedCount && <Box marginLeft='auto' background="#00000020" borderRadius="8px" padding="0 1rem" fontSize="1.2rem" height="38px" lineHeight="38px">
            {selected.length}/{prop.selectedCount}
          </Box>}
        </div>
        <Droppable droppableId="selectedDropableId">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, prop.selectedTitle)}>
              {selected.length == 0 && 
                <div style={{textAlign: 'center', color: 'gray'}}>
                  {f('input_draggableSelected')}
                </div>
              }
              {selected.map((item, index) => (itemComponent(item, index, true, (index + 1 === selected.length))))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Box>
      { prop.fixedBox && <Box height={boxHeight} transition="0.2s" />}
      <Spacer rem={2}/>
      <Box>
        <Droppable droppableId="itemsDropableId">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, false)}>
              {items.length == 0 && 
                <div style={{textAlign: 'center', color: 'gray'}}>
                  {f('input_draggableNonSelected')}
                </div>
              }
              {items.map((item, index) => (itemComponent(item, index, false, (index + 1 === items.length))))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Box>
      
    </DragDropContext>
  );
}