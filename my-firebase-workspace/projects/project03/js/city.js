let stars = []
let cars = []
let buildings = []
let clouds = []
let lamps = []

let shootingStar = { x: 0, y: 0, speedX: 0, speedY: 0, active: false }

const CONFIG = {
    windowRefresh: 4,
    reflectionRefresh: 4,
    plane: { margin: 80, yMin: 0.06, yMax: 0.3, speedMin: 2.2, speedMax: 3.4, spawn: [300, 600], cooldown: [400, 800] },
    balloon: { margin: 80, yMin: 0.1, yMax: 0.35, speedMin: 0.8, speedMax: 1.4, spawn: [400, 800], cooldown: [500, 900] },
    hero: { margin: 40, yMin: 0.08, yMax: 0.35, speedMin: 2, speedMax: 3.2, spawn: 480 },
    fireworkTimer: [500, 1200],
    honkTimer: [700, 1400],
    brakeTimer: [500, 1200],
    lightningTimer: [240, 600],
    ufo: { margin: 90, yMin: 0.08, yMax: 0.3, speedMin: 1.6, speedMax: 2.6, spawn: [500, 900], cooldown: [600, 1000] },
    drone: { margin: 90, yMin: 0.12, yMax: 0.4, speedMin: 1.8, speedMax: 2.8, spawn: [300, 700], cooldown: [400, 800] },
    villain: { margin: 60, speedMin: 2.6, speedMax: 3 },
    autoCycleFrames: 900,
    puddleCount: 8
}

let planeCfg = {
    margin: CONFIG.plane.margin,
    yMin: CONFIG.plane.yMin,
    yMax: CONFIG.plane.yMax,
    speedMin: CONFIG.plane.speedMin,
    speedMax: CONFIG.plane.speedMax,
    cooldown: CONFIG.plane.cooldown
}
let balloonCfg = {
    margin: CONFIG.balloon.margin,
    yMin: CONFIG.balloon.yMin,
    yMax: CONFIG.balloon.yMax,
    speedMin: CONFIG.balloon.speedMin,
    speedMax: CONFIG.balloon.speedMax,
    cooldown: CONFIG.balloon.cooldown
}
let heroCfg = {
    margin: CONFIG.hero.margin,
    yMin: CONFIG.hero.yMin,
    yMax: CONFIG.hero.yMax,
    speedMin: CONFIG.hero.speedMin,
    speedMax: CONFIG.hero.speedMax,
    cooldown: [CONFIG.hero.spawn, CONFIG.hero.spawn],
    onSpawn: o => { o.phase = random(TWO_PI) },
    onDone: () => { heroTrail = [] }
}
let ufoCfg = {
    margin: CONFIG.ufo.margin,
    yMin: CONFIG.ufo.yMin,
    yMax: CONFIG.ufo.yMax,
    speedMin: CONFIG.ufo.speedMin,
    speedMax: CONFIG.ufo.speedMax,
    cooldown: CONFIG.ufo.cooldown,
    onSpawn: o => { o.phase = random(TWO_PI) }
}
let droneCfg = {
    margin: CONFIG.drone.margin,
    yMin: CONFIG.drone.yMin,
    yMax: CONFIG.drone.yMax,
    speedMin: CONFIG.drone.speedMin,
    speedMax: CONFIG.drone.speedMax,
    cooldown: CONFIG.drone.cooldown,
    onSpawn: o => { o.phase = random(TWO_PI) }
}

let reflPG = null
let reflRedraw = 0
let reflDirty = false
let tallestB = null
let resizeTimer = 0

let isDay = false
let dayProgress = 0
let nightA = 1
let dayA = 0

let scaleFactor = 1
let roadH = 60
let skyPG
let skyBucket = -1

let weather = 'clear'
let rain = []
let rainSplash = []
let snow = []
let birds = []
let fireflies = []
let lightning = { timer: 0, flash: 0, bolt: [] }
let people = []
let vents = []
let steam = []
let plane = { active: false, x: 0, y: 0, speed: 0, timer: 0, dir: 1 }
let honkTimer = 0
let brakeTimer = 0
let trees = []
let leaves = []

let shake = 0
let fireworks = []
let fireworkTimer = 0
let rainbowTimer = 0
let balloon = { active: false, x: 0, y: 0, timer: 0, dir: 1 }
let roofCatIdx = 0
let fwColors = [[255, 90, 120], [255, 200, 90], [120, 220, 255], [150, 255, 150], [230, 140, 255], [255, 255, 255]]

let batSignal = false
let hero = { active: false, x: 0, y: 0, speed: 0, phase: 0, dir: 1, timer: CONFIG.hero.spawn }
let heroTrail = []

let ufo = { active: false, x: 0, y: 0, speed: 0, phase: 0, dir: 1, timer: CONFIG.ufo.spawn[0] }
let drone = { active: false, x: 0, y: 0, speed: 0, phase: 0, dir: 1, timer: CONFIG.drone.spawn[0] }
let villain = { active: false, x: 0, y: 0, speed: 0, phase: 0, dir: 1, timer: 0 }
let villainTrail = []
let villainRoof = null
let villainLurk = 0
let animals = []
let puddles = []
let chimneySmoke = []
let parallax = []
let autoCycle = false
let autoTimer = 0
let season = 'summer'
let rainA = 0
let snowA = 0
let uiBtns = []

function preload() {

}

function updateScale() {
    scaleFactor = constrain(min(width, height) / 700, 0.55, 1.15)
    roadH = 60 * scaleFactor
}

function setup() {
    createCanvas(windowWidth, windowHeight)
    noStroke()

    loadState()
    dayProgress = isDay ? 1 : 0

    rebuildScene()

    if (autoCycle) autoTimer = CONFIG.autoCycleFrames
    fireworkTimer = round(random(CONFIG.fireworkTimer[0], CONFIG.fireworkTimer[1]))

    resetShootingStar()
}

function rebuildScene() {
    updateScale()
    initStars()
    initBuildings()
    initClouds()
    initCars()
    initLamps()
    initBirds()
    initRain()
    initSnow()
    initFireflies()
    initLightning()
    initPeople()
    initVents()
    initPlane()
    initTrees()
    initLeaves()
    initBalloon()
    initPuddles()
    initAnimals()
    initParallax()
    initUfo()
    initDrone()
    buildUIButtons()
    reflDirty = true

    skyPG = createGraphics(width, height)
    renderSkyPG()
    skyBucket = round(dayProgress * 60)
}

function loadState() {
    try {
        let savedDay = localStorage.getItem('city_isDay')
        if (savedDay !== null) isDay = savedDay === 'true'
        let savedSeason = localStorage.getItem('city_season')
        if (['summer', 'autumn', 'winter', 'spring'].includes(savedSeason)) season = savedSeason
        let savedWeather = localStorage.getItem('city_weather')
        if (['clear', 'rain', 'snow'].includes(savedWeather)) weather = savedWeather
        let savedAuto = localStorage.getItem('city_auto')
        if (savedAuto !== null) autoCycle = savedAuto === 'true'
    } catch (e) {
        console.warn('city: could not load state', e)
    }
}

function saveState() {
    try {
        localStorage.setItem('city_isDay', isDay)
        localStorage.setItem('city_season', season)
        localStorage.setItem('city_weather', weather)
        localStorage.setItem('city_auto', autoCycle)
        let lights = buildings.map(b => b.lightsOn)
        localStorage.setItem('city_lights', JSON.stringify(lights))
    } catch (e) {
        console.warn('city: could not save state', e)
    }
}

function loadLights() {
    try {
        let saved = localStorage.getItem('city_lights')
        if (saved) {
            let arr = JSON.parse(saved)
            for (let i = 0; i < buildings.length && i < arr.length; i++) {
                buildings[i].lightsOn = arr[i]
            }
        }
    } catch (e) {
        console.warn('city: could not load lights', e)
    }
}

function initCars() {
    let carY1 = height - roadH + 8
    let carY2 = height - roadH + 34
    let specs = [
        { type: 'sedan', body: "#ff5e5e", speed: 4 },
        { type: 'taxi', body: "#ffd166", speed: 6.5 },
        { type: 'sport', body: "#8be9fd", speed: 8 },
        { type: 'truck', body: "#5be37a", speed: 3 },
        { type: 'police', body: "#b9c6de", speed: 6 }
    ]
    shuffle(specs, true)
    cars = []
    for (let i = 0; i < specs.length; i++) {
        let sp = specs[i]
        let dir = i % 2 === 0 ? 1 : -1
        let baseSpeed = sp.speed * random(0.85, 1.15) * scaleFactor
        cars.push({
            x: dir === 1 ? -100 - i * 260 : width + 100 + i * 260,
            y: dir === 1 ? carY1 : carY2,
            speed: baseSpeed * dir,
            baseSpeed: baseSpeed,
            dir: dir,
            honk: 0,
            brake: 0,
            hazardT: 0,
            type: sp.type,
            body: sp.body
        })
    }
}

function initStars() {
    stars = []
    for (let i = 0; i < 400; i++) {
        stars.push({
            x: random(width),
            y: random(height * 0.85),
            size: random(1, 3),
            twinkle: random(0.02, 0.08)
        })
    }
}

