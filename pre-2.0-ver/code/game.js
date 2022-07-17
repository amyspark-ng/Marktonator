import kaboom from "https://unpkg.com/kaboom@2000.1.6/dist/kaboom.mjs"
import { newgroundsPlugin } from "https://unpkg.com/newgrounds-boom@1.1.1/src/newgrounds.mjs"
import * as ApiStuff from './ApiStuff.js'

const k = kaboom({
	plugins: [ newgroundsPlugin ],
	width: 1170,
	height: 660,
	logMax: 10,
	stretch: true,
	letterbox: true
})

// #region stufff
// CHARACTERS
loadSprite("mark", "./sprites/characters/mark.png")
loadSprite("notmark", "./sprites/characters/notmark.png")
loadSprite("markish", "./sprites/characters/markish.png")
loadSprite("bean", "./sprites/characters/bean.png")
loadSprite("notkaboom", "./sprites/notkaboom.png")
loadSprite("mark_S", "./sprites/mark_S.png")

// MARK PATTERNS
loadSprite("state1", "./sprites/mark_patterns/state1.png")
loadSprite("state2", "./sprites/mark_patterns/state2.png")
loadSprite("state3", "./sprites/mark_patterns/state3.png")
loadSprite("state4", "./sprites/mark_patterns/state4.png")
loadSprite("state5", "./sprites/mark_patterns/state5.png")
loadSprite("checkerboard", "./sprites/bgs/checkerboard.png")
loadSprite("bg_real", "./sprites/bgs/bg_real.png")
loadSprite("gameover_bg", "./sprites/bgs/gameover_bg.png")
loadSprite("mark_bg", "./sprites/bgs/mark_bg.png")
loadSprite("notmark_bg", "./sprites/bgs/notmark_bg.png")

// MEDALS
loadSprite("medal_no", "./sprites/medals/medal_no.png")
loadSprite("medal1", "./sprites/medals/medal1.png")
loadSprite("medal2", "./sprites/medals/medal2.png")
loadSprite("medal3", "./sprites/medals/medal3.png")
loadSprite("medal4", "./sprites/medals/medal4.png")
loadSprite("medal5", "./sprites/medals/medal5.png")
loadSprite("medal6", "./sprites/medals/medal6.png")
loadSprite("medal7", "./sprites/medals/medal7.png")
loadSprite("medal8", "./sprites/medals/medal8.png")

// SOUNDS
loadSound("score", "./sounds/score.mp3")
loadSound("score_bean", "./sounds/score_bean.wav")
loadSound("loss", "./sounds/gameover.wav")
loadSound("select", "./sounds/select.wav")
loadSound("back", "./sounds/backwards.wav")
loadSound("wrong", "./sounds/wrong.wav")
loadSound("funni", "./sounds/jijiji.mp3")

const WIDTH = width()
const HEIGHT = height()

