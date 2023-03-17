const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
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
                id: call.request.id,
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
    addUser: async (call, callback) => {
        let user = await Prisma.user.create({
            data: {
                name: call.request.name,
                email: call.request.email,
            },
        });
        if (user) {
            callback(null, user);
        }
    },
    updateUser: async (call, callback) => {
        const user = await Prisma.user.update({
            where: {
                id: call.request.id,
            },
            data: {
                name: call.request.name,
                email: call.request.email,
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
    deleteUser: async (call, callback) => {
        const deleteUser = await Prisma.user.delete({
            where: {
                id: call.request.id,
            },
        });
        // console.log(deleteUser);
        if (deleteUser) {
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "User Tak Ketemu",
            });
        }
    },
});

server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
});
