import { asyncScheduler, of, scheduled } from "rxjs";

export function async$<T>(value: T) {
  return scheduled(of(value), asyncScheduler);
}

export function async<T>(cb: () => T, delay?: number) {
  return new Promise((resolve) => setTimeout(() => resolve(cb()), delay));
}

export const asyncTick = async.bind(null, () => {});
