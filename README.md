# Spider Stream by Web-Crawlers

## Team Members

Krutik Shah - Student Number: 1006213526  
Kourosh Jaberi - Student Number: 1005947362

## Description and Scope Focus

We plan on building a web application which will allow users to stream what they are doing on their computer to other users, who can join streams as viewers. Additionally, Streamers will receive notifications when new users join their stream and begin watching. Viewers will be able to send emoji reactions that other viewers and the streamer can view. The scope of this assignment will mainly be focused on the backend, implementing the pushdown notifications, emoji reactions, and peer-to-peer connections. The frontend will also require a great deal of work to display the stream, allow users to join streams, and show emoji reactions. We plan on using Angular for the frontend, and SQLite with Express and Peer.js for the backend. The emoji reactions will be handled by socket.io, the join notifications will be handled by Push API, and we will use Peer.js and screen capture for the actual streaming.

## Complexity Points to Achieve

3pts: Implementation of Pushdown notifications for when new users join a stream.  
1pt: The use of Peer.js, which we will use for streaming.  
1pt: For the use of screen capture API.  
2pts: The use of socket.io, which we will use for initializing the peer connection and emoji reactions.

##Bonus Attempt

1pt: Implement auth0 into application  
?pt: Implement a chat for viewers to communicate with the streamer and one another  
2pt: Stream donation system that will use Stripe

## Schedule

| Version       | Goals Achieved                                        | Complexity Points                |
| ------------- | ----------------------------------------------------- | -------------------------------- |
| Alpha Version | Basic streaming application (with completed frontend) | Peer.js and screen capture: 2pts |
| Beta Version  | Incorporate push notifications into application       | Pushdown notifications: 3pts     |
| Final Version | Implement emoji reactions                             | socket.io: 2pts                  |

```

```
