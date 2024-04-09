import { Layer, Line, Stage } from "react-konva";
import React from "react";

class HandDrawnImage {
    static HandDrawnImage(
        setIsDrawing,
        setLines,
        lines,
        isDrawing,
        stageRef,
        setCurrentDisplayedPicture,
        saveDataIntoDatabase
    ) {
        const handleMouseDown = () => {
            setIsDrawing(true);
            setLines([...lines, []]);
        };

        const handleMouseMove = (event) => {
            if (!isDrawing) return;

            const stage = stageRef.current;
            const point = stage.getPointerPosition();

            setLines((prevLines) => {
                const lastLine = [...prevLines.slice(-1)[0], point.x, point.y];
                return [...prevLines.slice(0, -1), lastLine];
            });
        };

        const handleMouseUp = () => {
            setIsDrawing(false);
        };

        const handleClearClick = () => {
            setLines([]);
            setCurrentDisplayedPicture(null);
        };

        return (
            <div>
                <Stage
                    width={window.innerWidth}
                    height={500}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    ref={stageRef}
                >
                    <Layer>
                        {lines.map((line, i) => (
                            <Line
                                key={i}
                                points={line}
                                stroke="black"
                                strokeWidth={2}
                                tension={0.5}
                                lineCap="round"
                            />
                        ))}
                    </Layer>
                </Stage>
                <button className="btn btn-primary"
                        onClick={saveDataIntoDatabase}
                >
                    Save Drawing
                </button>
                <button className="btn btn-primary"
                        onClick={handleClearClick}
                >
                    Clear Drawing
                </button>
            </div>
        );
    }
}

export default HandDrawnImage;
