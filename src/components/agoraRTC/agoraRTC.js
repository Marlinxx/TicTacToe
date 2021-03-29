import React, { Component } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from 'agora-rtm-sdk';

import './agoraRTC.scss';

const token = '0064a051e53c6ee48429044a9ace1a64d22IAAyRLGZV7ZSYqnTdnFxAJHj25Xsh76ofle2ESArUCLhdI4kO3kAAAAAEAC5X9YGrNpiYAEAAQCr2mJg'
const app_id = '4a051e53c6ee48429044a9ace1a64d22'
const RTM_app_id = 'dd1bdd5406a642fea84499861dcef2e3'
const randomUserName = `user${Math.round(Math.random()*10)}`;
class AgoraRTCIntegration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            volumeLevel: 0,
            message: null,
            networkQuality: 0,
            isVideoEnabled: true,
            isAudioEnabled: true,
            isTutorAudioControlEnabled: true,
            isTutorVideoControlEnabled: true
        }
        this.audioTrack = null;
        this.videoTrack = null;
        this.client = null
        this.RTMClient = null;
        this.RTMChannel = null
    }

    componentDidMount() {
       this.initRTC();
       this.initRTM();
    }

    initRTM() {
        this.RTMClient = AgoraRTM.createInstance(RTM_app_id);
        this.RTMChannel = this.RTMClient.createChannel('demo_channel_name');
        this.RTMChannel2 = this.RTMClient.createChannel('demo_channel_name2');
        this.RTMClient.on('ConnectionStateChanged', (newState, reason) => {
            console.warn('on connection state changed to ' + newState + ' reason: ' + reason);
          });

        this.RTMClient.login({ token: null, uid: randomUserName}).then(() => {
            console.warn('AgoraRTM client login success');
            this.RTMChannel.join().then(() => {
                console.warn(`AgoraRTM channel -demo_channel_name- join success with ${randomUserName}`);
            }).catch(err => {
                console.warn('AgoraRTM channel join failure', err);
            });
            this.RTMChannel2.join().then(() => {
                console.warn(`AgoraRTM channel -demo_channel_name2- join success with ${randomUserName}`);
            }).catch(err => {
                console.warn('AgoraRTM channel join failure', err);
            });
        }).catch(err => {
            console.warn('AgoraRTM client login failure', err);
        });

        this.RTMChannel.on('ChannelMessage', ({ text }, senderId) => {
            this.onIncomingMessage(text);
        });
    }

    initRTC() {
        this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        // let app_id = 'dd1bdd5406a642fea84499861dcef2e3'
        this.client.join(app_id, 'demo_channel_name', token, randomUserName).then(uid => {
            console.warn(`AgoraRTC channel -demo_channel_name- join success with ${uid}`);
        }).catch(err =>{
            alert(err)
        })

        // this.client.join(app_id, 'demo_channel_name2', token, randomUserName).then(uid => {
        //     console.warn(`AgoraRTC channel -demo_channel_name2- join success with ${uid}`);
        // }).catch(err =>{
        //     alert(err)
        // })

        AgoraRTC.getDevices()
        .then(async devices => {
          const audioDevices = devices.filter(function(device){
              return device.kind === "audioinput";
          });
          const videoDevices = devices.filter(function(device){
              return device.kind === "videoinput";
          });
        //   console.clear();
        //   console.warn('audio devices', audioDevices);
        //   console.warn('video devices', videoDevices);

          var selectedMicrophoneId = audioDevices[0].deviceId;
          var selectedCameraId = videoDevices[0].deviceId;
          this.createAVTracks(selectedMicrophoneId, selectedCameraId);
        })

        this.client.on('network-quality', stats => {
            this.setState({
                networkQuality: stats.uplinkNetworkQuality
            })
        })
        this.client.on("user-published", async (user, mediaType) => {
            // Initiate the subscription
            await this.client.subscribe(user, mediaType);
          
            // If the subscribed track is an audio track
            if (mediaType === "audio") {
              const audioTrack = user.audioTrack;
              // Play the audio
              audioTrack.play();
            } else {
              const videoTrack = user.videoTrack;
              // Play the video
              videoTrack.play("remoteStreamContainer", {
                  mirror: true
              });
            }
          });

        this.client.on('onMicrophoneChanged', (microphoneId) => {
            console.warn(microphoneId)
            // this.audioTrack = await AgoraRTC.createCustomAudioTrack()
        })
    }

    async createAVTracks(micId, cameraID) {
        try {
            this.videoTrack = await AgoraRTC.createCameraVideoTrack({ cameraId: cameraID })
            this.audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ microphoneId: micId })
            // this.screenTrack = await AgoraRTC.createScreenVideoTrack();
            this.videoTrack.play("localstreamContainer");
            // this.screenTrack.play("remoteStreamContainer")
              setInterval(() => {
                const level = this.audioTrack.getVolumeLevel();
                this.setState({
                    volumeLevel: level
                });
              }, 100);
        } 
        catch(err) {
            if(err.code === 'PERMISSION_DENIED') {
                this.setState({
                    message: 'Please allow camera and microphone access in the address bar'
                });
            }
        }
    }

    audioClickHandler() {
        this.audioTrack.setEnabled(!this.state.isAudioEnabled).then(res => {
            this.setState((currentState) => ({
                isAudioEnabled: !currentState.isAudioEnabled
            })
            )
        })
    }

    videoClickHandler () {
        this.videoTrack.setEnabled(!this.state.isVideoEnabled).then(res => {
            this.setState((currentState) => ({
                isVideoEnabled: !currentState.isVideoEnabled
            })
            );
        });
        
    }

    publishLocalTracks() {
        this.client.publish([this.audioTrack, this.videoTrack]).then(res => {
            console.warn('published successfully', res);
        })
    }

    muteClickHandler(track) {
        const msg = JSON.stringify({
            type:"remoteMute",
            track: track
        })
        this.RTMChannel.sendMessage({
            text: msg
        }).then(res => 
            console.warn('message sent successfully', msg)
        ).catch(err => 
            console.warn(err)
        )
    }

    onIncomingMessage(text) {
        const msg = JSON.parse(text);
        console.log(msg)
        if(msg.track === 'audio'){
            this.state.isAudioEnabled && this.audioClickHandler();
            this.setState((currentState) => ({
                isTutorAudioControlEnabled: !currentState.isTutorAudioControlEnabled
            }))
        } else {
            this.state.isVideoEnabled && this.videoClickHandler();
            this.setState((currentState) => ({
                isTutorVideoControlEnabled: !currentState.isTutorVideoControlEnabled
            }))
        }
    }

    render() {
        const {volumeLevel, message, networkQuality, isAudioEnabled, isVideoEnabled, isTutorAudioControlEnabled, isTutorVideoControlEnabled} = this.state;
        return(
            <div className='container'>
                <div className='leftSection'>
                    <div className='localstreamContainer' id='localstreamContainer' >
                        <div className='controlsOverlay'>
                            <button 
                            className={`${isAudioEnabled ? 'activeButton' : 'disabledButton'} ${!isTutorAudioControlEnabled? 'inactiveButton': null}`} 
                            onClick={() => this.audioClickHandler()}
                            disabled={!isTutorAudioControlEnabled}>
                                Audio
                            </button>
                            <button 
                            className={`${isVideoEnabled ? 'activeButton' : 'disabledButton'} ${!isTutorVideoControlEnabled? 'inactiveButton': null}`} 
                            onClick={() => this.videoClickHandler()}
                            disabled={!isTutorVideoControlEnabled}>
                                Video
                            </button>
                        </div>
                    </div>
                    <div>
                        <span>Audio volume:</span>
                        <input type='range' min='0' max='1' value={volumeLevel} step="0.01" readOnly /> 
                    </div>
                    { message &&
                        <div>
                            <span>{message}</span>
                        </div>
                    }
                    <span>Your network quality is {networkQuality}</span>
                    <button className={'activeButton'} onClick={() => this.publishLocalTracks()}>Publish</button>
                    <div>
                        <button onClick={() => this.muteClickHandler('audio')}>Mute all audio</button>
                        <button onClick={() => this.muteClickHandler('video')}>Mute all video</button>
                    </div>
                </div>

                <div className='leftSection'>
                    <div className='localstreamContainer' id='remoteStreamContainer' >
                    </div>
                </div>
            </div>
        )
    }
}

export default AgoraRTCIntegration;