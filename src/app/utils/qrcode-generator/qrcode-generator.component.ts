import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { toCanvas } from 'qrcode';
import { WINDOW } from '../browser.service';

@Component({
  selector: 'mystk-qrcode-generator',
  templateUrl: './qrcode-generator.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrcodeGeneratorComponent {
  @Input()
  data: string;
  @ViewChild('qrcodeCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private color: string;

  constructor(
    // @Inject(COMPUTED_STYLE) private computedStyle: CSSStyleDeclaration,
    @Inject(WINDOW) private window: Window,
    private eltRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
    this.color = this.window.getComputedStyle(this.eltRef.nativeElement).getPropertyValue('--ion-color-primary');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx = this.canvasRef.nativeElement.getContext('2d');
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      toCanvas(canvas, this.data, { color: { dark: this.color }, errorCorrectionLevel: 'H' });
    }
  }

}
