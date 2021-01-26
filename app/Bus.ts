import IEventMessage from "./interfaces/IEventMessage";
import { IObserver } from "./interfaces/IObserver";

export class Bus {
  private observables: IObserver[] = [];

  public register(observer: IObserver) {
    this.observables.push(observer);
  }

  public remove(observer: IObserver) {
    this.observables = this.observables.filter((value) => value != observer);
  }

  public notify(event: string, message: IEventMessage) {
    for (let observer of this.observables) {
      if (observer.event == event)
        observer.callback(message);
    }
  }
}