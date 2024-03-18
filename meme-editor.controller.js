'use strict'

console.log('controller is connected (index-js)');

let gElCanvas
let gCtx
let gCurrImg
let gCurrImgId


function onInit() {

    console.log(gImgs);
    gElCanvas = document.querySelector('.canvas-meme-editor')
    gCtx = gElCanvas.getContext('2d')


    var elEditorSec = document.querySelector('.editor-section')
    elEditorSec.style.display = 'grid'

    resizeCanvas()

    window.addEventListener('resize', () => resizeCanvas())
    renderMemeGallery()

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

// function onAddTxtLine() {
//     var elCanvasContainer = document.querySelector('.canvas-container')
//     var lastTxtLine = document.querySelector('.meme-txt:last-child')

//     var newTxtLine = document.createElement('span')

//     newTxtLine.className = 'meme-txt'
//     newTxtLine.textContent = 'Add text here'
//     newTxtLine.contentEditable = true


//     gMeme.lines.push({
//         txt: newTxtLine.textContent,
//         size: newTxtLine.style.fontSize,
//         color: newTxtLine.style.color,
//     })

//     console.log(gMeme.lines); //WORKS

//     if (lastTxtLine) {
//         var newTopPosition = lastTxtLine.offsetTop + lastTxtLine.offsetHeight + 20
//         newTxtLine.style.top = `${newTopPosition}px`
//     } else {
//         newTxtLine.style.top = '36%'
//     }

//     elCanvasContainer.appendChild(newTxtLine)
// }


// function onNextTxtLine() {
//     let elMemeTxts = document.querySelectorAll('.meme-txt')
//     if (typeof gMeme.selectedLineIdx !== 'undefined') {
//         elMemeTxts[gMeme.selectedLineIdx].classList.remove('line-edited')
//         elMemeTxts[gMeme.selectedLineIdx].style.borderColor = 'black'
//     }
//     gMeme.selectedLineIdx++
//     if (gMeme.selectedLineIdx >= elMemeTxts.length) {
//         gMeme.selectedLineIdx = 0
//     }
//     elMemeTxts[gMeme.selectedLineIdx].classList.add('line-edited')
//     elMemeTxts[gMeme.selectedLineIdx].style.borderColor = 'red'
// }



// function changeImgTxt(elEditorTxt) {
//     let elMemeTxt = document.querySelector('.line-edited') // this is the text that will be edited when I change the text in the editor

//     elMemeTxt.innerText = elEditorTxt.innerText
//     updateMemeTxt(gCurrImgId, elMemeTxt.innerText)
// }


function changeImgTxt() {
    const editorTxt = document.querySelector('.editor-txt');
    let textStartX, textStartY, textEndX, textEndY; // Variables to store the text coordinates

    editorTxt.addEventListener('input', function () {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        coverCanvasWithImg(gCurrImg)

        // Get the text content from the span
        const text = this.innerText.trim() // Remove leading/trailing whitespace

        // Set the font properties for the text
        gCtx.font = '30px Arial' // Example font size and type
        gCtx.fillStyle = 'black' // Example text color

        // Set the position where the text will start
        const x = 60 // Example X coordinate
        let y = 60 // Initial Y coordinate

        // Split the text into words
        const words = text.split(' ')
        let line = '' // Initialize an empty line for constructing each line of text

        // Loop through each word in the text
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' '
            const metrics = gCtx.measureText(testLine)

            // Check if adding the next word exceeds the canvas width
            if (metrics.width > gElCanvas.width - x * 2) {
                // Draw the current line and move to the next line
                gCtx.fillText(line, x, y)
                line = words[i] + ' '
                y += 25 // Move to the next line (adjust based on line height)
            } else {
                line = testLine
            }
        }

        // Draw the last line of text
        gCtx.fillText(line, x, y);

        // Store the start and end coordinates of the text
        textStartX = x; // Start X coordinate is fixed
        textStartY = 20; // Start Y coordinate
        textEndX = x + gCtx.measureText(line).width; // End X coordinate
        textEndY = y + 30; // End Y coordinate (assuming 30px is the line height)

        // Draw the bounding box around the text
        drawTextBoundingBox(textStartX, textStartY, textEndX, textEndY);
    });
}


function drawTextBoundingBox(startX, startY, endX, endY) {
    const padding = 2; // Padding around the text

    // Calculate the width and height of the bounding box
    const width = endX - startX + 1 * padding;
    const height = endY - startY + 1 * padding;

    // Set the rectangle style
    gCtx.strokeStyle = 'red'; // Example border color
    gCtx.lineWidth = 2; // Example border width

    // Draw the rectangle around the text
    gCtx.strokeRect(startX - padding, startY - padding, width, height);
}


















