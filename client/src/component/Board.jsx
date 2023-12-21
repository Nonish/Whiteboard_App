import { useRef, useEffect, useState } from 'react';
import useScreenSize from '../hooks/useScreenSize';
import { SOCKET } from '../services';

const Board = (props) => {
   // eslint-disable-next-line react/prop-types
   const { brushColor, brushSize } = props;
   const screenSize = useScreenSize()
   const canvasRef = useRef(null);
   const [socket, setSocket] = useState(null);

   useEffect(() => {
      setSocket(SOCKET);
   }, []);

   useEffect(() => {
      if (socket) { // Event listener for receiving canvas data from the socket
         socket.on('canvasImage', (data) => {// Create an image object from the data URL
            const image = new Image();
            image.src = data;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');// Draw the image onto the canvas

            image.onload = () => {
               ctx.drawImage(image, 0, 0);
            };
         });
      }
   }, [socket]);


   // Function to start drawing
   useEffect(() => {
      // Variables to store drawing state
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      const startDrawing = (e) => {
         isDrawing = true;
         console.log(`drawing started`, brushColor, brushSize);
         [lastX, lastY] = [e.offsetX, e.offsetY];
      };

      // Function to draw
      const draw = (e) => {
         if (!isDrawing) return;
         const canvas = canvasRef.current;
         const ctx = canvas.getContext('2d');

         if (ctx) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
         }
         [lastX, lastY] = [e.offsetX, e.offsetY];
      };

      // Function to end drawing
      const endDrawing = () => {
         const canvas = canvasRef.current;
         const dataURL = canvas.toDataURL(); // Get the data URL of the canvas content

         if (socket) {
            socket.emit('canvasImage', dataURL);// Send the dataURL or image data to the socket
            console.log('drawing ended');
         }
         isDrawing = false;
      };

      const canvas = canvasRef.current;
      const ctx = canvasRef.current?.getContext('2d');

      if (ctx) {// Set initial drawing styles
         ctx.strokeStyle = brushColor;
         ctx.lineWidth = brushSize;
         ctx.lineCap = 'round';
         ctx.lineJoin = 'round';
      }

      // Event listeners for drawing
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', endDrawing);
      canvas.addEventListener('mouseout', endDrawing);

      return () => {
         // Clean up event listeners when component unmounts
         canvas.removeEventListener('mousedown', startDrawing);
         canvas.removeEventListener('mousemove', draw);
         canvas.removeEventListener('mouseup', endDrawing);
         canvas.removeEventListener('mouseout', endDrawing);
      };
   }, [brushColor, brushSize, socket]);

   return (
      <canvas
         ref={canvasRef}
         width={screenSize[0] > 600 ? 600 : 300}
         height={screenSize[1] > 400 ? 400 : 200}
         style={{ backgroundColor: '#fff' }}
      />
   );
};

export default Board;
