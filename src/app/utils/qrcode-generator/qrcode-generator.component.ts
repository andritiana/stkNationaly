import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { toCanvas,  } from 'qrcode';
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
  private bgColor: string;

  constructor(
    @Inject(WINDOW) private window: Window,
    private eltRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
    const style = this.window.getComputedStyle(this.eltRef.nativeElement);
    this.bgColor = style.getPropertyValue('--background').trim();
    this.color = style.getPropertyValue('--ion-color-primary').trim();

    const canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.drawQrCode(canvas);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue && this.bgColor && this.color) {
      this.drawQrCode(this.canvasRef.nativeElement);
    }
  }

  private drawQrCode(canvas: HTMLCanvasElement) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    toCanvas(canvas, this.data, { color: { dark: this.color, light: this.bgColor }, errorCorrectionLevel: 'H' });
  }
}