function initBuildings() {
    let spacing = 15 * scaleFactor
    let targetW = 120 * scaleFactor
    let niit = constrain(round(width / (targetW + spacing)), 4, 18)

    buildings = []
    let allPalette = ["#232744", "#1e2138", "#262a4a", "#1c1f36", "#282c4e", "#20233c"]
    let center = floor(niit / 2)

    let mults = []
    let totalM = 0
    for (let i = 0; i < niit; i++) {
        let m = random(0.7, 1.3)
        mults.push(m)
        totalM += m
    }
    let bWidth = (width - spacing * (niit + 1)) / totalM

    let roofs = ['flat', 'flat', 'flat', 'peak', 'dome', 'step', 'spire', 'taper']
    let dayTints = ['#8b93b8', '#9aa0c0', '#7f86a8', '#a6a0bd', '#94a8b0', '#b0a0b8']
    let awningCols = ['#e07b54', '#e0b054', '#5b8fbf', '#a05b8f', '#5bbf8f']

    let x = spacing
    for (let i = 0; i < niit; i++) {
        let w = bWidth * mults[i]
        let hFrac = i === center ? random(0.48, 0.52) : random(0.2, 0.5)
        let roof = i === center
            ? ['spire', 'taper', 'step'][floor(random(3))]
            : roofs[floor(random(roofs.length))]
        let tw = roof === 'taper' ? w * random(0.35, 0.6) : w
        buildings.push({
            x: x,
            y: height * hFrac,
            w: w,
            tw: tw,
            h: height,
            roof: roof,
            baseColor: allPalette[i % allPalette.length],
            dayTint: dayTints[floor(random(dayTints.length))],
            awning: random() > 0.65,
            awningCol: awningCols[floor(random(awningCols.length))],
            lightsOn: true,
            flicker: random(0.01, 0.03),
            windowsPG: null,
            windowsDirty: true,
            roofDecor: (roof === 'flat' || roof === 'taper') ? (random() < 0.55 ? 'ac' : 'dish') : null,
            decorX: random(0.15, 0.85),
            chimney: (roof === 'flat' || roof === 'taper') && random() < 0.3 ? { x: random(0.25, 0.75), h: (10 + random(8)) * scaleFactor } : null,
            hasAntenna: random() > 0.6 && (roof === 'flat' || roof === 'taper')
        })
        x += w + spacing
    }

    let signDefs = [
        { t: 'ПИЦЦА', c: '#ff5b7f' },
        { t: 'BAR', c: '#5bc9ff' },
        { t: 'HOTEL', c: '#ffd15b' },
        { t: 'CINEMA', c: '#ff6b5b' },
        { t: 'КАФЕ', c: '#7bffa8' },
        { t: '♪', c: '#c98bff' }
    ]
    for (let b of buildings) {
        if (random() < 0.35 && b.roof !== 'spire' && b.roof !== 'taper') {
            let d = signDefs[floor(random(signDefs.length))]
            b.sign = { t: d.t, c: d.c, y: random(height * 0.32, height * 0.55) }
        } else {
            b.sign = null
        }
    }

    let catCands = buildings.map((b, i) => ({ b, i })).filter(o => o.b.roof === 'flat' || o.b.roof === 'taper')
    roofCatIdx = catCands.length ? catCands[floor(random(catCands.length))].i : floor(random(buildings.length))

    loadLights()

    tallestB = null
    for (let c of buildings) {
        if (!tallestB || c.y < tallestB.y) tallestB = c
    }
}

function initClouds() {
    clouds = []
    for (let i = 0; i < 6; i++) {
        clouds.push({
            x: random(width),
            y: random(30, height * 0.25),
            w: random(80, 160),
            speed: random(0.2, 0.5)
        })
    }
}

function initLamps() {
    lamps = []
    let spacing = 140 * scaleFactor
    for (let x = spacing / 2; x < width; x += spacing) {
        lamps.push({ x: x, on: true })
    }
}

function initBirds() {
    birds = []
    for (let i = 0; i < 3; i++) {
        birds.push({
            x: random(width),
            y: random(height * 0.08, height * 0.28),
            speed: random(0.6, 1.3),
            phase: random(TWO_PI)
        })
    }
}

function initRain() {
    rain = []
    for (let i = 0; i < 140; i++) {
        rain.push({
            x: random(width),
            y: random(-100, height),
            len: random(8, 18) * scaleFactor,
            speed: random(9, 18) * scaleFactor,
            wind: random(1, 3)
        })
    }
    rainSplash = []
}

function initSnow() {
    snow = []
    for (let i = 0; i < 130; i++) {
        snow.push({
            x: random(width),
            y: random(-20, height),
            size: random(2, 5),
            speed: random(0.8, 2.2) * scaleFactor,
            phase: random(TWO_PI)
        })
    }
}

function initFireflies() {
    fireflies = []
    for (let i = 0; i < 18; i++) {
        fireflies.push({
            x: random(width),
            y: random(height - roadH - 130 * scaleFactor, height - roadH - 10 * scaleFactor),
            phase: random(TWO_PI),
            speed: random(0.2, 0.7)
        })
    }
}

function initLightning() {
    lightning = { timer: round(random(CONFIG.lightningTimer[0], CONFIG.lightningTimer[1])), flash: 0, bolt: [] }
}

function initPeople() {
    people = []
    let sy = height - roadH - 14 * scaleFactor
    let coats = ["#3a4166", "#4a3f6b", "#35506b", "#6b3f4a", "#3d6b4a", "#6b5b3d"]
    for (let i = 0; i < 6; i++) {
        people.push({
            x: random(width),
            y: sy + random(-3, 3) * scaleFactor,
            speed: random(0.5, 1.2) * scaleFactor * (random() > 0.5 ? 1 : -1),
            phase: random(TWO_PI),
            coat: coats[floor(random(coats.length))]
        })
    }
}

function initVents() {
    vents = []
    for (let i = 0; i < 3; i++) {
        vents.push({ x: random(width * 0.15, width * 0.85), y: height - roadH - 6 * scaleFactor })
    }
    steam = []
}

function initPlane() {
    plane = { active: false, x: 0, y: 0, speed: 0, timer: round(random(CONFIG.plane.spawn[0], CONFIG.plane.spawn[1])), dir: 1 }
}

function initBalloon() {
    balloon = { active: false, x: 0, y: 0, timer: round(random(CONFIG.balloon.spawn[0], CONFIG.balloon.spawn[1])), dir: 1 }
}

function initTrees() {
    trees = []
    let n = 7
    let palette = {
        summer: ['#2e6b4f', '#3a7d5a', '#4d8a5c', '#5c946e', '#416b3a'],
        spring: ['#5c946e', '#7ab648', '#8cc66b', '#6aa84f', '#7fae5e'],
        autumn: ['#c98732', '#b5722e', '#d96c3c', '#a05b2e', '#c9a227'],
        winter: ['#4a4a52', '#3d3d45', '#5a5a62', '#44444c', '#3a3a40']
    }
    for (let i = 0; i < n; i++) {
        trees.push({
            x: random(width * 0.06, width * 0.94),
            y: height - roadH - 10 * scaleFactor,
            size: random(18, 30) * scaleFactor,
            phase: random(TWO_PI),
            green: palette[season][floor(random(palette[season].length))]
        })
    }
}

function initLeaves() {
    leaves = []
    let kind = season === 'spring' ? 'petal' : 'leaf'
    let cols = {
        petal: ['#f7b8c8', '#f2a7bd', '#fcd3df', '#e89ab4'],
        leaf: ['#c98732', '#d96c3c', '#a05b2e', '#c9a227', '#7ab648']
    }
    for (let i = 0; i < 26; i++) {
        leaves.push({
            x: random(width),
            y: random(height),
            size: random(2, 4) * scaleFactor,
            speed: random(0.4, 1) * scaleFactor,
            sway: random(TWO_PI),
            col: cols[kind][floor(random(cols[kind].length))],
            kind: kind
        })
    }
}

function initPuddles() {
    puddles = []
    for (let i = 0; i < CONFIG.puddleCount; i++) {
        puddles.push({
            x: random(width * 0.05, width * 0.95),
            y: height - roadH + random(8, roadH * 0.7),
            r: random(14, 34) * scaleFactor,
            a: 0
        })
    }
}

function initAnimals() {
    animals = []
    let y = height - roadH - 6 * scaleFactor
    let dogCols = ['#8a6f4d', '#7a5a3a', '#5c3d26']
    for (let i = 0; i < 3; i++) {
        let kind = random() < 0.5 ? 'cat' : 'dog'
        animals.push({
            x: random(width),
            y: y + random(-2, 2) * scaleFactor,
            speed: random(0.6, 1.3) * scaleFactor * (random() > 0.5 ? 1 : -1),
            phase: random(TWO_PI),
            kind: kind,
            col: kind === 'cat' ? '#20242f' : dogCols[floor(random(dogCols.length))]
        })
    }
}

function initParallax() {
    parallax = []
    let x = 0
    while (x < width) {
        let w = random(30, 70) * scaleFactor
        let h = random(height * 0.12, height * 0.42)
        parallax.push({
            x: x,
            w: w,
            h: h,
            y: height - roadH - h,
            tone: floor(random(4))
        })
        x += w + random(6, 22) * scaleFactor
    }
    parallax.span = x
}

function initUfo() {
    ufo = { active: false, x: 0, y: 0, speed: 0, phase: 0, dir: 1, timer: round(random(CONFIG.ufo.spawn[0], CONFIG.ufo.spawn[1])) }
}

function initDrone() {
    drone = { active: false, x: 0, y: 0, speed: 0, phase: 0, dir: 1, timer: round(random(CONFIG.drone.spawn[0], CONFIG.drone.spawn[1])) }
}

function setSeason(s) {
    season = s
    initTrees()
    initLeaves()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(rebuildScene, 200)
}

function mixDayNight(nightColor, dayColor) {
    return lerpColor(color(nightColor), color(dayColor), dayProgress)
}

function draw() {
    let target = isDay ? 1 : 0
    dayProgress = lerp(dayProgress, target, 0.02)
    nightA = 1 - dayProgress
    dayA = dayProgress

    rainA = lerp(rainA, weather === 'rain' ? 1 : 0, 0.03)
    snowA = lerp(snowA, weather === 'snow' ? 1 : 0, 0.03)

    autoCycleTick()

    if (honkTimer <= 0) {
        honkTimer = round(random(CONFIG.honkTimer[0], CONFIG.honkTimer[1]))
        honkCar(cars[floor(random(cars.length))], false)
    } else {
        honkTimer--
    }

    if (brakeTimer <= 0) {
        brakeTimer = round(random(CONFIG.brakeTimer[0], CONFIG.brakeTimer[1]))
        let c = cars[floor(random(cars.length))]
        if (c.brake <= 0) c.brake = round(random(50, 120))
    } else {
        brakeTimer--
    }

    if (nightA > 0.3) {
        if (fireworkTimer <= 0) {
            fireworkTimer = round(random(CONFIG.fireworkTimer[0], CONFIG.fireworkTimer[1]))
            launchFirework()
            if (random() < 0.5) launchFirework()
        } else {
            fireworkTimer--
        }
    }
    background(mixDayNight('#110c21', '#70a1ff'))

    if (shake > 0) {
        shake *= 0.88
        if (shake < 0.3) shake = 0
        translate(random(-shake, shake), random(-shake, shake))
    }

    let bucket = round(dayProgress * 60)
    if (bucket !== skyBucket) {
        renderSkyPG()
        skyBucket = bucket
    }
    image(skyPG, 0, 0)

    if (nightA > 0.01) {
        push()
        drawingContext.globalAlpha = nightA
        drawSky()
        drawShootingStar()
        drawPlane()
        drawUfo()
        pop()
    }

    if (dayA > 0.01) {
        push()
        drawingContext.globalAlpha = dayA
        drawSun()
        drawClouds()
        drawBalloon()
        drawDrone()
        pop()
    }

    drawRainbow()
    drawFireworks()
    drawBirds()
    drawHero()
    drawVillain()

    drawParallax()
    drawSkylineGlow()

    for (let b of buildings) {
        drawBuilding(b)
    }

    drawRoofCat()
    drawNeonSigns()
    drawTrees()
    drawPeople()
    drawAnimals()

    drawSignalDevice()
    drawBatSignal()

    drawLamps()
    drawGroundHaze()
    drawRoad()
    drawShadows()
    drawReflections()
    drawPuddles()

    for (let car of cars) {
        drawCar(car)
    }

    drawWeather()
    drawLeaves()
    drawFireflies()
    drawSteam()
    drawChimneySmoke()
    drawVignette()
    drawShortcuts()
    drawUIButtons()
    drawStatus()
}

