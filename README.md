# MEMAD Explorer

## About

Repository for MEMAD Explorer with configuration files for [D2KLab/explorer](https://github.com/D2KLab/explorer).

## Requirements

* [Docker](https://docs.docker.com/engine/)
* [docker-compose](https://docs.docker.com/compose/)

## How to run

- Download this repository:

```bash
git clone https://github.com/MeMAD-project/explorer
cd explorer
```

- Start in development mode:

```bash
docker-composer -f docker-compose.yml -f docker-compose.dev.yml up
```

- Start in production mode:

```bash
docker-composer -f docker-compose.yml -f docker-compose.prod.yml up
```

## License

MEMAD Explorer is [Apache licensed](https://github.com/MEMAD-project/explorer/blob/main/LICENSE).
