/* eslint-disable prefer-const */
/* eslint-disable max-len */
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');

// const {Socket} = require('dgram');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const words1 = fs.readFileSync('./words/easy.words').toString().toLowerCase().split('\n');
const words2 = fs.readFileSync('./words/norm.words').toString().toLowerCase().split('\n');
const words3 = fs.readFileSync('./words/hard.words').toString().toLowerCase().split('\n');

const ROOMS = new Map([]);
let EMPTY_IMAGE = null;
let TIMER = null;

io.on('connection', (socket) => {
  console.log(`New connection`, socket.id);
  socket.emit('user_data', socket.id);
  refreshList();

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
            text: message.trim(),
            avatar: player[0].avatar,
            author: player[0].name,
          };
          io.to(key).emit('new_message', data);
          if (room.word) {
            if (message.trim().toLowerCase().localeCompare(room.word.trim()) == 0) {
              clearInterval(TIMER);
              TIMER = null;
              room.restTime = room.time;
              room.painter = socket.id;
              room.old_word = room.word.trim();
              room.word = '';
              room.image = EMPTY_IMAGE;
              io.to(key).emit('update_room', room);
              ROOMS.set(key, room);
              io.to(key).emit('end_round', {winner: socket.id, room: room});
              return;
            } else {
              console.log('not equal');
            }
          }
        } else {
        }
      }
    }
  });

  socket.on('disconnecting', () => {
    console.log(`Connection ${socket.id} canceled.`);
    eraseRooms();
  });

  socket.on('erase_rooms', () => {
    eraseRooms();
  });

  socket.on('create_room', (room, cb) => {
    if (!room.name) {
      cb(null);
      return;
    }
    if (ROOMS.size < 100) {
      let key = makeKey(6);
      while (ROOMS.has(key)) {
        key = makeKey(6);
      }
      // room.vocab = 0;
      room.key = key;
      room.painter = null;
      room.restTime = room.time;
      room.players[0].id = socket.id;
      room.kicked = [];
      room.word = '';
      room.old_word = '';
      EMPTY_IMAGE = room.image;
      ROOMS.set(key, room);
      cb(ROOMS.get(key));
      socket.join(key);
      refreshList();
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
            refreshList();
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
        refreshList();
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

  socket.on('change_vocab', (key, complexity) => {
    console.log('change_vocab to', complexity);
    let room = ROOMS.get(key);
    if (room) {
      room.vocab = complexity;
      ROOMS.set(key, room);
      refreshList();
      io.to(key).emit('change_complexity', complexity);
    }
  } );

  socket.on('start_game', (key, winner, cb) => {
    const room = ROOMS.get(key);
    if (room.players.length >= 2) {
      console.log('игроки на месте');
      // выбрать художника
      if (winner) {
        console.log(`Выиграл ${winner}`);
        room.painter = winner;
      } else {
        const painterID = Math.floor(Math.random() * Math.floor(room.players.length));
        room.painter = room.players[painterID].id;
      }

      // room.image = EMPTY_IMAGE;
      // io.to(key).emit('update_image', room.image.src);

      // Предоставить выбор слова
      let w1 = null; let w2 = null; let w3 = null;
      switch (room.vocab) {
        case '2':
          console.log('сложность 2');
          do {
            w1 = words3[Math.floor(Math.random() * Math.floor(words3.length))].toString().trim();
            w2 = words3[Math.floor(Math.random() * Math.floor(words3.length))].toString().trim();
            w3 = words3[Math.floor(Math.random() * Math.floor(words3.length))].toString().trim();
          } while (w1 == w2 || w2 == w3 || w1 == w3);
          break;
        case '1':
          console.log('сложность 1');
          do {
            w1 = words2[Math.floor(Math.random() * Math.floor(words2.length))].toString().trim();
            w2 = words2[Math.floor(Math.random() * Math.floor(words2.length))].toString().trim();
            w3 = words2[Math.floor(Math.random() * Math.floor(words2.length))].toString().trim();
          } while (w1 == w2 || w2 == w3 || w1 == w3);
          break;
        case '0':
          console.log('сложность 0');
        default:
          console.log('сложность хз - ', room.vocab);
          do {
            w1 = words1[Math.floor(Math.random() * Math.floor(words1.length))].toString().trim();
            w2 = words1[Math.floor(Math.random() * Math.floor(words1.length))].toString().trim();
            w3 = words1[Math.floor(Math.random() * Math.floor(words1.length))].toString().trim();
          } while (w1 == w2 || w2 == w3 || w1 == w3);
          break;
      }

      // Обновить данные
      room.image = EMPTY_IMAGE;
      io.to(key).emit('update_room', room);

      ROOMS.set(key, room);
      io.to(key).emit('init_game', {room: room, words: [w1, w2, w3]});

      // Обработка правильного ответа и передачи хода
      // Обработка окончания времени и передачи хода
    } else {
      const room = ROOMS.get(key);
      if (room) {
        room.painter = null;
        room.word = null;
        // room.old_word = null;
        ROOMS.set(key, room);
        io.to(key).emit('update_room', room);
        cb('Недостаточно игроков');
      }
    }
  });

  socket.on('choose_word', (word, key) => {
    if (!word) {
      return;
    }
    let room = ROOMS.get(key);
    if (room) {
      room.word = word.trim();
      room.image = EMPTY_IMAGE;
      ROOMS.set(key, room);
      io.to(key).emit('word_chosen', room);
      // Начать обраный отсчет
      clearInterval(TIMER);
      TIMER = null;
      TIMER = setInterval(() => {
        if (room.restTime <= 0) {
          clearInterval(TIMER);
          TIMER = null;
          room.restTime = room.time;
          if (room.word) {
            room.old_word = room.word.trim();
          }
          io.to(key).emit('end_round', {winner: null, room: room});
          room.word = '';
          ROOMS.set(key, room);
          return;
        } else if (TIMER) {
          room.restTime--;
          ROOMS.set(key, room);
          io.to(key).emit('update_timer', room.restTime);
        } else {
          return;
        }
      }, 1000);
    }
  });

  socket.on('draw', (image, key, cb) => {
    let room = ROOMS.get(key);
    if (room) {
      if (socket.id === room.painter) {
        room.image.src = image;
        ROOMS.set(key, room);
        io.to(key).emit('update_room', room);
        cb(0);
      } else {
        cb(1);
      }
    }
  });

  /**
   * Updates the list of public rooms
   * @param {Array} data
   */
  function refreshList() {
    const keys = ROOMS.keys();
    const data = [];
    for (let i = 0; i < ROOMS.size; i++) {
      const key = keys.next().value;
      if (ROOMS.get(key).players.length > 0) {
        if (ROOMS.get(key).players.length !== ROOMS.get(key).size &&
        ROOMS.get(key).status === 'public') {
          data.push(ROOMS.get(key));
          data[data.length-1].key = key;
        }
      } else {
        ROOMS.delete(key);
      }
    }
    io.emit('update_rooms', data);
  }

  /**
         * Erases rooms from user
         */
  function eraseRooms() {
    const key = Object.keys(socket.rooms)[1];
    let room = ROOMS.get(key);
    let isPainter = false;
    if (room) {
      isPainter = room.painter == socket.id;
      room.players = room.players.filter(function(el) {
        return el.id != socket.id;
      });
      if (room.players.length > 0) {
        ROOMS.set(key, room);
        io.to(key).emit('update_players', ROOMS.get(key).players);
      } else {
        ROOMS.delete(key);
      }

      room = ROOMS.get(key);
      if (room) {
        if (room.players.length < 2 || isPainter) {
          room.painter = null;
          room.word = null;
          clearInterval(TIMER);
          TIMER = null;
          room.restTime = room.time;
          room.image = EMPTY_IMAGE;
          ROOMS.set(key, room);
          io.to(key).emit('reset_game', {room, text: isPainter ? 'Художник вышел или был исключен' : 'Вы остались одни'});
        }
      }
      refreshList();
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
app.use('/', express.static('dist'));

const PORT = 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


