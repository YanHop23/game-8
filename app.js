const areaElement = document.getElementById('area')
areaElement.style.gridTemplateAreas =
    '"box1 box2 box3" "box4 box5 box6" "box7 box8 box9"'

let virtualArea = [1, 2, 3, 4, 5, 6, 7, 8, 9]

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
            break
        case 'ArrowDown':
            moveDown()
            break
        case 'ArrowLeft':
            moveLeft()
            break
        case 'ArrowRight':
            moveRight()
            break
    }
})