function autoCycleTick() {
    if (!autoCycle) return
    autoTimer--
    if (autoTimer <= 0) {
        autoTimer = CONFIG.autoCycleFrames
        toggleDayNight()
    }
}

function renderSkyPG() {
    skyPG.noStroke()
    let topColor = mixDayNight('#0a0714', '#4a7fd6')
    let botColor = mixDayNight('#241a3d', '#a9d0f0')

    for (let y = 0; y < height; y += 2) {
        let t = y / height
        skyPG.stroke(lerpColor(topColor, botColor, t))
        skyPG.line(0, y, width, y)
    }
    skyPG.noStroke()
}

function moonPos() {
    let arcY = height * 0.08 + (1 - sin(dayProgress * PI)) * height * 0.22
    return {
        x: lerp(width * 0.85, width * 0.15, dayProgress),
        y: arcY
    }
}

function sunPos() {
    let arcY = height * 0.08 + (1 - sin(dayProgress * PI)) * height * 0.22
    return {
        x: lerp(width * 0.15, width * 0.85, dayProgress),
        y: arcY
    }
}

function drawSky() {
    noStroke()
    for (let s of stars) {
        let alpha = map(sin(frameCount * s.twinkle), -1, 1, 90, 255)
        fill(255, 255, 255, alpha)
        circle(s.x, s.y, s.size)

        if (s.size > 2.2) {
            push()
            blendMode(ADD)
            stroke(255, 255, 255, alpha * 0.45)
            strokeWeight(1)
            line(s.x - 4, s.y, s.x + 4, s.y)
            line(s.x, s.y - 4, s.x, s.y + 4)
            pop()
        }
    }

    drawAurora()

    let moon = moonPos()
    let moonX = moon.x
    let moonY = moon.y

    for (let r = 130; r > 50; r -= 8) {
        fill(255, 255, 220, 8)
        circle(moonX, moonY, r)
    }

    fill(245, 245, 225)
    circle(moonX, moonY, 60)
    fill(20, 15, 35, 200)
    circle(moonX - 18, moonY - 8, 50)

    fill(255, 255, 235, 150)
    circle(moonX + 10, moonY + 12, 8)
    circle(moonX - 6, moonY + 18, 5)
}

function drawAurora() {
    push()
    blendMode(ADD)
    noStroke()
    for (let i = 0; i < 3; i++) {
        let yBase = height * (0.05 + i * 0.08)
        let col = i === 0 ? color(80, 255, 170, 24)
            : i === 1 ? color(70, 220, 255, 18)
                : color(180, 110, 255, 16)
        fill(col)
        let amp = 26 * scaleFactor
        beginShape()
        for (let x = 0; x <= width; x += 8) {
            let y = yBase
                + sin(x * 0.006 + frameCount * 0.008 + i * 2.1) * amp * 0.4
                + sin(x * 0.002 - frameCount * 0.004 + i) * amp
            vertex(x, y)
        }
        for (let x = width; x >= 0; x -= 8) {
            vertex(x, yBase + 72 * scaleFactor)
        }
        endShape(CLOSE)
    }
    pop()
}

function drawSun() {
    let sun = sunPos()
    let sunX = sun.x
    let sunY = sun.y

    noStroke()
    for (let r = 140; r > 60; r -= 8) {
        fill(255, 220, 100, 14)
        circle(sunX, sunY, r)
    }

    push()
    blendMode(ADD)
    for (let i = 0; i < 14; i++) {
        let ang = i * TWO_PI / 14 + frameCount * 0.0005
        let x1 = cos(ang) * 70
        let y1 = sin(ang) * 70
        let x2 = cos(ang - 0.06) * 170
        let y2 = sin(ang - 0.06) * 170
        let x3 = cos(ang + 0.06) * 170
        let y3 = sin(ang + 0.06) * 170
        fill(255, 230, 150, 14)
        triangle(sunX + x1, sunY + y1, sunX + x2, sunY + y2, sunX + x3, sunY + y3)
    }
    pop()

    fill(255, 205, 60)
    circle(sunX, sunY, 60)
    fill(255, 235, 150)
    circle(sunX, sunY, 40)
}

function drawClouds() {
    noStroke()
    for (let c of clouds) {
        fill(255, 255, 255, 160)
        ellipse(c.x + 3, c.y + 4, c.w, c.w * 0.4)
        fill(255, 255, 255, 220)
        ellipse(c.x, c.y, c.w, c.w * 0.4)
        ellipse(c.x + c.w * 0.3, c.y - 10, c.w * 0.6, c.w * 0.35)
        ellipse(c.x - c.w * 0.3, c.y - 5, c.w * 0.5, c.w * 0.3)

        c.x += c.speed
        if (c.x - c.w > width) {
            c.x = -c.w
        }
    }
}

function drawBirds() {
    if (dayA < 0.05) return
    noFill()
    for (let b of birds) {
        stroke(35, 45, 65, 190 * dayA)
        strokeWeight(1.6 * scaleFactor)
        strokeCap(ROUND)
        let flap = sin(frameCount * 0.12 + b.phase) * 3

        bezier(b.x - 9, b.y, b.x - 5, b.y - 5 - flap, b.x - 2, b.y - 3 + flap, b.x, b.y)
        bezier(b.x + 9, b.y, b.x + 5, b.y - 5 - flap, b.x + 2, b.y - 3 + flap, b.x, b.y)

        b.x += b.speed * scaleFactor
        if (b.x > width + 30) {
            b.x = -30
            b.y = random(height * 0.08, height * 0.28)
        }
    }
    noStroke()
}

function updateRain() {
    for (let d of rain) {
        d.y += d.speed
        d.x += d.wind * 0.3

        if (d.y > height - roadH) {
            rainSplash.push({ x: d.x, y: height - roadH, r: 0, life: 16 })
            d.y = random(-80, -10)
            d.x = random(width)
        }
    }
}

function drawRain() {
    updateRain()

    for (let s of rainSplash) {
        s.life--
        s.r += 1.4
        s.y -= 0.4
        stroke(170, 200, 220, map(s.life, 16, 0, 110, 0) * rainA)
        strokeWeight(1)
        noFill()
        ellipse(s.x, s.y, s.r, s.r * 0.3)
        ellipse(s.x, s.y, s.r * 0.5, s.r * 0.15)
    }
    rainSplash = rainSplash.filter(s => s.life > 0)

    for (let d of rain) {
        stroke(160, 190, 220, 140 * rainA)
        strokeWeight(1.2)
        line(d.x, d.y, d.x - d.wind * 1.5, d.y + d.len)
    }
    noStroke()
}

function updateSnow() {
    for (let f of snow) {
        f.y += f.speed
        f.x += sin(frameCount * 0.02 + f.phase) * 0.6
        if (f.y > height + 5) {
            f.y = random(-20, -5)
            f.x = random(width)
        }
    }
}

function drawSnow() {
    updateSnow()
    noStroke()
    for (let f of snow) {
        fill(255, 255, 255, 200 * snowA)
        circle(f.x, f.y, f.size)
    }
}

function drawWeather() {
    if (rainA > 0.03) {
        drawRain()
        updateLightning()
        drawLightning()
    } else {
        lightning.flash = max(0, lightning.flash - 14)
    }
    if (snowA > 0.03) drawSnow()
}

function updateLightning() {
    lightning.timer--
    if (lightning.timer <= 0) {
        strikeLightning()
        lightning.timer = round(random(CONFIG.lightningTimer[0], CONFIG.lightningTimer[1]))
    }
    lightning.flash = max(0, lightning.flash - 14)
}

function strikeLightning() {
    let sx = random(width * 0.2, width * 0.8)
    let topY = random(height * 0.03, height * 0.15)
    let botY = height - roadH - random(0, 30 * scaleFactor)
    let pts = [[sx, topY]]
    let x = sx
    let y = topY
    let drift = random(-1, 1) * 16
    while (y < botY) {
        y += random(10, 24)
        x += drift + random(-12, 12)
        pts.push([x, y])
        if (random() < 0.25) drift = random(-1, 1) * 16
        if (random() < 0.18 && pts.length > 3) {
            let bx = x, by = y, d = random(-18, 18)
            while (by < y + 60) {
                by += random(10, 18)
                bx += d
                pts.push([bx, by])
            }
            break
        }
    }
    lightning.bolt = pts
    lightning.flash = 255
    shake = 16
}

function drawLightning() {
    if (lightning.flash <= 0) return
    push()
    blendMode(ADD)
    noStroke()
    fill(215, 228, 255, lightning.flash * 0.07)
    rect(0, 0, width, height)
    if (lightning.flash > 45 && lightning.bolt.length > 1) {
        stroke(235, 243, 255, min(255, lightning.flash))
        strokeWeight(2)
        strokeCap(ROUND)
        noFill()
        beginShape()
        for (let p of lightning.bolt) {
            vertex(p[0], p[1])
        }
        endShape()
    }
    pop()
}

function drawBatShape(x, y, w) {
    const pts = [
        [-0.28, -0.14], [-0.20, -0.42], [-0.08, -0.24], [0.08, -0.24], [0.20, -0.42], [0.28, -0.14],
        [0.56, -0.22], [0.96, 0.06], [0.78, 0.18], [0.88, 0.36], [0.58, 0.30], [0.34, 0.14],
        [0.26, 0.40], [0.08, 0.26], [0.00, 0.48], [-0.08, 0.26], [-0.26, 0.40], [-0.34, 0.14],
        [-0.58, 0.30], [-0.88, 0.36], [-0.78, 0.18], [-0.96, 0.06], [-0.56, -0.22]
    ]
    let h = w * 0.72
    push()
    translate(x, y)
    beginShape()
    for (let p of pts) {
        vertex(p[0] * w / 2, p[1] * h / 2)
    }
    endShape(CLOSE)
    pop()
}

function tallestBuilding() {
    return tallestB
}

function signalSpot() {
    let b = tallestBuilding()
    if (!b) return { x: width / 2, y: height * 0.2 }
    return { x: b.x + b.w / 2, y: b.y - 8 * scaleFactor }
}

function signalBatInfo() {
    let s = signalSpot()
    let beamH = height * 0.5
    let w = min(width * 0.2, 170 * scaleFactor)
    return { x: s.x, y: s.y - beamH * 0.88, w: w }
}

