const PubSub = require('@google-cloud/pubsub');

const pubsub = new PubSub();

const topicName = 'dharam-topic';

exports.helloWorld = (req, res) => {
  let message = req.query.message || req.body || 'Hello World!';
  console.log(message)
  
  const data = JSON.stringify(message);
  
  const dataBuffer = Buffer.from(data);

  
  pubsub
  .topic(topicName)
  .publisher()
  .publish(dataBuffer)
  .then(messageId => {
    res.status(200).send("Message Published");
  })
  .catch(err => {
    res.status(400).send("Error");
  });
  
};

