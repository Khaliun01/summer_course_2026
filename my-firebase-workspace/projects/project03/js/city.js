let stars = []
let cars = []
let buildings = []
let clouds = []
let lamps = []

let shootingStar = { x: 0, y: 0, speedX: 0, speedY: 0, active: false }

let isDay = false      
let dayProgress = 0 
let nightA = 1  
let dayA = 0  

let bgMusic
let scaleFactor = 1
let roadH = 60
let hintAlpha = 255
let hintTimer = 0

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

let audioCtx = null
let masterGain = null
let soundOn = true
let noiseCache = null
let rainNodes = null
let shake = 0
let cricketTimer = 0
let birdSfxTimer = 0

let batSignal = false
let hero = { active: false, x: 0, y: 0, speed: 0, phase: 0, dir: 1, timer: 0 }
let heroTrail = []

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

    skyPG = createGraphics(width, height)
    renderSkyPG()
    skyBucket = round(dayProgress * 60)

    resetShootingStar()

    if (bgMusic) {
        bgMusic.loop()
    }
}

function loadState() {
    try {
        let savedDay = localStorage.getItem('city_isDay')
        if (savedDay !== null) isDay = savedDay === 'true'
    } catch (e) { }
}

function saveState() {
    try {
        localStorage.setItem('city_isDay', isDay)
        let lights = buildings.map(b => b.lightsOn)
        localStorage.setItem('city_lights', JSON.stringify(lights))
    } catch (e) { }
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
    } catch (e) { }
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
            hasAntenna: random() > 0.6 && (roof === 'flat' || roof === 'taper')
        })
        x += w + spacing
    }
    loadLights()
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
        lamps.push({ x: x })
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
    lightning = { timer: round(random(200, 500)), flash: 0, bolt: [] }
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
    plane = { active: false, x: 0, y: 0, speed: 0, timer: round(random(300, 600)), dir: 1 }
}

function initTrees() {
    trees = []
    let n = 7
    let greens = ['#2e6b4f', '#3a7d5a', '#4d8a5c', '#5c946e', '#416b3a']
    for (let i = 0; i < n; i++) {
        trees.push({
            x: random(width * 0.06, width * 0.94),
            y: height - roadH - 10 * scaleFactor,
            size: random(18, 30) * scaleFactor,
            phase: random(TWO_PI),
            green: greens[floor(random(greens.length))]
        })
    }
}

function initLeaves() {
    leaves = []
    let cols = ['#7ab648', '#c9a227', '#d96c3c', '#6aa84f']
    for (let i = 0; i < 26; i++) {
        leaves.push({
            x: random(width),
            y: random(height),
            size: random(2, 4) * scaleFactor,
            speed: random(0.4, 1) * scaleFactor,
            sway: random(TWO_PI),
            col: cols[floor(random(cols.length))]
        })
    }
}

function initAudio() {
    if (audioCtx) {
        if (audioCtx.state === 'suspended') audioCtx.resume()
        return
    }
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        masterGain = audioCtx.createGain()
        masterGain.gain.value = soundOn ? 0.5 : 0
        masterGain.connect(audioCtx.destination)
    } catch (e) { }
}

function noiseBuf() {
    if (noiseCache) return noiseCache
    let len = audioCtx.sampleRate * 2
    let buffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate)
    let data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    noiseCache = buffer
    return noiseCache
}

function blip(freq, dur, type, vol, slideTo) {
    if (!audioCtx || !soundOn) return
    let t = audioCtx.currentTime
    let osc = audioCtx.createOscillator()
    let g = audioCtx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g).connect(masterGain)
    osc.start(t)
    osc.stop(t + dur + 0.05)
}

function noiseBurst(dur, vol, cutoff) {
    if (!audioCtx || !soundOn) return
    let t = audioCtx.currentTime
    let src = audioCtx.createBufferSource()
    src.buffer = noiseBuf()
    let f = audioCtx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = cutoff || 1200
    let g = audioCtx.createGain()
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f).connect(g).connect(masterGain)
    src.start(t)
    src.stop(t + dur + 0.05)
}

function playHonk() {
    if (!audioCtx || !soundOn) return
    blip(430, 0.28, 'square', 0.13, 350)
    blip(452, 0.28, 'square', 0.09, 372)
}

