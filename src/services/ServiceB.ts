import { Register } from '../IoCContainer';
import { IServiceA } from './ServiceA';

export interface IServiceB {
  doServiceB(): void;
}

@Register('IServiceB', ['IServiceA'])
export default class ServiceB implements IServiceB {
  constructor(private serviceA: IServiceA) {}

  doServiceB(): void {
    this.serviceA.doServiceA();
    console.log('Doing service B');
  }
}
