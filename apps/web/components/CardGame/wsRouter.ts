import { Socket } from "socket.io-client";
import {
  DefaultEventsMap,
  EventsMap,
  EventParams,
  EventNames,
} from "@socket.io/component-emitter";

export default class SocketWrapper<
  ListenEvents extends EventsMap = DefaultEventsMap,
  EmitEvents extends EventsMap = ListenEvents
> {
  private socket: Socket;
  private listeners: Map<keyof ListenEvents, ListenEvents[keyof ListenEvents]>;

  constructor(socket: Socket) {
    this.socket = socket;
    this.listeners = new Map();
  }

  public on<Ev extends keyof ListenEvents>(ev: Ev, cb: ListenEvents[Ev]): this {
    this.socket.on(String(ev), cb);
    this.listeners.set(ev, cb);

    return this;
  }

  public emit<Ev extends keyof EventNames<EmitEvents>>(
    ev: Ev,
    ...args: EventParams<EmitEvents, Ev>
  ): this {
    this.socket.emit(String(ev), ...args);

    return this;
  }

  public off() {
    this.listeners.forEach((cb, ev) => {
      this.socket.off(String(ev), cb);
    });

    this.listeners.clear();
  }
}
