import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Copy, Check, Users, Video } from 'lucide-react';
import { VideoChat } from './VideoChat';

export function PeerLobby() {
    const [peerId, setPeerId] = useState('');
    const [remotePeerId, setRemotePeerId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const peerRef = useRef(null);
    const callRef = useRef(null);

    useEffect(() => {
        const peer = new Peer();

        peer.on('open', (id) => {
            setPeerId(id);
        });

        peer.on('call', (call) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setLocalStream(stream);
                    call.answer(stream); // Answer the call with an A/V stream.
                    call.on('stream', (remoteStream) => {
                        setRemoteStream(remoteStream);
                        setIsConnected(true);
                    });
                    callRef.current = call;
                })
                .catch((err) => {
                    // DEBUG: console.error('Failed to get local stream', err);
                });
        });

        peerRef.current = peer;

        return () => {
            if (callRef.current) callRef.current.close();
            if (peerRef.current) peerRef.current.destroy();
            if (localStream) localStream.getTracks().forEach(track => track.stop());
        };
    }, []);

    const connectToPeer = () => {
        if (!remotePeerId) return;

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);
                const call = peerRef.current.call(remotePeerId, stream);

                call.on('stream', (remoteStream) => {
                    setRemoteStream(remoteStream);
                    setIsConnected(true);
                });

                callRef.current = call;
            })
            .catch((err) => {
                // DEBUG: console.error('Failed to get local stream', err);
            });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(peerId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsVideoOff(!isVideoOff);
        }
    };

    if (isConnected) {
        return (
            <VideoChat
                localStream={localStream}
                remoteStream={remoteStream}
                isMuted={isMuted}
                toggleMute={toggleMute}
                isVideoOff={isVideoOff}
                toggleVideo={toggleVideo}
            />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-slate-50 dark:bg-transparent">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-8 border border-transparent dark:border-slate-700">
                <div className="flex justify-center">
                    <div className="bg-indigo-100 p-4 rounded-full">
                        <Users className="w-12 h-12 text-indigo-600" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Peer Interview</h2>
                    <p className="text-slate-500 dark:text-slate-400">Connect with a partner for a mock interview.</p>
                </div>

                <div className="space-y-6">
                    {/* Your ID Section */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Your Room ID
                        </label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-700 dark:text-slate-200 break-all">
                                {peerId || 'Generating...'}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
                                title="Copy ID"
                            >
                                {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">OR</span>
                        </div>
                    </div>

                    {/* Join Section */}
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter Partner's Room ID"
                            value={remotePeerId}
                            onChange={(e) => setRemotePeerId(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                        <button
                            onClick={connectToPeer}
                            disabled={!remotePeerId || !peerId}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Video size={20} />
                            Join Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
