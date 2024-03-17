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
    // var newTxt = changeImgTxt(elEditorTxt)



    gCurrImg = elImage

    let elUploadBox = document.querySelector('.upload-box')
    elUploadBox.style.display = 'none'

    let elImgSection = document.querySelector('.img-section')
    elImgSection.style.display = 'none'

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




function changeImgTxt(elEditorTxt) {
    let elMemeTxt = document.querySelector('.meme-txt');
    elMemeTxt.innerText = elEditorTxt.innerText;
    console.log(gCurrImgId);
}









