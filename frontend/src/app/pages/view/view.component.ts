import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements AfterViewInit {
  socket: Socket;
  ROOM_ID: string | null;
  myPeer;
  peerId: string = '';
  peers: { [id: string]: any } = {};
  videoGrid;
  endpoint = environment.apiEndpoint;
  isWatching: boolean = false;
  msgForm: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.ROOM_ID = this.route.snapshot.paramMap.get('id');
    this.videoGrid = document.getElementById('video-grid');
    this.socket = io(this.endpoint);
    this.socket.on('user-disconnected', (userId) => {
      if (this.peers[userId]) this.peers[userId].close();
    });
    this.myPeer = new Peer();
    this.myPeer.on('open', (id) => {
      // socket.emit('join-room', ROOM_ID, id)
      this.peerId = id;
      // console.log(id);
    });
    this.msgForm = this.fb.group({
      msg: '',
    });
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

  joinStream() {
    this.isWatching = true;
    this.socket.emit('join-room', this.ROOM_ID, this.peerId);
    this.videoGrid = document.getElementById('video-grid');
    this.myPeer.on('call', (call) => {
      call.answer();
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        this.addVideoStream(video, userVideoStream);
      });
    });

    this.socket.on('user-connected', (peerId) => {
      this.connectToNewUser(peerId, null);
    });
  }

  sendMessage() {
    this.socket.emit('msg', this.msgForm.value.msg);
    this.msgForm.reset();
  }

  ngAfterViewInit(): void {
    // this.joinStream();
  }
}
