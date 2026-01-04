import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/Layout';
import { Card, CardHeader, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Loader2, Share2, Copy } from 'lucide-react';
import { Tldraw, useEditor } from 'tldraw';
import { Peer } from 'peerjs';
import { useAuth } from '../../../shared/context/AuthContext';
import { useToast } from '../../../shared/context/ToastContext';

import 'tldraw/tldraw.css';

export const CollaborativeWhiteboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [peer, setPeer] = useState(null);
    const [conn, setConn] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [shareLink, setShareLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Disconnected');
    const [editor, setEditor] = useState(null);
    const isRemoteUpdate = React.useRef(false);

    // Initialize PeerJS
    useEffect(() => {
        const p = new Peer(undefined, {
      host: '0.peerjs.com',
      secure: true,
      port: 443,
    });
        setPeer(p);
        setStatus('Connecting to server...');
        
        p.on('open', (id) => {
            setStatus('Online');
            // If a roomId is provided via query, connect to it
            const params = new URLSearchParams(location.search);
            const target = params.get('room');
            if (target) {
                setStatus('Connecting to peer...');
                const connection = p.connect(target);
                setConn(connection);
                setRoomId(target);
                setShareLink(`${window.location.origin}${window.location.pathname}?room=${target}`);
            } else {
                // Host mode – generate link for others to join
                setRoomId(id);
                setShareLink(`${window.location.origin}${window.location.pathname}?room=${id}`);
            }
        });
        
        // Handle incoming connections (Host mode)
        p.on('connection', (connection) => {
            // DEBUG: console.log('Incoming connection:', connection);
            setConn(connection);
            setStatus('Peer Connected');
        });
        
        p.on('error', (err) => {
            // DEBUG: console.error('Peer error:', err);
            setStatus('Connection Error');
        });

    // Cleanup
        return () => {
            p?.destroy();
        };
    }, []);

    // Handle incoming data (snapshot updates)
    useEffect(() => {
        if (!conn) return;

        conn.on('open', () => {
            setStatus('Connected');
        });

        const handleData = (data) => {
            if (data.type === 'snapshot' && editor) {
                // Set flag to prevent echoing this update back
                isRemoteUpdate.current = true;
                try {
                    editor.store.loadSnapshot(data.payload);
                } finally {
                    // Reset flag after a short delay to ensure listeners have fired
                    // or immediately if synchronous. loadSnapshot is usually sync.
                    setTimeout(() => {
                        isRemoteUpdate.current = false;
                    }, 50);
                }
            }
        };

        const handleClose = () => {
            // DEBUG: console.log('Connection closed');
            setConn(null);
            setStatus('Peer Disconnected');
        };

        conn.on('data', handleData);
        conn.on('close', handleClose);
        
        return () => {
            conn.off('data', handleData);
            conn.off('close', handleClose);
        };
    }, [conn, editor]);

    // Broadcast local changes
    useEffect(() => {
        if (!editor) return;
        
        const unsubscribe = editor.store.listen((entry) => {
            // If this update came from a remote peer, do not broadcast it back
            if (isRemoteUpdate.current) return;

             // entry contains { changes: ... } but we are sending full snapshot
            if (conn && conn.open) {
                // Ideally we only send if the change originated locally.
                // Tldraw 2.x update listener:
                if (entry.source !== 'user') return; 

                const snapshot = editor.store.getSnapshot();
                conn.send({ type: 'snapshot', payload: snapshot });
            }
        });
        return () => unsubscribe();
    }, [editor, conn]);

    const copyLink = () => {
        navigator.clipboard.writeText(shareLink).then(() => showToast('Link copied to clipboard', 'success'));
    };

    // if (!user) {
    //     navigate('/auth');
    //     return null;
    // }

    return (
        <Layout>
            <div className="w-full max-w-[1920px] mx-auto px-2 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6 overflow-hidden">
                <Card className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px] border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="px-4 md:px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shrink-0">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div className="flex items-center gap-4 w-full lg:w-auto">
                                <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                                    <Share2 className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase italic">Canvas Studio</h2>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">
                                        {status.includes('Connected') ? 'Collaboration Active' : 'Private Workspace'}
                                    </p>
                                </div>
                                <div className={`lg:hidden px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 ${
                                    status.includes('Connected') || status === 'Online' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                                }`}>
                                    {status === 'Online' ? 'HOST' : status}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full lg:w-auto">
                                <div className={`hidden lg:block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                                    status.includes('Connected') || status === 'Online' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                                }`}>
                                    {status}
                                </div>
                                
                                <div className="flex flex-1 lg:flex-none items-center bg-slate-50 dark:bg-slate-900 rounded-2xl pl-4 pr-1 py-1 border border-slate-200 dark:border-slate-700 transition-all hover:border-indigo-500 min-w-0">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2 shrink-0">ROOM:</span>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={roomId} 
                                        className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 dark:text-slate-300 w-24 md:w-32 px-0 truncate"
                                    />
                                    <Button 
                                        variant="white" 
                                        size="sm" 
                                        onClick={copyLink} 
                                        disabled={loading} 
                                        className="h-8 md:h-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all px-3 md:px-4 shrink-0 font-bold"
                                    >
                                        <Copy className="w-3.5 h-3.5 md:mr-2" />
                                        <span className="hidden md:inline">COPY SHARE LINK</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="relative flex-1 p-0 overflow-hidden bg-white dark:bg-[#1a1a1a]">
                        <div className="absolute inset-0 z-0 tldraw-mobile-ready">
                             <Tldraw 
                                persistenceKey="collab-whiteboard-v2"
                                onMount={(editor) => setEditor(editor)}
                                inferDarkMode={true}
                                autoFocus={true}
                             />
                        </div>
                    </CardBody>
                </Card>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .tldraw-mobile-ready .tl-ui-layout {
                    --tl-margin: 8px;
                }
                @media (max-width: 768px) {
                    .tldraw-mobile-ready .tl-ui-layout {
                        --tl-margin: 4px;
                    }
                    .tldraw-mobile-ready [data-testid="main.menu"] {
                        display: none;
                    }
                }
            `}} />
        </Layout>
    );
};
