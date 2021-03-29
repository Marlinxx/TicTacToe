import React, { Component } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng"

import './agoraRTC.scss';

class AgoraRTCIntegration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            volumeLevel: 0,
            message: null,
            networkQuality: 0,
            isVideoEnabled: true,
            isAudioEnabled: true
        }
        this.audioTrack = null;
        this.videoTrack = null;
        this.client = null
    }


    componentDidMount() {
        this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        let token = '0064a051e53c6ee48429044a9ace1a64d22IAAlNBJIwIXUk0FwNeV5PcZgz++SekuXoe1ERZsF2NTkyo4kO3kAAAAAEAC5X9YGsPZeYAEAAQCw9l5g'
        let app_id = '4a051e53c6ee48429044a9ace1a64d22'
        // let app_id = 'dd1bdd5406a642fea84499861dcef2e3'
        this.client.join(app_id, 'demo_channel_name', token, null).then(uid => {
            console.log('uid', uid);
        })

        AgoraRTC.getDevices()
        .then(async devices => {
          const audioDevices = devices.filter(function(device){
              return device.kind === "audioinput";
          });
          const videoDevices = devices.filter(function(device){
              return device.kind === "videoinput";
          });
        //   console.clear();
        //   console.log('audio devices', audioDevices);
        //   console.log('video devices', videoDevices);

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
            console.log(microphoneId)
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
            console.log('published successfully', res);
        })
    }

    render() {
        const {volumeLevel, message, networkQuality, isAudioEnabled, isVideoEnabled} = this.state;
        return(
            <div className='container'>
                <div className='leftSection'>
                    <div className='localstreamContainer' id='localstreamContainer' >
                        <div className='controlsOverlay'>
                            <button className={isAudioEnabled ? 'activeButton' : 'disabledButton'} onClick={() => this.audioClickHandler()}>
                                Audio
                            </button>
                            <button className={isVideoEnabled ? 'activeButton' : 'disabledButton'} onClick={() => this.videoClickHandler()}>
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