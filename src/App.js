import React, { useEffect, useRef, useState } from 'react';
import classes from './styles';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SHAPE_PROPS } from './constants';
import { isMouseOnShape, drawCircle, drawRect, redrawAll } from './utils';

function App() {
  const [shapes, setShape] = useState([]);

  const canvas = useRef(null);
  const slider = useRef(null);
  const widthSlider = useRef(null);
  const heightSlider = useRef(null);
  const colorPicker = useRef(null);

  let context, domRect;

  const attr = {
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
  }

  const updatedShapes = [...shapes];
  const selectedShapes = shapes.filter(s => s.isSelected);

  useEffect(() => {
    canvas.current.width = CANVAS_WIDTH;
    canvas.current.height = CANVAS_HEIGHT;
  }, []);

  useEffect(() => {
    context = canvas.current.getContext('2d');
    domRect = canvas.current.getBoundingClientRect();

    attr.offsetX = domRect.left;
    attr.offsetY = domRect.top;

    canvas.current.addEventListener('mousedown', handleMouseDown);
    canvas.current.addEventListener('mousemove', handleMouseHover);

    if (selectedShapes.length > 0) {
      if (slider.current) slider.current.addEventListener('change', handleChangeProperty);
      if (widthSlider.current) widthSlider.current.addEventListener('change', handleChangeProperty);
      if (heightSlider.current) heightSlider.current.addEventListener('change', handleChangeProperty);
      if (colorPicker.current) colorPicker.current.addEventListener('input', handleChangeProperty);
    }

    return () => {
      canvas.current.removeEventListener('mousedown', handleMouseDown);
      canvas.current.removeEventListener('mousemove', handleMouseHover);
    }
  });

  const handleMouseDown = (e) => {
    canvas.current.addEventListener('mousemove', handleMouseDrag);
    canvas.current.addEventListener('mouseup', handleMouseUp);

    attr.startX = e.clientX - attr.offsetX;
    attr.startY = e.clientY - attr.offsetY;

    for (let i = 0; i < shapes.length; i++) {
      // If more than one shape is selected, return early and allow 
      // all the selected shapes be draggable via `handleMouseDrag`
      if (selectedShapes.length > 1) return;

      const shape = shapes[i];

      if (isMouseOnShape(attr.startX, attr.startY, shape)) {
        updatedShapes[i].isHovered = false;
        updatedShapes[i].isSelected = shape.isSelected ? false : true;

        setShape(updatedShapes);
        redrawAll(updatedShapes, context);
      } else {
        updatedShapes[i].isSelected = e.shiftKey ? true : false;

        setShape(updatedShapes);
        redrawAll(updatedShapes, context);
      }
    }
  };

  const handleMouseDrag = (e) => {
    const mouseX = e.clientX - attr.offsetX;
    const mouseY = e.clientY - attr.offsetY;
    const dx = mouseX - attr.startX;
    const dy = mouseY - attr.startY;

    updatedShapes.filter(s => s.isSelected).map(({ index }) => {
      updatedShapes[index].x += dx;
      updatedShapes[index].y += dy;
  
      setShape(updatedShapes);
    });

    redrawAll(updatedShapes, context);

    attr.startX = mouseX;
    attr.startY = mouseY;
  };

  const handleMouseUp = (e) => {
    canvas.current.removeEventListener('mousemove', handleMouseDrag);
    canvas.current.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseHover = (e) => {
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      attr.startX = e.clientX - attr.offsetX;
      attr.startY = e.clientY - attr.offsetY;

      if (isMouseOnShape(attr.startX, attr.startY, shape)) {
        updatedShapes[i].isHovered = true;

        setShape(updatedShapes);
        redrawAll(shapes, context);
        return;
      } else {
        updatedShapes[i].isHovered = false;
        
        setShape(updatedShapes);
        redrawAll(shapes, context);
      }
    }
  }

  const handleDrawCircle = () => {
    setShape([...shapes, { ...SHAPE_PROPS.circle, index: shapes.length, type: 'circle' }]);
    drawCircle(context, SHAPE_PROPS.circle);
  }

  const handleDrawRect = () => {
    setShape([...shapes, { ...SHAPE_PROPS.rect, index: shapes.length, type: 'rect' }]);
    drawRect(context, SHAPE_PROPS.rect);
  }

  const handleDeleteShape = (index) => {
    const s = updatedShapes.filter(s => s.index !== index);

    setShape(s);
    redrawAll(s, context);
  }

  const handleChangeProperty = e => {
    updatedShapes.filter(s => s.isSelected).map(({ index }) => {
      if (e.target.id === 'radius') updatedShapes[index].radius = e.target.value;
      if (e.target.id === 'width') updatedShapes[index].width = e.target.value;
      if (e.target.id === 'height') updatedShapes[index].height = e.target.value;
      if (e.target.id === 'circle-color') updatedShapes[index].circleColor = e.target.value;
      if (e.target.id === 'rect-color') updatedShapes[index].rectColor = e.target.value;

      setShape(updatedShapes);
      redrawAll(updatedShapes, context);
    });
  }

  return (
    <div css={classes.appContainer} id="container">
      <div css={classes.leftButtons}>
        <button type="button" css={classes.button} onClick={handleDrawCircle}>Add Circle</button>
        <button type="button" css={classes.button} onClick={handleDrawRect}>Add Rectangle</button>
      </div>
      
      <canvas id="canvas" ref={canvas} css={classes.canvas}></canvas>

      <div css={classes.toolContainer}>
        {selectedShapes.map(s => (
          <div css={classes.editor} key={`${s.type}-${s.index}`}>
            <div css={classes.shapePropsHead}>
              <button type="button" css={classes.delete} onClick={() => handleDeleteShape(s.index)}>🗑️</button>
              {s.type === 'circle' && (<span>Circle</span>)}
              {s.type === 'rect' && (<span>Rectangle</span>)}
            </div>
            <div>
              <span css={classes.label}>center-x</span>
              <span>{s.x}</span>
            </div>
            <div>
              <span css={classes.label}>center-y</span>
              <span>{s.y}</span>
            </div>
            {s.type === 'circle' && (
              <div>
                <div css={classes.input}>
                  <label htmlFor='radius' css={classes.label}>radius</label>
                  <input ref={slider} id="radius" type="range" min="0" max="200" defaultValue={s.radius} />
                </div>
                <div css={classes.input}>
                  <label htmlFor="circle-color" css={classes.label}>color</label>
                  <input ref={colorPicker} type="color" id="circle-color" />
                </div>
              </div>
            )}
            {s.type === 'rect' && (
              <div>
                <div css={classes.sliders}>
                  <div css={classes.input}>
                    <label htmlFor='width' css={classes.label}>width</label>
                    <input ref={widthSlider} id="width" type="range" min="0" max="500" defaultValue={s.width} />
                  </div>
                  <div css={classes.input}>
                    <label htmlFor='height' css={classes.label}>height</label>
                    <input ref={heightSlider} id="height" type="range" min="0" max="500" defaultValue={s.height} />
                  </div>
                </div>
                <div css={classes.input}>
                  <label htmlFor="rect-color" css={classes.label}>color</label>
                  <input ref={colorPicker} type="color" id="rect-color" />
                </div>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
