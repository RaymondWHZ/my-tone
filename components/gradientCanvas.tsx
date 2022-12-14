import React, { useRef, useEffect } from 'react'
import styles from "../styles/Home.module.css";

interface GradientCanvasProps {
  colorPoints: number[][]
  saveCanvas: boolean
}

export const GradientCanvas: React.FC<GradientCanvasProps> = ({ colorPoints, saveCanvas }) => {
  
  const canvasRef = useRef<any>(null)
  
  const draw = (ctx: any) => {
    var grd = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    // grd.addColorStop(0, "black");
    // grd.addColorStop("0.3", "magenta");
    // grd.addColorStop("0.5", "blue");
    // grd.addColorStop("0.6", "green");
    // grd.addColorStop("0.8", "yellow");
    // grd.addColorStop(1, "red");

    var colorStopWidth = 1.0 / (colorPoints.length - 1)
    console.log(colorPoints)
    console.log(colorStopWidth)
    colorPoints.forEach((p, i) => {
      grd.addColorStop(colorStopWidth * i, `rgb(${p[0]}, ${p[1]}, ${p[2]})`)
    });

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    //Our draw come here
    draw(context)
  }, [draw])

  const save = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a');
    link.download = 'Gradient.png';
    link.href = canvas.toDataURL('image/png')
    link.click();
  }

  useEffect(() => {
    if (saveCanvas) {
      save()
    }
  }, [saveCanvas])
  
  return <canvas ref={canvasRef} className={styles.gradient}/>
}
