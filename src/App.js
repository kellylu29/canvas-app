import React, { useEffect, useRef, useState } from 'react';
import classes from './styles';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SHAPE_PROPS } from './constants';
import { isMouseOnShape, drawCircle, drawRect, redrawAll } from './utils';

function App() {
  const [shapes, setShape] = useState([]);

  const canvas = useRef(null);

  let context, domRect;

  const attr = {
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
  }

  // create a new array to mutate on the containing objects otherwise
  // react does not see changes to nested properties of objects in an array
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

    // If more than one shape is selected while a shape is being clicked,
    // return early and allow all the selected shapes be draggable via `handleMouseDrag`
    if (selectedShapes.length > 1) {
      // find the shape the mouse is clicking, if it's not clicking a shape then
      // move onto the loop below
      const onShape = shapes.find(s => isMouseOnShape(attr.startX, attr.startY, s));

      if (onShape && onShape.isSelected) return;
    }

    if (e.shiftKey) {
      selectedShapes.map(s => {
        updatedShapes[s.index].isSelected = true;
      });
    }

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];

      if (isMouseOnShape(attr.startX, attr.startY, shape)) {
        updatedShapes[i].isHovered = false;
        updatedShapes[i].isSelected = shape.isSelected ? false : true;

        setShape(updatedShapes);
        redrawAll(updatedShapes, context);
      } else {
        if (!e.shiftKey) {
          updatedShapes[i].isSelected = false;
  
          setShape(updatedShapes);
          redrawAll(updatedShapes, context);
        }
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
    });

    setShape(updatedShapes);
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

  const handleChangeProperty = (e, i, prop) => {
    updatedShapes.filter(s => s.isSelected).map(({ index }) => {
      if (i === index) updatedShapes[index][prop] = e.target.value;
    });
    setShape(updatedShapes);
    redrawAll(updatedShapes, context);
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
                  <label htmlFor={`radius-${s.index}`} css={classes.label}>radius</label>
                  <input id={`radius-${s.index}`} type="range" min="0" max="200" defaultValue={s.radius} onChange={(e) => handleChangeProperty(e, s.index, 'radius')}/>
                </div>
                {selectedShapes.m}
                <div css={classes.input}>
                  <label htmlFor={`circle-color-${s.index}`} css={classes.label}>color</label>
                  <input type="color" id={`circle-color-${s.index}`} onInput={(e) => handleChangeProperty(e, s.index, 'circleColor')} />
                </div>
              </div>
            )}
            {s.type === 'rect' && (
              <div>
                <div css={classes.sliders}>
                  <div css={classes.input}>
                    <label htmlFor={`width-${s.index}`} css={classes.label}>width</label>
                    <input id={`width-${s.index}`} type="range" min="0" max="500" defaultValue={s.width} onChange={(e) => handleChangeProperty(e, s.index, 'width')} />
                  </div>
                  <div css={classes.input}>
                    <label htmlFor={`height-${s.index}`} css={classes.label}>height</label>
                    <input id={`height-${s.index}`} type="range" min="0" max="500" defaultValue={s.height} onChange={(e) => handleChangeProperty(e, s.index, 'height')} />
                  </div>
                </div>
                <div css={classes.input}>
                  <label htmlFor={`rect-color-${s.index}`} css={classes.label}>color</label>
                  <input type="color" id={`rect-color-${s.index}`} onInput={(e) => handleChangeProperty(e, s.index, 'rectColor')} />
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
