import { ElementRef, inject, InjectFlags, InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken('Browser window', { providedIn: 'platform', factory: () => window });
