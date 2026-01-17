import { PeerLobby } from '../components/PeerLobby';
import { Header } from '../../../shared/components/Header';

export function P2PInterview() {
    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <Header />
            <main className="flex-1 relative w-full">
                <div className="absolute inset-0 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 h-full w-full overflow-hidden relative">
                        <PeerLobby />
                    </div>
                </div>
            </main>
        </div>
    );
}
