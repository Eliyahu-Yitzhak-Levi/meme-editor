'use strict'

console.log('controller is connected (index-js)')

let gElCanvas
let gCtx
let gCurrImg
let gCurrImgId


function onInit() {

    // console.log(gImgs)
    gElCanvas = document.querySelector('.canvas-meme-editor')
    gCtx = gElCanvas.getContext('2d')


    var elEditorSec = document.querySelector('.editor-section')
    elEditorSec.style.display = 'grid'

    resizeCanvas()

    window.addEventListener('resize', () => resizeCanvas())
    renderMemeGallery()

    // event-listeners-setup
    onChangeFontSize()

}




function resetPage() {
    let elUploadBox = document.querySelector('.upload-box')
    elUploadBox.style.display = 'flex'

    let elImgSection = document.querySelector('.img-section')
    elImgSection.style.display = 'grid'

    let elContainer = document.querySelector('.container')
    elContainer.style.display = 'flex'
}

function renderMemeGallery() {
    let elImgSection = document.querySelector('.img-section')

    let strHtmls = '' // Initialize an empty string to store the HTML

    gImgs.forEach(img => {
        // Concatenate each image HTML to the string
        strHtmls += `
            <div class="img-container">
                <img src="${img.url}" alt="" data-id="${img.id}" onclick="renderMeme(this , ${img.id})">
            </div>`
    })

    elImgSection.innerHTML = strHtmls // Set the HTML content of the container
}




function renderMeme(elImage, imgId) {
    console.log(elImage, imgId);
    gCurrImgId = imgId




    gCurrImg = elImage

    let elUploadBox = document.querySelector('.upload-box')
    elUploadBox.style.display = 'none'

    let elImgSection = document.querySelector('.img-section')
    elImgSection.style.display = 'none'

    let elContainer = document.querySelector('.container')
    elContainer.style.display = 'none'


    coverCanvasWithImg(elImage)


}

function coverCanvasWithImg(elImage) {
    gElCanvas.height = (elImage.naturalHeight / elImage.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImage, 0, 0, gElCanvas.width, gElCanvas.height)
}


function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth

    let tempCurrImg = gCurrImg

    if (tempCurrImg) {
        coverCanvasWithImg(tempCurrImg)
    }
}

function drawText() {
    // Clear the canvas before drawing
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    coverCanvasWithImg(gCurrImg)

    // Get the text from the contenteditable span
    const elEditorText = document.querySelector('.editor-txt').innerText.trim()

    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0

    // Update the text for each line in gMeme.lines
    gMeme.lines.forEach((line, index) => {
        if (index === gMeme.selectedLineIdx) {
            line.txt = elEditorText // Update the text property only for the first line

            const textMetrics = gCtx.measureText(line)
            const textWidth = textMetrics.width
            const textHeight = parseInt(gCtx.font)
            gCtx.strokeStyle = 'red' // Border color
            gCtx.lineWidth = 2 // Border width
            gCtx.strokeRect(gMeme.lines[index].xLineStart - 10, gMeme.lines[index].yLineStart - textHeight - 10, textWidth + 100, textHeight + 20)
        }
        // Set the font size and color for the current line
        gCtx.font = `${line.size}px Arial`
        gCtx.strokeStyle = line.color

        // Draw the text at the specified position
        gCtx.fillText(line.txt, line.xLineStart, line.yLineStart)
        gCtx.strokeText(line.txt, line.xLineStart, line.yLineStart)
    })
}




function onAddTxtLine() {
    gMeme.numOfLines++
    let line = newLine('Add text here', 20, 'black', gMeme.lines[gMeme.numOfLines - 1].xLineStart, gMeme.lines[gMeme.numOfLines - 1].yLineStart + 50)
    gMeme.lines.push(line)
    console.log(gMeme.lines)
    drawText()
}

function onNextTxtLine() {
    gMeme.selectedLineIdx++
    drawText()
}


function onDeleteTxtLine() {
    if (gMeme.numOfLines === 0) return

    // Find the index of the selected line in the lines array
    const indexToRemove = gMeme.selectedLineIdx

    // Remove the line from the lines array
    gMeme.lines.splice(indexToRemove, 1)

    if (gMeme.numOfLines === 0) return
    else gMeme.numOfLines--
    drawText()
}

// Add click event listener to the document because the canvas dom element is not initialized here yet.
document.addEventListener('click', function (event) {
    // Get the mouse coordinates relative to the canvas
    const canvasBounds = gElCanvas.getBoundingClientRect()
    const mouseX = event.clientX - canvasBounds.left
    const mouseY = event.clientY - canvasBounds.top

    // Check if the click was within any of the lines
    gMeme.lines.forEach((line, index) => {
        const textMetrics = gCtx.measureText(line.txt)
        const textWidth = textMetrics.width
        const textHeight = parseInt(gCtx.font)
        const lineX = line.xLineStart
        const lineY = line.yLineStart - textHeight // Adjust for text height

        // Check if the click is within the bounding box of this line
        if (
            mouseX >= lineX && mouseX <= lineX + textWidth + 50 && // Add padding to width
            mouseY >= lineY && mouseY <= lineY + textHeight + 20 // Add padding to height
        ) {
            // Handle click for this line
            // console.log('Clicked on line:', index)
            const elEditorText = document.querySelector('.editor-txt').innerText.trim()
            gMeme.selectedLineIdx = index
            gMeme.lines[gMeme.selectedLineIdx].txt = elEditorText
            drawText() // FUNCTION WORKS, SELECTS THE WANTED LINE TO EDIT ON THE CANVAS
        }
    })
})

function onChangeFontSize() {

    let elButtons = document.querySelectorAll('.btn-font');

    elButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check which button was clicked based on its class
            if (button.classList.contains('plus')) {
                // Handle click on the plus button
                console.log('Plus button clicked')
                gMeme.lines[gMeme.selectedLineIdx].size += 5
                console.log(gMeme.selectedLineIdx);
                console.log(gMeme.lines[gMeme.selectedLineIdx].size);
                drawText()

            } else if (button.classList.contains('minus')) {
                // Handle click on the minus button
                console.log('Minus button clicked')
                gMeme.lines[gMeme.selectedLineIdx].size -= 5
                drawText()
            }
        })
    })
}


function onChangeTextLocation() {
    elButtons = document.querySelectorAll('.align')

    elButtons.forEach(button => {
        if (button.classList.contains('plus')) {

        } else if (button.classList.contains('plus')) {

        } else if (button.classList.contains('plus')) {

        }
    })
}