function drawSignalDevice() {
    let s = signalSpot()
    let b = tallestBuilding()
    if (!b) return

    noStroke()
    fill(mixDayNight('#101225', '#2c3150'))
    rect(s.x - 8 * scaleFactor, b.y - 12 * scaleFactor, 16 * scaleFactor, 12 * scaleFactor, 2)
    fill(255, 240, 180, batSignal ? 230 : 70)
    circle(s.x, b.y - 10 * scaleFactor, 5 * scaleFactor)
}

function drawBatSignal() {
    if (!batSignal) return
    let s = signalSpot()
    let bat = signalBatInfo()
    let beamH = height * 0.5
    let topY = s.y - beamH
    let a = nightA

    push()
    blendMode(ADD)
    noStroke()
    fill(255, 235, 190, 22 * a)
    triangle(s.x, s.y, s.x - beamH * 0.5, topY, s.x + beamH * 0.5, topY)
    fill(255, 245, 210, 30 * a)
    triangle(s.x, s.y, s.x - beamH * 0.24, topY + beamH * 0.12, s.x + beamH * 0.24, topY + beamH * 0.12)

    for (let i = 3; i >= 1; i--) {
        fill(255, 235, 160, (4 - i) * 9 * a)
        drawBatShape(bat.x, bat.y, bat.w * (1 + i * 0.18))
    }
    pop()

    fill(255, 250, 220, 235 * a)
    drawBatShape(bat.x, bat.y, bat.w)
}

function drawHero() {
    if (!updateFlying(hero, heroCfg)) return

    heroTrail.push({ x: hero.x, y: hero.y, life: 45 })

    noStroke()
    for (let p of heroTrail) {
        p.life -= 1.8
        fill(255, 255, 255, map(p.life, 45, 0, 35, 0))
        circle(p.x, p.y, 2.5 * scaleFactor)
    }
    heroTrail = heroTrail.filter(p => p.life > 0)

    push()
    translate(hero.x, hero.y)
    scale(scaleFactor)
    if (hero.dir === -1) scale(-1, 1)

    push()
    blendMode(ADD)
    noStroke()
    fill(120, 170, 255, 45)
    ellipse(0, -2, 50, 24)
    pop()

    let wave = sin(frameCount * 0.2 + hero.phase) * 5

    noStroke()
    fill(20, 26, 48)
    triangle(-4, -7, -24 - wave, -9 + wave, -7, 8)
    triangle(-7, -4, -30 + wave, 2 + wave, -3, 7)

    fill(12, 15, 30)
    ellipse(0, -3, 18, 8)
    circle(11, -5, 7)

    fill(20, 26, 48)
    rect(9, -8, 9, 3, 1)
    rect(-10, 1, 9, 3, 1)
    rect(-15, 4, 7, 3, 1)

    fill(255, 220, 110)
    ellipse(4, -1, 4, 5)

    pop()
}

function drawVillain() {
    if (batSignal) {
        if (villain.active) {
            villain.x += villain.speed
            villain.y = lerp(villain.y, hero.active ? hero.y : villain.y, 0.02)
            villainTrail.push({ x: villain.x, y: villain.y, life: 30 })
            if ((villain.dir === 1 && villain.x > width + CONFIG.villain.margin) || (villain.dir === -1 && villain.x < -CONFIG.villain.margin)) {
                villain.active = false
                villainTrail = []
                villain.timer = 40
            }
        } else {
            if (villain.timer > 0) villain.timer--
        }

        if (!villain.active && villain.timer <= 0) {
            villain.active = true
            villainRoof = null
            villain.dir = hero.active && hero.x < width / 2 ? 1 : -1
            villain.x = villain.dir === 1 ? -CONFIG.villain.margin : width + CONFIG.villain.margin
            villain.y = random(height * 0.1, height * 0.3)
            villain.speed = villain.dir * random(CONFIG.villain.speedMin, CONFIG.villain.speedMax) * scaleFactor
            villain.phase = random(TWO_PI)
        }
        if (!villain.active) return
        drawVillainFigure()
        return
    }

    if (villain.active) {
        villain.active = false
        villainTrail = []
    }

    villainLurk--
    if (villainRoof) {
        let r = villainRoof
        if (hero.active && abs(hero.x - r.x) < 150 && abs(hero.y - r.y) < 150) {
            villainRoof = null
            villainLurk = round(random(400, 700))
        }
    } else if (villainLurk <= 0) {
        let cands = buildings.filter(b => b.roof === 'flat' || b.roof === 'taper')
        if (cands.length > 0) {
            let b = cands[floor(random(cands.length))]
            villainRoof = { x: b.x + b.w * 0.5, y: b.y - 10 * scaleFactor, w: b.tw }
        }
        villainLurk = round(random(600, 1000))
    }
    if (villainRoof) drawVillainOnRoof(villainRoof)
}

function drawVillainFigure() {
    noStroke()
    for (let p of villainTrail) {
        p.life -= 2
        fill(255, 60, 90, map(p.life, 30, 0, 40, 0))
        circle(p.x, p.y, 2.5 * scaleFactor)
    }
    villainTrail = villainTrail.filter(p => p.life > 0)

    push()
    translate(villain.x, villain.y)
    scale(scaleFactor)
    if (villain.dir === -1) scale(-1, 1)

    push()
    blendMode(ADD)
    noStroke()
    fill(255, 60, 90, 26 * nightA)
    ellipse(0, 4, 60, 14)
    pop()

    noStroke()
    fill(18, 12, 22)
    triangle(-6, -2, -22, 8, -2, 10)
    ellipse(0, 0, 14, 16)
    fill(6, 6, 12)
    circle(0, -2, 8)
    fill(255, 70, 60, 120 + 100 * nightA)
    circle(0, -2, 3)
    fill(18, 12, 22)
    rect(-9, 6, 16, 8, 2)
    pop()
}

function drawVillainOnRoof(r) {
    let s = scaleFactor
    let sway = sin(frameCount * 0.05) * 2 * s
    push()
    translate(r.x, r.y)
    scale(s)
    noStroke()
    fill(14, 10, 18, 235)
    ellipse(sway, 0, 18, 8)
    circle(sway, -5, 8)
    fill(6, 6, 12)
    circle(sway, -5, 4)
    fill(255, 70, 60, 200)
    circle(sway, -5, 1.6)
    pop()
}

function resetShootingStar() {
    shootingStar.x = random(width * 0.1, width * 0.5)
    shootingStar.y = random(20, height * 0.2)
    shootingStar.speedX = random(6, 10)
    shootingStar.speedY = random(3, 6)
}

function drawShootingStar() {
    for (let i = 0; i < 5; i++) {
        let alpha = map(i, 0, 5, 200, 0)
        stroke(255, 255, 210, alpha)
        strokeWeight(2.5 - i * 0.3)
        line(
            shootingStar.x - shootingStar.speedX * i,
            shootingStar.y - shootingStar.speedY * i,
            shootingStar.x - shootingStar.speedX * (i + 1),
            shootingStar.y - shootingStar.speedY * (i + 1)
        )
    }
    noStroke()

    shootingStar.x += shootingStar.speedX
    shootingStar.y += shootingStar.speedY

    if (shootingStar.x > width || shootingStar.y > height * 0.5) {
        resetShootingStar()
    }
}

function drawSkylineGlow() {
    noStroke()
    fill(mixDayNight(color(120, 90, 200, 35), color(180, 210, 255, 30)))
    let glowH = 220 * scaleFactor
    rect(0, height - glowH, width, glowH)
}

function drawLamps() {
    let lampY = height - roadH - 4 * scaleFactor
    for (let l of lamps) {
        if (!l.on) continue
        stroke(mixDayNight('#101225', '#2c3150'))
        strokeWeight(3 * scaleFactor)
        line(l.x, lampY, l.x, lampY - 45 * scaleFactor)
        noStroke()

        fill(255, 220, 140, 90 * nightA)
        circle(l.x, lampY - 45 * scaleFactor, 26 * scaleFactor)
        fill(255, 240, 190, 220 * nightA)
        circle(l.x, lampY - 45 * scaleFactor, 10 * scaleFactor)

        noStroke()
        fill(255, 220, 140, 34 * nightA)
        ellipse(l.x, height - roadH + 6, 64 * scaleFactor, 14 * scaleFactor)
    }
}

function drawFireflies() {
    if (season !== 'summer') return
    if (nightA < 0.05) return
    push()
    blendMode(ADD)
    noStroke()
    let minY = height - roadH - 130 * scaleFactor
    let maxY = height - roadH - 10 * scaleFactor
    for (let f of fireflies) {
        f.x += sin(frameCount * 0.02 + f.phase) * f.speed
        f.y += cos(frameCount * 0.015 + f.phase * 1.3) * f.speed * 0.5
        if (f.x < 0) f.x = width
        if (f.x > width) f.x = 0
        f.y = constrain(f.y, minY, maxY)
        let glow = (sin(frameCount * 0.1 + f.phase) + 1) / 2
        fill(210, 255, 150, (60 + glow * 130) * nightA)
        circle(f.x, f.y, 6 + glow * 10)
        fill(240, 255, 200, (120 + glow * 120) * nightA)
        circle(f.x, f.y, 2.5)
    }
    pop()
}

function drawPeople() {
    for (let p of people) {
        p.x += p.speed
        if (p.speed > 0 && p.x > width + 20) p.x = -20
        if (p.speed < 0 && p.x < -20) p.x = width + 20

        let s = scaleFactor
        let bob = sin(frameCount * 0.1 + p.phase) * 2 * s
        let step = sin(frameCount * 0.1 + p.phase)

        push()
        translate(p.x, p.y + bob)
        scale(s)
        if (p.speed < 0) scale(-1, 1)

        let coat = lerpColor(color(p.coat), color(8, 10, 18), 0.8 * nightA)
        noStroke()

        fill(coat)
        triangle(-3, 0, -3, 8 + step * 3, 0, 8)
        triangle(3, 0, 3, 8 - step * 3, 0, 8)
        rect(-4, -10, 8, 12, 2)
        fill(lerpColor(color(p.coat), color(0), 0.6))
        circle(0, -14, 6)

        if (rainA > 0.5) {
            fill(lerpColor(color('#2a2f4a'), color(0), 0.7 * nightA))
            arc(0, -16, 16, 12, PI, TWO_PI)
            stroke(60, 60, 80)
            strokeWeight(1)
            line(0, -16, 0, -8)
            noStroke()
        }
        pop()
    }
}

function drawSteam() {
    if (frameCount % 16 === 0) {
        for (let v of vents) {
            steam.push({ x: v.x + random(-4, 4), y: v.y, r: random(2, 3.5), life: random(36, 66) })
        }
    }
    noStroke()
    for (let p of steam) {
        p.y -= 0.6 * scaleFactor
        p.x += sin(p.life * 0.15) * 0.4
        p.r += 0.2
        p.life--
        fill(255, 255, 255, map(p.life, 66, 0, 46, 0))
        circle(p.x, p.y, p.r * 2)
    }
    steam = steam.filter(p => p.life > 0)
}

