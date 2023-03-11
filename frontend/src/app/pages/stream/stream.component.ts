import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { ApiService } from '../../services/api.service';
import Peer from 'peerjs';
import { environment } from '../../../environments/environment';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit {
  socket: Socket;
  ROOM_ID: string | null;
  myPeer;
  peerId: string = '';
  peers: { [id: string]: any } = {};
  videoGrid;
  endpoint = environment.apiEndpoint;
  isStreamer: boolean = false;
  isStreaming: boolean = false;
  isAuth: boolean = false;
  username: string = '';
  userId: number = 0;
  synth: SpeechSynthesis = window.speechSynthesis;
  message: SpeechSynthesisUtterance = new SpeechSynthesisUtterance('null');

  constructor(private route: ActivatedRoute, private api: ApiService,
    private swPush: SwPush) {
    this.ROOM_ID = this.route.snapshot.paramMap.get('id');

    this.videoGrid = document.getElementById('video-grid');
    this.socket = io(this.endpoint);
    this.socket.on('user-disconnected', (userId) => {
      if (this.peers[userId]) this.peers[userId].close();
    });
    this.socket.on('user-msg', (msg: string) => {
      this.playMessage(msg);
    });
    this.myPeer = new Peer();
    this.myPeer.on('open', (id) => {
      // socket.emit('join-room', ROOM_ID, id)
      this.peerId = id;
      // console.log(id);
    });
  }

  playMessage(msg: string) {
    const utterance = new SpeechSynthesisUtterance(msg);
    this.synth.cancel();
    this.synth.speak(utterance);
  }

  connectToNewUser(peerId: string, stream: any) {
    const call = this.myPeer.call(peerId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      this.addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    });

    this.peers[peerId] = call;
  }

  addVideoStream(video: any, stream: any) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    if (this.videoGrid) this.videoGrid.append(video);
  }

  startStream() {
    this.isStreaming = true;
    this.socket.emit('join-room', this.ROOM_ID, this.peerId);
    this.videoGrid = document.getElementById('video-grid');
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const video = document.createElement('video');
        this.addVideoStream(video, stream);

        this.myPeer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            this.addVideoStream(video, userVideoStream);
          });
          call.on('close', () => {
            video.remove();
          });
        });

        this.socket.on('user-connected', (peerId) => {
          this.connectToNewUser(peerId, stream);
        });
      });
  }

  checkAuth() {
    this.api.me().subscribe({
      next: (res) => {
        if (res.userId) {
          this.isAuth = true;
          this.username = res.username;
          this.userId = res.userId;
          if (this.username === this.ROOM_ID) this.isStreamer = true;
          else this.isStreamer = false;
        } else this.isAuth = false;
      },
      error: (err) => {},
    });
  }

  ngOnInit() {
    this.checkAuth();
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: environment.publicKey
    })
    .then(sub => console.log(sub))
    .catch(err => console.error("Could not subscribe", err));
  }
}
