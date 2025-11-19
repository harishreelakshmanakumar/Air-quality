import { Object3DNode, extend } from '@react-three/fiber'
import { Mesh, Group } from 'three'

declare module '@react-three/fiber' {
  interface ThreeElements {
    primitive: Object3DNode<any, any>
  }
}

extend({ Mesh, Group })