function drawChimneySmoke() {
    if (frameCount % 40 === 0) {
        for (let b of buildings) {
            if (!b.chimney) continue
            let topX = buildingTopX(b)
            let cx = topX + b.tw * b.chimney.x
            let drift = weather === 'rain' ? random(-1.2, -0.6) : random(-0.5, -0.2)
            chimneySmoke.push({
                x: cx + random(-2, 2),
                y: b.y - 10 * scaleFactor - b.chimney.h,
                r: random(2, 3) * scaleFactor,
                life: random(60, 110),
                drift: drift
            })
        }
    }
    noStroke()
    for (let p of chimneySmoke) {
        p.y -= 0.35 * scaleFactor
        p.x += p.drift * scaleFactor + sin(p.life * 0.1) * 0.2
        p.r += 0.15 * scaleFactor
        p.life--
        fill(210, 215, 225, map(p.life, 110, 0, 70, 0))
        circle(p.x, p.y, p.r * 2)
    }
    chimneySmoke = chimneySmoke.filter(p => p.life > 0)
}

function drawPuddles() {
    let target = rainA
    for (let p of puddles) {
        p.a = lerp(p.a, target, 0.02)
        if (p.a < 0.03) continue
        let shimmer = 0.6 + 0.4 * sin(frameCount * 0.05 + p.x * 0.01)
        fill(40, 50, 85, 140 * p.a)
        ellipse(p.x, p.y, p.r, p.r * 0.32)
        fill(160, 190, 215, 60 * p.a)
        ellipse(p.x - p.r * 0.18, p.y - 1, p.r * 0.55, p.r * 0.12)
        let lit = false
        for (let l of lamps) {
            if (l.on && abs(l.x - p.x) < 90 * scaleFactor) { lit = true; break }
        }
        if (lit && nightA > 0.1) {
            fill(255, 215, 145, 45 * nightA * p.a * shimmer)
            ellipse(p.x, p.y + 1, p.r * 0.8, p.r * 0.15)
        }
    }
}

function drawAnimals() {
    for (let a of animals) {
        a.x += a.speed
        if (a.speed > 0 && a.x > width + 30) a.x = -30
        if (a.speed < 0 && a.x < -30) a.x = width + 30

        let s = scaleFactor
        let leg = sin(frameCount * 0.15 + a.phase)
        let bob = abs(leg) * 1.5 * s
        let col = lerpColor(color(a.col), color(8, 10, 18), 0.75 * nightA)

        push()
        translate(a.x, a.y + bob)
        scale(s)
        if (a.speed < 0) scale(-1, 1)
        noStroke()
        fill(col)

        if (a.kind === 'cat') {
            ellipse(0, 0, 14, 5)
            circle(6, -4, 5)
            triangle(5, -6, 6, -9, 8, -6)
            triangle(8, -6, 9, -9, 11, -6)
            stroke(col)
            strokeWeight(1.2)
            line(-6, -1, -10, -4)
            noStroke()
        } else {
            ellipse(0, 0, 16, 6)
            circle(6, -4, 6)
            ellipse(8, -3, 4, 3)
            stroke(col)
            strokeWeight(1.2)
            line(-7, -1, -10, -4)
            noStroke()
        }

        fill(lerpColor(color(a.col), color(0), 0.45))
        for (let i = 0; i < 4; i++) {
            let lx = -6 + i * 4
            let lift = i % 2 === 0 ? leg : -leg
            rect(lx, 0, 1.5, 3 + lift * 0.4)
        }
        pop()
    }
}

function drawParallax() {
    let ox = (mouseX - width / 2) * 0.03
    let span = parallax.span || width
    let col = mixDayNight(color(14, 16, 30, 150), color(120, 140, 175, 150))
    noStroke()
    for (let p of parallax) {
        for (let o of [ox, ox + span, ox - span]) {
            let x = p.x + o
            if (x < -p.w - 10 || x > width + 10) continue
            fill(col)
            rect(x, p.y, p.w, p.h)
            rect(x + p.w * 0.5 - p.w * 0.08, p.y - 8 * scaleFactor, p.w * 0.16, 8 * scaleFactor)
            if (nightA > 0.3 && p.tone === 0) {
                fill(255, 205, 120, 55 * nightA)
                for (let i = 0; i < 3; i++) {
                    rect(x + p.w * 0.15 + i * p.w * 0.3, p.y + p.h * 0.3 + i * p.h * 0.2, 3 * scaleFactor, 4 * scaleFactor)
                }
            }
        }
    }
}

function updateFlying(o, cfg) {
    if (o.timer > 0) o.timer--
    if (!o.active && o.timer <= 0) {
        o.active = true
        o.dir = random() > 0.5 ? 1 : -1
        o.x = o.dir === 1 ? -cfg.margin : width + cfg.margin
        o.y = random(height * cfg.yMin, height * cfg.yMax)
        o.speed = o.dir * random(cfg.speedMin, cfg.speedMax) * scaleFactor
        if (cfg.onSpawn) cfg.onSpawn(o)
    }
    if (o.active) {
        o.x += o.speed
        if ((o.dir === 1 && o.x > width + cfg.margin) || (o.dir === -1 && o.x < -cfg.margin)) {
            o.active = false
            o.timer = round(random(cfg.cooldown[0], cfg.cooldown[1]))
            if (cfg.onDone) cfg.onDone(o)
        }
    }
    return o.active
}

function drawPlane() {
    if (nightA < 0.05) return
    if (!updateFlying(plane, planeCfg)) return

    push()
    translate(plane.x, plane.y)
    scale(scaleFactor)
    if (plane.dir === -1) scale(-1, 1)

    push()
    blendMode(ADD)
    stroke(255, 245, 210, 30)
    strokeWeight(2)
    line(-70, 0, -10, 0)
    pop()

    noStroke()
    fill(235, 240, 250, 230)
    ellipse(0, 0, 26, 6)
    fill(160, 175, 205, 230)
    ellipse(-13, 0, 6, 3)

    fill(210, 220, 240, 220)
    triangle(-2, -1, 6, -1, 4, -15)
    triangle(-2, 1, 6, 1, 4, 15)

    fill(200, 210, 235, 220)
    triangle(-14, -1, -9, -1, -11, -9)

    let b = sin(frameCount * 0.25) > 0 ? 255 : 60
    fill(255, 80, 80, b)
    circle(-14, 0, 2.5)
    let b2 = sin(frameCount * 0.25 + PI) > 0 ? 255 : 60
    fill(140, 255, 160, b2)
    circle(10, 0, 2.5)

    pop()
}

function drawUfo() {
    if (nightA < 0.05) return
    if (!updateFlying(ufo, ufoCfg)) return

    let bob = sin(frameCount * 0.04 + ufo.phase) * 6 * scaleFactor
    push()
    translate(ufo.x, ufo.y + bob)
    scale(scaleFactor)
    if (ufo.dir === -1) scale(-1, 1)

    push()
    blendMode(ADD)
    noStroke()
    fill(180, 255, 200, 22 * nightA)
    triangle(-12, 2, 12, 2, 0, 46)
    pop()

    noStroke()
    fill(150, 165, 190)
    ellipse(0, 0, 30, 10)
    fill(90, 110, 145)
    ellipse(0, 1, 30, 8)
    fill(210, 235, 255)
    arc(0, -3, 12, 12, PI, TWO_PI)
    fill(120, 200, 255, 200)
    circle(0, -4, 6)

    let blink = sin(frameCount * 0.3 + ufo.phase) > 0 ? 255 : 90
    fill(255, 90, 120, blink)
    circle(-11, 0, 3)
    fill(120, 255, 160, blink)
    circle(11, 0, 3)
    pop()
}

function drawDrone() {
    if (dayA < 0.05) return
    if (!updateFlying(drone, droneCfg)) return

    let wob = sin(frameCount * 0.25 + drone.phase) * 3 * scaleFactor
    push()
    translate(drone.x, drone.y + wob)
    scale(scaleFactor)
    if (drone.dir === -1) scale(-1, 1)

    noStroke()
    fill(30, 34, 46)
    rect(-4, -2, 8, 4, 2)
    fill(70, 80, 100)
    rect(-10, -5, 4, 3, 1)
    rect(6, -5, 4, 3, 1)
    rect(-10, 2, 4, 3, 1)
    rect(6, 2, 4, 3, 1)
    let blink = sin(frameCount * 0.4 + drone.phase) > 0 ? 255 : 80
    fill(255, 40, 40, blink)
    circle(0, -2, 2)
    fill(255, 255, 255, 160)
    rect(-1, -6, 2, 2)
    pop()
}

function drawTrees() {
    let snow = snowA > 0.5
    for (let t of trees) {
        let sway = sin(frameCount * 0.02 + t.phase) * 2 * scaleFactor
        push()
        translate(t.x, t.y)
        fill(0, 0, 0, 60)
        ellipse(0, 3, t.size * 0.9, 6)
        fill(lerpColor(color('#5b3d26'), color(18, 14, 12), 0.6 * nightA))
        rect(-3 * scaleFactor, -t.size * 0.28, 6 * scaleFactor, t.size * 0.28, 2)
        if (season === 'winter') {
            fill(lerpColor(color('#3a3a40'), color(12, 14, 20), 0.6 * nightA))
            circle(sway, -t.size * 0.4, t.size * 0.6)
            if (snow) {
                fill(235, 242, 250, 200)
                circle(sway, -t.size * 0.4, t.size * 0.3)
            }
        } else {
            let c = color(t.green)
            let ccol = snow
                ? lerpColor(c, color(245, 248, 255), 0.65)
                : lerpColor(c, color(8, 12, 10), 0.55 * nightA)
            fill(ccol)
            circle(sway, -t.size * 0.4, t.size)
            fill(lerpColor(ccol, color(255, 255, 255), 0.1))
            circle(sway - t.size * 0.18, -t.size * 0.52, t.size * 0.58)
            circle(sway + t.size * 0.16, -t.size * 0.48, t.size * 0.52)
            circle(sway, -t.size * 0.56, t.size * 0.5)
            if (season === 'spring') {
                fill(255, 205, 225, 120)
                circle(sway - t.size * 0.08, -t.size * 0.5, t.size * 0.16)
                circle(sway + t.size * 0.12, -t.size * 0.42, t.size * 0.12)
            }
            if (snow) {
                fill(235, 242, 250, 200)
                circle(sway, -t.size * 0.44, t.size * 0.34)
            }
        }
        pop()
    }
}

