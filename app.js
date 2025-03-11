const areaElement = document.getElementById('area')
let firstState = '"box6 box9 box8" "box1 box4 box5" "box7 box3 box2"'
// firstState = areaElement.style.gridTemplateAreas
areaElement.style.gridTemplateAreas = firstState

let userPath = ''
function PushUserPath(e) {
    userPath += e
    console.log(userPath)
}

function setState() {
    let depthInput = document.getElementById('UsDepth')
    let dirLeft = document.getElementById('dirLeft')
    let dirRight = document.getElementById('dirRight')
    let dirBottom = document.getElementById('dirBottom')
    let dirTop = document.getElementById('dirTop')
    return {
        depth: depthInput.value,
        dirLeft: dirLeft.value,
        dirRight: dirRight.value,
        dirBottom: dirBottom.value,
        dirTop: dirTop.value,
    }
}
function convertArea(area) {
    return `"box${area[0]} box${area[1]} box${area[2]}" "box${area[3]} box${area[4]} box${area[5]}" "box${area[6]} box${area[7]} box${area[8]}"`
}
function extractNumbers(gridString) {
    return gridString.match(/\d+/g).join('')
}
function condToLeft(arr) {
    let a = [...arr.slice(0, 3)]
    let b = [...arr.slice(3, 6)]
    let c = [...arr.slice(6, 9)]
    return [...a.splice(1, 2), ...b.splice(1, 2), ...c.splice(1, 2)]
}
function condToRight(arr) {
    let a = [...arr.slice(0, 3)]
    let b = [...arr.slice(3, 6)]
    let c = [...arr.slice(6, 9)]
    return [...a.splice(0, 2), ...b.splice(0, 2), ...c.splice(0, 2)]
}
function swapElements(arr, direction) {
    let element = arr.indexOf(9)
    let newArray = [...arr]
    let temp = element
    switch (direction) {
        case 'left':
            newArray[element] = arr[element - 1]
            newArray[element - 1] = arr[temp]
            break
        case 'right':
            newArray[element] = arr[element + 1]
            newArray[element + 1] = arr[temp]
            break
        case 'up':
            newArray[element] = arr[element - 3]
            newArray[element - 3] = arr[temp]
            break
        case 'down':
            newArray[element] = arr[element + 3]
            newArray[element + 3] = arr[temp]
            break
    }
    return newArray
}
function moveBlock(direction) {
    switch (direction) {
        case 'left':
            moveLeft()
            break
        case 'right':
            moveRight()
            break
        case 'bottom':
            moveDown()
            break
        case 'top':
            moveUp()
            break
    }
}
function moveUp() {
    let area = areaElement.style.gridTemplateAreas
    let clearArea = extractNumbers(area)
    if (!clearArea.slice(0, 3).includes(9)) {
        let swappedArea = swapElements(clearArea, 'up')
        areaElement.style.gridTemplateAreas = convertArea(swappedArea)
    }
}
function moveDown() {
    let area = areaElement.style.gridTemplateAreas
    let clearArea = extractNumbers(area)
    if (!clearArea.slice(6, 9).includes(9)) {
        let swappedArea = swapElements(clearArea, 'down')
        areaElement.style.gridTemplateAreas = convertArea(swappedArea)
    }
}
function moveLeft() {
    let area = areaElement.style.gridTemplateAreas
    let clearArea = extractNumbers(area)
    if (condToLeft(clearArea).includes('9')) {
        let swappedArea = swapElements(clearArea, 'left')
        areaElement.style.gridTemplateAreas = convertArea(swappedArea)
    }
}
function moveRight() {
    let area = areaElement.style.gridTemplateAreas
    let clearArea = extractNumbers(area)
    if (condToRight(clearArea).includes('9')) {
        let swappedArea = swapElements(clearArea, 'right')
        areaElement.style.gridTemplateAreas = convertArea(swappedArea)
    }
}

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            moveUp()
            PushUserPath(3)
            break
        case 'ArrowDown':
            moveDown()
            PushUserPath(4)
            break
        case 'ArrowLeft':
            moveLeft()
            PushUserPath(1)
            break
        case 'ArrowRight':
            moveRight()
            PushUserPath(2)

            break
        case 's':
            console.log('START')
            break
        case 'f':
            console.log('FINISH')
            break
    }
})

function reset(direction) {
    const oppositeDirection = {
        left: 'right',
        right: 'left',
        top: 'bottom',
        bottom: 'top',
    }
    moveBlock(oppositeDirection[direction])
}

