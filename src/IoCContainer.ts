/**
 * Types and Interfaces
 */
type Class = { new (...args: any[]): any };

interface Module {
  reference: Class;
  dependencies?: string[];
  instance?: any;
}

interface Modules {
  [key: string]: Module;
}

interface Bootstrap {
  services: Class[];
  modules: Class[];
}

/**
 * Register class decorator
 */
export function Register(name: string, deps: string[] = []) {
  const container = IoCContainer.instance;
  return function <T extends { new (...args: any[]): unknown }>(
    constructor: T
  ) {
    container.register(name, deps, constructor);
  };
}

/**
 * Inversion of control container
 */
class IoCContainer {
  private static _instance: IoCContainer = new IoCContainer();
  private _modules?: Modules;
  private _queue: Modules[] = [];

  private constructor() {
    if (IoCContainer._instance) {
      throw new Error('IoCContainer singleton already exists.');
    }
  }

  /**
   * IoC Container instance getter
   */
  static get instance() {
    return IoCContainer._instance;
  }

  /**
   * After all `Register` decorators are resolved
   * on imported bootstrap classes,
   * then this method body is resolved.
   *
   * The `Register` decorator is how bootstrap items get enqueued;
   * as such, we can now safely dequeue.
   */
  set bootstrap(_bootstrap: Bootstrap) {
    this._modules = {};
    this._dequeue();
  }

  /**
   * Register references, dependencies, and instances;
   * or enqueue during bootstrap phase
   */
  register(name: string, deps: string[] = [], clazz: any) {
    if (!this._modules) {
      return this._enqueue(name, deps, clazz);
    } else if (!this._modules[name]) {
      throw new Error(`"${name}" has not been bootstrapped.`);
    } else if (this._modules[name].instance) {
      return;
    }

    const depsOfClass = this._getDepsOfClass(deps);
    this._modules[name].instance = new clazz(...depsOfClass);
  }

  /**
   * Gets array of dependency instances
   */
  private _getDepsOfClass(deps: string[]) {
    return deps.map(dep => this.resolve(dep));
  }

  /**
   * Gets an instance for a module or service
   */
  resolve<T>(dep: string): T {
    if (!this._modules) {
      throw new Error('No modules defined.');
    } else if (!this._modules[dep]?.instance) {
      throw new Error(`"${dep}" has not been bootstrapped.`);
    }
    return this._modules[dep].instance;
  }

  /**
   * Enqueues modules or services during bootstrap phase
   */
  private _enqueue(name: string, deps: string[], clazz: any) {
    this._queue.push({
      [name]: {
        dependencies: deps,
        reference: clazz,
      },
    });
  }

  /**
   * Dequeues modules or services during bootstrap phase
   */
  private _dequeue() {
    this._queue
      // assign modules/services by name
      .map(module => {
        const entries = Object.entries(module);
        entries.forEach(([name, { dependencies, reference }]) => {
          if (this._modules) {
            this._modules[name] = { dependencies, reference };
          }
        });
        return entries;
      })
      // register modules/services
      .forEach(entries => {
        entries.forEach(([name, { dependencies, reference }]) => {
          if (this._modules) {
            this.register(name, dependencies, reference);
          }
        });
      });

    this._queue = [];
  }
}

export default IoCContainer;
