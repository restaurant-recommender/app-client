import { useState, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd-next";
import { Checkbox } from "antd"
import { faBars, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { AvailableItem } from "../../types"
import { Spacer, Box } from "../"

import "./DraggableArea.scss"
import { relative } from "path";
import { useFormatter } from "../../utils";

const imageurl = "https://media-cdn.tripadvisor.com/media/photo-o/0e/cc/0a/dc/restaurant-chocolat.jpg"

interface IDraggableArea {
  availableItems: AvailableItem[]
  selectedTitle?: string
  setAvailableItemsCallback: any
  clickOnIdCallback?: any // id: string
  hasThumnail?: boolean
  disabled?: boolean
  selectedCount?: number
}

const thumbnailSize = "84px"

const getAvailableItems = (selected: AvailableItem[], items: AvailableItem[]): AvailableItem[] => {
  const orderedSelected = selected.map((item, index) => ({
    id: item.id,
    name: item.name,
    isSelected: true,
    order: index + 1,
  }))
  const orderedItems= items.map((item, index) => ({
    id: item.id,
    name: item.name,
    isSelected: false,
    order: index + 1,
  }))
  return orderedSelected.concat(orderedItems)
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex): AvailableItem[] => {
  const result = Array.from(list) as AvailableItem[];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, isLast, hasThumnail) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  padding: hasThumnail ? 0 : grid * 2,
  margin: !isLast ? `0 0 ${grid}px 0` : '0',
  borderRadius: '8px',

  height: hasThumnail ? thumbnailSize : 'unset',

  // change background colour if dragging
  background: isDragging ? '#bae7ff' : '#ffffff',
  boxShadow: isDragging ? "0 0 0 4pt #1890ff" : 'none',
  position: 'relative',
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver, hasTitle) => ({
  borderRadius: '14px',
  background: isDraggingOver ? '#ffe7ba' : '#e5e5e5',
  // border: hasTitle ? 'solid 4px #fe8019' : 'none',
  boxShadow: hasTitle ? '0 0 0 4px #fe8019' : 'none',
  padding: grid,
  marginTop: '-12px',
  width: '100%',
});

const getItemsFromAvailables = (availables: AvailableItem[]) => (
  availables.filter(a => !a.isSelected)
)

const getSelectedFromAvailables = (availables: AvailableItem[]) => (
  availables.filter(a => a.isSelected)
)

export const DraggableArea = (prop: IDraggableArea) => {
  // const [availables, setAvailable] = useState<AvailableItem[]>(prop.availableItems)
  const [items, setItems] = useState<AvailableItem[]>(getItemsFromAvailables(prop.availableItems).sort((a, b) => a.order - b.order))
  const [selected, setSelected] = useState<AvailableItem[]>(getSelectedFromAvailables(prop.availableItems).sort((a, b) => a.order - b.order))

  const f = useFormatter()

  useEffect(() => {
    const newAvailableItems = getAvailableItems(selected, items)
    // console.log(newAvailableItems)
    prop.setAvailableItemsCallback(newAvailableItems)
  }, [items, selected])

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

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const newItems: AvailableItem[] = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

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

  const itemComponent = (item: AvailableItem, index, showRanking, isLast) => (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}>
      {(provided, snapshot) => (
        prop.hasThumnail ? 
        (<div onClick={() => {prop.clickOnIdCallback && prop.clickOnIdCallback(item.id)}} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, isLast, prop.hasThumnail)}>
          <Box width={thumbnailSize} height={thumbnailSize} background="#fe8019" flexShrink={0} borderRadius="8px 0 0 8px" overflow="hidden">
            <img src={item.image} width={thumbnailSize} height={thumbnailSize} style={{objectFit: 'cover', zoom: '2', transform: 'translate(-25%, -25%)'}} />
          </Box>
          {showRanking && (<Box display="flex" zIndex={100} width={thumbnailSize} height={thumbnailSize} background="#00000050" flexShrink={0} borderRadius="8px 0 0 8px" marginLeft={'-' + thumbnailSize}>
            <div className="rank-badge" style={{background: "white", color: "#101010", margin:"auto", zIndex: 101}}>{index + 1}</div>
          </Box>)}
          <Box display="flex" flexGrow={1} >
            <Box margin="auto 1rem">{item.name}</Box>
          </Box>
          {!prop.disabled && <FontAwesomeIcon icon={faBars} style={{marginTop: 'auto', marginBottom: 'auto', marginLeft: '1rem', marginRight: '1rem'}}/>}
          {!prop.disabled && <div className="draggable-knob"/>}
        </div>)
        :
        (<div onClick={() => {prop.clickOnIdCallback && prop.clickOnIdCallback(item.id)}} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, isLast, prop.hasThumnail)}>
          {showRanking && <div className="rank-badge">{index + 1}</div>}
          <div style={{flexGrow: 1, maxWidth: '75%'}}>{item.name}</div>
          {!prop.disabled && <FontAwesomeIcon icon={faBars} style={{marginTop: 'auto', marginBottom: 'auto', marginLeft: '1rem'}}/>}
          {!prop.disabled && <div className="draggable-knob"/>}
        </div>)
      )}
    </Draggable>
  )

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="list-title" style={{boxShadow: '0 0 0 4px #fe8019'}}>{prop.selectedTitle}&nbsp;&nbsp;<FontAwesomeIcon icon={faHeart} />
          {prop.selectedCount && <Box marginLeft='auto' background="#00000020" borderRadius="8px" padding="0 1rem" fontSize="1.2rem" height="38px" lineHeight="38px">
            {selected.length}/{prop.selectedCount}
          </Box>}</div>
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
      <Spacer rem={2}/>
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
    </DragDropContext>
  );
}