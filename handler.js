const HOST = process.env.HOST || 'localhost'
const PORT =  process.env.PORT || 6379

// Redis client library
const redis = require('redis');

// Client instance
const client = redis.createClient({
                                    port : PORT,         
                                    host : HOST
                                  });


client.on("connect", function() {
  console.log("Redis client pid=>" + process.pid + " Connected");
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

client.on("monitor", function (time, args, raw_reply) {
  console.log(time + ": " + args); 
});

const petOwners = require('./petOwner.json')
const pets = require('./pets.json')

const ops = require('./Operations/ops')



// This is the lambda function:
exports.restructureJson =  (event, context, callback) => {
      var OwnerPets = ops.restructure(petOwners, pets);
      console.log(OwnerPets);
      // client.set(OwnerPets, redis.print);
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(OwnerPets)
      });
};

// This is the lambda function:
exports.redisSearch =  (event, context, callback) => {
  var OwnerPets = ops.restructure(petOwners, pets);

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(OwnerPets)
  });
};

// This is the lambda function:
exports.redisSet =  (event, context, callback) => {
  try {
    // Set a keyvar 
      OwnerPets = ops.restructure(petOwners, pets);
      for (const OwnerPet of OwnerPets) {
        client.sadd("OwnerPet", JSON.stringify(OwnerPet), redis.print);
        // client.set(OwnerPet.id, JSON.stringify(OwnerPet), redis.print);
      }
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({statusCode: 200, message : "Working Fine"})
      });  
  } catch (error) {
    return callback(null, {
      statusCode: 501,
      body: JSON.stringify({statusCode: 501, message : "Something went wrong"})
    });
  }
};

exports.redisGet =  (event, context, callback) => {
  // Set a key
  // client.get('1', function (error, result) {
  //     if (error) {
  //         console.log(error);
  //         return callback(null, {
  //           statusCode: 501,
  //           body: JSON.stringify({statusCode: 501, message : "Something went wrong"})
  //         });
  //         throw error;
  //     }
  //     console.log('GET result ->' + result);
  //     return callback(null, {
  //       statusCode: 200,
  //       body: JSON.stringify({statusCode: 200, message : "Working Fine"})
  //     });
  // });
  
  client.smembers("OwnerPet", function(err,results) {
    console.log("Pet Owner = " + results);

    for (var i in results) {

        console.log("Count = " + i);
        console.log("PetOwner = " + results[i]);


        // var userID = redis.hget(onlineUsers[i],"userID", function(err,reply) {
        //     console.log("onlineUser hget: " + reply);
        //     data = JSON.parse(reply);
        //     console.log("data: " +data);
        // });       
        }
            return callback(null, {
              statusCode: 200,
              body: JSON.stringify({ 
                                      statusCode: 200, 
                                      message : "Working Fine", 
                                      body : results })
                                  });
      });


};


// Test Lambda function
exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };
  callback(null, response);
};