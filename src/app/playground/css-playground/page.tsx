'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/playground/ToolLayout';
import CopyButton from '@/components/playground/CopyButton';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/playground/localStorage';
import type { CSSPlaygroundState } from '@/lib/playground/types';

const DEFAULT_STATE: CSSPlaygroundState = {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    boxShadow: {
        x: 0,
        y: 4,
        blur: 10,
        spread: 0,
        color: '#000000',
    },
    backgroundColor: '#667eea',
    textColor: '#ffffff',
    width: 300,
    height: 200,
};

export default function CSSPlaygroundPage() {
    const [state, setState] = useState<CSSPlaygroundState>(() =>
        loadFromStorage(STORAGE_KEYS.CSS_PLAYGROUND, DEFAULT_STATE)
    );

    // Save to localStorage
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.CSS_PLAYGROUND, state);
    }, [state]);

    const generateCSS = () => {
        return `.preview-box {
  width: ${state.width}px;
  height: ${state.height}px;
  padding: ${state.padding}px;
  margin: ${state.margin}px;
  border-radius: ${state.borderRadius}px;
  box-shadow: ${state.boxShadow.x}px ${state.boxShadow.y}px ${state.boxShadow.blur}px ${state.boxShadow.spread}px ${state.boxShadow.color};
  background-color: ${state.backgroundColor};
  color: ${state.textColor};
}`;
    };

    const handleReset = () => {
        setState(DEFAULT_STATE);
    };

    const previewStyle: React.CSSProperties = {
        width: `${state.width}px`,
        height: `${state.height}px`,
        padding: `${state.padding}px`,
        margin: `${state.margin}px`,
        borderRadius: `${state.borderRadius}px`,
        boxShadow: `${state.boxShadow.x}px ${state.boxShadow.y}px ${state.boxShadow.blur}px ${state.boxShadow.spread}px ${state.boxShadow.color}`,
        backgroundColor: state.backgroundColor,
        color: state.textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '18px',
    };

    return (
        <ToolLayout
            title="CSS Playground"
            description="Experiment with CSS properties using visual sliders"
        >
            <div className="space-y-4">
                {/* Controls */}
                <div className="card p-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                        Adjust Properties
                    </h3>
                    <div className="flex items-center gap-2">
                        <button onClick={handleReset} className="btn-secondary">
                            Reset
                        </button>
                        <CopyButton text={generateCSS()} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Controls Panel */}
                    <div className="card p-6 space-y-6">
                        {/* Dimensions */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                Dimensions
                            </h4>

                            <SliderControl
                                label="Width"
                                value={state.width}
                                onChange={(width) => setState((prev) => ({ ...prev, width }))}
                                min={100}
                                max={600}
                                unit="px"
                            />

                            <SliderControl
                                label="Height"
                                value={state.height}
                                onChange={(height) => setState((prev) => ({ ...prev, height }))}
                                min={100}
                                max={400}
                                unit="px"
                            />
                        </div>

                        {/* Spacing */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                Spacing
                            </h4>

                            <SliderControl
                                label="Padding"
                                value={state.padding}
                                onChange={(padding) => setState((prev) => ({ ...prev, padding }))}
                                min={0}
                                max={100}
                                unit="px"
                            />

                            <SliderControl
                                label="Margin"
                                value={state.margin}
                                onChange={(margin) => setState((prev) => ({ ...prev, margin }))}
                                min={0}
                                max={100}
                                unit="px"
                            />

                            <SliderControl
                                label="Border Radius"
                                value={state.borderRadius}
                                onChange={(borderRadius) => setState((prev) => ({ ...prev, borderRadius }))}
                                min={0}
                                max={50}
                                unit="px"
                            />
                        </div>

                        {/* Box Shadow */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                Box Shadow
                            </h4>

                            <SliderControl
                                label="Offset X"
                                value={state.boxShadow.x}
                                onChange={(x) => setState((prev) => ({ ...prev, boxShadow: { ...prev.boxShadow, x } }))}
                                min={-50}
                                max={50}
                                unit="px"
                            />

                            <SliderControl
                                label="Offset Y"
                                value={state.boxShadow.y}
                                onChange={(y) => setState((prev) => ({ ...prev, boxShadow: { ...prev.boxShadow, y } }))}
                                min={-50}
                                max={50}
                                unit="px"
                            />

                            <SliderControl
                                label="Blur"
                                value={state.boxShadow.blur}
                                onChange={(blur) => setState((prev) => ({ ...prev, boxShadow: { ...prev.boxShadow, blur } }))}
                                min={0}
                                max={50}
                                unit="px"
                            />

                            <SliderControl
                                label="Spread"
                                value={state.boxShadow.spread}
                                onChange={(spread) => setState((prev) => ({ ...prev, boxShadow: { ...prev.boxShadow, spread } }))}
                                min={-20}
                                max={20}
                                unit="px"
                            />

                            <ColorControl
                                label="Shadow Color"
                                value={state.boxShadow.color}
                                onChange={(color) => setState((prev) => ({ ...prev, boxShadow: { ...prev.boxShadow, color } }))}
                            />
                        </div>

                        {/* Colors */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                Colors
                            </h4>

                            <ColorControl
                                label="Background"
                                value={state.backgroundColor}
                                onChange={(backgroundColor) => setState((prev) => ({ ...prev, backgroundColor }))}
                            />

                            <ColorControl
                                label="Text Color"
                                value={state.textColor}
                                onChange={(textColor) => setState((prev) => ({ ...prev, textColor }))}
                            />
                        </div>
                    </div>

                    {/* Preview and Code */}
                    <div className="space-y-4">
                        {/* Preview */}
                        <div className="card p-6">
                            <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                                Live Preview
                            </h4>
                            <div className="flex items-center justify-center min-h-[300px] bg-light-elevated dark:bg-dark-elevated rounded-lg p-8">
                                <div style={previewStyle}>
                                    Preview Box
                                </div>
                            </div>
                        </div>

                        {/* Generated CSS */}
                        <div className="card p-6 space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                                    Generated CSS
                                </h4>
                                <CopyButton text={generateCSS()} className="!text-xs !py-1" />
                            </div>
                            <pre className="p-4 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg overflow-auto text-light-text-primary dark:text-dark-text-primary font-mono text-sm max-h-[300px]">
                                {generateCSS()}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

// Slider Control Component
interface SliderControlProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    unit: string;
}

function SliderControl({ label, value, onChange, min, max, unit }: SliderControlProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {label}
                </label>
                <span className="text-sm font-mono text-light-text-primary dark:text-dark-text-primary">
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-light-elevated dark:bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-light-accent-primary dark:accent-dark-accent-primary"
            />
        </div>
    );
}

// Color Control Component
interface ColorControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

function ColorControl({ label, value, onChange }: ColorControlProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-light-border dark:border-dark-border"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg text-sm font-mono text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                />
            </div>
        </div>
    );
}
