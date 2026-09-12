import L from 'leaflet';

// Esri can return a successful placeholder image for an uncached tile. Asking
// for blankTile=false makes missing coverage detectable so we can use a parent.
export class CoverageTileLayer extends L.TileLayer {
  constructor(private templateUrl: string, options: L.TileLayerOptions) {
    super(templateUrl, options);
  }
  createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = document.createElement('div');
    tile.style.overflow = 'hidden';
    const img = document.createElement('img');
    img.alt = '';
    img.setAttribute('role', 'presentation');
    img.style.position = 'absolute';
    img.style.maxWidth = 'none';
    tile.append(img);
    const size = this.getTileSize();
    const load = (zoom: number) => {
      const factor = 2 ** (coords.z - zoom);
      const parent = L.point(Math.floor(coords.x / factor), Math.floor(coords.y / factor)) as L.Coords;
      parent.z = zoom;
      img.style.width = `${size.x * factor}px`;
      img.style.height = `${size.y * factor}px`;
      img.style.left = `${-(coords.x - parent.x * factor) * size.x}px`;
      img.style.top = `${-(coords.y - parent.y * factor) * size.y}px`;
      img.onload = () => done(undefined, tile);
      img.onerror = () => zoom > 0 ? load(zoom - 1) : done(new Error('Map tile unavailable'), tile);
      img.src = L.Util.template(this.templateUrl, { x: parent.x, y: parent.y, z: parent.z });
    };
    load(coords.z);
    return tile;
  }
}
