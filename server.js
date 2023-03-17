const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
const PROTO_PATH_POST = "./src/proto/post.proto";
const PROTO_PATH_USER = "./src/proto/user.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

let options = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
};
const postProtoDefinition = protoLoader.loadSync(PROTO_PATH_POST, options);
const userProtoDefinition = protoLoader.loadSync(PROTO_PATH_USER, options);

const postsProto = grpc.loadPackageDefinition(postProtoDefinition);
const usersProto = grpc.loadPackageDefinition(userProtoDefinition);

const server = new grpc.Server();

// UserService pada kode di bawah harus ada dalam file user.proto begitu pula dengan method method nya
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
server.addService(postsProto.PostService.service, {
    getPosts: async (_, callback) => {
        let posts = await Prisma.post.findMany();
        callback(null, { posts });
    },
    getPost: async (call, callback) => {
        let post = await Prisma.post.findUnique({
            where: {
                id: call.request.id,
            },
        });
        if (post) {
            callback(null, post);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "post Tak Ketemu",
            });
        }
    },
    addPost: async (call, callback) => {
        let post = await Prisma.post.create({
            data: {
                title: call.request.title,
                content: call.request.content,
                published: call.request.published,
                authorId: call.request.authorId,
                updatedAt: call.request.updatedAt,
            },
        });
        if (post) {
            callback(null, post);
        }
    },
    updatePost: async (call, callback) => {
        const post = await Prisma.post.update({
            where: {
                id: call.request.id,
            },
            data: {
                title: call.request.title,
                content: call.request.content,
                published: call.request.published,
                authorId: call.request.authorId,
                updatedAt: call.request.updatedAt,
            },
        });
        if (post) {
            callback(null, post);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "post Tak Ketemu",
            });
        }
    },
    deletePost: async (call, callback) => {
        const deletepost = await Prisma.post.delete({
            where: {
                id: call.request.id,
            },
        });
        if (deletepost) {
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "post Tak Ketemu",
            });
        }
    },
});

server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
});
