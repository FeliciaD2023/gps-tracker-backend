import { WebSocketGateway, WebSocketServer, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from "@nestjs/common";

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatGateway.name);

    @WebSocketServer() io: Server;

    afterInit() {
        this.logger.log("Initialized");
    }

    handleConnection(client: any, ...args: any[]) {
        const { sockets } = this.io.sockets;

        this.logger.log(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${sockets.size}`);
    }

    handleDisconnect(client: any) {
        this.logger.log(`Cliend id:${client.id} disconnected`);
    }

    @SubscribeMessage("ping")
    handleMessage(client: any, data: any) {
        this.logger.log(`Message received from client id: ${client.id}`);
        this.logger.debug(`Payload: ${data}`);
        return {
            event: "pong",
            data: "Wrong data that will make the test fail",
        };
    }

    @SubscribeMessage("message")
    handleMessage1(client: any, data: any): string {
        this.logger.log(`Message received from client id: ${client.id}`);
        this.logger.debug(`Payload: ${data}`);
        return 'Hello world';
    }
}