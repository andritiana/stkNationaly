import type {
  AfterViewInit, OnDestroy} from '@angular/core';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';
import Viewer from 'viewerjs';

/**
 * Apply on an element containing img-s and call show(index) to display images in a lightbox with viewerjs
 *
 * Based on [ngx-viewer2](https://github.com/LeninOchoa/ngx-viewer2/) by LeninOchoa
 */
@Directive({
  selector: '[mystk-viewerjs]',
  standalone: true,
  host: {
    '(ready)': 'onViewerReady($event)',
    '(show)': 'onViewerShow($event)',
    '(hide)': 'onViewerHide($event)',
    '(view)': 'onViewerView($event)',
    '(viewed)': 'onViewerViewed($event)',
    '(zoom)': 'onViewerZoom($event)',
  },
})
export class MystkViewerjsDirective implements AfterViewInit, OnDestroy {
  @Output() viewerHide: EventEmitter<Event> = new EventEmitter<Event>();
  get viewerOptions(): Viewer.Options {
    return this._viewerOptions;
  }
  @Input() set viewerOptions(opts: Viewer.Options) {
    this._viewerOptions = {
      ...this._viewerOptions,
      ...opts,
    };
  };
  @Output() viewerReady: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() viewerShow: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() viewerView: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() viewerViewed: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() viewerZoom: EventEmitter<Event> = new EventEmitter<Event>();

  private _viewerOptions: Viewer.Options = {
    slideOnTouch: false,
    toolbar: {
      flipHorizontal: true,
      flipVertical: true,
      oneToOne: true,
      reset: true,
      rotateLeft: true,
      rotateRight: true,
      play: true,
    },
  };
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private instance!: Viewer;

  ngAfterViewInit(): void {
    this.initViewer();
  }

  ngOnDestroy(): void {
    if (this.instance) {
      this.instance.destroy();
    }
  }

  show(imgIndex?: number) {
    this.instance.show();
    if (typeof imgIndex === 'number') {
      this.instance.view(imgIndex);
    }
  }

  private initViewer(): void {
    if (this.instance) {
      this.instance.destroy();
    }

    const nativeElement: HTMLElement = this.elementRef.nativeElement;
    this.instance = new Viewer(nativeElement, {
      // Transitions currently break the Viewer when running optimizations during ng build (i.e in prod mode)
      // TODO: Find a fix for this so we don't have to force disable transitions
      transition: false,
      ...this.viewerOptions,
    });
  }

  private onViewerHide = (event: CustomEvent) => this.viewerHide.emit(event);

  private onViewerReady = (event: CustomEvent) => this.viewerReady.emit(event);

  private onViewerShow = (event: CustomEvent) => this.viewerShow.emit(event);

  private onViewerView = (event: CustomEvent) => this.viewerView.emit(event);

  private onViewerViewed = (event: CustomEvent) => {
    this.instance.zoomTo(1);
    this.viewerViewed.emit(event);
  };

  private onViewerZoom = (event: CustomEvent) => this.viewerZoom.emit(event);
}
