import kaboom from "https://unpkg.com/kaboom@2000.1.6/dist/kaboom.mjs"
import { newgroundsPlugin } from "https://unpkg.com/newgrounds-boom@1.1.1/src/newgrounds.mjs"
import * as ApiStuff from './ApiStuff.js'

kaboom({
	plugins: [newgroundsPlugin]
})

ngInit(ApiStuff.NgCore, ApiStuff.EncryptionKey)

// CHARACTERS
loadSprite("mark", "./sprites/characters/mark.png")
loadSprite("notmark", "./sprites/characters/notmark.png")
loadSprite("bean", "./sprites/characters/bean.png")
loadSprite("notkaboom", "./sprites/notkaboom.png")
loadSprite("mark_S", "./sprites/mark_S.png")

// MARK PATTERNS
loadSprite("state1", "./sprites/mark_patterns/state1.png")
loadSprite("state2", "./sprites/mark_patterns/state2.png")
loadSprite("state3", "./sprites/mark_patterns/state3.png")
loadSprite("state4", "./sprites/mark_patterns/state4.png")
loadSprite("state5", "./sprites/mark_patterns/state5.png")

// SOUNDS
loadSound("score", "./sounds/score.mp3")
loadSound("loss", "./sounds/gameover.wav")
loadSound("select", "./sounds/select.wav")
loadSound("back", "./sounds/backwards.wav")
loadSound("wrong", "./sounds/wrong.wav")
loadSound("funni", "./sounds/jijiji.mp3")

// COLORS
const colors = [
	rgb(18, 18, 18), // 0 DEFAULT
	rgb(255, 71, 108), // 1 RED
	rgb(255, 167, 99), // 2 ORANGE
	rgb(230, 219, 106), // 3 YELLOW
	rgb(109, 201, 109), // 4 GREEN
	rgb(125, 184, 240), // 5 BLUE
	rgb(192, 125, 240), // 6 PURPLE
	rgb(95, 226, 179), // 7 SCORECOLOR
	rgb(209, 38, 75), // 8 BADCOLOR
	rgb(60, 240, 102), // 9 EASY DIFF
	rgb(243, 235, 50), // 10 REGULAR DIFF
	rgb(242, 78, 80), // 11 HARD DIFF 
	rgb(155, 78, 242) // 12 MAX DIFF COLOR
]

const WIDTH = width()
const HEIGHT = height()

let highscore = 0
let score = 0

highscore = getData("highscore")

for(let i = 0; i < ApiStuff.HasMedal.length; i++) {
	ApiStuff.HasMedal[i] = getData("hasmedal" + i)
	console.log(ApiStuff.HasMedal[i])
}

let timePassed = 0

