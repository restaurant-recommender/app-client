import { useState, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd-next";
import { Checkbox } from "antd"
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Spacer } from "../"

import "./DraggableArea.scss"
import { relative } from "path";


interface IAvailableItem {
  id: string
  name: string
  isSeleceted: boolean
  order: number
}

interface IDraggableArea {
  availableItems: IAvailableItem[]
  selectedTitle?: string
  setAvailableItemsCallback: any
}

const getAvailableItems = (selected: IAvailableItem[], items: IAvailableItem[]): IAvailableItem[] => {
  const orderedSelected = selected.map((item, index) => ({
    id: item.id,
    name: item.name,
    isSeleceted: true,
    order: index + 1,
  }))
  const orderedItems= items.map((item, index) => ({
    id: item.id,
    name: item.name,
    isSeleceted: false,
    order: index + 1,
  }))
  return orderedSelected.concat(orderedItems)
}

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex): IAvailableItem[] => {
  const result = Array.from(list) as IAvailableItem[];
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

const getItemStyle = (isDragging, draggableStyle, isLast) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  display: 'flex',
  padding: grid * 2,
  margin: !isLast ? `0 0 ${grid}px 0` : '0',
  borderRadius: '8px',

  // change background colour if dragging
  background: isDragging ? '#bae7ff' : '#ffffff',
  border: isDragging ? 'solid 4px #1890ff' : 'none',
  position: 'relative',
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver, hasTitle) => ({
  borderRadius: hasTitle ? '0 0 14px 14px' : '14px',
  background: isDraggingOver ? '#ffd9b0bd' : '#e5e5e5',
  border: hasTitle ? 'solid 4px #fe8019' : 'none',
  padding: grid,
  width: '100%',
});

const getItemsFromAvailables = (availables: IAvailableItem[]) => (
  availables.filter(a => !a.isSeleceted)
)

const getSelectedFromAvailables = (availables: IAvailableItem[]) => (
  availables.filter(a => a.isSeleceted)
)

export const DraggableArea = (prop: IDraggableArea) => {
  // const [availables, setAvailable] = useState<IAvailableItem[]>(prop.availableItems)
  const [items, setItems] = useState<IAvailableItem[]>(getItemsFromAvailables(prop.availableItems))
  const [selected, setSelected] = useState<IAvailableItem[]>(getSelectedFromAvailables(prop.availableItems))

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
      const newItems: IAvailableItem[] = reorder(
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

  const itemComponent = (item, index, showRanking, isLast) => (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, isLast)}>
          {showRanking && <div className="rank-badge">{index + 1}</div>}
          <div style={{flexGrow: 1}}>{item.name}</div>
          <FontAwesomeIcon icon={faBars} style={{margin: 'auto'}}/>
          <div className="draggable-knob" {...provided.dragHandleProps}/>
        </div>
      )}
    </Draggable>
  )

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="list-title">{prop.selectedTitle}</div>
      <Droppable droppableId="selectedDropableId">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, prop.selectedTitle)}>
            {selected.length == 0 && 
              <div style={{textAlign: 'center', color: 'gray'}}>
                Drag item from bottom to this box.
              </div>
            }
            {selected.map((item, index) => (itemComponent(item, index, true, (index + 1 === selected.length))))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Spacer />
      <Droppable droppableId="itemsDropableId">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver, false)}>
            {items.length == 0 && 
              <div style={{textAlign: 'center', color: 'gray'}}>
                Drag item from top to this box to remove.
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