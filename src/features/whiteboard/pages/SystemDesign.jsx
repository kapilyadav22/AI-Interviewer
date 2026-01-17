import { Whiteboard } from '../components/Whiteboard';
import { Header } from '../../../shared/components/Header';

export function SystemDesign() {
    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <Header />
            <main className="flex-1 relative w-full">
                <div className="absolute inset-0">
                    <div className="h-full w-full overflow-hidden relative">
                        <Whiteboard />
                    </div>
                </div>
            </main>
        </div>
    );
}