// # MENUSCENE
scene("menuscene", () => {	
	let bg = add([
		rect(WIDTH + 50, HEIGHT + 50),
		color(colors[0]),
		pos(-50, -50),
	]);
	
	let maintextO = add([
		text("MARK", {
			size: 100,
			width: 880,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2 - 120, HEIGHT / 2 - 90),
		area(),
	])

	let maintextT = add([
		text("TONATOR", {
			size: 100,
			width: 880,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2, maintextO.pos.y + 100),
		area(),
		"trigger"
	])

	add([
		text("Press click here to play!", {
			size: 30,
			width: 600,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2, maintextT.pos.y + 100),
		area(),
		"trigger"
	])

	let markMenu = add([
		sprite("mark"),
		pos(maintextO.pos.x + 160, maintextO.pos.y - 95),
		scale(0.26, 0.25),
		area(),
		"trigger"
	])
	
	let amytext = add([
		text("Game created by AmySparkNG - 2022", {
			size: 15,
			width: 880,
			font: "sink",
		}),
		origin("right"),
		pos(WIDTH - 10, HEIGHT - 20),
		"amy"
	])

	add([
		text("HIGHSCORE: " + highscore, {
			size: 15,
			width: 880,
			font: "sink",
		}),
		origin("right"),
		pos(amytext.pos.x, amytext.pos.y - 44),
	])

	play("score")
	
	onKeyPress("v", () => {
		play("funni")
	
		if (!ApiStuff.HasMedal[6]) {
			ngUnlockMedal(ApiStuff.Medal_IDS[6])
			ApiStuff.HasMedal[6] = true
			setData("hasmedal" + 6)
		}
	})

	wait(1.0, () => {	
		onClick("trigger", () => {
			go("gamescene")
		})
	})
})

// # GAMESCENE
scene("gamescene", () => {
	// #region VARS 
	layers([
		"mark",
		"text",
		"notkaboom",
		"red_bg",
	])
			
	let bean
	let mark
	let notmark
	
	let beanScale
	let markScale
	let notmarkScale

	let difficulty = 1
	let timer = 8
	let currentTimerDiff = 6 // var to keep track of the current max time based on the difficulty
	let notmarkSpawning
	let notmarktrolling
	let markDistance

	let hasStarted = false

	let scoreTextG = add([
		text("SCORE: " + 0, {
			size: 40,
			width: WIDTH,
			font: "sinko",
		}),
		layer("text"),
		pos(10)
	]) 
	
	let timerText = add([
		text("TIME LEFT: " + currentTimerDiff + "", {
			size: 40,
			width: WIDTH,
			font: "sinko",
		}),
		pos(10, HEIGHT - 55),
		layer("text"),
		"timerText"
	]) 
	
	let difficultyText = add([
		text(0 + " | DIFF: 0", {
			size: 40,
			width: 800,
			font: "sinko",
		}),
		pos(WIDTH - 16, HEIGHT - 34),
		layer("text"),
		origin("right"),
		"difficultyText"
	]) 
		
	let bg = add([
		rect(WIDTH + 50, HEIGHT + 50),
		color(colors[0]),
		layer("bg"),
		pos(-50, -50),
	]);

	let markbg = add([
		sprite("state1"),
		origin("center"),
		pos(WIDTH / 2, HEIGHT / 2),
		scale(1.2),
	])

	let notkaboom = add([
		sprite("notkaboom"),
		pos(0, 0),
		scale(0.75),
		opacity(0),
		layer("notkaboom")
	])

	// #endregion

	//#region FUNCTIONS METHODS
	function StartGame() {

		if (!ApiStuff.HasMedal[0]) {
			ngUnlockMedal(ApiStuff.Medal_IDS[0])
			ApiStuff.HasMedal[0] = true
			setData("hasmedal" + 0)
		}

		onUpdate("difficultyText", () => {
			timePassed += dt()
		
			let stringTime = Math.floor((timePassed + Number.EPSILON) * 100) / 100 + ""

			if (timePassed <= 0)  difficulty = 0
			if (hasStarted) difficulty = 1
			if (timePassed >= 10) {
				difficulty = 2

				if (!ApiStuff.HasMedal[1]) {
					ngUnlockMedal(ApiStuff.Medal_IDS[1])
					ApiStuff.HasMedal[1] = true
					setData("hasmedal" + 1)
				}
			}
			
			if (timePassed >= 20) difficulty = 3
			if (timePassed >= 30) {
				difficulty = 4
			
				if (!ApiStuff.HasMedal[2]) {
					ngUnlockMedal(ApiStuff.Medal_IDS[2])
					ApiStuff.HasMedal[2] = true
					setData("hasmedal" + 2)
				}
			}
			
			if (timePassed >= 40) difficulty = 5
			if (timePassed >= 45) difficulty = 6
			if (timePassed >= 50) difficulty = 7
			if (timePassed >= 60) {
				difficulty = 8 
			
				if (!ApiStuff.HasMedal[3]) {
					ngUnlockMedal(ApiStuff.Medal_IDS[3])
					ApiStuff.HasMedal[3] = true
					setData("hasmedal" + 3)
				}				
			}
				if (timePassed >= 76) {
				difficultyText.text = stringTime + " | DIFF = MAX!!"
				difficultyText.color = colors[12]

				notmarktrolling = true
			
				if (!ApiStuff.HasMedal[4]) {
					ngUnlockMedal(ApiStuff.Medal_IDS[4])
					ApiStuff.HasMedal[4] = true
					setData("hasmedal" + 4)
				}				
			}

			else {
				difficultyText.text = stringTime + " | DIFF = " + difficulty
			}
		})

		onUpdate("timerText", () => {
			switch(difficulty) {
				case 1:
				currentTimerDiff = 6
				break
		
				case 2:
				currentTimerDiff = 5.5
				break
		
				case 3:
				currentTimerDiff = 4.5
				break
				
				case 4:
				currentTimerDiff = 3.5
				break
		
				case 5:
				currentTimerDiff = 1.6
				break

				case 8:
				if (timePassed >= 75) {
					currentTimerDiff = 1.0
				}
			}
			
			timer -= dt()
		
			if (timer <= 0) {
				timerText.text = "0.0 - You lost."
				difficultyText.text = "Mark."
				scoreTextG.text = "Score: Mark."
				destroyAll("bean")
				destroyAll("mark")
				destroyAll("notmark")

				destroy(markbg)

				bg.use("red_bg")
				bg.color = rgb(237, 12, 65)

				add([
					sprite("mark_S"),
					pos(WIDTH / 2 - 400, HEIGHT / 2 - 400),
					scale(1.2)
				])

				wait (0.1, () => {
					play("loss")
					go("gameover")
				})
			}
			
			timerText.text = "TIME LEFT: " + Math.round((timer + Number.EPSILON) * 100) / 100 + ""
		})
		
		onClick("mark", () => {
			return
		})
	}

	function AddBean() {
		let x = rand(0, WIDTH)
		let y = rand(0, HEIGHT)
	
		bean = add([
			sprite("bean"),
			pos(x, y),
			area(),
			layer("bean"),
			scale(beanScale),
			"bean"
		])
	}
	
	function Spawn() {		
		let beanstoSpawn

		// Determines the amount of beans to spawn, the scale of the objects
		// And their distance to each other depending on the diffficulty
		switch(difficulty) {
			case 1:
			beanstoSpawn = 2
			beanScale = 1.0
			markScale = 0.102
			markDistance = [WIDTH / 2 + 180, HEIGHT / 2 + 180]
			markbg.opacity = 0
			if (hasStarted) {
				difficultyText.color = colors[9]
			}
			break
			
			case 2:
			beanstoSpawn = 5
			beanScale = 1.05
			markScale = 0.106
			markDistance = [WIDTH / 2 + 380, HEIGHT / 2 + 380]
			difficultyText.color = colors[9]
			break
			
			case 3:
			beanstoSpawn = 10
			beanScale = 1.06
			markDistance = [WIDTH / 2 + 420, HEIGHT / 2 + 420]
			difficultyText.color = colors[9]
			break
			
			case 4:
			beanstoSpawn = 15
			beanScale = 1.08
			markDistance = [WIDTH / 2 + 440, HEIGHT / 2 + 440]
			markbg.opacity = 0.1
			difficultyText.color = colors[10]
			break
	
			case 5:
			beanstoSpawn = 20
			markDistance = [WIDTH / 2 + 430, HEIGHT / 2 + 430]
			difficultyText.color = colors[10]
			break
				
			case 6:
			beanstoSpawn = 25
			notmarkScale = 2.0
			markScale = 0.102
			markDistance = [WIDTH / 2 + 440, HEIGHT / 2 + 440]
			markbg.opacity = 0.16
			markbg.use(sprite("state2"))
			difficultyText.color = colors[10]
			break
			
			case 7:
			beanstoSpawn = 26
			markScale = 0.099
			notmarkScale = 2.1
			markDistance = [WIDTH / 2 + 520, HEIGHT / 2 + 520]
			markbg.opacity = 0.18
			markbg.use(sprite("state3"))
			difficultyText.color = colors[10]
			break

			case 8:
			beanstoSpawn = 34
			markScale = 0.098
			notmarkScale = 2.2
			markDistance = [WIDTH, HEIGHT]
			markbg.opacity = 0.2
			markbg.use(sprite("state4"))
			difficultyText.color = colors[11]
			notmarkSpawning = true
			
			if (timePassed >= 76) {
				markbg.use(sprite("state5"))
			}
			break
		}

		for (let i = 0; i < beanstoSpawn; i++) {
			AddBean()
		}
	
		// Spawn mark
		let x = rand(WIDTH / 2, markDistance[0])
		let y = rand(HEIGHT / 2, markDistance[1])

		while (x >= WIDTH - 150 || x <= 65) {
			x = rand(0, markDistance[0])
		}

		while (y >= HEIGHT - 150 || y <= 65) {
			y = rand(0, markDistance[1])
		}

		mark = add([
			sprite("mark"),
			pos(x, y),
			area(),
			scale(markScale),
			layer("mark"),
			"mark"
		])

		if (notmarkSpawning === true) {
			let x
			let y
			let howWill = rand(1, 2)

			if (howWill == 1) {
				x = mark.pos.x + Math.floor(rand(180, 180))
				y = mark.pos.y + Math.floor(rand(180, 180))
			} 
			
			else {
			 	x = mark.pos.x - Math.floor(rand(180, 180))
				y = mark.pos.y - Math.floor(rand(180, 180))
			} 
			
			if (!notmarktrolling) {
				notmark = add([
					sprite("notmark"),
					pos(x, y),
					area(),
					scale(notmarkScale),
					layer("mark"),
					"notmark"
				])
			}

			else {
				notmark = add([
					sprite("notmark"),
					pos(mousePos()),
					area(),
					scale(notmarkScale),
					layer("mark"),
					"notmark"
				])
			}
		}
	}

	function onclickmarkstuff(markP) {
		timer = currentTimerDiff
		
		timerText.color = colors[7]
		wait(0.4, () => {
			timerText.color = WHITE
		})
		
		addKaboom(vec2(mousePos()))
		destroy(markP)
		
		play("score")
		
		destroyAll("bean")
		destroyAll("notmark")
		Spawn(10)
		
		if (difficulty == 6) {
			score += 150
		}

		else if (difficulty == 8) {
			score += 200
		}

		else {
			score += 100
		}

		scoreTextG.text = "SCORE: " + score
		scoreTextG.color = colors[7]

		wait(0.5, () => {
			scoreTextG.color = WHITE
		})

		if (score >= highscore) {
			highscore = score
			setData("highscore", highscore)
		}
	
		let randomColor = Math.floor(rand(1, 6))
		bg.color = colors[randomColor] 
	
		wait(0.15, () => {
			difficultyText.color = WHITE
		})
	}

	function onclickbeanstuff(beanP) {
		addKaboom(vec2(mousePos()))
		destroy(beanP)
		play("score")
		
		score += 50
		scoreTextG.text = "SCORE: " + score
		timer += 0.2
	
		timerText.color = colors[7]
		wait(0.4, () => {
			timerText.color = WHITE
		})
	}

	function onclicknotmarkstuff(notmarkP) {		
		destroy(notmarkP)
		play("wrong")
		shake(5)

		notkaboom.pos = mousePos()
		notkaboom.opacity = 1.0

		wait(0.4, () => {
			notkaboom.opacity = 0
		})

		score -= 100
		scoreTextG.color = colors[8]
		scoreTextG.text = "SCORE: " + score

		wait(0.5, () => {
			scoreTextG.color = WHITE
		})
	}

	// #endregion

	//#region EVENTS
	// Resets score lol
	score = 0

	markbg.width = WIDTH
	markbg.width = HEIGHT

	onKeyPress("space", () => {
		debug.log("Width: " + WIDTH)
	})
	
	if (WIDTH <= 860) {
		difficultyText.origin = ""
		difficultyText.pos.x = 10
		difficultyText.pos.y = timerText.pos.y - 45
	}

	onKeyPress("backspace", () => {
		if (!hasStarted) {
			play("back")
			go("menuscene")
		}

		else {
			shake(1)
		}
	})

	AddBean()
	Spawn()
	
	onClick("bean", (bean) => {
		if (hasStarted === false) {
			hasStarted = true
			StartGame()
			onclickbeanstuff(bean)
		}
		
		else {
			onclickbeanstuff(bean)
		}
	})
	
	onClick("mark", (markP) => {
		if (hasStarted === false) {
			hasStarted = true
			StartGame()
			onclickmarkstuff(markP)
		}
		
		else {
			onclickmarkstuff(markP)
		}
	})

	onClick("notmark", (notmarkP) => {
		onclicknotmarkstuff(notmarkP)
	})
	
	// #endregion
})

// # GAMEOVER
scene("gameover", () => {	
	add([
		rect(WIDTH + 50, HEIGHT + 50),
		color(33, 41, 56),
		pos(-50, -50),
		layer("bg"),
	]);
	
	let gameovertext = add([
		text("GAMEOVER", {
			size: 100,
			width: 380,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2 - 100, HEIGHT / 2 - 60)
	])

	let notmark = add([
		sprite("notmark"),
		pos(gameovertext.pos.x + 170, gameovertext.pos.y - 85),
		scale(7.6, 7.5),
		area(),
		"notmark"
	])

	let scoreText = add([
		text(`Your score: ${score} - Highscore: ${highscore}` , {
			size: 30,
			width: 900,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2, gameovertext.pos.y + 164)
	])

	add([
		text("Click to try again!", {
			size: 30,
			width: 600,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2, scoreText.pos.y + 60)
	])

	if (WIDTH <= 794) {
		scoreText.scale = [0.8]
	}

	if (score >= highscore && highscore >= 100) {
		scoreText.color = colors[7]
		scoreText.text = `NEW Highscore: ${highscore}`
		notmark.use(sprite("mark"))
		notmark.scaleTo(0.4, 0.45)
		notmark.pos.y -= 55
		notmark.pos.x -= 30
	}

	shake(20)

	ngPostScore(ApiStuff.Scoreboard_IDS[0], score)
	ngPostScore(ApiStuff.Scoreboard_IDS[1], timePassed)

	if (!ApiStuff.HasMedal[5]) {
		ngUnlockMedal(ApiStuff.Medal_IDS[5])
		ApiStuff.HasMedal[5] = true
		setData("hasmedal" + 5)
	}

	wait(0.5, () => {
		onMousePress(() => {
			play("select")
			go("gamescene")
		})

		onKeyPress("backspace", () => {
			play("back")
			go("menuscene")
		})
	})
})

// WHERE THE GAME STARTS
go("menuscene")