function playBird() {
    if (!audioCtx || !soundOn) return
    blip(2600, 0.08, 'sine', 0.1, 3200)
    setTimeout(() => { if (soundOn) blip(2900, 0.07, 'sine', 0.08, 3400) }, 130)
}

function playCricket() {
    if (!audioCtx || !soundOn) return
    let t = audioCtx.currentTime
    for (let i = 0; i < 4; i++) {
        let st = t + i * 0.05
        let osc = audioCtx.createOscillator()
        let g = audioCtx.createGain()
        osc.type = 'square'
        osc.frequency.value = 4200
        g.gain.setValueAtTime(0, st)
        g.gain.linearRampToValueAtTime(0.04, st + 0.005)
        g.gain.linearRampToValueAtTime(0.0001, st + 0.04)
        osc.connect(g).connect(masterGain)
        osc.start(st)
        osc.stop(st + 0.05)
    }
}

function playThunder() {
    if (!audioCtx || !soundOn) return
    noiseBurst(1.3, 0.45, 400)
    noiseBurst(0.7, 0.3, 240)
    shake = 16
}

function playSwoosh() {
    if (!audioCtx || !soundOn) return
    let t = audioCtx.currentTime
    let src = audioCtx.createBufferSource()
    src.buffer = noiseBuf()
    let f = audioCtx.createBiquadFilter()
    f.type = 'bandpass'
    f.Q.value = 2
    f.frequency.setValueAtTime(300, t)
    f.frequency.exponentialRampToValueAtTime(3200, t + 0.5)
    let g = audioCtx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.15)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
    src.connect(f).connect(g).connect(masterGain)
    src.start(t)
    src.stop(t + 0.55)
}

function playChime() {
    if (!audioCtx || !soundOn) return
    blip(523, 0.4, 'sine', 0.13)
    setTimeout(() => { if (soundOn) blip(659, 0.5, 'sine', 0.11) }, 130)
}

function playShoot() {
    if (!audioCtx || !soundOn) return
    blip(1300, 0.3, 'sine', 0.045, 320)
}

function ensureRain(on) {
    if (!audioCtx) return
    if (on && !rainNodes) {
        let src = audioCtx.createBufferSource()
        src.buffer = noiseBuf()
        src.loop = true
        let f = audioCtx.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.value = 900
        let g = audioCtx.createGain()
        g.gain.value = 0
        src.connect(f).connect(g).connect(masterGain)
        src.start()
        rainNodes = { g: g }
    }
    if (rainNodes) {
        let t = audioCtx.currentTime
        let target = on ? 0.08 : 0
        rainNodes.g.gain.cancelScheduledValues(t)
        rainNodes.g.gain.setTargetAtTime(target, t, 0.3)
    }
}

function toggleSound() {
    soundOn = !soundOn
    if (masterGain) masterGain.gain.value = soundOn ? 0.5 : 0
    if (!soundOn && rainNodes) rainNodes.g.gain.value = 0
}

function updateAmbient() {
    if (!audioCtx) return
    ensureRain(weather === 'rain')
    if (cricketTimer <= 0) {
        cricketTimer = round(random(260, 520))
        if (nightA > 0.4) playCricket()
    } else {
        cricketTimer--
    }
    if (birdSfxTimer <= 0) {
        birdSfxTimer = round(random(500, 900))
        if (dayA > 0.5) playBird()
    } else {
        birdSfxTimer--
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
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

    skyPG = createGraphics(width, height)
    renderSkyPG()
    skyBucket = round(dayProgress * 60)
}

function mixDayNight(nightColor, dayColor) {
    return lerpColor(color(nightColor), color(dayColor), dayProgress)
}

function draw() {
    let target = isDay ? 1 : 0
    dayProgress = lerp(dayProgress, target, 0.02)
    nightA = 1 - dayProgress
    dayA = dayProgress

    if (honkTimer <= 0) {
        honkTimer = round(random(700, 1400))
        honkCar(cars[floor(random(cars.length))], false)
    } else {
        honkTimer--
    }

    if (brakeTimer <= 0) {
        brakeTimer = round(random(500, 1200))
        let c = cars[floor(random(cars.length))]
        if (c.brake <= 0) c.brake = round(random(50, 120))
    } else {
        brakeTimer--
    }

    background(mixDayNight('#110c21', '#70a1ff'))

    updateAmbient()

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
        pop()
    }

    if (dayA > 0.01) {
        push()
        drawingContext.globalAlpha = dayA
        drawSun()
        drawClouds()
        pop()
    }

    drawBirds()
    drawHero()

    drawSkylineGlow()

    for (let b of buildings) {
        drawBuilding(b)
    }

    drawTrees()
    drawPeople()

    drawSignalDevice()
    drawBatSignal()

    drawLamps()
    drawGroundHaze()
    drawRoad()
    drawShadows()
    drawReflections()

    for (let car of cars) {
        drawCar(car)
    }

    drawWeather()
    drawLeaves()
    drawFireflies()
    drawSteam()
    drawVignette()
    drawHint()
    drawSoundIcon()
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
        stroke(170, 200, 220, map(s.life, 16, 0, 110, 0))
        strokeWeight(1)
        noFill()
        ellipse(s.x, s.y, s.r, s.r * 0.3)
        ellipse(s.x, s.y, s.r * 0.5, s.r * 0.15)
    }
    rainSplash = rainSplash.filter(s => s.life > 0)

    for (let d of rain) {
        stroke(160, 190, 220, 140)
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
        fill(255, 255, 255, 200)
        circle(f.x, f.y, f.size)
    }
}

