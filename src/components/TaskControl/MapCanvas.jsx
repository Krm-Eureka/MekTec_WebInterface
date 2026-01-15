import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Line, Group, Rect, Text, Circle } from 'react-konva';
import useImage from 'use-image';
import { MAP_CONFIG } from '../../config/mapConfig';
import { useMapControls } from '../../hooks/useMapControls';
import MapLegend from '../Map/MapLegend';
import ActiveTasksPanel from '../Map/ActiveTasksPanel';

const MapCanvas = ({ floorId, locations, tasks, selectedSource, onAddTask, width, height, isMockMode, isMobileMode }) => {
    const [image] = useImage(`/src/assets/Floor${floorId}.png`);
    const [dragStartNode, setDragStartNode] = useState(null);
    const [dragCurrentPos, setDragCurrentPos] = useState(null);
    const [snapNode, setSnapNode] = useState(null);
    const [tooltip, setTooltip] = useState(null);

    const stageRef = useRef(null);

    // Use map controls hook
    const { scale, position, setPosition, handleWheel, handleTouchMove, handleTouchEnd } = useMapControls(isMobileMode);

    const mapToScreen = (apiX, apiY) => {
        if (!image) return { x: 0, y: 0 };
        const x = (apiX * MAP_CONFIG.MULTIPLIER) + MAP_CONFIG.ORIGIN_OFFSET_X;
        const y = image.height - (apiY * MAP_CONFIG.MULTIPLIER) - MAP_CONFIG.ORIGIN_OFFSET_Y;
        return { x, y };
    };

    const getRelativePointerPosition = (stage) => {
        const transform = stage.getAbsoluteTransform().copy().invert();
        const pos = stage.getPointerPosition();
        return transform.point(pos);
    };

    const handleNodeMouseDown = (e, node) => {
        console.log('⬇️ MouseDown on:', node.name);
        e.cancelBubble = true;
        setDragStartNode(node);
        const pos = getRelativePointerPosition(stageRef.current);
        setDragCurrentPos(pos);
    };

    const handleMouseMove = (e) => {
        if (!dragStartNode) return;
        const stage = stageRef.current;
        const pointerPos = stage.getPointerPosition();
        const pos = getRelativePointerPosition(stage);
        setDragCurrentPos(pos);

        // Auto-pan at edges
        const EDGE_BUFFER = 50;
        const PAN_SPEED = 15;
        let dx = 0, dy = 0;
        if (pointerPos.x < EDGE_BUFFER) dx = PAN_SPEED;
        else if (pointerPos.x > width - EDGE_BUFFER) dx = -PAN_SPEED;
        if (pointerPos.y < EDGE_BUFFER) dy = PAN_SPEED;
        else if (pointerPos.y > height - EDGE_BUFFER) dy = -PAN_SPEED;

        if (dx !== 0 || dy !== 0) {
            setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        }

        // Find snap target
        let closestNode = null;
        let minDistance = MAP_CONFIG.SNAP_DISTANCE * (1 / scale);
        locations.forEach(node => {
            const screenPos = mapToScreen(node.apiX, node.apiY);
            if (node.id === dragStartNode.id) return;
            const dist = Math.sqrt(Math.pow(pos.x - screenPos.x, 2) + Math.pow(pos.y - screenPos.y, 2));
            if (dist < minDistance) {
                minDistance = dist;
                closestNode = { ...node, ...screenPos };
            }
        });
        setSnapNode(closestNode);
    };

    const handleMouseUp = (e) => {
        console.log('🖱️ MouseUp', { hasDragStart: !!dragStartNode, hasSnap: !!snapNode });

        if (dragStartNode && snapNode) {
            console.log('✅ Completing drag from', dragStartNode.name, 'to', snapNode.name);
            onAddTask(dragStartNode, snapNode);
        }

        setDragStartNode(null);
        setDragCurrentPos(null);
        setSnapNode(null);
    };

    return (
        <div className="canvas-container">
            <Stage
                width={width}
                height={height}
                ref={stageRef}
                draggable={!dragStartNode && !isMobileMode}
                scaleX={scale}
                scaleY={scale}
                x={position.x}
                y={position.y}
                onWheel={(e) => handleWheel(e, stageRef)}
                onTouchMove={(e) => handleTouchMove(e, stageRef)}
                onTouchEnd={handleTouchEnd}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onDragEnd={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
            >
                <Layer>
                    {/* Background Map Image */}
                    {image && <Image image={image} opacity={MAP_CONFIG.OPACITY} />}

                    {/* Drag Line Preview */}
                    {dragStartNode && dragCurrentPos && (
                        <Line
                            points={[
                                mapToScreen(dragStartNode.apiX, dragStartNode.apiY).x,
                                mapToScreen(dragStartNode.apiX, dragStartNode.apiY).y,
                                snapNode ? snapNode.x : dragCurrentPos.x,
                                snapNode ? snapNode.y : dragCurrentPos.y
                            ]}
                            stroke={snapNode ? MAP_CONFIG.COLORS.ACTIVE_STATION : "#ffffff"}
                            strokeWidth={2 / scale}
                            dash={[5 / scale, 5 / scale]}
                        />
                    )}

                    {/* Location Nodes */}
                    {locations.map((node) => {
                        const { x, y } = mapToScreen(node.apiX, node.apiY);
                        const isActive = snapNode?.id === node.id;
                        const isPinned = selectedSource?.id === node.id;
                        const locWidthPx = (node.width || MAP_CONFIG.DEFAULT_LOC_SIZE) * MAP_CONFIG.MULTIPLIER;
                        const locLengthPx = (node.length || MAP_CONFIG.DEFAULT_LOC_SIZE) * MAP_CONFIG.MULTIPLIER;

                        return (
                            <Group
                                key={node.id}
                                x={x} y={y}
                                onTap={() => {
                                    console.log('👆 MapCanvas onTap fired for:', node.name);
                                    onAddTask(node, null);
                                }}
                                onClick={() => {
                                    console.log('👆 MapCanvas onClick fired for:', node.name);
                                    onAddTask(node, null);
                                }}
                                onMouseDown={isMobileMode ? undefined : (e) => handleNodeMouseDown(e, { ...node, x, y })}
                                onMouseEnter={() => {
                                    setTooltip({ x, y, data: node.raw });
                                    document.body.style.cursor = 'pointer';
                                }}
                                onMouseLeave={() => {
                                    setTooltip(null);
                                    document.body.style.cursor = 'default';
                                }}
                            >
                                {/* Selection Glow */}
                                {isPinned && (
                                    <Rect
                                        x={-locWidthPx / 2 - 5} y={-locLengthPx / 2 - 5}
                                        width={locWidthPx + 10} height={locLengthPx + 10}
                                        fill="transparent" stroke="#2ecc71" strokeWidth={3 / scale}
                                        shadowColor="#2ecc71" shadowBlur={15} cornerRadius={4}
                                    />
                                )}

                                {/* Location Base */}
                                <Rect
                                    x={-locWidthPx / 2}
                                    y={-locLengthPx / 2}
                                    width={locWidthPx}
                                    height={locLengthPx}
                                    fill={isActive ? "rgba(46, 204, 113, 0.4)" : (isPinned ? "rgba(46, 204, 113, 0.2)" : "rgba(0, 0, 0, 0.1)")}
                                    stroke={isActive || isPinned ? MAP_CONFIG.COLORS.ACTIVE_STATION : MAP_CONFIG.COLORS.EMPTY_STATION}
                                    strokeWidth={1 / scale}
                                    dash={[2 / scale, 2 / scale]}
                                    cornerRadius={2}
                                />

                                {/* Shelf Icon and Label */}
                                <Group>
                                    {node.hasShelf && (
                                        <Group
                                            rotation={node.containerOrientation || 0}
                                        >
                                            {/* Cart body - sized according to actual dimensions */}
                                            <Rect
                                                x={-(node.containerWidth * MAP_CONFIG.MULTIPLIER) / 2}
                                                y={-(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2}
                                                width={node.containerWidth * MAP_CONFIG.MULTIPLIER}
                                                height={node.containerLength * MAP_CONFIG.MULTIPLIER}
                                                fill={node.isBusy ? MAP_CONFIG.COLORS.SHELF_BUSY : MAP_CONFIG.COLORS.SHELF}
                                                stroke="#000000"
                                                strokeWidth={2}
                                                cornerRadius={3}
                                                shadowColor="black"
                                                shadowBlur={8}
                                                shadowOpacity={0.6}
                                            />

                                            {/* Cart wheels */}
                                            <Circle
                                                x={-(node.containerWidth * MAP_CONFIG.MULTIPLIER) / 2 + 8}
                                                y={-(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2 + 8}
                                                radius={4}
                                                fill="#ffffff"
                                                stroke="#000000"
                                                strokeWidth={1}
                                            />
                                            <Circle
                                                x={(node.containerWidth * MAP_CONFIG.MULTIPLIER) / 2 - 8}
                                                y={-(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2 + 8}
                                                radius={4}
                                                fill="#ffffff"
                                                stroke="#000000"
                                                strokeWidth={1}
                                            />
                                            <Circle
                                                x={-(node.containerWidth * MAP_CONFIG.MULTIPLIER) / 2 + 8}
                                                y={(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2 - 8}
                                                radius={4}
                                                fill="#ffffff"
                                                stroke="#000000"
                                                strokeWidth={1}
                                            />
                                            <Circle
                                                x={(node.containerWidth * MAP_CONFIG.MULTIPLIER) / 2 - 8}
                                                y={(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2 - 8}
                                                radius={4}
                                                fill="#ffffff"
                                                stroke="#000000"
                                                strokeWidth={1}
                                            />

                                            {/* Direction indicator (arrow) */}
                                            {/* <Line
                                                points={[
                                                    0,
                                                    -(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2,
                                                    -8,
                                                    -(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2 + 12,
                                                    8,
                                                    -(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2 + 12,
                                                    0,
                                                    -(node.containerLength * MAP_CONFIG.MULTIPLIER) / 2
                                                ]}
                                                stroke="#ffffff"
                                                strokeWidth={2.5}
                                                fill="#ffffff"
                                                closed={true}
                                            /> */}
                                        </Group>
                                    )}

                                    {/* Location label - fixed physical size (scales with map) */}
                                    <Group y={node.hasShelf ? (node.containerLength * MAP_CONFIG.MULTIPLIER) / 2 + 15 : 0}>
                                        <Rect x={-50} y={-7} width={100} height={14} fill={MAP_CONFIG.COLORS.LABEL_BG} cornerRadius={4} />
                                        <Text text={node.name} align="center" width={100} offsetX={50} y={-5} fill={MAP_CONFIG.COLORS.STATION_NAME} fontSize={10} fontStyle="bold" />
                                    </Group>
                                </Group>
                            </Group>
                        );
                    })}

                    {/* Tooltip */}
                    {tooltip && tooltip.data && (
                        <Group x={tooltip.x} y={tooltip.y} offset={{ y: 110 * (1 / scale), x: 90 * (1 / scale) }} scaleX={1 / scale} scaleY={1 / scale}>
                            <Rect width={180} height={100} fill="rgba(20, 25, 30, 0.95)" stroke={MAP_CONFIG.COLORS.STATION_NAME} strokeWidth={1} cornerRadius={4} shadowBlur={10} />
                            <Text x={10} y={10} text={`📍 ID: ${tooltip.data.locationCode || 'N/A'}`} fill={MAP_CONFIG.COLORS.STATION_NAME} fontSize={11} fontStyle="bold" />
                            <Text x={10} y={30} text={`Type: ${tooltip.data.locationType || 'N/A'}`} fill="#adbac7" fontSize={10} />
                            <Text x={10} y={50} text={`📦 Container: ${tooltip.data.occupyContainerCode || tooltip.data.containerCode || 'None'}`} fill={tooltip.data.occupyContainerCode || tooltip.data.containerCode ? (tooltip.data.isBusy ? MAP_CONFIG.COLORS.SHELF_BUSY : MAP_CONFIG.COLORS.SHELF) : "#adbac7"} fontSize={10} />
                            <Text x={10} y={70} text={`Status: ${tooltip.data.isBusy ? `BUSY (Task: ${tooltip.data.taskCode || '?'})` : 'Available'}`} fill={tooltip.data.isBusy ? MAP_CONFIG.COLORS.SHELF_BUSY : MAP_CONFIG.COLORS.ACTIVE_STATION} fontSize={10} />
                        </Group>
                    )}
                </Layer>
            </Stage>

            {/* Active Tasks Panel */}
            <ActiveTasksPanel tasks={tasks} locations={locations} floorId={floorId} />

            {/* Map Legend */}
            <MapLegend />
        </div>
    );
};

export default MapCanvas;
