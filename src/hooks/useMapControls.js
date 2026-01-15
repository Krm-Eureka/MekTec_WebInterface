import { useState, useRef } from 'react';

/**
 * Custom hook for handling map zoom, pan, and touch controls
 */
export const useMapControls = (isMobileMode) => {
    const [scale, setScale] = useState(0.8);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    
    const lastDist = useRef(0);
    const lastCenter = useRef(null);

    // Helper functions
    const getDistance = (p1, p2) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    const getCenter = (p1, p2) => {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
        };
    };

    // Mouse wheel zoom (desktop)
    const handleWheel = (e, stageRef) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;
        setScale(newScale);
        setPosition({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
    };

    // Touch handling (mobile)
    const handleTouchMove = (e, stageRef) => {
        e.evt.preventDefault();
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];
        const stage = stageRef.current;

        if (touch1 && touch2) {
            // Two fingers: Pinch zoom
            const p1 = { x: touch1.clientX, y: touch1.clientY };
            const p2 = { x: touch2.clientX, y: touch2.clientY };

            const newCenter = getCenter(p1, p2);
            const dist = getDistance(p1, p2);

            if (lastDist.current === 0) {
                lastDist.current = dist;
                lastCenter.current = newCenter;
                return;
            }

            const pointTo = {
                x: (newCenter.x - stage.x()) / scale,
                y: (newCenter.y - stage.y()) / scale,
            };

            const newScale = scale * (dist / lastDist.current);
            const clampedScale = Math.max(0.3, Math.min(3, newScale));

            setScale(clampedScale);
            setPosition({
                x: newCenter.x - pointTo.x * clampedScale,
                y: newCenter.y - pointTo.y * clampedScale,
            });

            lastDist.current = dist;
            lastCenter.current = newCenter;
        } else if (touch1 && isMobileMode) {
            // One finger: Pan
            const pos = { x: touch1.clientX, y: touch1.clientY };
            
            if (lastCenter.current) {
                const dx = pos.x - lastCenter.current.x;
                const dy = pos.y - lastCenter.current.y;
                
                setPosition(prev => ({
                    x: prev.x + dx,
                    y: prev.y + dy
                }));
            }
            
            lastCenter.current = pos;
        }
    };

    const handleTouchEnd = () => {
        lastDist.current = 0;
        lastCenter.current = null;
    };

    return {
        scale,
        position,
        setPosition,
        handleWheel,
        handleTouchMove,
        handleTouchEnd
    };
};
