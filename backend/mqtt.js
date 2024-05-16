const mqtt = require('mqtt');
const userDB = require('./models/userDB');

let sensorData = {temperature: null, humidity: null};
const MQTT_BROKER = "mqtt://192.168.0.3";
const MQTT_TOPIC = "sensor/data";

const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(MQTT_TOPIC, (err) => {
        if (!err) {
            console.log(`Subscribed to topic ${MQTT_TOPIC}`);
        }
    });
});

client.on('message', async (topic, message) => {
    if (topic === MQTT_TOPIC) {
        sensorData = JSON.parse(message.toString());
        console.log('Received sensor data:', sensorData);

        try {
            await userDB.addSensor(1111, sensorData.temperature, sensorData.humidity);
        } catch (err) {
            console.error(err);
        }
    }
});
