import React, { useRef, useEffect } from 'react';
import './flappyBird.css';
import bgImage from './images/bg.png';
import fgImage from './images/fg.png';
import birdImage from './images/bird.png';
import pipeNorthImage from './images/pipeNorth.png';
import pipeSouthImage from './images/pipeSouth.png';
import jumpSound from './sounds/fly.mp3';
import scoreSound from './sounds/score.mp3';

// canvas width and height
const canvasWidth = 288;
const canvasHeight = 512;

// bird initial position
let birdX = 30;
let birdY = 150;

// bird fall speed
const gravity = 1;

// bird up speed
const jump = 30;

// distance between north south pipes
const gap = 120;

// create pipes
let pipes = [];
// first pipe
pipes.push({ x: canvasWidth, y: -100 });

// define score
let score = 0;

const FlappyBird = () => {
	const canvasRef = useRef(null);
	const bgRef = useRef(null);
	const fgRef = useRef(null);
	const birdRef = useRef(null);
	const pipeNorthRef = useRef(null);
	const pipeSouthRef = useRef(null);
	const jumpSoundRef = useRef(null);
	const scoreSoundRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		// get images
		const bg = bgRef.current;
		const pipeNorth = pipeNorthRef.current;
		const pipeSouth = pipeSouthRef.current;
		const fg = fgRef.current;
		const bird = birdRef.current;

		// get audios
		const jumpAudio = jumpSoundRef.current;
		const scoreAudio = scoreSoundRef.current;

		// click/key down, bird jump
		const moveUp = () => {
			jumpAudio.play();
			birdY -= jump;
		};
		document.addEventListener('click', moveUp);
		document.addEventListener('keydown', moveUp);

		const render = () => {
			context.drawImage(bg, 0, 0);

			for (let i = 0; i < pipes.length; i++) {
				context.drawImage(pipeNorth, pipes[i].x, pipes[i].y);
				context.drawImage(
					pipeSouth,
					pipes[i].x,
					pipes[i].y + pipeNorth.height + gap
				);
				// move each pipe to left
				pipes[i].x--;
				if (pipes[i].x === 100) {
					pipes.push({
						x: canvasWidth + 100,
						y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
					});
				}

				// detect collision
				if (
					(birdX + bird.width >= pipes[i].x &&
						birdX <= pipes[i].x + pipeNorth.width &&
						(birdY <= pipes[i].y + pipeNorth.height ||
							birdY + bird.height >= pipes[i].y + pipeNorth.height + gap)) ||
					birdY + bird.height >= canvasHeight - fg.height
				) {
					window.location.reload();
				}

				// score increment
				if (pipes[i].x === 0) {
					scoreAudio.play();
					score++;
				}
			}

			// delete disappeared pipe
			if (pipes[0].x + pipeNorth.width === 0) {
				pipes.shift();
			}

			context.drawImage(fg, 0, canvasHeight - fg.height);
			context.drawImage(bird, birdX, birdY);

			birdY += gravity;

			context.fillStyle = '#000';
			context.font = '20px Verdana';
			context.fillText('Score : ' + score, 10, canvasHeight - 20);

			requestAnimationFrame(render);
		};
		render();
	}, []);

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={canvasWidth}
				height={canvasHeight}
			></canvas>
			<img ref={bgRef} src={bgImage} alt='bg' hidden />
			<img ref={fgRef} src={fgImage} alt='fg' hidden />
			<img ref={birdRef} src={birdImage} alt='bird' hidden />
			<img ref={pipeNorthRef} src={pipeNorthImage} alt='pipeNorth' hidden />
			<img ref={pipeSouthRef} src={pipeSouthImage} alt='pipeSouth' hidden />
			<audio ref={jumpSoundRef} src={jumpSound} hidden />
			<audio ref={scoreSoundRef} src={scoreSound} hidden />
		</div>
	);
};

export default FlappyBird;