function drawShadows() {
    if (dayA < 0.05) return
    let sun = sunPos()
    noStroke()
    fill(0, 0, 30, 24 * dayA)
    for (let b of buildings) {
        let c = b.x + b.w / 2
        let sx = c - sun.x
        let sLen = width * 0.34 * constrain(abs(sx) / width, 0.06, 1) * dayA
        let dir = sx > 0 ? 1 : -1
        quad(c - b.w / 2, height - 2, c + b.w / 2, height - 2,
            c + b.w / 2 + dir * sLen, height - roadH * 0.6, c - b.w / 2 + dir * sLen, height - roadH * 0.6)
    }
}

function drawLeaves() {
    if (rainA > 0.3 || snowA > 0.3) return
    if (season !== 'spring' && season !== 'autumn') return
    for (let l of leaves) {
        l.y += l.speed
        l.x += sin(frameCount * 0.02 + l.sway) * 0.8
        if (l.y > height + 10) {
            l.y = random(-30, -5)
            l.x = random(width)
        }
        push()
        translate(l.x, l.y)
        rotate(sin(frameCount * 0.05 + l.sway) * 0.5)
        if (l.kind === 'petal') {
            fill(lerpColor(color(l.col), color(40, 20, 30), 0.3 * nightA))
            ellipse(0, 0, l.size * 1.2, l.size * 0.8)
        } else {
            fill(lerpColor(color(l.col), color(20, 25, 15), 0.5 * nightA))
            ellipse(0, 0, l.size * 1.6, l.size)
        }
        pop()
    }
}

function launchFirework(x, targetY) {
    let c = fwColors[floor(random(fwColors.length))]
    fireworks.push({
        x: x === undefined ? random(width * 0.15, width * 0.85) : x,
        targetY: targetY === undefined ? random(height * 0.08, height * 0.3) : targetY,
        y: height + 10,
        col: c,
        stage: 'up',
        parts: []
    })
}

function drawFireworks() {
    for (let f of fireworks) {
        if (f.stage === 'up') {
            f.y -= 7 * scaleFactor
            if (f.y <= f.targetY) {
                f.stage = 'burst'
                f.parts = []
                let n = 46
                for (let i = 0; i < n; i++) {
                    let a = (i / n) * TWO_PI + random(-0.1, 0.1)
                    let sp = random(2, 6) * scaleFactor
                    f.parts.push({ x: f.x, y: f.y, vx: cos(a) * sp, vy: sin(a) * sp, life: random(38, 66) })
                }
            }
            push()
            blendMode(ADD)
            noStroke()
            fill(255, 235, 180, 200)
            circle(f.x, f.y, 3)
            stroke(255, 220, 150, 150)
            strokeWeight(2)
            line(f.x, f.y, f.x, f.y + 14)
            pop()
        } else {
            let r = f.col[0], g = f.col[1], b = f.col[2]
            push()
            blendMode(ADD)
            noStroke()
            for (let p of f.parts) {
                p.x += p.vx
                p.y += p.vy
                p.vy += 0.12
                p.vx *= 0.985
                p.life--
                if (p.life <= 0) continue
                let a = map(p.life, 66, 0, 200, 0)
                fill(r, g, b, a)
                circle(p.x, p.y, 3)
                stroke(r, g, b, a * 0.5)
                strokeWeight(1)
                line(p.x, p.y, p.x - p.vx * 2, p.y - p.vy * 2)
            }
            pop()
        }
    }
    fireworks = fireworks.filter(f => f.stage === 'up' || f.parts.length > 0)
}

function drawNeonSigns() {
    if (nightA < 0.05) return
    for (let b of buildings) {
        if (!b.sign) continue
        let s = b.sign
        let c = color(s.c)
        let r = red(c), g = green(c), bl = blue(c)
        let cx = b.x + b.w / 2
        let a = nightA * (random() < 0.008 ? 0.35 : 1)
        push()
        blendMode(ADD)
        textAlign(CENTER, CENTER)
        textStyle(BOLD)
        let base = constrain(b.w * 0.2, 10, 20) * scaleFactor
        for (let i = 3; i >= 1; i--) {
            textSize(base + i * 4)
            fill(r, g, bl, (4 - i) * 12 * a)
            text(s.t, cx, s.y)
        }
        textSize(base)
        fill(r, g, bl, 235 * a)
        text(s.t, cx, s.y)
        pop()
    }
}

function drawRainbow() {
    if (rainbowTimer <= 0) return
    rainbowTimer--
    let cx = width * 0.5
    let cy = height * 0.95
    let r0 = min(width, height) * 0.55
    let a = map(rainbowTimer, 600, 0, 110, 0) * (0.35 + 0.65 * dayA)
    if (a <= 1) return
    noFill()
    let cols = ['#ff5b5b', '#ff9f43', '#ffd75b', '#7bff8c', '#5bc9ff', '#9b7bff']
    for (let i = 0; i < cols.length; i++) {
        let c = color(cols[i])
        stroke(red(c), green(c), blue(c), a)
        strokeWeight(6 * scaleFactor)
        arc(cx, cy, (r0 - i * 8 * scaleFactor) * 2, (r0 - i * 8 * scaleFactor) * 2, PI, TWO_PI)
    }
    noStroke()
}

function drawBalloon() {
    if (dayA < 0.05) return
    if (!updateFlying(balloon, balloonCfg)) return
    balloon.y += sin(frameCount * 0.01) * 0.3

    push()
    translate(balloon.x, balloon.y)
    scale(scaleFactor)
    if (balloon.dir === -1) scale(-1, 1)
    noStroke()
    fill('#e55b5b')
    ellipse(0, -4, 36, 42)
    fill('#ffd75b')
    ellipse(0, -4, 22, 42)
    fill('#ffffff')
    ellipse(0, -4, 10, 42)
    fill(90, 60, 40)
    triangle(-4, 14, 4, 14, 0, 26)
    fill('#6b3f2a')
    rect(-8, 26, 16, 10, 2)
    fill(255, 200, 120, 160)
    ellipse(0, 24, 10, 5)
    pop()
}

function drawRoofCat() {
    if (buildings.length === 0) return
    let b = buildings[roofCatIdx] || buildings[0]
    let s = scaleFactor
    let cx = b.x + b.w * 0.4
    let cy = b.y - 12 * s
    let swish = sin(frameCount * 0.08) * 4 * s
    noStroke()
    fill(18, 16, 24, 230)
    ellipse(cx, cy, 12 * s, 8 * s)
    circle(cx + 6 * s, cy - 4 * s, 6 * s)
    triangle(cx + 4 * s, cy - 7 * s, cx + 6 * s, cy - 10 * s, cx + 8 * s, cy - 6 * s)
    triangle(cx + 7 * s, cy - 7 * s, cx + 9 * s, cy - 10 * s, cx + 10 * s, cy - 5 * s)
    stroke(18, 16, 24, 220)
    strokeWeight(2 * s)
    line(cx - 6 * s, cy, cx - 12 * s, cy + 7 * s + swish)
    noStroke()
}

function drawStatus() {
    noStroke()
    fill(255, 255, 255, 150)
    textAlign(LEFT, TOP)
    textSize(12 * scaleFactor)
    let names = { summer: 'ЗУН', autumn: 'НАМАР', winter: 'ӨВӨЛ', spring: 'ХАВАР' }
    let txt = names[season]
    if (autoCycle) txt += ' • AUTO'
    if (weather !== 'clear') txt += ' • ' + (weather === 'rain' ? 'БОРОО' : 'ЦАС')
    text(txt, 14, 12)
}

function drawReflections() {
    if (nightA < 0.05) return
    push()
    blendMode(ADD)
    noStroke()

    let m = moonPos()
    let colW = 26 * scaleFactor
    for (let i = 0; i < 3; i++) {
        fill(255, 240, 200, (34 - i * 11) * nightA)
        rect(m.x - colW * (0.6 - i * 0.15), height - roadH + 2, colW * (1.2 - i * 0.3), roadH)
    }

    let lampY = height - roadH - 4 * scaleFactor
    for (let l of lamps) {
        if (!l.on) continue
        let streakW = 3 * scaleFactor
        let flick = 0.5 + 0.5 * sin(frameCount * 0.05 + l.x * 0.01)
        fill(255, 220, 150, 46 * nightA * flick)
        rect(l.x - streakW / 2, height - roadH + 2, streakW, roadH)
        fill(255, 240, 190, 26 * nightA)
        rect(l.x - streakW * 2, height - roadH + 2, streakW * 4, roadH)
    }

    drawBuildingReflections()

    pop()
}

function drawBuildingReflections() {
    let rw = round(width)
    let rh = round(roadH)
    if (!reflPG || reflPG.width !== rw || reflPG.height !== rh) {
        if (reflPG) reflPG.remove()
        reflPG = createGraphics(rw, rh)
    }
    reflRedraw++
    if (reflDirty || reflRedraw % CONFIG.reflectionRefresh === 0) {
        renderBuildingReflections()
        reflDirty = false
    }
    image(reflPG, 0, height - roadH)
}

function renderBuildingReflections() {
    let pg = reflPG
    pg.clear()
    pg.noStroke()
    for (let b of buildings) {
        if (!b.lightsOn) continue
        for (let i = 0; i < 7; i++) {
            let seed = (b.x + i * 37) % 97 / 97
            let wx = b.x + seed * b.w
            let frac = ((i * 13) % 100) / 100
            let hh = (2 + frac * 8) * scaleFactor
            let shimmer = 0.7 + 0.3 * sin(frameCount * 0.06 + i * 2.2 + b.x * 0.01)
            pg.fill(255, 210, 130, 20 * nightA * shimmer)
            pg.rect(wx, 2 + frac * roadH, 2.2 * scaleFactor, hh)
        }
    }
}

function buildingTopX(b) {
    return b.x + (b.w - b.tw) / 2
}

function buildingWidthAt(b, y) {
    let t = constrain((y - b.y) / (height - b.y), 0, 1)
    return lerp(b.tw, b.w, t)
}

function drawBuilding(b) {
    noStroke()

    fill(0, 0, 0, 60)
    rect(b.x + 4, b.y + 4, b.w, height - b.y)

    let topC = mixDayNight(b.baseColor, b.dayTint)
    let botC = mixDayNight('#14152a', '#333a56')
    for (let y = b.y; y < height; y += 4) {
        let t = (y - b.y) / (height - b.y)
        let wAt = buildingWidthAt(b, y)
        let left = b.x + (b.w - wAt) / 2
        stroke(lerpColor(topC, botC, t))
        strokeWeight(4)
        line(left, y, left + wAt, y)
    }
    noStroke()

    stroke(mixDayNight('#3a3f66', '#6b7396'))
    strokeWeight(1.5)
    noFill()
    let topX = buildingTopX(b)
    beginShape()
    vertex(topX, b.y)
    vertex(topX + b.tw, b.y)
    vertex(b.x + b.w, height)
    vertex(b.x, height)
    endShape(CLOSE)
    noStroke()

    drawRoof(b, topC)
    drawBuildingTop(b)
    drawWindows(b)
    drawAwning(b)
}

