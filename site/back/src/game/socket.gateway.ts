import { Server, Socket } from 'socket.io';
import Room from './Room';
import Queue from './Queue';
import { User, ConnectedUsers } from './User';
import { GameMode, GameState, UserStatus } from './Constants';
import {
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  Entity,
  Paddle,
  Paddle2,
  Ball,
  Game,
  paddleWidth,
  paddleHeight,
  ballSize,
  wallOffset,
} from './game';
import UserService from 'src/nest/services/user.service';
import EventsGateway from 'src/nest/gateways/events.gateway';
import ScoreService from 'src/nest/services/score.service';
import { CreateScoreDto } from 'src/nest/dtos/score.dto';
import { send } from 'process';

function getCurrentTime() {
  const date: number = Date.now();
  return date;
}

@WebSocketGateway({
  namespace: 'events',
})
export class SocketEvents
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UserService,
    private readonly eventsGateway: EventsGateway,
    private readonly scoreService: ScoreService,
  ) {}

  private readonly queue: Queue = new Queue();
  private readonly rooms: Map<string, Room> = new Map();
  private readonly currentGames: Array<Room> = new Array();
  private readonly connectedUsers: ConnectedUsers = new ConnectedUsers();

  createNewRoom(players: User[]): void {
    const roomId: string = `${players[0].username}&${players[1].username}`;
    let room: Room = new Room(roomId, players, { mode: players[0].mode });

    this.eventsGateway.server.to(players[0].socketId).emit('newRoom', room);
    this.eventsGateway.server.to(players[1].socketId).emit('newRoom', room);
    this.rooms.set(roomId, room);
    this.currentGames.push(room);

    this.eventsGateway.server.emit('updateCurrentGames', this.currentGames);
  }

  afterInit(server: Server) {
    setInterval(() => {
      if (this.queue.size() > 1) {
        let players: User[] = Array();

        players = this.queue.matchPlayers();
        if (players.length === 0) return;
        this.createNewRoom(players);
      }
    }, 5000);
  }

  //connection
  async handleConnection(client: Socket) {
  }

  @SubscribeMessage('handleUserConnect')
  handleConnectionToGame(@ConnectedSocket() client: Socket) {
    let newUser: User = null;
    newUser = new User(
      client.id,
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId == client.id,
      ).username,
    );
    newUser.setUserStatus(UserStatus.INHUB);
    this.connectedUsers.addUser(newUser);
  }

  @SubscribeMessage('forceDisconnection')
  handleForceDisconnection(@ConnectedSocket() client: Socket) {
    let user: User = this.connectedUsers.getUser(client.id);

    if (user) {
      this.rooms.forEach((room: Room) => {
        if (room.isAPlayer(user)) {
          room.removeUser(user);

          if (room.players.length === 0) {
            this.rooms.delete(room.roomId);

            const roomIndex: number = this.currentGames.findIndex(
              (toRemove) => toRemove.roomId === room.roomId,
            );
            if (roomIndex !== -1) {
              this.currentGames.splice(roomIndex, 1);
            }
            this.eventsGateway.server.emit(
              'updateCurrentGames',
              this.currentGames,
            );
          }
          client.leave(room.roomId);
          room.otherLeft = true;
          return;
        }
      });

      /* remove from queue */
      this.queue.remove(user);
      this.eventsGateway.server.emit('changeFriendStatus', user.username, false);
    }
  }

  //disconnection
  handleDisconnect(@ConnectedSocket() client: Socket) {
    let user: User = this.connectedUsers.getUser(client.id);

    if (user) {
      this.rooms.forEach((room: Room) => {
        if (room.isAPlayer(user)) {
          room.removeUser(user);

          if (
            room.players.length === 0 &&
            room.gameState !== GameState.WAITING
          ) {
            this.rooms.delete(room.roomId);

            const roomIndex: number = this.currentGames.findIndex(
              (toRemove) => toRemove.roomId === room.roomId,
            );
            if (roomIndex !== -1) {
              this.currentGames.splice(roomIndex, 1);
            }
            this.eventsGateway.server.emit(
              'updateCurrentGames',
              this.currentGames,
            );
          }
          client.leave(room.roomId);
          this.eventsGateway.server.to(room.roomId).emit('lost connection');
          room.lostConnection = true;
          return;
        }
      });

      /* remove from queue and connected users */
      this.queue.remove(user);
      this.connectedUsers.removeUser(user);
      this.eventsGateway.server.emit('changeFriendStatus', user.username, false);
    }
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() mode: string,
  ) {
    const user: User = this.connectedUsers.getUser(client.id);

    if (!user) {
      user.setSocketId(client.id);
    }

    if (user && !this.queue.isInQueue(user)) {
      this.connectedUsers.changeUserStatus(client.id, UserStatus.INQUEUE);
      this.connectedUsers.setGameMode(client.id, mode);
      this.queue.enqueue(user);

      this.eventsGateway.server.to(client.id).emit('joinedQueue');
    }
  }

  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(@ConnectedSocket() client: Socket) {
    const user: User = this.connectedUsers.getUser(client.id);

    if (user && this.queue.isInQueue(user)) {
      this.queue.remove(user);
    }
    if (this.connectedUsers.getUser(client.id).isWaiting) {
      this.connectedUsers.setIsWaiting(client.id, false);
    }
    this.eventsGateway.server.to(client.id).emit('leavedQueue');
  }

  @SubscribeMessage('spectateRoom')
  handleSpectateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const room: Room = this.rooms.get(roomId);

    if (room) {
      const user = this.connectedUsers.getUser(client.id);

      if (!room.isAPlayer(user)) {
        this.eventsGateway.server.to(client.id).emit('newRoom', room);
      }
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const room: Room = this.rooms.get(roomId);

    if (room) {
      const user = this.connectedUsers.getUser(client.id);

      client.join(roomId);
      if (user) {
        if (user.status === UserStatus.INHUB) {
          this.connectedUsers.changeUserStatus(
            client.id,
            UserStatus.SPECTATING,
          );
        } else if (
          room.isAPlayer(user) &&
          !room.players.find((usr) => usr.username === user.username)
        ) {
          room.addUser(user);
        }
      }

      this.eventsGateway.server.to(client.id).emit('joinedRoom');
      this.eventsGateway.server
        .to(client.id)
        .emit('updateRoom', JSON.stringify(room.serialize()));
      this.eventsGateway.server.emit('changeFriendStatus', user.username, true);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const room: Room = this.rooms.get(roomId);
    const user: User = this.connectedUsers.getUser(client.id);

    if (user && room) {
      room.removeUser(user);

      if (room.players.length === 0) {
        this.rooms.delete(room.roomId);

        const roomIndex: number = this.currentGames.findIndex(
          (toRemove) => toRemove.roomId === room.roomId,
        );
        if (roomIndex !== -1) {
          this.currentGames.splice(roomIndex, 1);
        }
        this.eventsGateway.server.emit('updateCurrentGames', this.currentGames);
      }

      client.leave(room.roomId);
      this.connectedUsers.changeUserStatus(client.id, UserStatus.INHUB);
    }
    this.eventsGateway.server.to(client.id).emit('leavedRoom');
  }

  @SubscribeMessage('invitePong')
  async handleInvitePong(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const otherId = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    ).socketId;

    const senderUsername = this.eventsGateway.connectedUsers.find(
      (usr) => usr.socketId == client.id,
    ).username;
    this.eventsGateway.server
      .to(otherId)
      .emit('receiverInvitePong', senderUsername);

    let user: User = this.connectedUsers.getUser(client.id);
    if (!user) {
      let newUser: User = new User(
        client.id,
        this.eventsGateway.connectedUsers.find(
          (usr) => usr.socketId == client.id,
        ).username,
      );
      user = newUser;
      this.connectedUsers.addUser(user);
    }

    if (user && !this.queue.isInQueue(user)) {
      this.connectedUsers.setIsWaiting(client.id, true);
      this.connectedUsers.changeUserStatus(client.id, UserStatus.INQUEUE);
      this.connectedUsers.setGameMode(user.socketId, 'classic');

      this.eventsGateway.server.to(client.id).emit('joinedQueue');
    }
  }

  @SubscribeMessage('AcceptPongInvite')
  handleAcceptInvitePong(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const senderSocketId = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    ).socketId;
    const other = this.connectedUsers.getUser(senderSocketId);
    if (!other) {
      return;
    }
    const receivererUsername = this.eventsGateway.connectedUsers.find(
      (usr) => usr.socketId == client.id,
    ).username;

    const firstuser: User = new User(
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.username == username,
      ).socketId,
      username,
    );
    firstuser.setMode('classic');
    const backuser: User = new User(
      client.id,
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId == client.id,
      ).username,
    );

    let players: User[] = Array();
    players[0] = firstuser;
    players[1] = backuser;
    if (other.isWaiting) this.createNewRoom(players);
  }

  @SubscribeMessage('DeclinePongInvite')
  handleDeclineInvitePong(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const senderSocketId = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    ).socketId;

    if (this.connectedUsers.getUser(senderSocketId).isWaiting) {
      this.connectedUsers.setIsWaiting(senderSocketId, false);
    }
    this.eventsGateway.server.to(senderSocketId).emit('leavedQueue');
    const user = this.eventsGateway.connectedUsers.find(
      (usr) => usr.socketId == client.id,
    );
    this.eventsGateway.server
      .to(senderSocketId)
      .emit('pongInviteDeclined', user.username);
  }

  secondToTimestamp(second: number): number {
    return second * 1000;
  }

  @SubscribeMessage('requestUpdate')
  async handleRequestUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const room: Room = this.rooms.get(roomId);

    if (room && !room.isGameEnd) {
      const currentTimestamp: number = Date.now();

      if (room.gameState === GameState.WAITING) {
        if (room.players.length === 2) {
          room.gameState = GameState.STARTING;
          room.start();
        }
      }
      if (room.gameState === GameState.STARTING) {
        room.start();
      } else if (room.gameState === GameState.PLAYING) {
        room.update(currentTimestamp);

        this.eventsGateway.server
          .to(room.roomId)
          .emit('updateRoom', JSON.stringify(room.serialize()));

        if (
          (room.otherLeft && !room.lostConnection) ||
          room.playerOne.score >= 7 ||
          room.playerTwo.score >= 7
        ) {
          if (!room.isGameEnd) {
            room.isGameEnd = true;

            const scoreDtoPlayerOne: CreateScoreDto = {
              playerScore: room.playerOne.score,
              enemyScore: room.playerTwo.score,
            };
            const scoreDtoPlayerTwo: CreateScoreDto = {
              playerScore: room.playerTwo.score,
              enemyScore: room.playerOne.score,
            };

            const user = await this.userService.getOnePublic({
              user42: this.eventsGateway.connectedUsers.find(
                (usr) => usr.socketId == room.playerOne.user.socketId,
              ).username,
            });
            const userId = user.id;
            const user2 = await this.userService.getOnePublic({
              user42: this.eventsGateway.connectedUsers.find(
                (usr) => usr.socketId == room.playerTwo.user.socketId,
              ).username,
            });
            const userId2 = user2.id;

            if (room.otherLeft) {
              if (room.playerOne.user.socketId === client.id) {
                this.eventsGateway.server
                  .to(client.id)
                  .emit('winner', room.playerOne.user.username);
                this.eventsGateway.server
                  .to(room.playerOne.user.socketId)
                  .emit('swalError', 'Your opponent left the game');
              } else if (room.playerTwo.user.socketId === client.id) {
                this.eventsGateway.server
                  .to(client.id)
                  .emit('winner', room.playerTwo.user.username);
                this.eventsGateway.server
                  .to(room.playerTwo.user.socketId)
                  .emit('swalError', 'Your opponent left the game');
              }
            } else if (room.playerOne.score > room.playerTwo.score) {
              this.eventsGateway.server.emit(
                'winner',
                room.playerOne.user.username,
              );
            } else {
              this.eventsGateway.server.emit(
                'winner',
                room.playerTwo.user.username,
              );
            }

            const res = await this.scoreService.add(userId, scoreDtoPlayerOne);
            const res2 = await this.scoreService.add(
              userId2,
              scoreDtoPlayerTwo,
            );

            this.eventsGateway.server
              .to(room.playerOne.user.socketId)
              .emit('newScore', res);
            this.eventsGateway.server
              .to(room.playerTwo.user.socketId)
              .emit('newScore', res2);
          }
        } else if (room.lostConnection) {
          if (room.playerOne.user.socketId === client.id) {
            this.eventsGateway.server
              .to(room.playerOne.user.socketId)
              .emit('swalError', 'Lost connection from your opponent');
          } else if (room.playerTwo.user.socketId === client.id) {
            this.eventsGateway.server
              .to(room.playerTwo.user.socketId)
              .emit('swalError', 'Lost connection from your opponent');
          }
        }
      }
    }
  }

  @SubscribeMessage('keyDown')
  async handleKeyUp(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; key: string },
  ) {
    const room: Room = this.rooms.get(data.roomId);

    if (room && room.playerOne.user.socketId === client.id) {
      if (data.key === 'ArrowUp') room.playerOne.ArrowUp = true;
      if (data.key === 'ArrowDown') room.playerOne.ArrowDown = true;
    } else if (room && room.playerTwo.user.socketId === client.id) {
      if (data.key === 'ArrowUp') room.playerTwo.ArrowUp = true;
      if (data.key === 'ArrowDown') room.playerTwo.ArrowDown = true;
    }
  }

  @SubscribeMessage('keyUp')
  async handleKeyDown(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; key: string },
  ) {
    const room: Room = this.rooms.get(data.roomId);

    if (room && room.playerOne.user.socketId === client.id) {
      if (data.key === 'ArrowUp') room.playerOne.ArrowUp = false;
      if (data.key === 'ArrowDown') room.playerOne.ArrowDown = false;
    } else if (room && room.playerTwo.user.socketId === client.id) {
      if (data.key === 'ArrowUp') room.playerTwo.ArrowUp = false;
      if (data.key === 'ArrowDown') room.playerTwo.ArrowDown = false;
    }
  }

  @SubscribeMessage('getCurrentGames')
  handleCurrentGames(@ConnectedSocket() client: Socket) {
    this.eventsGateway.server
      .to(client.id)
      .emit('updateCurrentGames', this.currentGames);
  }

  // Friends requests
  @SubscribeMessage('sendfriendRequest')
  async handleFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const user = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    );
    const tmp = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find((usr) => usr.socketId == client.id)
        .userId,
    );
    const tmp2 = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId == user.socketId,
      ).userId,
    );
    const friends = await this.userService.getFriends(tmp2.id);
    const friendRequests = await this.userService.getFriendRequests(tmp2.id);
    let nope: boolean = true;
    friends.map((friend) => {
      if (friend.user42 == tmp.user42) {
        nope = false;
      }
    });
    friendRequests.map((friend) => {
      if (friend.user42 == tmp.user42) {
        nope = false;
      }
    });
    if (tmp2.blocked.find((usr) => usr.user42 === tmp.user42)) {
      this.eventsGateway.server
        .to(client.id)
        .emit('swalError', `You are blocked by ${username}`);
      nope = false;
    }
    if (tmp.friendRequests.find((usr) => usr.user42 === tmp2.user42)) {
      this.eventsGateway.server
        .to(client.id)
        .emit(
          'swalError',
          `You've already got a friend request from ${username}`,
        );
      nope = false;
    }
    if (nope) {
      this.userService.sendFriendRequest(
        this.eventsGateway.connectedUsers.find(
          (usr) => usr.socketId == client.id,
        ).userId,
        user.userId,
      );
      if (user && tmp) {
        this.eventsGateway.server
          .to(user.socketId)
          .emit('friendRequest', user.username, tmp);
      }
    }
  }

  @SubscribeMessage('acceptFriendRequest')
  async handleAcceptFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const user = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username === username,
    );
    const accepter = this.eventsGateway.connectedUsers.find(
      (usr) => usr.socketId == client.id,
    );
    const tmp = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId === client.id,
      ).userId,
    );
    const tmp2 = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId === user.socketId,
      ).userId,
    );
    this.userService.acceptFriendRequest(
      this.eventsGateway.connectedUsers.find((usr) => usr.socketId == client.id)
        .userId,
      user.userId,
    );
    if (user && tmp && tmp2) {
      this.eventsGateway.server
        .to(user.socketId)
        .emit('acceptFriendRequest', user.username, tmp);

      this.eventsGateway.server
        .to(client.id)
        .emit('acceptFriendRequest', user.username, tmp2);

      this.eventsGateway.server.to(client.id).emit('removeRequest', tmp2);
      this.eventsGateway.server.to(user.socketId).emit(
        'swalError',
        `${accepter.username} accepted your friend request.\n
          Your are now friends.`,
      );
    }
  }

  @SubscribeMessage('declineFriendRequest')
  async handleDeclineFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const user = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    );
    const decliner = this.eventsGateway.connectedUsers.find(
      (usr) => usr.socketId == client.id,
    );
    const tmp = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId == user.socketId,
      ).userId,
    );
    this.userService.rejectFriendRequest(
      this.eventsGateway.connectedUsers.find((usr) => usr.socketId == client.id)
        .userId,
      user.userId,
    );
    if (user && tmp) {
      this.eventsGateway.server.to(client.id).emit('removeRequest', tmp);
      this.eventsGateway.server
        .to(user.socketId)
        .emit(
          'swalError',
          `${decliner.username} declined your friend request.`,
        );
    }
  }

  @SubscribeMessage('removeFriend')
  async handleRemoveFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const user = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    );
    const remover = this.eventsGateway.connectedUsers.find(
      (usr) => usr.socketId == client.id,
    );
    const tmp = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find((usr) => usr.socketId == client.id)
        .userId,
    );
    this.userService.removeFriend(
      this.eventsGateway.connectedUsers.find((usr) => usr.socketId == client.id)
        .userId,
      user.userId,
    );
    if (user && tmp) {
      this.eventsGateway.server
        .to(client.id)
        .emit('removeFriendUpdate', user.username);
      this.eventsGateway.server
        .to(user.socketId)
        .emit('removeFriendUpdate', tmp.user42);
      this.eventsGateway.server
        .to(user.socketId)
        .emit('swalError', `${remover.username} removed you from his friends.`);
    }
  }

  @SubscribeMessage('blockUser')
  async handleBlockUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const user = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    );
    const blocker = this.eventsGateway.connectedUsers.find(
      (usr) => usr.socketId == client.id,
    );
    const tmp2 = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId == user.socketId,
      ).userId,
    );
    this.userService.block(
      this.eventsGateway.connectedUsers.find((usr) => usr.socketId == client.id)
        .userId,
      user.userId,
    );
    if (user && tmp2) {
      this.eventsGateway.server.to(client.id).emit('blockUserUpdate', tmp2);
      this.eventsGateway.server
        .to(user.socketId)
        .emit('swalError', `You have been blocked by ${blocker.username}`);
    }
  }

  @SubscribeMessage('removeFriendRequest')
  async handleRemoveFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const user = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    );
    const tmp = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find((usr) => usr.socketId == client.id)
        .userId,
    );
    const tmp2 = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId == user.socketId,
      ).userId,
    );
    if (
      user &&
      tmp &&
      tmp2.friendRequests.find((usr) => usr.user42 === tmp.user42)
    ) {
      this.userService.rejectFriendRequest(
        user.userId,
        this.eventsGateway.connectedUsers.find(
          (usr) => usr.socketId === client.id,
        ).userId,
      );
      this.eventsGateway.server.to(user.socketId).emit('removeRequest', tmp);
    }
    if (
      user &&
      tmp2 &&
      tmp.friendRequests.find((usr) => usr.user42 === username)
    ) {
      this.userService.rejectFriendRequest(
        this.eventsGateway.connectedUsers.find(
          (usr) => usr.socketId === client.id,
        ).userId,
        user.userId,
      );
      this.eventsGateway.server.to(client.id).emit('removeRequest', tmp2);
    }
  }

  @SubscribeMessage('unblockUser')
  async handleUnblockUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const user = this.eventsGateway.connectedUsers.find(
      (usr) => usr.username == username,
    );
    const blocker = this.eventsGateway.connectedUsers.find(
      (usr) => usr.socketId == client.id,
    );
    const tmp2 = await this.userService.getOne(
      this.eventsGateway.connectedUsers.find(
        (usr) => usr.socketId == user.socketId,
      ).userId,
    );
    this.userService.unblock(
      this.eventsGateway.connectedUsers.find((usr) => usr.socketId == client.id)
        .userId,
      user.userId,
    );
    if (user && tmp2) {
      this.eventsGateway.server.to(client.id).emit('unblockUserUpdate', tmp2);
      this.eventsGateway.server
        .to(user.socketId)
        .emit('swalError', `You have been unblocked by ${blocker.username}`);
    }
  }

  @SubscribeMessage('getOtherUserScores')
  async handleGetOtherUserScores(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    const user = await this.userService.getOnePublic({ user42: username });
    const res = await this.scoreService.get({ userId: user.id });
    this.eventsGateway.server.to(client.id).emit('otherUserScores', res);
  }
}
