// file ini telah di refactor ke ./src/client.jd
const PROTO_PATH_CUSTOMER = "./src/proto/customer.proto";
const PROTO_PATH_USER = "./src/proto/user.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

let options = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
};
const customerProtoDefinition = protoLoader.loadSync(PROTO_PATH_CUSTOMER, options);
const userProtoDefinition = protoLoader.loadSync(PROTO_PATH_USER, options);

const CustomerService = grpc.loadPackageDefinition(customerProtoDefinition).CustomerService;
const UserService = grpc.loadPackageDefinition(userProtoDefinition).UserService;

const customerClient = new CustomerService("127.0.0.1:50051", grpc.credentials.createInsecure());
const userClient = new UserService("127.0.0.1:50051", grpc.credentials.createInsecure());
// module.exports = client;

// testting
// userClient.getUsers({}, (error, response) => {
//     if (error) throw error;
//     console.log(response);
// });

// userClient.getUser({ id: 2 }, (error, response) => {
//     if (error) throw error;
//     console.log(response);
// });

// userClient.addUser({ name: "John Doe", email: "jhondoe@mail.com" }, (err, resp) => {
//     if (err) throw err;
//     console.log(resp);
// });
