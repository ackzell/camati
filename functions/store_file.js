// import { MongoClient } from 'mongodb'

exports.handler = function(event, context, callback) {
  // const DB_URL = process.env.DB_URL
  // const DB_NAME = process.env.DB_NAME
  // const DB_COLLECTION = process.env.DB_COLLECTION
  // event and context provided by Netlify
  // callback provided by us

  /**
   * event
   * {
      "path": "Path parameter",
      "httpMethod": "Incoming request's method name"
      "headers": {Incoming request headers}
      "queryStringParameters": {query string parameters }
      "body": "A JSON string of the request payload."
      "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
      }
   */

  if (event.httpMethod === 'POST') {
    console.log(event.body)

    // MongoClient.connect(
    //   `${DB_URL}/${DB_NAME}`,
    //   { useUnifiedTopology: true },
    //   function(err, connection) {
    //     if (err) {
    //       console.log('Error while connecting', err)
    //       callback(null, {
    //         statusCode: 500,
    //         body: JSON.stringify({ error: err })
    //       })
    //     }

    //     const db = connection.db(DB_NAME)
    //     const audiosCollection = db.collection(DB_COLLECTION)

    //     audiosCollection
    //       .insertOne({ hallo: 'Welt' })
    //       .then(
    //         (result) => {
    //           callback(null, { statusCode: 200, body: JSON.stringify(result) })
    //         },
    //         (err) => {
    //           console.log(err)
    //           callback(null, { statusCode: 501, body: 'Could not insert' })
    //         }
    //       )
    //       .finally(() => connection.close())
    //   }
    // )
  }

  console.log(event)
  callback(null, { statusCode: 501, body: 'Could not insert' })
}
