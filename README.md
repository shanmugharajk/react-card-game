# react-card-game
A multiplayer game built on Socket.io, React-redux and Redis.

## To run

### Pre requisites
- NodeJs
- Redis

Install these two softwares. Then clone the repository by

```
git clone https://github.com/shansfk/react-card-game.git
```

Then navigate to the server folder in the repository and run

```
yarn install

yarn start
```

To run client navigate to client folder then do.

```
yarn install

yarn start
```

For windows run the following (run the same in server/client folder). The change is due to the variation in setting the env variables.

```
yarn install

yarn run start-win
```

(Note : Sometimes while running the server for the first time it may fail. so run the same command again and it should be fine.)

Regarding the rules and for more information about the game please refer [link here](https://shansfk.github.io/react-card-game/.)
