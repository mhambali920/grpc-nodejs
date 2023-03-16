const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
const PROTO_PATH_CUSTOMER = "./customer.proto";
const PROTO_PATH_USER = "./user.proto";

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

const customersProto = grpc.loadPackageDefinition(customerProtoDefinition);
const usersProto = grpc.loadPackageDefinition(userProtoDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();

// UserService pada kode di bawah harus ada dalam file user.proto
// rpc MethodName (Request) returns (Response);
// getUsers: (param1,param2) => { param1 untuk menerima request, param2 callback response }
server.addService(usersProto.UserService.service, {
    getUsers: async (_, callback) => {
        let users = await Prisma.user.findMany();
        callback(null, { users });
    },
    getUser: async (call, callback) => {
        let user = await Prisma.user.findUnique({
            where: {
                id: Number(call.request.id),
            },
        });
        if (user) {
            callback(null, user);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "User Tak Ketemu",
            });
        }
    },
});

// customer service masih pake in memory array
let customers = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "John Bolton",
        age: 23,
        address: "Address 1",
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Mary Anne",
        age: 45,
        address: "Address 2",
    },
];
server.addService(customersProto.CustomerService.service, {
    getAll: (_, callback) => {
        callback(null, { customers });
    },

    get: (call, callback) => {
        let customer = customers.find((n) => n.id == call.request.id);

        if (customer) {
            callback(null, customer);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found",
            });
        }
    },

    insert: (call, callback) => {
        let customer = call.request;

        customer.id = uuidv4();
        customers.push(customer);
        callback(null, customer);
    },

    update: (call, callback) => {
        let existingCustomer = customers.find((n) => n.id == call.request.id);

        if (existingCustomer) {
            existingCustomer.name = call.request.name;
            existingCustomer.age = call.request.age;
            existingCustomer.address = call.request.address;
            callback(null, existingCustomer);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found",
            });
        }
    },

    remove: (call, callback) => {
        let existingCustomerIndex = customers.findIndex((n) => n.id == call.request.id);

        if (existingCustomerIndex != -1) {
            customers.splice(existingCustomerIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found",
            });
        }
    },
});

server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
});
