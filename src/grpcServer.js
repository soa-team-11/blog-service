import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { create, postCommentLogic } from "./controllers/blog.controller.js";

const PROTO_PATH = path.resolve("proto/blog.proto");

export function startGrpcServer() {
    const packageDef = protoLoader.loadSync(PROTO_PATH, {});
    const grpcObj = grpc.loadPackageDefinition(packageDef);
    const blogPackage = grpcObj.blog;

    const blogHandlers = {
        Create: async (call, callback) => {
            console.log("dawjduiojwaiodjwaioj")
            try {
                console.log("Received gRPC request:", call.request);
                const { author, title, description, images } = call.request;
                console.log("author:", author, "title:", title, "description:", description, "images:", images);

                const blog = await create({ author, title, description, images });

                const response = {
                    blog: {
                        id: blog._id.toString(),
                        author: blog.author,
                        title: blog.title,
                        description: blog.description,
                        images: blog.images || [],
                    },
                    message: "Blog created",
                };

                return callback(null, response);
            } catch (err) {
                console.error("gRPC Create error:", err);

                if (err.code === "USER_NOT_FOUND") {
                    return callback({
                        code: grpc.status.NOT_FOUND,
                        message: err.message,
                    });
                }

                return callback({
                    code: grpc.status.INTERNAL,
                    message: err.message,
                });
            }
        },
          PostComment: async (call, callback) => {  
            try {
                const { blogId, author, text } = call.request;
                const blog = await postCommentLogic({ blogId, author, text });
                const response = {
                    blog: {
                        id: blog._id.toString(),
                        author: blog.author,
                        title: blog.title,
                        description: blog.description,
                        images: blog.images || [],
                        comments: blog.comments.map(c => ({
                            author: c.author,
                            text: c.text,
                            createdAt: c.createdAt?.toISOString() || new Date().toISOString(),
                        })),
                    },
                    message: "Comment added successfully",
                };
                return callback(null, response);
            } catch (err) {
                return callback({
                    code: err.code === "BLOG_NOT_FOUND" ? grpc.status.NOT_FOUND : grpc.status.INTERNAL,
                    message: err.message,
                });
            }
        },
    };

    const server = new grpc.Server();
    server.addService(blogPackage.BlogService.service, blogHandlers);

    const GRPC_PORT = process.env.GRPC_PORT || 50051;
    server.bindAsync(
        `0.0.0.0:${GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.error("gRPC server failed:", err);
                return;
            }
            console.log(`gRPC listening on port ${port}`);
            server.start();
        }
    );
}