function drawAwning(b) {
    if (!b.awning || b.w < 40 * scaleFactor) return
    noStroke()
    let aw = b.w * 0.8
    let ax = b.x + b.w * 0.1
    let ay = height - 92 * scaleFactor
    let aH = 15 * scaleFactor
    let stripes = 5
    let col = lerpColor(color(b.awningCol), color(15, 12, 22), 0.6 * nightA)
    for (let i = 0; i < stripes; i++) {
        fill(i % 2 === 0 ? col : color(245, 240, 235, 240))
        rect(ax + i * aw / stripes, ay, aw / stripes + 0.5, aH)
    }
    for (let i = 0; i < stripes; i++) {
        fill(i % 2 === 0 ? col : color(245, 240, 235, 240))
        arc(ax + (i + 0.5) * aw / stripes, ay + aH, aw / stripes, 8 * scaleFactor, 0, PI)
    }
}

function drawRoof(b, topC) {
    noStroke()
    let topX = buildingTopX(b)
    let roofC = lerpColor(topC, color('#2c3150'), 0.18)

    if (b.roof === 'peak') {
        let peakH = b.tw * 0.55
        fill(roofC)
        triangle(topX, b.y, topX + b.tw, b.y, topX + b.tw / 2, b.y - peakH)
        if (snowA > 0.5) {
            fill(240, 246, 255, 200)
            triangle(topX, b.y, topX + b.tw, b.y, topX + b.tw / 2, b.y - peakH * 0.55)
        }
    } else if (b.roof === 'dome') {
        fill(roofC)
        ellipse(topX + b.tw / 2, b.y, b.tw * 1.02, b.tw * 0.72)
        if (snowA > 0.5) {
            fill(240, 246, 255, 200)
            ellipse(topX + b.tw / 2, b.y - b.tw * 0.04, b.tw * 0.6, b.tw * 0.38)
        }
    } else if (b.roof === 'spire') {
        fill(lerpColor(topC, color('#2c3150'), 0.35))
        let h = b.tw * 1.4
        let wTop = 2 * scaleFactor
        quad(topX, b.y, topX + b.tw, b.y, topX + b.tw / 2 + wTop, b.y - h, topX + b.tw / 2 - wTop, b.y - h)
        if (snowA > 0.5) {
            fill(240, 246, 255, 180)
            quad(topX + b.tw * 0.3, b.y, topX + b.tw * 0.7, b.y, topX + b.tw / 2 + wTop, b.y - h, topX + b.tw / 2 - wTop, b.y - h)
        }
    } else if (b.roof === 'step') {
        let inset = b.tw * 0.14
        let stepH = b.tw * 0.16
        fill(roofC)
        rect(topX + inset, b.y - stepH, b.tw - inset * 2, stepH)
        rect(topX + inset * 1.8, b.y - stepH * 2, b.tw - inset * 3.6, stepH)
        if (snowA > 0.5) {
            fill(240, 246, 255, 200)
            rect(topX + inset, b.y - stepH - 2, b.tw - inset * 2, 3)
            rect(topX + inset * 1.8, b.y - stepH * 2 - 2, b.tw - inset * 3.6, 3)
        }
    }
}

function drawBuildingTop(b) {
    let topX = buildingTopX(b)
    if (b.roof === 'flat' || b.roof === 'taper') {
        fill(mixDayNight('#101225', '#2c3150'))
        rect(topX + b.tw * 0.15, b.y - 10, b.tw * 0.7, 10)
        if (snowA > 0.5) {
            fill(235, 242, 250, 200)
            rect(topX + b.tw * 0.15 - 2, b.y - 12, b.tw * 0.7 + 4, 4, 2)
        }

        if (b.chimney) {
            let cx = topX + b.tw * b.chimney.x
            fill(mixDayNight('#0d0f1e', '#33395a'))
            rect(cx - 3 * scaleFactor, b.y - 10 * scaleFactor - b.chimney.h, 6 * scaleFactor, b.chimney.h, 1)
        }

        if (b.roofDecor) {
            let dx = topX + b.tw * b.decorX
            let col = mixDayNight('#101225', '#2c3150')
            if (b.roofDecor === 'ac') {
                fill(col)
                rect(dx - 5 * scaleFactor, b.y - 16 * scaleFactor, 10 * scaleFactor, 6 * scaleFactor, 1)
                fill(lerpColor(col, color(255), 0.15))
                rect(dx - 3 * scaleFactor, b.y - 14.5 * scaleFactor, 3 * scaleFactor, 3 * scaleFactor, 1)
                rect(dx + 1 * scaleFactor, b.y - 14.5 * scaleFactor, 3 * scaleFactor, 3 * scaleFactor, 1)
            } else {
                stroke(col)
                strokeWeight(1.5)
                line(dx, b.y - 10, dx, b.y - 14 * scaleFactor)
                noStroke()
                fill(col)
                circle(dx, b.y - 16 * scaleFactor, 5 * scaleFactor)
                fill(lerpColor(col, color(255), 0.2))
                arc(dx, b.y - 16 * scaleFactor, 3.5 * scaleFactor, 3.5 * scaleFactor, PI, TWO_PI)
            }
        }

        if (b.hasAntenna) {
            stroke(mixDayNight('#101225', '#2c3150'))
            strokeWeight(2)
            line(topX + b.tw * 0.5, b.y - 10, topX + b.tw * 0.5, b.y - 30)
            noStroke()
            let blink = map(sin(frameCount * 0.05), -1, 1, 120, 255) * nightA
            fill(255, 90, 90, blink)
            circle(topX + b.tw * 0.5, b.y - 30, 6)
            if (snowA > 0.5) {
                fill(235, 242, 250, 180)
                rect(topX + b.tw * 0.5 - 3, b.y - 34, 6, 3, 2)
            }
        }
    } else {
        let tipY = b.y
        if (b.roof === 'peak') tipY = b.y - b.tw * 0.55
        else if (b.roof === 'dome') tipY = b.y - b.tw * 0.36
        else if (b.roof === 'step') tipY = b.y - b.tw * 0.32
        else if (b.roof === 'spire') tipY = b.y - b.tw * 1.4
        let blink = map(sin(frameCount * 0.05), -1, 1, 120, 255) * nightA
        fill(255, 90, 90, blink)
        circle(topX + b.tw / 2, tipY - 6, 3.5)
    }
}

function drawWindows(b) {
    let pw = round(b.w)
    let ph = round(height - b.y)
    if (!b.windowsPG || b.windowsPG.width !== pw || b.windowsPG.height !== ph) {
        if (b.windowsPG) b.windowsPG.remove()
        b.windowsPG = createGraphics(pw, ph)
    }
    b.windowFrame = (b.windowFrame || 0) + 1
    if (b.windowsDirty || b.windowFrame % CONFIG.windowRefresh === 0) {
        renderWindows(b)
        b.windowsDirty = false
    }
    image(b.windowsPG, b.x, b.y)
}

function renderWindows(b) {
    let pg = b.windowsPG
    let bx = b.x
    let by = b.y
    let bw = b.w
    let rows = 7
    let cols = 3
    let padY = (height - by - 70) / (rows + 1)

    pg.clear()
    pg.noStroke()
    pg.push()
    pg.translate(-bx, -by)
    for (let r = 1; r <= rows; r++) {
        let t = (r - 1) / (rows - 1)
        let wAt = lerp(b.tw, bw, t)
        let left = bx + (bw - wAt) / 2
        let padX = wAt / (cols + 1)
        for (let c = 1; c <= cols; c++) {
            let wx = left + c * padX - 8
            let wy = by + r * padY - 6

            pg.fill(35, 37, 60)
            pg.rect(wx, wy, 16, 12, 2)

            if (b.lightsOn) {
                let glow = map(sin(frameCount * b.flicker + r + c), -1, 1, 150, 255)
                pg.fill(255, 200, 120, 45 * nightA)
                pg.rect(wx - 3, wy - 3, 22, 18, 4)
                pg.fill(255, 224, 150, glow * nightA)
                pg.rect(wx, wy, 16, 12, 2)

                let hash = (r * 7 + c * 13 + bx) % 11
                if (hash === 0) {
                    let sway = sin(frameCount * 0.08 + r * 2 + c * 3) * 2
                    pg.fill(24, 18, 34, 200 * nightA)
                    pg.circle(wx + 8 + sway, wy + 3, 5)
                    pg.ellipse(wx + 8 + sway, wy + 9, 8, 6)
                }
            }

            pg.fill(191, 227, 242, 255 * dayA)
            pg.rect(wx, wy, 16, 12, 2)
        }
    }
    pg.pop()
}

function drawGroundHaze() {
    noStroke()
    fill(mixDayNight(color(140, 100, 220, 20), color(255, 255, 255, 20)))
    rect(0, height - roadH - 30 * scaleFactor, width, 30 * scaleFactor)
}

function drawRoad() {
    noStroke()
    fill(mixDayNight('#151622', '#3c4152'))
    rect(0, height - roadH, width, roadH)

    fill(mixDayNight('#101018', '#31353f'))
    rect(0, height - roadH, width, 8 * scaleFactor)

    let midY = height - roadH / 2

    stroke(255, 200, 100)
    strokeWeight(2)
    line(0, midY, width, midY)

    noStroke()
    fill(255, 255, 255, 160)
    let dashW = 26 * scaleFactor
    let gap = 20 * scaleFactor
    let offset = (frameCount * 3 * scaleFactor) % (dashW + gap)
    for (let x = -offset; x < width; x += dashW + gap) {
        rect(x, midY - 1.5, dashW, 3, 1)
    }
}

function drawVignette() {
    noStroke()
    for (let i = 0; i < 4; i++) {
        fill(0, 0, 0, 10)
        rect(0, 0, width, i * 6 + 2)
        rect(0, height - (i * 6 + 2), width, i * 6 + 2)
        rect(0, 0, i * 6 + 2, height)
        rect(width - (i * 6 + 2), 0, i * 6 + 2, height)
    }
}

function drawShortcuts() {
    let s = scaleFactor
    let items = [
        ['D', 'өдөр шөнө'],
        ['W', 'бороо / цас'],
        ['L', 'барилгын гэрэл'],
        ['B', 'Bat-Signal'],
        ['A', 'автомат өдөр/шөнө'],
        ['S', 'улирал'],
        ['Дар', ' машин — аваар гэрэл'],
        ['Дар', ' шон — унтраах'],
        ['Дар', ' тэнгэр — салют']
    ]
    let pad = 9 * s
    let lh = 14 * s
    let fsz = 11 * s
    textSize(fsz)
    textAlign(LEFT, CENTER)
    let keyCol = 0
    let descCol = 0
    for (let it of items) {
        keyCol = max(keyCol, textWidth(it[0] + '  '))
        descCol = max(descCol, textWidth(it[1]))
    }
    let boxW = keyCol + descCol + pad * 2
    let boxH = items.length * lh + pad * 2
    let bx = pad
    let by = height - roadH - boxH - pad

    noStroke()
    fill(10, 12, 24, 150)
    rect(bx, by, boxW, boxH, 6 * s)

    for (let i = 0; i < items.length; i++) {
        let y = by + pad + i * lh + lh / 2
        fill(255, 255, 255, 235)
        text(items[i][0], bx + pad, y)
        fill(255, 255, 255, 160)
        text(items[i][1], bx + pad + keyCol, y)
    }
}

