# Chest X-Ray Diagnosis Webapp
## Summary

![homepage](./public/homepage.png)

This project aims to apply a Machine-Learning (ML) model to detect COVID-19 within patient chest X-ray images. Users will be able to upload, store, and choose which images get analyzed using our trained model. The prototype web interface is designed to be a simple tool that provides diagnostic information. The layout will have a few elements, including an image upload area and a diagnosis display section. Our ML model will specifically detect Covid-19 and currently achieve 65% accuracy on public Covid datasets.

To achieve efficiency, we designed a message broker structure to give scalability to the inference process. The implementation of the message broker is done through a Redis queue, and the entire system design can be found below:

![system design](./public/design.png)

## Scope/Scope:

1. A high-accuracy deep learning model running on backend.
2. Web-pages that serve as the default client.

## Advantages:

1. Backend scalable to multiple machines (webserver, Redis instance).
2. Universally accessible model through public API. 
3. User-friendly web interface.

## Technologies Decisions:

1. Designed an API that take X-Ray scan image as input and return model predictions.
    1. Node, Express, TensorFlow, sharp
2. Created a scalable backend using message queueing.
    1. Redis
3. Tested various components, automated testing.
    1. Jest, Postman, Github

## Main Dependencies
Node.js
Express
Tensorflow js
Chest x-ray prediction model saved at "./resources/static/<Model-Name>"

## To Run:
1. start redis
```
redis-server
```
2. start backend server
```
npm run devstart
```
3. Visit "http://localhost:3000/" for home page
