/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require('./Room');
const axios = require('axios');
const DJ_URI = 'https://icanhazdadjoke.com/'
const joke = "What do you call eight hobbits? A hob-byte!";

/** ChatUser is a individual connection from client -> server to chat. */

class ChatUser {
  /** make chat: store connection-device, rooom */

  constructor(send, roomName) {
    this._send = send; // "send" function for this user
    this.room = Room.get(roomName); // room user will be in
    this.name = null; // becomes the username of the visitor
    // this.joke = null;  //becomes a random joke from DAD JOKES API

    console.log(`created chat in ${this.room.name}`);
  }

  /** send msgs to this client using underlying connection-send-function */

  send(data) {
    try {
      this._s
      end(data);
    } catch {
      // If trying to send to a user fails, ignore it
    }
  }

  /** handle joining: add to room members, announce join */

  handleJoin(name) {
    this.name = name;
    this.room.join(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} joined "${this.room.name}".`
    });
  }

  /** handle a chat: broadcast to room. */

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: 'chat',
      text: text
    });
  }


  /** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   */

  handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);

    if (msg.type === 'join') this.handleJoin(msg.name);
    else if (msg.type === 'chat') this.handleChat(msg.text);
    // else if(msg.type ===  "get-joke") this.getJoke(DJ_URI);
    else if(msg.type ==="get-joke") this.printJoke(joke)
    else throw new Error(`bad message: ${msg.type}`);
  }



  /** get a random joke */
  // getJoke(URI){
  //   this.room.broadcast({
  //     name: this.name,
  //     type: 'get-joke',
  //     text:  async () => {
  //       try {
  //           const resp = await axios.get(`${URI}`, {
  //             headers:{Accept: 'application/json'}
  //           })
  //           console.log(resp.data);
  //       } catch (err) {
  //           // Handle Error Here
  //           console.error(err);
  //       }
  //       }
  //   })
  // };
  

  /* Print Joke */
  printJoke(joke) {
    this.room.broadcast({
      name: this.name,
      type: 'get-joke',
      text: joke
    });
  }


  /** Connection was closed: leave room, announce exit to others */

  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} left ${this.room.name}.`
    });
  }
}

module.exports = ChatUser;