function aiMoving(initialState, state, depth, dirs, condDepth) {
    if (depth >= condDepth) return
    for (let i = 0; i < state.length; i++) {
        let direction = ['left', 'right', 'top', 'bottom']
        let directionNumbers = {
            left: dirs[0],
            right: dirs[1],
            top: dirs[2],
            bottom: dirs[3],
        }
        let area = areaElement.style.gridTemplateAreas
        let clearArea = extractNumbers(area)
        for (let j = 0; j < 4; j++) {
            areaElement.style.gridTemplateAreas = convertArea(state[i].position)
            let newArea = clearArea
            moveBlock(direction[j])
            newArea = extractNumbers(areaElement.style.gridTemplateAreas)
            if (state[i].position !== newArea) {
                reset(direction[j])
                if (!isPositionDuplicate(initialState, newArea)) {
                    let newState = addState(state[i], newArea)
                    newState.path =
                        state[i].path + directionNumbers[direction[j]]

                    // depthFirstSearch(initialState, '123456789')

                    // console.log(
                    //     aStarSearch(initialState, '123456789', heuristic)
                    // )

                    if (
                        breadthFirstSearch(initialState, '123456789') !== null
                    ) {
                        console.log(
                            breadthFirstSearch(initialState, '123456789')
                        )
                        return
                    }
                }
            }
        }
    }
    for (let i = 0; i < state.length; i++) {
        aiMoving(initialState, state[i].state, depth + 1, dirs, condDepth)
    }
}

function isPositionDuplicate(state, position) {
    if (!state || state.length === 0) return false

    for (let i = 0; i < state.length; i++) {
        if (state[i].position === position) return true
        if (state[i].state && isPositionDuplicate(state[i].state, position))
            return true
    }

    return false
}

function breadthFirstSearch(state, targetPosition) {
    let queue = [...state]

    while (queue.length > 0) {
        let current = queue.shift()

        if (current.position === targetPosition) {
            console.log('ok')

            return current.path
        }

        if (current.state) {
            queue.push(...current.state)
        }
    }

    return null
}
function depthFirstSearch(state, targetPosition) {
    for (let i = 0; i < state.length; i++) {
        if (state[i].position === targetPosition) {
            console.log('ok')
            return state[i]
        }

        if (state[i].state) {
            let result = depthFirstSearch(state[i].state, targetPosition)
            if (result) return result
        }
    }

    return null
}

function aStarSearch(state, targetPosition, heuristic) {
    let openSet = [
        {
            node: state[0],
            g: 0,
            f: heuristic(state[0].position, targetPosition),
        },
    ]
    let cameFrom = new Map()
    let gScore = new Map()
    gScore.set(state[0].position, 0)

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f)
        let current = openSet.shift().node

        if (current.position === targetPosition) {
            return current
        }

        for (let neighbor of current.state || []) {
            let tentativeGScore = gScore.get(current.position) + 1
            if (
                !gScore.has(neighbor.position) ||
                tentativeGScore < gScore.get(neighbor.position)
            ) {
                cameFrom.set(neighbor.position, current)
                gScore.set(neighbor.position, tentativeGScore)
                let fScore =
                    tentativeGScore +
                    heuristic(neighbor.position, targetPosition)
                openSet.push({ node: neighbor, g: tentativeGScore, f: fScore })
            }
        }
    }

    return null
}

function heuristic(position, targetPosition) {
    let posArray = position.split('').map(Number)
    let targetArray = targetPosition.split('').map(Number)
    return posArray.reduce(
        (sum, num, index) => sum + Math.abs(num - targetArray[index]),
        0
    )
}

function Run() {
    let area = areaElement.style.gridTemplateAreas
    let clearArea = extractNumbers(area)
    let settings = setState()
    let condDepth = settings.depth
    let dirs = [
        settings.dirLeft,
        settings.dirRight,
        settings.dirTop,
        settings.dirBottom,
    ]
    let outsideState = [
        {
            id: generateId(),
            depth: 0,
            position: clearArea,
            path: '',
            state: [],
        },
    ]

    aiMoving(outsideState, outsideState, 0, dirs, condDepth)
    console.log(JSON.stringify(outsideState, null, 2))
    console.log(stateIdCounter)
    areaElement.style.gridTemplateAreas = firstState
}

let stateIdCounter = 0

function generateId() {
    return stateIdCounter++
}

function addState(parentState, newPosition) {
    const newState = {
        id: generateId(),
        depth: parentState.depth + 1,
        position: newPosition,
        path: '',
        state: [],
    }

    parentState.state.push(newState)

    return newState
}
document.getElementById('run').addEventListener('click', Run)
