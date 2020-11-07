/* eslint-disable max-len */
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {MongoClient} = require('mongodb');

// const {Socket} = require('dgram');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const mongoClient = new MongoClient('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true});


/**
 * Main thread function
 */
async function main() {
  try {
    await mongoClient.connect(function(err, client) {
      if (err) {
        throw err;
      }

      // const db = client.db('croco');
      // const collection = db.collection('rooms');


      const ROOMS = new Map([]);

      io.on('connection', (socket) => {
        console.log(`New connection`, socket.id);

        socket.emit('user_data', socket.id);

        socket.on('new_message', (message, key) => {
          console.log(`${socket.id} sent message ${message} to ${key}`);
          if (message.trim()) {
            const room = ROOMS.get(key);
            if (room) {
              console.log('room exists');
              const player = room.players.filter(function(el) {
                return el.id == socket.id;
              });
              if (player[0].name && player[0].avatar) {
                const data = {
                  id: socket.id,
                  text: message,
                  avatar: player[0].avatar,
                  author: player[0].name,
                };
                io.to(key).emit('new_message', data);
              } else {
                console.log(player[0].name, player[0].avatar);
              }
            }
          }
        });

        setInterval(() => {
          const keys = ROOMS.keys();
          const data = [];
          for (let i = 0; i < ROOMS.size; i++) {
            const key = keys.next().value;
            if (ROOMS.get(key).players.length !== ROOMS.get(key).size &&
      ROOMS.get(key).status === 'public') {
              data.push(ROOMS.get(key));
              data[data.length-1].key = key;
            }
          }
          refreshList(data);
        }, 1000);

        socket.on('disconnecting', () => {
          console.log(`Connection ${socket.id} canceled.`);
          eraseRooms();
        });

        socket.on('erase_rooms', () => {
          eraseRooms();
        });

        socket.on('create_room', (room, cb) => {
          if (ROOMS.size < 100) {
            let key = makeKey(6);
            while (ROOMS.has(key)) {
              key = makeKey(6);
            }
            room.key = key;
            room.players[0].id = socket.id;
            room.players[0].score = 0;
            room.kicked = [];
            ROOMS.set(key, room);
            cb(ROOMS.get(key));
            socket.join(key);
          } else {
            cb(false);
          }
        });

        socket.on('request_room', (req, cb) => {
          const key = req.key;
          const user = req.user;

          console.log(`Room ${key} was requested by ${user.name}.`);
          if (ROOMS.has(key)) {
            const data = ROOMS.get(key);
            if (data.players.length < data.size) {
              user.id = socket.id;
              pos = data.players.map( function(e) {
                return e.id;
              }).indexOf(socket.id);
              if (pos < 0) {
                if (data.kicked.indexOf(socket.id) == -1) {
                  user.score = 0;
                  data.players.push(user);
                  ROOMS.set(key, data);
                  socket.join(key);
                  cb(data);
                  socket.to(key).emit('new_player', user);
                } else {
                  cb('Вы были исключены из этой комнаты');
                }
              } else {
                cb(`Вы уже нвходитесь в дааной комнате`);
              }
            } else {
              cb(`Комната ${data.name} уже заполнена`);
            }
          } else {
            cb(`Комната ${key} не найдина`);
          }
        });

        socket.on('get_room_info', (key, cb) => {
        // eslint-disable-next-line prefer-const
          let room = ROOMS.get(key);
          if (room) {
            room.key = key;
            console.log(room);
            cb(room);
          } else {
            cb();
          }
        });

        socket.on('change_status', (key, cb) => {
          console.log(`${socket.id} wants to change status of ${key}`);
          const room = ROOMS.get(key);
          if (room) {
            const host = room.players[0];
            if (host.id == socket.id) {
              if (room.status == 'public') {
                room.status = 'private';
              } else {
                room.status = 'public';
              }
              ROOMS.set(key, room);
              io.to(key).emit('change_status', room.status);
              cb(true);
            } else {
              cb(false);
            }
          }
        });


        socket.on('kick', (id, name, key, cb) => {
          console.log(name, 'was kicked from', key);
          io.to(key).emit('kick', {id, name});
          const room = ROOMS.get(key);
          if (room) {
            room.players = room.players.filter(function(el) {
              return el.id != id;
            });
            room.kicked.push(id);
            if (room.players.length > 0) {
              ROOMS.set(key, room);
              io.to(key).emit('update_players', ROOMS.get(key).players);
              cb(true);
              return;
            } else {
              ROOMS.delete(key);
            }
          }
          cb(false);
        });

        /**
         * Updates the list of public rooms
         * @param {Array} data
         */
        function refreshList(data) {
          io.emit('update_rooms', data);
        }

        /**
         * Erases rooms from user
         */
        function eraseRooms() {
          const key = Object.keys(socket.rooms)[1];
          const room = ROOMS.get(key);
          if (room) {
            room.players = room.players.filter(function(el) {
              return el.id != socket.id;
            });
            if (room.players.length > 0) {
              ROOMS.set(key, room);
              io.to(key).emit('update_players', ROOMS.get(key).players);
            } else {
              ROOMS.delete(key);
            }
          }
        }
      });

      /**
       * Make unique secret key for a new room
       * @param {number} length length of secret key
       * @return {String} Secret key
       */
      function makeKey(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }

      const PORT = 5000;
      server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    });
  } catch (e) {
    console.error(e);
  }
}
main().catch(console.error);
