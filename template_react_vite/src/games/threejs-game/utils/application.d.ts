export class Application {
  container: HTMLElement;
  renderer: any;
  cheeseCollector: any;
  cameraObj: any;
  _isCleanedUp: boolean;

  constructor(container?: HTMLElement | null);

  cleanup(): void;
}
