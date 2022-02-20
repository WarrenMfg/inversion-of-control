import IoCContainer from './src/IoCContainer';
import ServiceA from './src/services/ServiceA';
import ServiceB from './src/services/ServiceB';
import DoThing, { IDoThing } from './src/modules/DoThing';

/**
 * Bootstrap
 */
const container = IoCContainer.instance;
container.bootstrap = {
  services: [ServiceA, ServiceB],
  modules: [DoThing],
};

/**
 * Playground
 */
const doThingModule = container.resolve<IDoThing>('IDoThing');
doThingModule.doThing();