function drawWeather() {
    if (weather === 'rain') {
        drawRain()
        updateLightning()
        drawLightning()
    } else if (weather === 'snow') {
        drawSnow()
        lightning.flash = max(0, lightning.flash - 14)
    }
}

function updateLightning() {
    lightning.timer--
    if (lightning.timer <= 0) {
        strikeLightning()
        lightning.timer = round(random(240, 600))
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
    playThunder()
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
    let b = buildings[0]
    for (let cand of buildings) {
        if (cand.y < b.y) b = cand
    }
    return b
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
    hero.timer++
    if (!hero.active && hero.timer > 480) {
        hero.active = true
        hero.timer = 0
        hero.dir = random() > 0.5 ? 1 : -1
        hero.x = hero.dir === 1 ? -40 : width + 40
        hero.y = random(height * 0.08, height * 0.35)
        hero.speed = hero.dir * random(3.5, 5.5) * scaleFactor
        hero.phase = random(TWO_PI)
    }
    if (hero.active) {
        hero.x += hero.speed
        heroTrail.push({ x: hero.x, y: hero.y, life: 45 })
        if ((hero.dir === 1 && hero.x > width + 40) || (hero.dir === -1 && hero.x < -40)) {
            hero.active = false
            heroTrail = []
        }
    }
    if (!hero.active) return

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
        if (random() < 0.12) playShoot()
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

        if (weather === 'rain') {
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

function drawPlane() {
    if (nightA < 0.05) return
    if (!plane.active) {
        plane.timer--
        if (plane.timer <= 0) {
            plane.active = true
            plane.dir = random() > 0.5 ? 1 : -1
            plane.x = plane.dir === 1 ? -80 : width + 80
            plane.y = random(height * 0.06, height * 0.3)
            plane.speed = plane.dir * random(2.2, 3.4) * scaleFactor
        }
    } else {
        plane.x += plane.speed
        if ((plane.dir === 1 && plane.x > width + 80) || (plane.dir === -1 && plane.x < -80)) {
            plane.active = false
            plane.timer = round(random(400, 800))
        }
    }
    if (!plane.active) return

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

function drawTrees() {
    let snow = weather === 'snow'
    for (let t of trees) {
        let sway = sin(frameCount * 0.02 + t.phase) * 2 * scaleFactor
        push()
        translate(t.x, t.y)
        fill(0, 0, 0, 60)
        ellipse(0, 3, t.size * 0.9, 6)
        fill(lerpColor(color('#5b3d26'), color(18, 14, 12), 0.6 * nightA))
        rect(-3 * scaleFactor, -t.size * 0.28, 6 * scaleFactor, t.size * 0.28, 2)
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
    if (weather !== 'clear') return
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
        fill(lerpColor(color(l.col), color(20, 25, 15), 0.5 * nightA))
        ellipse(0, 0, l.size * 1.6, l.size)
        pop()
    }
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
        let streakW = 3 * scaleFactor
        let flick = 0.5 + 0.5 * sin(frameCount * 0.05 + l.x * 0.01)
        fill(255, 220, 150, 46 * nightA * flick)
        rect(l.x - streakW / 2, height - roadH + 2, streakW, roadH)
        fill(255, 240, 190, 26 * nightA)
        rect(l.x - streakW * 2, height - roadH + 2, streakW * 4, roadH)
    }

    for (let b of buildings) {
        if (!b.lightsOn) continue
        for (let i = 0; i < 7; i++) {
            let seed = (b.x + i * 37) % 97 / 97
            let wx = b.x + seed * b.w
            let frac = ((i * 13) % 100) / 100
            let hh = (2 + frac * 8) * scaleFactor
            let shimmer = 0.7 + 0.3 * sin(frameCount * 0.06 + i * 2.2 + b.x * 0.01)
            fill(255, 210, 130, 20 * nightA * shimmer)
            rect(wx, height - roadH + 2 + frac * roadH, 2.2 * scaleFactor, hh)
        }
    }

    pop()
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
        if (weather === 'snow') {
            fill(240, 246, 255, 200)
            triangle(topX, b.y, topX + b.tw, b.y, topX + b.tw / 2, b.y - peakH * 0.55)
        }
    } else if (b.roof === 'dome') {
        fill(roofC)
        ellipse(topX + b.tw / 2, b.y, b.tw * 1.02, b.tw * 0.72)
        if (weather === 'snow') {
            fill(240, 246, 255, 200)
            ellipse(topX + b.tw / 2, b.y - b.tw * 0.04, b.tw * 0.6, b.tw * 0.38)
        }
    } else if (b.roof === 'spire') {
        fill(lerpColor(topC, color('#2c3150'), 0.35))
        let h = b.tw * 1.4
        let wTop = 2 * scaleFactor
        quad(topX, b.y, topX + b.tw, b.y, topX + b.tw / 2 + wTop, b.y - h, topX + b.tw / 2 - wTop, b.y - h)
        if (weather === 'snow') {
            fill(240, 246, 255, 180)
            quad(topX + b.tw * 0.3, b.y, topX + b.tw * 0.7, b.y, topX + b.tw / 2 + wTop, b.y - h, topX + b.tw / 2 - wTop, b.y - h)
        }
    } else if (b.roof === 'step') {
        let inset = b.tw * 0.14
        let stepH = b.tw * 0.16
        fill(roofC)
        rect(topX + inset, b.y - stepH, b.tw - inset * 2, stepH)
        rect(topX + inset * 1.8, b.y - stepH * 2, b.tw - inset * 3.6, stepH)
        if (weather === 'snow') {
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
        if (weather === 'snow') {
            fill(235, 242, 250, 200)
            rect(topX + b.tw * 0.15 - 2, b.y - 12, b.tw * 0.7 + 4, 4, 2)
        }
        if (b.hasAntenna) {
            stroke(mixDayNight('#101225', '#2c3150'))
            strokeWeight(2)
            line(topX + b.tw * 0.5, b.y - 10, topX + b.tw * 0.5, b.y - 30)
            noStroke()
            let blink = map(sin(frameCount * 0.05), -1, 1, 120, 255) * nightA
            fill(255, 90, 90, blink)
            circle(topX + b.tw * 0.5, b.y - 30, 6)
            if (weather === 'snow') {
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
    let bx = b.x
    let by = b.y
    let bw = b.w
    let rows = 7
    let cols = 3
    let padY = (height - by - 70) / (rows + 1)

    noStroke()
    for (let r = 1; r <= rows; r++) {
        let t = (r - 1) / (rows - 1)
        let wAt = lerp(b.tw, bw, t)
        let left = bx + (bw - wAt) / 2
        let padX = wAt / (cols + 1)
        for (let c = 1; c <= cols; c++) {
            let wx = left + c * padX - 8
            let wy = by + r * padY - 6

            fill(35, 37, 60)
            rect(wx, wy, 16, 12, 2)

            if (b.lightsOn) {
                let glow = map(sin(frameCount * b.flicker + r + c), -1, 1, 150, 255)
                fill(255, 200, 120, 45 * nightA)
                rect(wx - 3, wy - 3, 22, 18, 4)
                fill(255, 224, 150, glow * nightA)
                rect(wx, wy, 16, 12, 2)

                let hash = (r * 7 + c * 13 + bx) % 11
                if (hash === 0) {
                    let sway = sin(frameCount * 0.08 + r * 2 + c * 3) * 2
                    fill(24, 18, 34, 200 * nightA)
                    circle(wx + 8 + sway, wy + 3, 5)
                    ellipse(wx + 8 + sway, wy + 9, 8, 6)
                }
            }

            fill(191, 227, 242, 255 * dayA)
            rect(wx, wy, 16, 12, 2)
        }
    }
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

function drawHint() {
    if (hintAlpha <= 0) return
    hintTimer++
    if (hintTimer > 240) {
        hintAlpha = max(0, hintAlpha - 3)
    }

    noStroke()
    fill(255, 255, 255, hintAlpha * 0.9)
    textAlign(CENTER, CENTER)
    textSize(14 * scaleFactor)
    text("Сар / Нар эсвэл D дар — өдөр шөнө сольж үзээрэй", width / 2, height - roadH - 72 * scaleFactor)
    text("Машин дээр дар • W — бороо/цас • L — цонх", width / 2, height - roadH - 54 * scaleFactor)
    text("Барилгын гэрэлд дар эсвэл B — Bat-Signal", width / 2, height - roadH - 36 * scaleFactor)
    text("M — дуу асаах/унтраах", width / 2, height - roadH - 18 * scaleFactor)
}

function drawSoundIcon() {
    push()
    translate(width - 30 * scaleFactor, 28 * scaleFactor)
    fill(255, 255, 255, 180)
    beginShape()
    vertex(-8, -4)
    vertex(-2, -4)
    vertex(4, -8)
    vertex(4, 8)
    vertex(-2, 4)
    vertex(-8, 4)
    endShape(CLOSE)
    if (soundOn) {
        noFill()
        stroke(255, 255, 255, 180)
        strokeWeight(1.5 * scaleFactor)
        arc(6, 0, 9, 9, -HALF_PI, HALF_PI)
        arc(6, 0, 16, 16, -HALF_PI, HALF_PI)
    } else {
        stroke(255, 80, 80, 220)
        strokeWeight(2 * scaleFactor)
        line(-7, -7, 7, 7)
        line(-7, 7, 7, -7)
    }
    pop()
}

function drawCar(car) {
    if (car.brake > 0) car.brake--

    push()
    translate(car.x, car.y)
    scale(scaleFactor)
    if (car.dir === -1) scale(-1, 1)
    noStroke()

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
    playChime()
    saveState()
}

function honkCar(car, randomizeColor) {
    car.honk = 30
    playHonk()
    if (randomizeColor) {
        let colors = ["#ff5e5e", "#bd8dc2", "#8be9fd", "#5be37a", "#ffd166", "#ff9f43", "#7bdff2"]
        car.body = colors[floor(random(colors.length))]
    }
}

function handleTap(px, py) {
    initAudio()
    for (let car of cars) {
        let w = 60 * scaleFactor
        let h = 34 * scaleFactor
        if (px > car.x - w / 2 && px < car.x + w / 2 && py > car.y - h / 2 && py < car.y + h / 2) {
            honkCar(car, true)
            return
        }
    }

    let m = moonPos()
    let s = sunPos()
    if (dist(px, py, m.x, m.y) < 35 || dist(px, py, s.x, s.y) < 35) {
        toggleDayNight()
        return
    }

    let spot = signalSpot()
    if (dist(px, py, spot.x, spot.y) < 22 * scaleFactor) {
        batSignal = !batSignal
        playSwoosh()
        return
    }
    if (batSignal) {
        let bat = signalBatInfo()
        if (dist(px, py, bat.x, bat.y) < bat.w * 0.6) {
            batSignal = false
            playSwoosh()
            return
        }
    }

    for (let b of buildings) {
        if (px > b.x && px < b.x + b.w && py > b.y && py < height) {
            b.lightsOn = !b.lightsOn
            saveState()
        }
    }
}

function mousePressed() {
    initAudio()
    handleTap(mouseX, mouseY)
}

function keyPressed() {
    initAudio()
    let k = key.toLowerCase()
    if (k === 'd') {
        toggleDayNight()
    } else if (k === 'w') {
        weather = weather === 'clear' ? 'rain' : (weather === 'rain' ? 'snow' : 'clear')
    } else if (k === 'l') {
        let anyOn = buildings.some(b => b.lightsOn)
        for (let b of buildings) {
            b.lightsOn = !anyOn
        }
        saveState()
    } else if (k === 'b') {
        batSignal = !batSignal
        playSwoosh()
    } else if (k === 'm') {
        toggleSound()
    }
    return false
}

function touchStarted() {
    initAudio()
    if (touches.length > 0) {
        handleTap(touches[0].x, touches[0].y)
    }
    return false
}