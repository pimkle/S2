import { Region } from '@antv/g-canvas';
import { ScrollOffset } from '..';
import { GridGroup } from './grid-group';

export class CacheableGroup extends GridGroup {
  public cacheCanvas: HTMLCanvasElement;

  private lastRenderScrollOffset: ScrollOffset;

  private cacheBBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  constructor(cfg) {
    super(cfg);
    const { width, height } = this.s2.options;
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    this.cacheCanvas = canvas;
  }

  drawToCanvas(ctx: CanvasRenderingContext2D) {
    const currentOffset = this.s2.facet.getScrollOffset();
    const deltaX = currentOffset.scrollX - this.lastRenderScrollOffset.scrollX;
    const deltaY = currentOffset.scrollY - this.lastRenderScrollOffset.scrollY;

    const { width, height, x, y } = this.cacheBBox;
    ctx.drawImage(
      this.cacheCanvas,
      deltaX * 2,
      deltaY * 2,
      width * 2,
      height * 2,
      x,
      y,
      width,
      height,
    );
  }

  draw(context: CanvasRenderingContext2D, region?: Region): void {
    if (this.cacheCanvas && this.cacheBBox) {
      this.drawToCanvas(context);
    }

    super.draw(context, region);

    if (!this.cacheBBox) {
      const canvasBBox = this.getCanvasBBox();
      if (canvasBBox.width) {
        const clipBbox = this.getClip().cfg.bbox;
        this.cacheBBox = {
          x: canvasBBox.x,
          y: canvasBBox.y,
          height: clipBbox.height,
          width: clipBbox.width,
        };
      }
    }

    if (this.cacheBBox) {
      const { scrollX, scrollY } = this.s2.facet.getScrollOffset();
      const ctx = this.cacheCanvas.getContext('2d');
      const { width, height, x, y } = this.cacheBBox;

      ctx.clearRect(0, 0, width * 2, height * 2);
      ctx.drawImage(
        this.getCanvas().cfg.el,
        x * 2 + scrollX * 2,
        y * 2 + scrollY * 2,
        width * 2,
        height * 2,
        0,
        0,
        width * 2,
        height * 2,
      );
    }

    this.lastRenderScrollOffset = this.s2.facet.getScrollOffset();
  }
}
