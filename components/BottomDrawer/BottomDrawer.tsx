import { Drawer } from "antd"

interface IBottomDrawer {
  visible: boolean
  children?: any
  onClose: any
  height?: number
}

export const BottomDrawer = (prop: IBottomDrawer) => {
  return (
    <Drawer visible={prop.visible} height={prop.height} placement="bottom" closable maskClosable onClose={prop.onClose}>
      {prop.children}
    </Drawer>
  )
}