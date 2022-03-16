import { BBox, Group, Region } from '@antv/g-canvas';
import { ScrollOffset, SpreadSheet } from '..';

export class CacheableGroup extends Group {
  private ss: SpreadSheet;

  public imageData: ImageData;

  public hasChanged = false;

  private lastRenderScrollOffset: ScrollOffset;

  private lastBBox: BBox;

  constructor(cfg) {
    super(cfg);
    this.ss = cfg.ss;
  }

  drawToCanvas(ctx: CanvasRenderingContext2D) {
    // const canvasTargetCtx = (
    //   document.querySelector('#foo') as HTMLCanvasElement
    // ).getContext('2d');
    ctx.putImageData(this.imageData, 0, 0);
  }

  draw(context: CanvasRenderingContext2D, region?: Region): void {
    const hasChanged = this.get('hasChanged');
    this.hasChanged = hasChanged;
    // if (this.imageData) {
    //   const bbox = this.getCanvasBBox();
    //   context.putImageData(
    //     this.imageData,
    //     bbox.x * 2,
    //     bbox.y * 2,
    //   );
    // }

    super.draw(context, region);

    console.log('hasChanged', this.getCanvasBBox());

    this.imageData = null;
    const bbox = this.getCanvasBBox();
    // cache
    if (bbox.width > 0) {
      this.imageData = context.getImageData(
        bbox.x * 2,
        bbox.y * 2,
        bbox.width * 2,
        bbox.height * 2,
      );
      this.lastBBox = bbox;

      this.lastRenderScrollOffset = this.ss.facet.getScrollOffset();
    }
  }
}
