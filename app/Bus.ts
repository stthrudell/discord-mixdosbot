import { Message } from "discord.js";
import { IObserver } from "./IObserver";

export class Bus {
  private observables: IObserver[] = [];

  public register(observer: IObserver) {
    this.observables.push(observer);
  }

  public remove(observer: IObserver) {
    this.observables = this.observables.filter((value) => value != observer);
  }

  public notify(event: string, message: Message) {
    for (let observer of this.observables) {
      if (observer.event == event)
        observer.callback(message);
    }
  }
}