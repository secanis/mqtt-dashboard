# Mqtt Dashboard

This Mqtt project should help to visualize the actual traffic and other data on a Mqtt Broker.
Initially was this project thought for Mosquitto as broker and a RaspberryPi as host.

![Screenshot Mqtt-Dashboard](https://github.com/secanis/mqtt-dashboard/raw/main/docs/images/screenshot.png "Screenshot Mqtt-Dashboard")

## How to run it

This project is set up to be usable on ARM and AMD x64 architectures with Docker.
To save and visualize some data we need a storage. In this case I choose Redis.
In my setup Redis is running in memory only, because I don't need the statistics in case of a reboot of my Raspberry Pi.

```bash
docker run --name redis -p 6379:6379 -d redis
```

After that start and configure the Mqtt-Dashboard:

```bash
docker run --name mqtt-dashboard -p 3333:3333 secanis/mqtt-dashboard
```

To configure the Mqtt-Dashboard you can set several ENV variables:

| ENV | default | description |
| ----| ------- | ----------- |
| REDIS_HOST | localhost | Redis host |
| REDIS_PORT | 6379 | Redis port |
| MQTT_HOST | localhost | Mqtt Hostname/Host |
| MQTT_PORT | 9001 | Mqtt Port |
| MQTT_USERNAME | - | Mqtt Username |
| MQTT_PASSWORD | - | Mqtt Password |

Full Example:

```bash
docker run --name mqtt-dashboard -p 3333:3333 -e MQTT_HOST=192.160.0.110 -e MQTT_USERNAME=mqtt -e MQTT_PASSWORD=admin secanis/mqtt-dashboard
```


## Development

This project uses:
- Backend
    - NestJS
- Frontend
    - Angular
    - Socket
    - EChart
    - MomentJS
- Redis

```bash
# start a local redis
docker run --name redis -p 6379:6379 -d redis

# to start the NestJS dev server
npm run start api

# to start the Angular dev server
npm run start
```

## Contribution

It would be very nice, when you give us a feedback or when you create issues if you detect problems or bugs. If you want to fix it yourself or you have an idea for something new, please create a PR, that would help us a lot.

Happy Coding <3 ...

