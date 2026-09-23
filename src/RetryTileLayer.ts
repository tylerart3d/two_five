import L from 'leaflet';

/** Recover transient tile failures without reloading successful neighbors. */
export class RetryTileLayer extends L.TileLayer {
  private pending = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
  constructor(url: string, options: L.TileLayerOptions) {
    super(url, options);
    this.on('tileunload', (event: L.TileEvent) => {
      clearTimeout(this.pending.get(event.tile));
      this.pending.delete(event.tile);
    });
  }
  createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
    let attempts = 0;
    const tile = super.createTile(coords, (error, element) => {
      if (error && attempts < 2 && tile.isConnected) {
        attempts += 1;
        this.pending.set(tile, setTimeout(() => {
          this.pending.delete(tile);
          if (tile.isConnected) (tile as HTMLImageElement).src = this.getTileUrl(coords);
        }, attempts * 1500));
      } else {
        done(error, element);
      }
    });
    return tile;
  }
}
