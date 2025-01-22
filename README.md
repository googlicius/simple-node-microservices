# Simple NodeJS Microservices

### User Service
Build:
```sh
docker build -t user-service:<version> user-service/Dockerfile .
```

### Build:
```sh
docker build -t <service-name>:<version> -f <service-name>/Dockerfile .
```

### Run
```sh
docker run -p <HOST_PORT>:<TARGET_PORT> <service-name>:<version> 
```

## Inspect image files
```sh
docker run -it --entrypoint sh <service-name>:<version>
```
