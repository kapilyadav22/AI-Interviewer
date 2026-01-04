import React, { useState, useEffect } from 'react';
import { Layout } from '../../../shared/components/Layout';
import { Card, CardHeader, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Save, Volume2, Play } from 'lucide-react';
import { useToast } from '../../../shared/context/ToastContext';

export function Settings() {
    const { showToast } = useToast();
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [testText] = useState("Hello! This is how I will sound during your interview.");

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            
            // Load saved settings
            const savedVoiceURI = localStorage.getItem('speech_voice_uri');
            const savedRate = localStorage.getItem('speech_rate');
            const savedPitch = localStorage.getItem('speech_pitch');

            if (savedVoiceURI) setSelectedVoice(savedVoiceURI);
            if (savedRate) setRate(parseFloat(savedRate));
            if (savedPitch) setPitch(parseFloat(savedPitch));
        };

        loadVoices();
        
        // Chrome loads voices asynchronously
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const handleSave = () => {
        localStorage.setItem('speech_voice_uri', selectedVoice);
        localStorage.setItem('speech_rate', rate);
        localStorage.setItem('speech_pitch', pitch);
        showToast('Settings saved successfully!', 'success');
    };

    const handleTest = () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(testText);
        
        const voice = voices.find(v => v.voiceURI === selectedVoice);
        if (voice) utterance.voice = voice;
        
        utterance.rate = rate;
        utterance.pitch = pitch;
        
        window.speechSynthesis.speak(utterance);
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Volume2 size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">AI Voice Settings</h1>
                </div>

                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-slate-900">Voice Customization</h2>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        {/* Voice Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Voice</label>
                            <select
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Default System Voice</option>
                                {voices.map((voice) => (
                                    <option key={voice.voiceURI} value={voice.voiceURI}>
                                        {voice.name} ({voice.lang})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rate Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium text-slate-700">Speed (Rate)</label>
                                <span className="text-sm text-slate-500">{rate}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Pitch Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium text-slate-700">Pitch</label>
                                <span className="text-sm text-slate-500">{pitch}</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={pitch}
                                onChange={(e) => setPitch(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Test Area */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex gap-4">
                                <Button onClick={handleTest} variant="secondary" className="flex-1">
                                    <Play className="w-4 h-4 mr-2" />
                                    Test Voice
                                </Button>
                                <Button onClick={handleSave} className="flex-1">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Settings
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </Layout>
    );
}
