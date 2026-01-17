import { useState, useEffect, useRef, useCallback } from "react";
import { Peer } from "peerjs";
import { useLocation } from "react-router-dom";
import { getSnapshot, loadSnapshot } from "tldraw";

export function useCollaborativeBoard({ showToast }) {
  const location = useLocation();
  const [conn, setConn] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [status, setStatus] = useState("Initializing...");
  const [editor, setEditor] = useState(null);
  const isRemoteUpdate = useRef(false);
  const peerRef = useRef(null);

  // Initialize PeerJS
  useEffect(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }

    const peerConfig = {
      host: "0.peerjs.com",
      secure: true,
      port: 443,
      debug: 1,
    };

    const p = new Peer(undefined, peerConfig);
    peerRef.current = p;

    setStatus("Connecting to server...");

    p.on("open", (id) => {
      setStatus("Online");
      const params = new URLSearchParams(location.search);
      const target = params.get("room");

      if (target) {
        setRoomId(target);
        setShareLink(
          `${window.location.origin}${window.location.pathname}?room=${target}`,
        );

        if (target === id) {
          console.warn("Cannot connect to self");
          return;
        }

        setStatus("Connecting to Host...");
        connectToPeer(p, target);
      } else {
        setRoomId(id);
        setShareLink(
          `${window.location.origin}${window.location.pathname}?room=${id}`,
        );
      }
    });

    p.on("connection", (connection) => {
      setStatus("Peer Connected");
      setupConnection(connection);
    });

    p.on("error", (err) => {
      console.error("PeerJS Error:", err);
      setStatus("Error: " + err.type);
    });

    return () => {
      p.destroy();
      peerRef.current = null;
    };
  }, []);

  const connectToPeer = (peer, targetId) => {
    try {
      const connection = peer.connect(targetId);
      setupConnection(connection);
    } catch (e) {
      console.error("Connect Exception:", e);
      setStatus("Connection Failed");
    }
  };

  const setupConnection = (connection) => {
    connection.on("open", () => {
      setStatus("Connected");
      setConn(connection);
      connection.send({ type: "handshake" });
    });

    connection.on("close", () => {
      setStatus("Peer Disconnected");
      setConn(null);
    });
  };

  // Handle incoming data & Initial Sync
  useEffect(() => {
    if (!conn || !editor) return;

    const handleData = (data) => {
      // 1. Initial Sync Request
      if (data.type === "handshake") {
        try {
          const snapshot = getSnapshot(editor.store);
          conn.send({ type: "snapshot", payload: snapshot });
        } catch (e) {
          console.error("Failed to get snapshot", e);
        }
        return;
      }

      // 2. Snapshot Update
      if (data.type === "snapshot") {
        isRemoteUpdate.current = true;
        try {
          loadSnapshot(editor.store, data.payload);
        } catch (e) {
          console.error("Sync Error", e);
        } finally {
          setTimeout(() => {
            isRemoteUpdate.current = false;
          }, 50);
        }
      }
    };

    conn.on("data", handleData);

    return () => {
      conn.off("data", handleData);
    };
  }, [conn, editor]);

  // Broadcast changes
  useEffect(() => {
    if (!editor || !conn) return;

    const unsubscribe = editor.store.listen((entry) => {
      if (isRemoteUpdate.current) return;

      if (entry.source === "user") {
        if (conn.open) {
          const snapshot = getSnapshot(editor.store);
          conn.send({ type: "snapshot", payload: snapshot });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [editor, conn]);

  const copyLink = useCallback(() => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => showToast("Link copied to clipboard", "success"));
  }, [shareLink, showToast]);

  return {
    status,
    roomId,
    setEditor,
    copyLink,
  };
}
