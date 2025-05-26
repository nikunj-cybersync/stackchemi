declare global {
  interface Window {
    $3Dmol: {
      createViewer: (element: HTMLDivElement, options: { backgroundColor: string }) => Viewer;
      SurfaceType: {
        VDW: number;
      };
    };
  }
}

interface Viewer {
  addModel: (data: string, format: string) => Model;
  setStyle: (sel: object, style: { stick: { radius: number } }) => void;
  addSurface: (type: number, options: { opacity: number; color: string }) => void;
  zoomTo: () => void;
  render: () => void;
  spin: (enabled: boolean) => void;
}

type Model = object;

export {}; 