const modelServer = require("../model_server");

test('check model is not null', async () => {
    const loadedModel = await modelServer.ensureModelLoaded();
    expect(loadedModel).not.toBeNull();
})

test('check redis client', async () => {
    const redisClient = await modelServer.ensureRedisConnect();
    expect(redisClient).not.toBeNull();
})


// write an unit test on post api