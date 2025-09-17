import {Container} from "./container/container";

async function main() {
  const container = new Container();

  await container.run();
}

main().catch(console.error).then(console.info);