// COLORS
const colors = [
	rgb(18, 18, 18), // 0 DEFAULT
	rgb(255, 71, 108), // 1 RED
	rgb(255, 167, 99), // 2 ORANGE
	rgb(201, 194, 89), // 3 YELLOW
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

let score = 0
let highscore = 0
highscore = getData("highscore")
let timePassed = 0
let stringTime = ""

ngInit(ApiStuff.NgCore, ApiStuff.EncryptionKey)

for(let i = 0; i < ApiStuff.HasMedal.length; i++) {
	ApiStuff.HasMedal[i] = getData("hasmedal" + i)
	console.log(`Medal${i} state: ${ApiStuff.HasMedal[i]}`)
}

volume(0.68)

scene("menuscene", () => {
	// #region VARS
	let bg = add([
		sprite("bg_real"),
		pos(-50, -50),
		scale(1.1),
		stay(),
		"bg"
	])
		
	let maintextO = add([
		text("MARK", {
			size: 100,
			width: 880,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2 - 120, HEIGHT / 2 - 160),
	])
	
	let maintextT = add([
		text("TONATOR", {
			size: 100,
			width: 880,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2, maintextO.pos.y + 100),
	])
	
	// Horizontal Rule
	add([
		text("------------------", {
			font: 'sinko',
		}),
		pos(maintextT.pos.x - 320, maintextT.pos.y + 60),
		scale(4.5)
	])
	
	let markMenu = add([
		sprite("mark"),
		pos(maintextO.pos.x + 160, maintextO.pos.y - 95),
		scale(0.26, 0.25),
	])
	
	let amytext = add([
		text("AmySparkNG - 2022 | v1.6", {
			size: 15,
			width: 880,
			font: "sink",
		}),
		origin("left"),
		pos(10, 640),
	])
	
	let highscoreText = add([
		text(`HIGHSCORE: 0`, {
			size: 15,
			width: 880,
			font: "sink",
		}),
		origin("right"),
		pos(1160, 640),
	])

	if (highscore != null) {
		highscoreText.text = `HIGHSCORE: ${highscore}`
	}

	let signedText = add([
		text("", {
			size: 15,
			width: 880,
			font: "sink",
		}),
		area( {width: 205} ),
		origin("right"),
		pos(1160, highscoreText.pos.y - 34),
	])

	let NGuser = ngUsername()

	if (NGuser) {
		signedText.text = `Signed as: ${String(NGuser)}`
	}

	else {
		signedText.text = "Not signed in NG :("
	}

	let funniTimes = 0

	// #endregion
	
	// #region FUNCTIONS
	function addButton(txt = "", p = vec2(0)) {
	
		let btn = add([
			text(txt, {
				font: 'sinko',
				size: 60,
				width: 99999,
			}),
			pos(p),
			area({ width: 240, height: 72}),
			origin("center"),
		])
	
		return btn
	}
	
	function press_firstbutton() {
		play("select")
		go("gamescene")
	}
	
	function press_secondbutton() {
		play("select")
		go("extra1")
	}
	// #endregion 
	
	let firstbutton = addButton("PLAY!", vec2(WIDTH / 2, maintextT.pos.y + 170))
	let secondbutton = addButton("EXTRA!", vec2(firstbutton.pos.x, firstbutton.pos.y + 80))
	let buttonIndex = 0
	secondbutton.area.width = 300
	
	onKeyPress("down", () => {
		buttonIndex++
	
		if (buttonIndex >= 2) {
			buttonIndex = 2
		}
	})
	
	onKeyPress("up", () => {
		buttonIndex--
	
		if (buttonIndex <= 1) {
			buttonIndex = 1
		}
	})
	
	onKeyPress("backspace", () => {
		buttonIndex = 0
	})

	wait(0.4, () => {
		play("score")
	})

	onKeyPress("v", () => {
		play("funni")
		shake(2)
		funniTimes++
		console.log(`Funny times pressed V: ${funniTimes}`)

		if (funniTimes >= 10) {
			funniTimes = 0
			
			markMenu.use(sprite("markish"))

			wait(2.5, () => {
				markMenu.use(sprite("mark"))
			})

			if (!ApiStuff.HasMedal[7]) {
				ngUnlockMedal(ApiStuff.Medal_IDS[7])
				ApiStuff.HasMedal[7] = true
				setData("hasmedal" + 7, true)
			}
		}

		if (!ApiStuff.HasMedal[6]) {
			ngUnlockMedal(ApiStuff.Medal_IDS[6])
			ApiStuff.HasMedal[6] = true
			setData("hasmedal" + 6, true)
		}
	})

	onUpdate(() => {
		if (firstbutton.isHovering() || buttonIndex == 1) {
			const t = time() * 4.5
			firstbutton.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			)
		
			secondbutton.color = rgb()
		
			onMouseMove(() => {
				buttonIndex = 0
			})
		}
		
		else if (secondbutton.isHovering() || buttonIndex == 2) {
			const t = time() * 4.5
			secondbutton.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			)
	
			firstbutton.color = rgb()
		
			onMouseMove(() => {
				buttonIndex = 0
			})
		}
		
		else {
			buttonIndex = 0
	
			firstbutton.color = rgb()
			secondbutton.color = rgb()
		}
	
		// NG stuff
		if (signedText.isHovering()) {
			if (NGuser) {
				const t = time() * 6
				signedText.color = rgb(
					wave(0, 255, t),
					wave(0, 255, t + 2),
					wave(0, 255, t + 4),
				)
			}
			
			else if (NGuser == undefined) signedText.color = rgb(112, 112, 112)
		}
		else signedText.color = rgb()
	})

	firstbutton.onClick(() => {
		press_firstbutton()
	})
	
	secondbutton.onClick(() => {
		press_secondbutton()
	})

	signedText.onClick(() => {
		if (NGuser == undefined) {
			play("wrong")
		}
		
		else {
			play("score_bean")
		}
	})

	let enterKeys = ["space", "enter"]

	onKeyPress(enterKeys, () => {
		if (buttonIndex == 1) {
			press_firstbutton()
		}
		
		else if (buttonIndex == 2) {
			press_secondbutton()
		}
	})
})

scene("extra1", () => {	

	// #region arrow
	add([
		text("<", {
			font: 'sinko',
			size: 100
		}),
		pos(54, 200),
		opacity(0.5)
	])
	
	let arrow = add([
		text(">", {
			font: 'sinko',
			size: 100
		}),
		pos(1024, 200),
		area(),
	])
	
	let backArrow = add([
		text("<-", {
			font: 'sinko',
			size: 50
		}),
		pos(14, 12),
		area(),
	])
	
	backArrow.onClick(() => {
		play("back")
		go("menuscene")
	})

	arrow.onClick(() => {
		play("wrong")
		shake(2)
		debug.log("NOT AVAILABLE")
	})

	onKeyPress("right", () => {
		play("wrong")
		shake(2)
		debug.log("NOT AVAILABLE")
	})

	onKeyPress("backspace", () => {
		play("back")
		go("menuscene")
	})
	// #endregion
	
	// SCOREBOARD title
	let charactersTitle = add([
		text("CHARACTERS", {
			font: 'sinko',
			size: 60
		}),
		pos(WIDTH / 2 - 245, 54),
		z(1),
	])

	// #region CHARACTERS
	// Mark
	let mark = add([
		sprite("mark"),
		scale(0.25),
		pos(486, 118),
		area( {height: 400, width: 380, offset: 35} ),
	])

	add([
		text("Mark!", {
			size: 42,
			font: 'sinko'
		}),
		pos(mark.pos.x + 10, mark.pos.y + 146)
	])

	add([
		text("If you click it you will get 100 of score!", {
			size: 24,
			font: 'sinko',
			width: 360,
		}),
		pos(mark.pos.x - 60, mark.pos.y + 200)
	])

	mark.onClick(() => {
		addKaboom(toWorld(mousePos()))
		play("score")
	})

	// bean
	let bean = add([
		sprite("bean"),
		scale(1.6),
		pos(58, 500),
		area()
	])

	add([
		text("bean", {
			size: 42,
			font: 'sinko'
		}),
		pos(bean.pos.x - 10, bean.pos.y - 50)
	])

	add([
		text("If you click it you will get 50 of score, and maybe some extra time ;)", {
			size: 20,
			font: 'sinko',
			width: 340,
		}),
		pos(bean.pos.x + 140, bean.pos.y + 10)
	])

	bean.onClick(() => {
		addKaboom(toWorld(mousePos()))
		play("score_bean")
	})

	// notmark
	let notmark = add([
		sprite("notmark"),
		scale(4.5),
		pos(948, 500),
		area(),
	])

	add([
		text("notmark.", {
			size: 42,
			font: 'sinko'
		}),
		pos(notmark.pos.x - 70, notmark.pos.y - 50)
	])

	add([
		text("If you click it you will lose 100 of score and probably die, he's a troll too so beware", {
			size: 20,
			font: 'sinko',
			width: 340,
		}),
		pos(notmark.pos.x - 315, notmark.pos.y + 2)
	])

	notmark.onClick(() => {
		let notkaboom = add([
			sprite("notkaboom"),
			pos(mousePos().x - 60, mousePos().y - 60)
		])
		play("wrong")

		wait(0.5, () => {
			destroy(notkaboom)
		})
	})

	// #endregion
})

scene("extra2", () => {
	
	// #region arrow stuff	
	let arrow = add([
		text("<", {
			font: 'sinko',
			size: 80
		}),
		pos(38, 200),
		area(),
	])
	
	add([
		text(">", {
			font: 'sinko',
			size: 80
		}),
		pos(1086, arrow.pos.y),
		opacity(0.5),
	])

	let backArrow = add([
		text("<-", {
			font: 'sinko',
			size: 50
		}),
		pos(14, 12),
		area(),
	])
	
	backArrow.onClick(() => {
		play("back")
		go("menuscene")
	})

	arrow.onClick(() => {
		play("back")
		go("extra1")
	})
	
	onKeyPress("left", () => {
		play("back")
		go("extra1")
	})
	
	onKeyPress("backspace", () => {
		play("back")
		go("menuscene")
	})
	
	// #region SCOREBOARD
	let scoreboard
	let scoreboard_scores = []
	let scoreboard_names = []
	
	// scoreboard = ngGetScores(ApiStuff.ScoreBoard)
	
	console.log(scoreboard)
	
	for (let i = 0; i < scoreboard.length; i++) {
		scoreboard_scores.push(scoreboard[i].value)
		scoreboard_names.push(scoreboard[i].user.name)
	}
	
	let scoreboardtitle = add([
		text("SCOREBOARD", {
			font: 'sinko',
			size: 60
		}),
		pos(width() / 2 - 245, 25),
		z(1),
	])
	
	let boardbg = add([
		rect(912, 296),
		color(rgb(18, 18, 18)),
		outline(4, WHITE),
		pos(140, 108),
		z(0),
	])
	
	let user1Text = add([
		text(`#1 - ${scoreboard_names[0]} / SCORE: ${scoreboard_scores[0]}`, {
			font: 'sinko',
			size: 35
		}),
		pos(scoreboardtitle.pos.x - 176, scoreboardtitle.pos.y + 123),
		origin("left")
	])
	
	let user2Text = add([
		text(`#2 - ${scoreboard_names[1]} / SCORE: ${scoreboard_scores[1]}`, {
			font: 'sinko',
			size: 35
		}),
		pos(scoreboardtitle.pos.x - 176, user1Text.pos.y + 53),
		origin("left")
	])
	
	let user3Text = add([
		text(`#3 - ${scoreboard_names[2]} / SCORE: ${scoreboard_scores[2]}`, {
			font: 'sinko',
			size: 35
		}),
		pos(scoreboardtitle.pos.x - 176, user2Text.pos.y + 53),
		origin("left")
	])
	
	let user4Text = add([
		text(`#4 - ${scoreboard_names[3]} / SCORE: ${scoreboard_scores[3]}`, {
			font: 'sinko',
			size: 35
		}),
		pos(scoreboardtitle.pos.x - 176, user3Text.pos.y + 53),
		origin("left")
	])
	
	let user5Text = add([
		text(`#5 - ${scoreboard_names[4]} / SCORE: ${scoreboard_scores[4]}`, {
			font: 'sinko',
			size: 35
		}),
		pos(scoreboardtitle.pos.x - 176, user4Text.pos.y + 53),
		origin("left")
	])

	// #endregion
	
	// #region MEDALS
	let medalstitle = add([
		text(`MEDALS UNLOCKED`, {
			font: 'sinko',
			size: 60
		}),
		pos(224, 430),
		z(1),
	])
	
	let medals = [
		add([
			rect(60, 60),
			outline(40, WHITE),
			sprite("medal_no"),
			scale(0.2),
			pos(58, 526),
			area(),
		]),

		add([
			rect(60, 60),
			outline(40, WHITE),
			sprite("medal_no"),
			scale(0.2),
			pos(194, 526),
			area(),
		]),

		add([
			rect(60, 60),
			outline(40, WHITE),
			sprite("medal_no"),
			scale(0.2),
			pos(330, 526),
			area(),
		]),

		add([
			rect(60, 60),
			outline(40, WHITE),
			sprite("medal_no"),
			scale(0.2),
			pos(466, 526),
			area(),
		]),

		add([
			rect(60, 60),
			outline(40, WHITE),
			sprite("medal_no"),
			scale(0.2),
			pos(602, 526),
			area(),
		]),

		add([
			rect(60, 60),
			outline(40, WHITE),
			sprite("medal_no"),
			scale(0.2),
			pos(738, 526),
			area(),
		]),

		add([
			rect(60, 60),
			outline(40, WHITE),
			sprite("medal_no"),
			scale(0.2),
			pos(874, 526),
			area(),
		]),

		add([
			rect(60, 60),
			outline(40, WHITE),
			sprite("medal_no"),
			scale(0.2),
			pos(1010, 526),
			area(),
		]),
	]

	// #endregion

	// #region hover texts medals
	let hover1 = add([
		rect(300, 100),
		color(rgb(12, 12, 12)),
		pos(medals[0].pos.x + 10, medals[0].pos.y - 120),
		z(2),
	])
	
	let hover1Text = add([
		text(`-Mark!
Start playing.
(+5 points)`, {
			font: 'sinko',
			size: 26,
		}),
		pos(hover1.pos.x + 10, hover1.pos.y + 10),
		z(3),
	])
	
	let hover2 = add([
		rect(300, 100),
		color(rgb(12, 12, 12)),
		pos(medals[1].pos.x + 10, medals[1].pos.y - 120),
		z(2),
	])
	
	let hover2Text = add([
		text(`-Ez
Reach 2nd diff
(+5 points)`, {
			font: 'sinko',
			size: 26,
		}),
		pos(hover2.pos.x + 10, hover2.pos.y + 10),
		z(3),
	])
	
	let hover3 = add([
		rect(300, 100),
		color(rgb(12, 12, 12)),
		pos(medals[2].pos.x + 10, medals[2].pos.y - 120),
		z(2),
	])
	
	let hover3Text = add([
		text(`-Ehh
Reach 3nd diff
(+5 points)`, {
			font: 'sinko',
			size: 26,
		}),
		pos(hover3.pos.x + 10, hover3.pos.y + 10),
		z(3),
	])
	
	let hover4 = add([
		rect(325, 100),
		color(rgb(12, 12, 12)),
		pos(medals[3].pos.x + 10, medals[3].pos.y - 120),
		z(2),
	])
	
	let hover4Text = add([
		text(`-Now this is it
Reach 4th diff
(+5 points)`, {
			font: 'sinko',
			size: 26,
		}),
		pos(hover4.pos.x + 10, hover4.pos.y + 10),
		z(3),
	])
	
	let hover5 = add([
		rect(310, 100),
		color(rgb(12, 12, 12)),
		pos(medals[4].pos.x + 10, medals[4].pos.y - 120),
		z(2),
	])
	
	let hover5Text = add([
		text(`-Mark.
Reach MAX diff
(+10 points)`, {
			font: 'sinko',
			size: 26,
		}),
		pos(hover5.pos.x + 10, hover5.pos.y + 10),
		z(3),
	])
	
	let hover6 = add([
		rect(310, 100),
		color(rgb(12, 12, 12)),
		pos(medals[5].pos.x + 10, medals[5].pos.y - 120),
		z(2),
	])
	
	let hover6Text = add([
		text(`-Awww :(
Loss
(+5 points)`, {
			font: 'sinko',
			size: 26,
		}),
		pos(hover6.pos.x + 10, hover6.pos.y + 10),
		z(3),
	])
	
	let hover7 = add([
		rect(360, 100),
		color(rgb(12, 12, 12)),
		pos(medals[6].pos.x - 82, medals[6].pos.y - 120),
		z(2),
	])
	
	let hover7Text = add([
		text(`-jijiji
funni baby vvvvv
(+5 points)`, {
			font: 'sinko',
			size: 26,
		}),
		pos(hover7.pos.x + 10, hover7.pos.y + 10),
		z(3),
	])
	
	let hover8 = add([
		rect(390, 100),
		color(rgb(12, 12, 12)),
		pos(medals[7].pos.x - 246, medals[7].pos.y - 120),
		z(2),
	])
	
	let hover8Text = add([
		text(`-Stop.
Annoy mark (vvvvv)
(+5 points)`, {
			font: 'sinko',
			size: 26,
		}),
		pos(hover8.pos.x + 10, hover8.pos.y + 10),
		z(3),
	])
	// #endregion
	
	// #region set the medal sprites
	for (let i = 0; i < ApiStuff.HasMedal.length; i++) {
		let bruh = i + 1
		
		if (ApiStuff.HasMedal[i] == true) {
			medals[i].use(sprite("medal" + bruh))
		}
	}
	
	// #region HOVERS
	onUpdate(() => {
		if (medals[0].isHovering()) {
			hover1.opacity = 1 
			hover1Text.opacity = 1
			hover1.use(outline(3, WHITE))
		}
	
		else {
			hover1.opacity = 0
			hover1Text.opacity = 0
			hover1.unuse("outline")
		}
		
		if (medals[1].isHovering()) {
			hover2.opacity = 1 
			hover2Text.opacity = 1
			hover2.use(outline(3, WHITE))
		}
		
		else {
			hover2.opacity = 0
			hover2Text.opacity = 0
			hover2.unuse("outline")
		}
	
		if (medals[2].isHovering()) {
			hover3.opacity = 1 
			hover3Text.opacity = 1
			hover3.use(outline(3, WHITE))
		}
	
		else {
			hover3.opacity = 0
			hover3Text.opacity = 0
			hover3.unuse("outline")
		}
	
		if (medals[3].isHovering()) {
			hover4.opacity = 1 
			hover4Text.opacity = 1
			hover4.use(outline(3, WHITE))
		}
	
		else {
			hover4.opacity = 0
			hover4Text.opacity = 0
			hover4.unuse("outline")
		}
	
		if (medals[4].isHovering()) {
			hover5.opacity = 1 
			hover5Text.opacity = 1
			hover5.use(outline(3, WHITE))
		}
	
		else {
			hover5.opacity = 0
			hover5Text.opacity = 0
			hover5.unuse("outline")
		}
	
		if (medals[5].isHovering()) {
			hover6.opacity = 1 
			hover6Text.opacity = 1
			hover6.use(outline(3, WHITE))
		}
	
		else {
			hover6.opacity = 0
			hover6Text.opacity = 0
			hover6.unuse("outline")
		}
	
		if (medals[6].isHovering()) {
			hover7.opacity = 1 
			hover7Text.opacity = 1
			hover7.use(outline(3, WHITE))
		}
	
		else {
			hover7.opacity = 0
			hover7Text.opacity = 0
			hover7.unuse("outline")
		}
	
		if (medals[7].isHovering()) {
			hover8.opacity = 1 
			hover8Text.opacity = 1
			hover8.use(outline(3, WHITE))
		}
	
		else {
			hover8.opacity = 0
			hover8Text.opacity = 0
			hover8.unuse("outline")
		}
	})
	// #endregion
})

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
	
	let beanScale = 0.0
	let markScale = 0.0
	let notmarkScale = 0.0

	let difficulty = 1
	let timer = 8
	let currentTimerDiff = 6 // var to keep track of the current max time based on the difficulty
	let notmarkSpawning = false
	let notmarktrolling = false
	// range of the lowest and highest position mark can spawn in
	let markDistanceX = [WIDTH / 2 - 180, WIDTH / 2 + 180]
	let markDistanceY = [HEIGHT / 2 - 180, HEIGHT / 2 + 180]
	let scarySize = 32
	let beanstoSpawn = 0

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
		pos(10, HEIGHT - 46),
		layer("text"),
		"timerText"
	]) 
	
	let difficultyText = add([
		text(0 + " | DIFF: 0", {
			size: 40,
			width: 800,
			font: "sinko",
		}),
		pos(WIDTH - 16, HEIGHT - 26),
		layer("text"),
		origin("right"),
		"difficultyText"
	]) 
		
	let colorBg = add([
		rect(WIDTH + 200, HEIGHT + 200),
		color(colors[0]),
		layer("bg"),
		pos(-50, -50),
	])
	
	let checkerboard = add([
		sprite("checkerboard"),
		color(colors[0]),
		layer("bg"),
		pos(-50, -50),
		scale(3),
	])

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
		hasStarted = true

		checkerboard.opacity = 0.45

		timePassed = 0
		difficulty = 0

		if (!ApiStuff.HasMedal[0]) {
			ngUnlockMedal(ApiStuff.Medal_IDS[0])
			ApiStuff.HasMedal[0] = true
			setData("hasmedal" + 0, true)
		}

		onUpdate("difficultyText", () => {
			timePassed += dt()
			stringTime = Math.floor((timePassed + Number.EPSILON) * 100) / 100 + ""

			if (timePassed <= 0)  difficulty = 0
			if (hasStarted) difficulty = 1
			if (timePassed >= 10) {
				difficulty = 2

				if (!ApiStuff.HasMedal[1]) {
					ngUnlockMedal(ApiStuff.Medal_IDS[1])
					ApiStuff.HasMedal[1] = true
					setData("hasmedal" + 1, true)
				}
			}
			
			if (timePassed >= 20) difficulty = 3
			if (timePassed >= 30) {
				difficulty = 4
			
				if (!ApiStuff.HasMedal[2]) {
					ngUnlockMedal(ApiStuff.Medal_IDS[2])
					ApiStuff.HasMedal[2] = true
					setData("hasmedal" + 2, true)
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
					setData("hasmedal" + 3, true)
				}				
			}
				if (timePassed >= 76) {
				difficultyText.text = stringTime + " | DIFF = MAX!!"
				difficultyText.color = colors[12]

				notmarktrolling = true
			
				if (!ApiStuff.HasMedal[4]) {
					ngUnlockMedal(ApiStuff.Medal_IDS[4])
					ApiStuff.HasMedal[4] = true
					setData("hasmedal" + 4, true)
				}				
			}

			else {
				difficultyText.text = stringTime + " | DIFF = " + difficulty
			}
		})

		timerText.onUpdate(() => {
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
			
			if (!timer <= 0) {
				timer -= dt()
				timerText.text = "TIME LEFT: " + Math.round((timer + Number.EPSILON) * 100) / 100 + ""
			}

			if (timer <= 0) {
				scaryF()
				
				wait(0.28, () => {
					go("gameover")
				})
			}
		})
		
		onClick("mark", () => {
			return
		})
	}

	function AddMark() {
		let x
		let y
		
		if (hasStarted == false) {
			x = WIDTH / 2 - 20
			y = HEIGHT / 2 - 20
		}

		else {
			if (difficulty >= 8) {
				x = rand(200, WIDTH - 200)
				y = rand(200, HEIGHT - 200)
			}

			// normal
			else {
				x = rand(markDistanceX[0], markDistanceX[1])
				y = rand(markDistanceY[0], markDistanceY[1])
			
				while (x >= WIDTH - 150 || x <= 65) {
					x = rand(markDistanceX[0], markDistanceX[1])
				}
		
				while (y >= HEIGHT - 150 || y <= 65) {
					y = rand(markDistanceY[0], markDistanceY[1])
				}		
			}
		}
		
		mark = add([
			sprite("mark"),
			pos(x, y),
			area(),
			scale(markScale),
			layer("mark"),
			"mark"
		])
	}

	function AddBean() {
		if (hasStarted == true) {
			for (let i = 0; i < beanstoSpawn; i++) {
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
		}
	}

	function Addnotmark() {
		// if he's not trolling
		if (!notmarktrolling) {
			notmark = add([
				sprite("notmark"),
				pos(),
				area(),
				scale(notmarkScale),
				layer("mark"),
				"notmark"
			])

			notmark.pos.x = rand(mousePos().x - 10, mousePos().x + 10)
			notmark.pos.y = rand(mousePos().y - 10, mousePos().y + 10)
		}

		else {
			let x = rand(mark.pos.x - 112, mark.pos.x + 112) 
			let y = rand(mark.pos.y - 112, mark.pos.y + 112) 

			notmark = add([
				sprite("notmark"),
				pos(x, y),
				area(),
				scale(notmarkScale),
				layer("mark"),
				"notmark"
			])
		}
	}
	
	function Spawn() {		
		// Determines the amount of beans to spawn, the scale of the objects
		// And their distance to each other depending on the diffficulty
		switch(difficulty) {
			case 1:
			beanstoSpawn = 2
			beanScale = 1.0
			markScale = 0.102
			markDistanceX = [WIDTH / 2 - 40, HEIGHT / 2 + 40]
			markDistanceY = [HEIGHT / 2 - 40, HEIGHT / 2 + 40]
			markbg.opacity = 0
			if (hasStarted) {
				difficultyText.color = colors[9]
			}
			break
			
			case 2:
			beanstoSpawn = 5
			beanScale = 1.05
			markScale = 0.106
			markDistanceX = [WIDTH / 2 - 80, HEIGHT / 2 + 80]
			markDistanceY = [HEIGHT / 2 - 80, HEIGHT / 2 + 80]
			difficultyText.color = colors[9]
			break
			
			case 3:
			beanstoSpawn = 10
			beanScale = 1.06
			markDistanceX = [WIDTH / 2 - 120, HEIGHT / 2 + 120]
			markDistanceY = [HEIGHT / 2 - 120, HEIGHT / 2 + 120]
			difficultyText.color = colors[9]
			break
			
			case 4:
			beanstoSpawn = 15
			beanScale = 1.08
			markDistanceX = [WIDTH / 2 - 240, HEIGHT / 2 + 240]
			markDistanceY = [HEIGHT / 2 - 240, HEIGHT / 2 + 240]
			markbg.opacity = 0.1
			difficultyText.color = colors[10]
			break
	
			case 5:
			beanstoSpawn = 20
			markDistanceX = [WIDTH / 2 - 360, HEIGHT / 2 + 360]
			markDistanceY = [HEIGHT / 2 - 360, HEIGHT / 2 + 360]
			difficultyText.color = colors[10]
			break
				
			case 6:
			beanstoSpawn = 25
			notmarkScale = 2.0
			markScale = 0.102
			markDistanceX = [WIDTH / 2 - 480, HEIGHT / 2 + 480]
			markDistanceY = [HEIGHT / 2 - 480, HEIGHT / 2 + 480]
			markbg.opacity = 0.16
			markbg.use(sprite("state2"))
			difficultyText.color = colors[10]
			break
			
			case 7:
			beanstoSpawn = 26
			markScale = 0.099
			notmarkScale = 2.1
			markDistanceX = [WIDTH / 2 - 520, HEIGHT / 2 + 520]
			markDistanceY = [HEIGHT / 2 - 520, HEIGHT / 2 + 520]
			markbg.opacity = 0.18
			markbg.use(sprite("state3"))
			difficultyText.color = colors[10]
			break

			case 8:
			beanstoSpawn = 34
			markScale = 0.098
			notmarkScale = 2.2
			markDistanceX = WIDTH - 200
			markDistanceY = HEIGHT - 200
			markbg.opacity = 0.2
			markbg.use(sprite("state4"))
			difficultyText.color = colors[11]
			notmarkSpawning = true
			
			if (timePassed >= 76) {
				markbg.use(sprite("state5"))
			}
			break
		}

		AddMark()
		AddBean()
		
		if (notmarkSpawning == true) {
			Addnotmark()
		}
	}

	function onclickmarkstuff(markP) {
		timer = currentTimerDiff
				
		addKaboom(vec2(mousePos()))
		destroy(markP)
		
		destroyAll("bean")
		destroyAll("notmark")
		Spawn(10)
		
		if (difficulty == 6) {
			score += 150
		}

		else if (difficulty >= 8) {
			score += 200
		}

		else {
			score += 100
		}

		scoreTextG.text = "SCORE: " + score
		scoreTextG.color = colors[7]

		wait(0.15, () => {
			scoreTextG.color = WHITE
		})
	
		let randomColor = Math.floor(rand(1, 6))
		colorBg.color = colors[randomColor] 
		checkerboard.color = colors[randomColor] 
	
		wait(0.5, () => {
			difficultyText.color = WHITE
		})

		play("score")

		if (score >= highscore) {
			highscore = score
			setData("highscore", highscore)
		}
	}

	function onclickbeanstuff(beanP) {
		play("score_bean")
		addKaboom(vec2(mousePos()))
		destroy(beanP)
		
		score += 50
		scoreTextG.text = "SCORE: " + score
		
		scoreTextG.color = colors[7]
		scoreTextG.text = "SCORE: " + score

		wait(0.5, () => {
			scoreTextG.color = WHITE
		})

		timer += 0.2
	
		timerText.color = colors[7]
		wait(0.5, () => {
			timerText.color = WHITE
		})
	}

	function onclicknotmarkstuff(notmarkP) {		
		destroy(notmarkP)
		shake(5)

		play("wrong")

		notkaboom.pos = notmarkP.pos
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

		timer -= 0.2
		timerText.color = colors[8]

		wait(0.5, () => {
			timerText.color = WHITE
		})
	}

	function scaryF() {
		timer = 0
		timerText.text = "TIME LEFT: 0.0"
		difficultyText.text = "Mark."
		scoreTextG.text = "Mark."
		destroyAll("bean")
		destroyAll("mark")
		destroyAll("notmark")

		destroy(markbg)

		colorBg.use("red_bg")
		colorBg.color = rgb(237, 12, 65)

		add([
			sprite("mark_S"),
			pos(WIDTH / 2 - 400, HEIGHT / 2 - 400),
			scale(1.2)
		])

		checkerboard.color = colors[0]

		let x = rand(0, WIDTH)
		let y = rand(0, HEIGHT)

		let scarytext = add([
			text("Mark", {
				size: scarySize
			}),
			pos(x, y)
		])

		scarySize += 12
	}

	// #endregion

	//#region EVENTS
	
	// Resets score lol
	score = 0

	onKeyPress("r", () => {
		timer = 0
	})
	
	onKeyPress("backspace", () => {
		if (!hasStarted) {
			play("back")
			go("menuscene")
		}

		else {
			shake(1)
		}
	})

	Spawn()
	
	onClick("bean", (bean) => {
		onclickbeanstuff(bean)
	})
	
	onClick("mark", (markP) => {
		if (hasStarted == false) {
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

scene("gameover", () => {	
	play("loss")
	
	let phrase = ""

	if (timePassed <= 10) phrase = "how."
	else if (timePassed >= 10 && timePassed < 20) phrase = "damn..."
	else if (timePassed >= 20 && timePassed < 40) phrase = "meh"
	else if (timePassed >= 40 && timePassed < 60) phrase = "hmmmm"
	else if (timePassed >= 60 && timePassed < 64) phrase = "good :)"
	else if (timePassed >= 64 && timePassed < 70) phrase = "awesome!!!!"
	else if (timePassed >= 70 && timePassed < 76) phrase = "GUDDD"
	else if (timePassed >= 76 && timePassed < 80) phrase = "Godlike!"
	else if (timePassed >= 80) phrase = "The best B)"

	// bg real
	add([
		sprite("gameover_bg"),
		pos(-50, -50),
		layer("bg"),
		scale(1.1)
	]);

	// mark bg
	let markbg = add([
		sprite("notmark_bg"),
		pos(-50, -50),
		opacity(0.1)
	])
	
	let gameovertext = add([
		text("GAMEOVER", {
			size: 100,
			width: 380,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2 - 100, HEIGHT / 2 - 114)
	])

	let notmark = add([
		sprite("notmark"),
		pos(gameovertext.pos.x + 170, gameovertext.pos.y - 85),
		scale(7.6, 7.6),
		"notmark"
	])

	let scoreText = add([
		text(`Your score: ${score} - Highscore: ${highscore}` , {
			size: 40,
			width: 99999,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2, gameovertext.pos.y + 150)
	])

	let timerText = add([
		text(`Time passed: ${stringTime} - ${phrase} ` , {
			size: 40,
			width: 1100,
			font: "sinko",
		}),
		origin("center"),
		pos(scoreText.pos.x, scoreText.pos.y + 50)
	])

	if (timePassed >= 76 && timePassed < 80) timerText.pos.x -= 40

	let again = add([
		text("Click here to try again!", {
			size: 51,
			width: 1100,
			font: "sinko",
		}),
		origin("center"),
		pos(WIDTH / 2, timerText.pos.y + 120),
		area(),
	])

	let backArrow = add([
		text("<-", {
			font: 'sinko',
			size: 50
		}),
		pos(14, 12),
		opacity(0.9),
		area(),
	])

	if (score >= highscore && highscore >= 100) {
		scoreText.color = colors[7]
		scoreText.text = `NEW Highscore: ${highscore}`
		notmark.use(sprite("mark"))
		notmark.scaleTo(0.4, 0.4)
		notmark.pos.y -= 50
		notmark.pos.x -= 30
		markbg.use(sprite("mark_bg"))
	}

	shake(20)

	let enterkeys = ["enter", "space"]

	onKeyPress(enterkeys, () => {
		play("back")
		go("gamescene")
	})

	backArrow.onClick(() => {
		play("back")
		go("menuscene")
	})
	
	again.onClick(() => {
		play("select")
		go("gamescene")
	})

	ngPostScore(ApiStuff.ScoreBoard, score)

	if (!ApiStuff.HasMedal[5]) {
		ngUnlockMedal(ApiStuff.Medal_IDS[5])
		ApiStuff.HasMedal[5] = true
		setData("hasmedal" + 5, true)
	}
})

go("menuscene")
