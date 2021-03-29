import React from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './App.css';
import RemoteStream from './Components/RemoteStream';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
class App4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localStreamInitiated: false,
      remoteStreams: {},
      localVideo: true,
      localAudio: true,
      videoPublished: false,
      audioPublished: false
    }
    this.channel = "demo_channel_name";
    this.localVideoView = React.createRef();
    this.videoTrack = null
    this.audioTrack = null;
    this.RTCClient = null;
    this.appId = "b8f5d7b5efcc4ba8992ac09d46a591b1";
    // this.token = "00635b75337d2e044a7970dd15999dfaddbIADbdGxS/b9P6f9x9KsoEw+2gAsWMNtHGOctZzYICsuoi9+pr8cAAAAAEAC5X9YGpIRdYAEAAQCjhF1g";
    this.rtm = {
      params: {
      }
    }
  }
  componentDidMount() {
    this.initLocalStream();
    this.onDeviceChange();
    this.initClient();
  }
  initLocalStream = async () => {
    try {
      [this.audioTrack, this.videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      this.videoTrack.setOptimizationMode("motion");
      this.videoTrack.play(this.localVideoView.current);
    } catch (error) {
      alert("please check the permission for audio/camera")
      console.log("Weeoe", error)
    }
  }
  onDeviceChange = () => {
    AgoraRTC.onMicrophoneChanged = this.onPlaybackDeviceChange;
    AgoraRTC.onCameraChanged = this.onPlaybackDeviceChange;
  }
  onCameraChanged = (info) => {
    console.log("camera changed!", info.state, info.device);
  }
  onPlaybackDeviceChange = (info) => {
    try {
      let newAudioDevice = await AgoraRTC.createMicrophoneAudioTrack();
    } catch (error) {
    }
  }
  onMicrophoneChanged = async (info) => {
    console.log("microphone changed!", info.state, info.device);
    try {
      let newAudioDevice = await AgoraRTC.createMicrophoneAudioTrack();
      if (this.state.videoPublished) {
        await this.RTCClient.unpublish(this.audioTrack);
        await this.RTCClient.publish(newAudioDevice);
        this.audioTrack = newAudioDevice;
      }
      // })
    } catch (error) {
      console.log("Error on get device,", error);
    }
  }
  publishTrack = async (track) => {
    this.RTCClient.publish(track).then(res => {
      if (track.trackMediaType === 'audio') {
        this.setState({ audioPublished: true })
      } else if (track.trackMediaType === 'video') {
        this.setState({ videoPublished: true })
      }
    }).catch(error => {
      console.log("Failed to published track :" + track.trackMediaType, track.trackMediaType, error);
    })
  }
  initClient = () => {
    this.RTCClient = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8'
    })
    this.subscribeEvents();
  }
  subscribeEvents = () => {
    this.RTCClient.on('user-published', this.userPublished);
    this.RTCClient.on('user-unpublished', this.userUnPublished);
    this.RTCClient.on('user-left', this.userLeft);
    this.RTCClient.on('user-joined', this.userJoined);
  }
  userLeft = (user, reason) => {
    console.log("userLeft Reason", reason);
    let remoteStreams = { ...this.state.remoteStreams };
    delete remoteStreams[user.uid];
    this.setState({ remoteStreams });
  }
  userJoined = (user) => {
    let remoteStreams = { ...this.state.remoteStreams };
    remoteStreams[user.uid] = {
      uid: user.uid,
      videoState: false,
      audioState: false
    };
    this.setState({
      remoteStreams
    })
  }
  userPublished = async (user, mediaType) => {
    await this.RTCClient.subscribe(user, mediaType);
    await this.RTCClient.setRemoteVideoStreamType(user.uid, 0)
    await this.RTCClient.setStreamFallbackOption(user.uid, 2)
    let remoteStreams = { ...this.state.remoteStreams };
    let uid = user.uid;
    if (mediaType === "video") {
      user.videoTrack.play(uid + "");
      remoteStreams[uid].videoState = true;
    }
    else if (mediaType === "audio") {
      user.audioTrack.play();
      remoteStreams[uid].audioState = true;
    }
    this.setState({ remoteStreams });
  }
  userUnPublished = async (user, mediaType) => {
    await this.RTCClient.unsubscribe(user, mediaType);
    let uid = user.uid;
    let remoteStreams = { ...this.state.remoteStreams };
    if (remoteStreams[uid]) {
      if (mediaType === "video") {
        remoteStreams[uid].videoState = false;
      }
      else if (mediaType === "audio") {
        remoteStreams[uid].audioState = false;
      }
      this.setState({ remoteStreams });
    }
  }
  joinChannel = () => {
    if (this.RTCClient !== null) {
      this.RTCClient.join(this.appId, this.channel, null, null).then(uid => {
        this.rtm.params.uid = uid;
        this.RTCClient.enableDualStream().then(() => {
          console.log("Enable Dual stream success!");
        }).catch(err => {
          console.log(err);
        })
        if (this.videoTrack._enabled) {
          this.publishTrack(this.videoTrack);
        }
        if (this.audioTrack._enabled) {
          this.publishTrack(this.audioTrack);
        }
      }).catch(error => {
        console.log("failed to join channel ", error);
      })
    }
  }
  toggleTrack = async (track) => {
    if (track === 'video') {
      if (this.state.localVideo) {
        await this.videoTrack.setEnabled(false);
      } else {
        await this.videoTrack.setEnabled(true);
        if (!this.state.videoPublished) {
          this.publishTrack(this.videoTrack);
        }
      }
      this.setState({ localVideo: !this.state.localVideo })
    } else {
      if (this.state.localAudio) {
        await this.audioTrack.setEnabled(false);
      } else {
        await this.audioTrack.setEnabled(true);
        if (!this.state.audioPublished) {
          this.publishTrack(this.audioTrack);
        }
      }
      this.setState({ localAudio: !this.state.localAudio });
    }
  }
  muteVideoL = (stream) => {
    console.log("WWWWWW", stream);
    stream.muteVideo();
  }
  UnmuteVideoL = (stream) => {
    console.log("LLLLLL", stream);
    stream.unmuteVideo();
  }
  render() {
    const { remoteStreams, remoteStreamControls } = this.state;
    console.log("remoteStreams=>>>", remoteStreams)
    return (
      <div className="App">
        <div className="localStreamContainer">
          <div id="localView" ref={this.localVideoView}></div>
          <div className="controls">
            <div className="controlIcon" onClick={() => this.toggleTrack("video")}>{this.state.localVideo ? <VideocamIcon fontSize="large" /> : <VideocamOffIcon fontSize="large" />}</div>
            <div className="controlIcon" onClick={() => this.toggleTrack("audio")}>{this.state.localAudio ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}</div>
          </div>
          <button className="join" onClick={this.joinChannel}>Join</button>
        </div>
        <div className="remoteStreamContainer">
          {Object.keys(remoteStreams).map((item, index) => <RemoteStream key={item} stream={remoteStreams[item]} id={item} />)}
        </div>
      </div>
    );
  }
}
export default App4;