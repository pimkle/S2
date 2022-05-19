import { BBox, Group, Region } from '@antv/g-canvas';
import { ScrollOffset, SpreadSheet } from '..';
import { GridGroup } from './grid-group';

export class CacheableGroup extends GridGroup {
  public imageData: ImageData;

  public hasChanged = false;

  private lastRenderScrollOffset: ScrollOffset;

  private cacheBBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  exportToCanvas(ctx: CanvasRenderingContext2D) {
    const canvasTargetCtx = (
      document.querySelector('#foo') as HTMLCanvasElement
    ).getContext('2d');
    canvasTargetCtx.putImageData(this.imageData, 0, 0);
  }

  drawToCanvas(ctx: CanvasRenderingContext2D) {
    const currentOffset = this.s2.facet.getScrollOffset();
    const deltaX = currentOffset.scrollX - this.lastRenderScrollOffset.scrollX;
    const deltaY = currentOffset.scrollY - this.lastRenderScrollOffset.scrollY;

    if (deltaX < this.cacheBBox.width && deltaY < this.cacheBBox.height) {
      ctx.putImageData(
        this.imageData,
        this.cacheBBox.x * 2 - deltaX * 2,
        this.cacheBBox.y * 2 - deltaY * 2,
      );
    }
  }

  draw(context: CanvasRenderingContext2D, region?: Region): void {
    const hasChanged = this.get('hasChanged');
    this.hasChanged = hasChanged;

    if (this.imageData) {
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

    // cache
    if (this.cacheBBox.width > 0) {
      this.imageData = context.getImageData(
        this.cacheBBox.x * 2,
        this.cacheBBox.y * 2,
        this.cacheBBox.width * 2,
        this.cacheBBox.height * 2,
      );

      // debug
      // this.exportToCanvas(context);

      this.lastRenderScrollOffset = this.s2.facet.getScrollOffset();
    }
  }
}
