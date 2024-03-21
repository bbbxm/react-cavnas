import { useRef, useState, useEffect } from "react";

function createElement(x1, y1, x2, y2) {
  return { x1, y1, x2, y2 };
}

const Canvas = (props) => {
  const ref = useRef();
  const rows = 10;
  const cols = 10;
  const seatSize = 40;
  const seatGap = 10;

  const [seatStatus, setSeatStatus] = useState(
    new Array(rows).fill(null).map(() => new Array(cols).fill(false))
  );

  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    draw(context);
  }, [seatStatus]);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    elements.forEach((element) => drawElement(context, element));
  }, [elements]);

  const draw = (context) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (seatGap + seatSize);
        const y = row * (seatGap + seatSize);
        context.fillStyle = seatStatus[row][col] ? "#f00" : "#ccc";
        context.fillRect(x, y, seatSize, seatSize);
      }
    }
  };

  const drawElement = (ctx, element) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    const { x1, y1, x2, y2 } = element;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x1, y1);
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
  };

  const handleClick = (event) => {
    const canvas = ref.current;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const col = Math.floor(x / (seatGap + seatSize));
    const row = Math.floor(y / (seatGap + seatSize));

    console.log("col row :>>", col, row);

    updateSeat(row, col);
  };

  const updateSeat = (row, col) => {
    const newSeatStatus = [...seatStatus];
    newSeatStatus[row][col] = !newSeatStatus[row][col];
    setSeatStatus(newSeatStatus);
  };

  const handleMouseDown = (event) => {
    setDrawing(true);

    const { clientX, clientY } = event;

    const element = createElement(clientX, clientY, clientX, clientY);

    setElements((prev) => [...prev, element]);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const { clientX, clientY } = event;

    const index = elements.length - 1;

    const { x1, y1 } = elements[index];
    const updateElement = createElement(x1, y1, clientX, clientY);

    const elementsCopy = [...elements];
    elementsCopy[index] = updateElement;
    setElements(elementsCopy);
    // const canvas = ref.current;
    // const rect = canvas.getBoundingClientRect();
    // const scaleX = canvas.width / rect.width;
    // const scaleY = canvas.height / rect.height;

    // const startX = (x1 - rect.left) * scaleX;
    // const startY = (y1 - rect.top) * scaleY;
    // const endX = (event.clientX - rect.left) * scaleX;
    // const endY = (event.clientY - rect.top) * scaleY;

    // const startCol = Math.floor(startX / (seatGap + seatSize));
    // const startRow = Math.floor(startY / (seatGap + seatSize));
    // const endCol = Math.floor(endX / (seatGap + seatSize));
    // const endRow = Math.floor(endY / (seatGap + seatSize));

    // for (let row = startRow; row < endRow; row++) {
    //   for (let col = startCol; col < endCol; col++) {
    //     updateSeat(row, col);
    //   }
    // }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <canvas
      onClick={handleClick}
      // onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
      ref={ref}
      {...props}
    />
  );
};

export default Canvas;
