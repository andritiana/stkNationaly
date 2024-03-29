import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { toCanvas } from 'qrcode';
import * as color from 'color';
import { WINDOW } from '../browser.service';
import { Platform } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { startWith } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mystk-qrcode-generator',
  templateUrl: './qrcode-generator.component.html',
  styles: [':host { display: block; } canvas { width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrcodeGeneratorComponent {
  @Input()
  data: string = '';
  @ViewChild('qrcodeCanvas', { static: true })
  canvasRef?: ElementRef<HTMLCanvasElement>;
  private ctx?: CanvasRenderingContext2D | null = null;
  private color: string = '';
  private bgColor: string = '';
  platform = inject(Platform);

  constructor(@Inject(WINDOW) private window: Window, private eltRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const style = this.window.getComputedStyle(this.eltRef.nativeElement);
    this.bgColor = style.getPropertyValue('--background').trim();
    this.color = style.getPropertyValue('--ion-color-primary').trim();

    const canvas = this.canvasRef?.nativeElement;
    this.ctx = this.canvasRef?.nativeElement.getContext('2d');
    this.platform.resize.pipe(startWith(void 0), untilDestroyed(this)).subscribe(() => this.drawQrCode(canvas));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue && this.bgColor && this.color) {
      this.drawQrCode(this.canvasRef?.nativeElement);
    }
  }

  private drawQrCode(canvas?: HTMLCanvasElement) {
    if (canvas && this.ctx) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      toCanvas(canvas, this.data, {
        color: { dark: color(this.color).hex(), light: color(this.bgColor).hex() },
        errorCorrectionLevel: 'H',
        scale: 6,
        margin: this.platform.width() > 375 ? 3 : 4,
      });
    }
  }
}
