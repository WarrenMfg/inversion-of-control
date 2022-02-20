import { Register } from '../IoCContainer';

export interface IServiceA {
  doServiceA(): void;
}

@Register('IServiceA')
export default class ServiceA implements IServiceA {
  doServiceA(): void {
    console.log('Doing service A');
  }
}
