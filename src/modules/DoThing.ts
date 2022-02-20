import { IServiceA } from '../services/ServiceA';
import { IServiceB } from '../services/ServiceB';
import { Register } from '../IoCContainer';

export interface IDoThing {
  doThing(): void;
}

@Register('IDoThing', ['IServiceA', 'IServiceB'])
export default class DoThing implements IDoThing {
  constructor(private serviceA: IServiceA, private serviceB: IServiceB) {}

  doThing(): void {
    this.serviceA.doServiceA();
    this.serviceB.doServiceB();
    console.log('Doing thing');
  }
}
