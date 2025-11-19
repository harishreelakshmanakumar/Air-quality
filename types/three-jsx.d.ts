// types/three-jsx.d.ts
export {}; // keep file a module

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // react-three-fiber uses <primitive /> which TS sometimes doesn't know about
      primitive: any;
    }
  }
}
