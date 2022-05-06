import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

export const isMouseOnShape = (x, y, shape) => {
  if (shape.type === 'circle') {
    const dx = x - shape.x
    const dy = y - shape.y;

    return Math.sqrt(dx * dx + dy * dy) < shape.radius;
  }
  if (shape.type === 'rect') {
    const left = shape.x;
    const right = shape.x + shape.width;
    const top = shape.y;
    const bottom = shape.y + shape.height;

    return x > left && x < right && y > top && y < bottom;
  }

  return false;
}

export const drawCircle = (context, { x, y, radius, color }) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
}

export const drawRect = (context, { x, y, width, height, color }) => {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

export const redrawAll = (shapes, context) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    if (shape.type === 'circle') {
      context.beginPath();
      context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);

      if (shape.isHovered) {
        context.lineWidth = 12;
        context.strokeStyle = 'rgba(0, 145, 255, 0.3)';
        context.stroke();
      }

      if (shape.isSelected) {
        context.beginPath();
        context.arc(shape.x, shape.y, parseInt(shape.radius) + 8, 0, 2 * Math.PI);
        context.lineWidth = 3;
        context.strokeStyle = 'yellow';
        context.stroke();
        context.beginPath();
        context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      }

      context.fillStyle = shape.circleColor;
      context.fill();
    } else if (shape.type === 'rect') {
      if (shape.isHovered) {
        context.lineWidth = 12;
        context.strokeStyle = 'rgba(0, 145, 255, 0.3)';
        context.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }

      if (shape.isSelected) {
        context.lineWidth = 3;
        context.strokeStyle = 'yellow';
        context.strokeRect(parseInt(shape.x) - 6, parseInt(shape.y) - 6, parseInt(shape.width) + 12, parseInt(shape.height) + 12); 
      }

      context.fillStyle = shape.rectColor;
      context.fillRect(shape.x, shape.y, shape.width, shape.height);
    }
  }
}