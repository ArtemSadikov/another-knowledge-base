export function Bind(value: Function, context: ClassMethodDecoratorContext) {
  if (context.kind !== "method") {
    throw new Error(`@Bind can only be applied to methods, not ${context.kind}`);
  }

  context.addInitializer(function () {
    Object.defineProperty(this, context.name, {
      value: value.bind(this),
      configurable: true,
      writable: true,
    });
  });
}
