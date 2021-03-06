import { createServer } from "./web/index.ts";
import {
  Controller as MuseumController,
  Repository as MuseumRepository,
} from "./museums/index.ts";

import {
  Controller as UserController,
  Repository as UserRepository,
} from "./users/index.ts";

const museumRepository = new MuseumRepository();
const museumController = new MuseumController({ museumRepository });

const userRepository = new UserRepository();
const userController = new UserController({ userRepository });

museumRepository.storage.set("fixture-1", {
  id: "fixture-1",
  name: "Most beautiful museum in the world",
  description: "One I really like",
  location: {
    lat: "12345",
    lng: "54321",
  },
});

createServer({
  configuration: { port: 8080 },
  museum: museumController,
  user: userController,
});
