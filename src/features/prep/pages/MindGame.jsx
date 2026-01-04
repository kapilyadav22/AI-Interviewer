import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../../shared/components/Layout';
import { Button } from '../../../shared/components/Button';
import { 
    Zap, RefreshCw, Trophy, AlertTriangle, 
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight 
} from 'lucide-react';

const TECH_LEVELS = {
    2: { name: 'Git', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
    4: { name: 'HTML', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    8: { name: 'CSS', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
    16: { name: 'JS', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' },
    32: { name: 'React', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
    64: { name: 'Node', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
    128: { name: 'Python', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    256: { name: 'Java', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' },
    512: { name: 'Docker', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
    1024: { name: 'K8s', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
    2048: { name: 'GOAT', color: 'bg-slate-900 dark:bg-black text-white border-slate-700 shadow-xl ring-4 ring-primary-500' },
};

export const MindGame = () => {
    const [grid, setGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWin, setGameWin] = useState(false);

    // Initialize/Reset Game
    const initGame = useCallback(() => {
        let newGrid = Array(4).fill().map(() => Array(4).fill(0));
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
        setGameWin(false);
    }, []);

    const addRandomTile = (currentGrid) => {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            currentGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const slide = (row) => {
        let arr = row.filter(val => val !== 0);
        let missing = 4 - arr.length;
        let zeros = Array(missing).fill(0);
        return arr.concat(zeros);
    };

    const combine = (row, currentScore) => {
        let newScore = currentScore;
        for (let i = 0; i < 3; i++) {
            if (row[i] !== 0 && row[i] === row[i + 1]) {
                row[i] *= 2;
                row[i + 1] = 0;
                newScore += row[i];
                if (row[i] === 2048) setGameWin(true);
            }
        }
        return { row, newScore };
    };

    const moveLeft = (currentGrid) => {
        let newGrid = [];
        let newScore = score;
        let moved = false;
        
        for (let r = 0; r < 4; r++) {
            let row = currentGrid[r];
            let slided = slide(row);
            let combined = combine(slided, newScore);
            let res = slide(combined.row);
            newGrid.push(res);
            newScore = combined.newScore;
            if (JSON.stringify(row) !== JSON.stringify(res)) moved = true;
        }
        return { newGrid, newScore, moved };
    };

    const rotateGrid = (currentGrid) => {
        let newGrid = Array(4).fill().map(() => Array(4).fill(0));
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                newGrid[c][3 - r] = currentGrid[r][c];
            }
        }
        return newGrid;
    };

    const handleMove = (direction) => {
        if (gameOver || gameWin) return;

        let currentGrid = JSON.parse(JSON.stringify(grid));
        let rotatedCount = 0;

        switch (direction) {
            case 'left': rotatedCount = 0; break;
            case 'down': rotatedCount = 1; break;
            case 'right': rotatedCount = 2; break;
            case 'up': rotatedCount = 3; break;
            default: return;
        }

        for (let i = 0; i < rotatedCount; i++) currentGrid = rotateGrid(currentGrid);
        
        let { newGrid, newScore, moved } = moveLeft(currentGrid);
        
        for (let i = 0; i < (4 - rotatedCount) % 4; i++) newGrid = rotateGrid(newGrid);

        if (moved) {
            addRandomTile(newGrid);
            setGrid(newGrid);
            setScore(newScore);
            if (newScore > bestScore) setBestScore(newScore);
            
            // Check for game over
            if (!canMove(newGrid)) setGameOver(true);
        }
    };

    const canMove = (currentGrid) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 0) return true;
                if (r < 3 && currentGrid[r][c] === currentGrid[r + 1][c]) return true;
                if (c < 3 && currentGrid[r][c] === currentGrid[r][c + 1]) return true;
            }
        }
        return false;
    };

    useEffect(() => {
        initGame();
        const storedBest = localStorage.getItem('tech_2048_best');
        if (storedBest) setBestScore(parseInt(storedBest));
    }, [initGame]);

    useEffect(() => {
        localStorage.setItem('tech_2048_best', bestScore.toString());
    }, [bestScore]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                handleMove(e.key.replace('Arrow', '').toLowerCase());
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [grid, gameOver, gameWin]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col items-center min-h-[80vh]">
                <div className="text-center space-y-4 mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">2048: Tech Edition</h1>
                    <p className="text-slate-600 dark:text-slate-400">Merge technologies to reach the <span className="font-bold text-primary-600 dark:text-primary-400 uppercase">GOAT Architect</span> status.</p>
                </div>

                <div className="w-full max-w-md space-y-6">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Score</div>
                                <div className="text-xl font-black text-slate-800 dark:text-white">{score}</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Best</div>
                                <div className="text-xl font-black text-slate-800 dark:text-white">{bestScore}</div>
                            </div>
                        </div>
                        <Button variant="secondary" onClick={initGame} title="New Game">
                            <RefreshCw className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Game Grid Container */}
                    <div className="relative bg-slate-200 dark:bg-slate-700/50 p-3 rounded-2xl shadow-inner aspect-square w-full select-none overflow-hidden border-4 border-slate-300 dark:border-slate-600">
                        <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full w-full">
                            {/* Empty background cells */}
                            {Array(16).fill(0).map((_, i) => (
                                <div key={i} className="bg-slate-300/50 dark:bg-slate-600/50 rounded-lg shadow-inner" />
                            ))}
                        </div>

                        {/* Active Tiles */}
                        <div className="absolute inset-0 p-3 grid grid-cols-4 grid-rows-4 gap-3 h-full w-full">
                            {grid.map((row, r) => row.map((val, c) => (
                                val !== 0 && (
                                    <motion.div
                                        key={`${r}-${c}-${val}`}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        layout
                                        className={`w-full h-full rounded-lg border-2 flex flex-col items-center justify-center p-1 text-center shadow-sm ${TECH_LEVELS[val]?.color || 'bg-slate-800 text-white'}`}
                                    >
                                        <span className={`font-black tracking-tight leading-none ${val >= 1024 ? 'text-sm' : 'text-base'}`}>
                                            {TECH_LEVELS[val]?.name || val}
                                        </span>
                                        {val < 2048 && <span className="text-[10px] opacity-70 mt-0.5">{val}</span>}
                                    </motion.div>
                                )
                            )))}
                        </div>

                        {/* Game Over / Win Overlays */}
                        <AnimatePresence>
                            {(gameOver || gameWin) && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <motion.div 
                                        initial={{ scale: 0.9, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        {gameWin ? (
                                            <div className="space-y-4">
                                                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto text-white shadow-xl ring-4 ring-yellow-200">
                                                    <Trophy size={40} />
                                                </div>
                                                <h2 className="text-4xl font-black text-white italic">BRAVO!</h2>
                                                <p className="text-slate-300">You've reached the pinnacle of tech: <br/><span className="text-yellow-400 font-bold uppercase tracking-widest text-lg">GOAT Architect</span></p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl ring-4 ring-red-200">
                                                    <AlertTriangle size={40} />
                                                </div>
                                                <h2 className="text-4xl font-black text-white italic">STACK OVERFLOW</h2>
                                                <p className="text-slate-300">No more valid merges possible. Your architecture reached some limits.</p>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3">
                                            <Button size="lg" className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border-none font-bold" onClick={initGame}>
                                                Try Another Sprint
                                            </Button>
                                            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => window.history.back()}>
                                                Back to Code
                                            </Button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* How to play */}
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center space-y-4">
                        <div className="flex items-center justify-center gap-4">
                            <div className="grid grid-cols-3 gap-1">
                                <div /> <div className="p-1.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm text-slate-600 dark:text-slate-300"><ArrowUp size={12}/></div> <div />
                                <div className="p-1.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm text-slate-600 dark:text-slate-300"><ArrowLeft size={12}/></div>
                                <div className="p-1.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm text-slate-600 dark:text-slate-300"><ArrowDown size={12}/></div>
                                <div className="p-1.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm text-slate-600 dark:text-slate-300"><ArrowRight size={12}/></div>
                            </div>
                            <p className="text-left text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                                Use your <span className="font-bold">Arrow Keys</span> to move the tiles. When two tiles with the same tech merge, they <span className="font-bold">Evolve</span>!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .backface-hidden { backface-visibility: hidden; }
                .perspective-1000 { perspective: 1000px; }
            `}</style>
        </Layout>
    );
};
