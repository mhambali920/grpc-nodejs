const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// options ini masih bisa dikirim sebagai argumen loadservice
let options = {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
};

/**
 * @param {string} proto_path - Path ke file .proto target
 * @param {string} serviceName - Service yang ada dalam .proto target
 */
const loadService = (proto_path, serviceName) => {
    const packageDefinition = protoLoader.loadSync(proto_path, options);
    const service = grpc.loadPackageDefinition(packageDefinition)[serviceName];
    return new service("127.0.0.1:50051", grpc.credentials.createInsecure());
};

module.exports = { loadService };