function buildUIButtons() {
    let bw = 92 * scaleFactor
    let bh = 24 * scaleFactor
    let bx = width - bw - 10 * scaleFactor
    uiBtns = [
        { label: 'УЛИРАЛ', x: bx, y: 56 * scaleFactor, w: bw, h: bh, act: cycleSeason },
        { label: 'AUTO', x: bx, y: 86 * scaleFactor, w: bw, h: bh, act: toggleAuto }
    ]
}

function drawUIButtons() {
    noStroke()
    for (let b of uiBtns) {
        fill(20, 24, 40, 150)
        rect(b.x, b.y, b.w, b.h, 6 * scaleFactor)
        fill(255, 255, 255, 190)
        textAlign(CENTER, CENTER)
        textSize(11 * scaleFactor)
        text(b.label, b.x + b.w / 2, b.y + b.h / 2 + 1)
    }
}

function cycleSeason() {
    let order = ['summer', 'autumn', 'winter', 'spring']
    setSeason(order[(order.indexOf(season) + 1) % order.length])
    saveState()
}

function toggleAuto() {
    autoCycle = !autoCycle
    autoTimer = CONFIG.autoCycleFrames
    saveState()
}

function drawCar(car) {
    if (car.brake > 0) car.brake--
    if (car.hazardT > 0) car.hazardT--

    push()
    translate(car.x, car.y)
    scale(scaleFactor)
    if (car.dir === -1) scale(-1, 1)
    noStroke()

    if (car.hazardT > 0) {
        let on = sin(frameCount * 0.3) > 0
        fill(255, 180, 60, on ? 235 : 60)
        rect(-1, 1, 2.5, 4, 1)
        rect(-1, 9, 2.5, 4, 1)
        rect(46, 1, 2.5, 4, 1)
        rect(46, 9, 2.5, 4, 1)
    }

    if (nightA > 0.1 && car.baseSpeed > 5) {
        push()
        blendMode(ADD)
        stroke(255, 90, 90, 26 * nightA)
        strokeWeight(3)
        line(-72, 12, -6, 12)
        pop()
    }

    fill(0, 0, 0, 70)
    ellipse(24, 20, 52, 8)

    drawCarBody(car)
    drawCarLights(car)

    fill(15)
    circle(10, 14, 9)
    circle(38, 14, 9)
    fill(70)
    circle(10, 14, 4)
    circle(38, 14, 4)

    if (nightA > 0.1) {
        push()
        blendMode(ADD)
        noStroke()
        fill(255, 240, 190, 26 * nightA)
        triangle(30, 14, 84, 5, 84, 23)
        fill(255, 235, 170, 18 * nightA)
        ellipse(24, 22, 46, 6)
        pop()
    }

    if (car.honk > 0) {
        car.honk--
        let t = 1 - car.honk / 30
        noFill()
        stroke(255, 255, 255, (1 - t) * 200)
        strokeWeight(2)
        ellipse(24, -16, 6 + t * 20, (6 + t * 20) * 0.6)
        noStroke()
        fill(255, 255, 255, (1 - t) * 230)
        textAlign(CENTER, CENTER)
        textSize(11)
        text("БИП!", 24, -30 - t * 10)
    }

    pop()

    let eff = car.brake > 0 ? 0.35 : 1
    if (car.hazardT > 0) eff = 0
    car.x += car.speed * eff
    if (car.speed > 0 && car.x > width + 120) {
        car.x = -140
    } else if (car.speed < 0 && car.x < -120) {
        car.x = width + 140
    }
}

function drawCarBody(car) {
    let t = car.type
    let bodyCol = color(car.body)

    if (t === 'sport') {
        fill(bodyCol)
        rect(0, 2, 52, 10, 5)
        rect(-2, 4, 56, 5, 3)
        fill(lerpColor(bodyCol, color(10, 14, 24), 0.55))
        ellipse(26, 0, 28, 9)
        fill(180, 215, 240, 220)
        ellipse(27, -2, 14, 5)
        fill(bodyCol)
        rect(40, -8, 12, 4, 1)
        rect(39, -9, 14, 1.5)
        fill(255, 255, 255, 90)
        rect(2, 5, 48, 2)
    } else if (t === 'truck') {
        fill(bodyCol)
        rect(0, 2, 64, 6, 3)
        rect(4, -8, 14, 12, 3)
        fill(185, 215, 238, 230)
        rect(6, -6, 5, 8, 2)
        fill(lerpColor(bodyCol, color(255), 0.12))
        rect(22, -14, 40, 18, 2)
        fill(lerpColor(bodyCol, color(0), 0.18))
        rect(34, -14, 2, 18)
        rect(48, -14, 2, 18)
    } else if (t === 'police') {
        fill(243, 246, 252)
        rect(0, 0, 48, 14, 4)
        rect(0, 5, 48, 9, 4)
        fill(car.body)
        rect(5, 5, 38, 3)
        fill(40, 45, 70)
        rect(6, 8, 36, 1.5)
        fill(30, 34, 52)
        rect(12, -7, 24, 9, 3)
        fill("#7dd3ff")
        rect(15, -5, 18, 6, 2)
        fill(255, 255, 255, 200)
        rect(18, -12, 14, 4, 1)
        let s1 = sin(frameCount * 0.3) > 0 ? 255 : 60
        let s2 = sin(frameCount * 0.3 + PI) > 0 ? 255 : 60
        fill(255, 60, 60, s1)
        rect(19, -12, 5, 3, 1)
        fill(60, 90, 255, s2)
        rect(26, -12, 5, 3, 1)
    } else {
        fill(lerpColor(bodyCol, color(255), 0.15))
        rect(0, 0, 48, 14, 4)
        fill(bodyCol)
        rect(0, 5, 48, 9, 4)
        fill(lerpColor(bodyCol, color(0), 0.5))
        rect(12, -7, 24, 9, 3)
        fill("#7dd3ff")
        rect(15, -5, 18, 6, 2)

        if (t === 'taxi') {
            fill(255, 255, 255, 210)
            rect(19, -12, 12, 4, 1)
            fill(20)
            textAlign(CENTER, CENTER)
            textSize(3.4)
            text("TAXI", 25, -10.5)
            fill(255, 255, 255, 200)
            rect(6, 6, 36, 4, 1)
            fill(20)
            for (let cx = 8; cx < 40; cx += 6) rect(cx, 7, 3, 2)
        }
    }
}

function drawCarLights(car) {
    if (car.type === 'truck') {
        let tl = car.brake > 0 ? 255 : 80 * nightA + 60
        fill(255, 40, 40, tl)
        rect(1, 0, 2, 5, 1)
        rect(1, 10, 2, 5, 1)
        fill(255, 243, 176, 255 * nightA)
        rect(60, 1, 2, 4, 1)
        return
    }
    fill(255, 243, 176, 255 * nightA)
    rect(46, 3, 4, 5, 1)
    let brakeOn = car.brake > 0
    fill(255, 40, 40, brakeOn ? 255 : 80 * nightA + 60)
    rect(-1, 3, 2, 5, 1)
    if (brakeOn) {
        push()
        blendMode(ADD)
        fill(255, 60, 60, 90)
        ellipse(-4, 5, 12, 8)
        pop()
    }
}

function toggleDayNight() {
    isDay = !isDay
    saveState()
}

function honkCar(car, randomizeColor) {
    car.honk = 30
    if (randomizeColor) {
        let colors = ["#ff5e5e", "#bd8dc2", "#8be9fd", "#5be37a", "#ffd166", "#ff9f43", "#7bdff2"]
        car.body = colors[floor(random(colors.length))]
    }
}

function handleTap(px, py) {
    for (let b of uiBtns) {
        if (px > b.x && px < b.x + b.w && py > b.y && py < b.y + b.h) {
            b.act()
            return
        }
    }
    for (let car of cars) {
        let w = 60 * scaleFactor
        let h = 34 * scaleFactor
        if (px > car.x - w / 2 && px < car.x + w / 2 && py > car.y - h / 2 && py < car.y + h / 2) {
            car.hazardT = round(random(140, 220))
            return
        }
    }

    let m = moonPos()
    let s = sunPos()
    if (dist(px, py, m.x, m.y) < 35 || dist(px, py, s.x, s.y) < 35) {
        toggleDayNight()
        return
    }

    if (nightA > 0.3 && py < height * 0.6) {
        launchFirework(px, py)
        return
    }

    let spot = signalSpot()
    if (dist(px, py, spot.x, spot.y) < 22 * scaleFactor) {
        batSignal = !batSignal
        return
    }
    if (batSignal) {
        let bat = signalBatInfo()
        if (dist(px, py, bat.x, bat.y) < bat.w * 0.6) {
            batSignal = false
            return
        }
    }

    let lampY = height - roadH - 4 * scaleFactor
    for (let l of lamps) {
        if (dist(px, py, l.x, lampY) < 26 * scaleFactor) {
            l.on = !l.on
            return
        }
    }

    for (let b of buildings) {
        if (px > b.x && px < b.x + b.w && py > b.y && py < height - roadH) {
            b.lightsOn = !b.lightsOn
            b.windowsDirty = true
            reflDirty = true
            saveState()
        }
    }
}

function mousePressed() {
    handleTap(mouseX, mouseY)
}

function keyPressed() {
    let k = key.toLowerCase()
    if (k === 'd') {
        toggleDayNight()
    } else if (k === 'w') {
        let old = weather
        weather = weather === 'clear' ? 'rain' : (weather === 'rain' ? 'snow' : 'clear')
        if (weather === 'clear' && (old === 'rain' || old === 'snow')) rainbowTimer = 600
        saveState()
    } else if (k === 'l') {
        let anyOn = buildings.some(b => b.lightsOn)
        for (let b of buildings) {
            b.lightsOn = !anyOn
            b.windowsDirty = true
        }
        reflDirty = true
        saveState()
    } else if (k === 'b') {
        batSignal = !batSignal
    } else if (k === 'a') {
        toggleAuto()
    } else if (k === 's') {
        cycleSeason()
    }
    return false
}

function touchStarted() {
    if (touches.length > 0) {
        handleTap(touches[0].x, touches[0].y)
    }
    return false
}