const board = document.getElementById('board')
const playerTurn = document.querySelector('#playerTurn')
const nextTurnButton = document.querySelector('#nextTurn')
const finishedPrepButton = document.querySelector('#finishedPrep')

var winner = "none"

var mode = "Prepare Phase"
var player = "white"

playerTurn.classList.add('invisible')
nextTurnButton.classList.add('invisible')

const pieces = [
    blackflag, blackspy,blackspy,blackprivate,blackprivate,blackprivate,blackprivate,blackprivate,blackprivate,
    blacksergeant,black2ndlieut,black1stlieut,blackcaptain,blackmajor,blackltcolonel,blackcolonel,black1star,black2star,
    black3star,black4star,black5star,"","","","","","",
    "","","","","","","","","",
    "","","","","","","","","",
    white3star,white4star,white5star,"","","","","","",
    whitesergeant,white2ndlieut,white1stlieut,whitecaptain,whitemajor,whiteltcolonel,whitecolonel,white1star,white2star,
    whiteflag,whitespy,whitespy,whiteprivate,whiteprivate,whiteprivate,whiteprivate,whiteprivate,whiteprivate,
]

function createBoard() {
    pieces.forEach((piece,i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = piece
        square.setAttribute('draggable', false)
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id',i)
        board.append(square)
    });
}
function addInvisible(arrPieces) {
    arrPieces.forEach(piece => {
        piece.classList.add('invisible')
    })
}

function removeInvisible(arrPieces) {
    arrPieces.forEach(piece => {
        piece.classList.remove('invisible')
    })
}




function checkMode(){
        
        const blackPieces = document.querySelectorAll('.black')
        const whitePieces = document.querySelectorAll('.white')

        if(player=="white"){
            addInvisible(blackPieces)
        }else if( player=="black"){
            removeInvisible(blackPieces)
            addInvisible(whitePieces)
        }else{
            const allPieces = document.querySelectorAll('.piece')
            addInvisible(allPieces)
        }
}

function makeBackCover(arrPieces) {
    arrPieces.forEach(piece => {
        const blackback = document.createElement('div')
        blackback.classList.add('pureblack')
        blackback.innerHTML = pureblack
        piece.parentNode.append(blackback)
    })
}



function startGame(){
    const allPieces = document.querySelectorAll('.piece')

    finishedPrepButton.classList.add('invisible')

    playerTurn.classList.remove('invisible')
    nextTurnButton.classList.remove('invisible')
   
    removeInvisible(allPieces)
      
    const blackPieces = document.querySelectorAll('.black')
    
    makeBackCover(blackPieces)

}

function finishedPrep() {
    if(player=="white"){
        player="black"
        checkMode()
    }else if(player=="black"){
        player="startWhite"
        finishedPrepButton.innerHTML = "Start Game"
        checkMode()
    }else if(player=="startWhite"){
        player="white"
        mode ="Game Phase"


        const blackPieces = document.querySelectorAll('.black')

        blackPieces.forEach(piece => {
            piece.setAttribute('draggable', false)
        })


        startGame()
    }
}


createBoard()
checkMode()


const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)

})


var startPosition
var draggedElement

function dragStart(e) {

    if(e.target.classList.contains('piece')){
        draggedElement = e.target
        startPosition = e.target.parentNode
    }else{
        draggedElement = undefined
        startPosition = undefined
    }
}

function dragOver(e) {
    e.preventDefault()

}

function dragDrop(e) {
    e.stopPropagation()

    if(mode=="Prepare Phase"){
        prep(e)
    }


    if(mode=="Game Phase"){
        
        game(e)
        if(lastMove!=undefined){
            if(player=="white"){
                if(lastMove.getAttribute("square-id")<9 && lastMove.firstChild.getAttribute('rank')=="flag"){
                    declareWinner("white","black")
                    console.log("a")
                }
            }
            if(player=="black"){
                if( lastMove.getAttribute("square-id")>62 && lastMove.firstChild.getAttribute('rank')=="flag"){
                    declareWinner("white","black")
                    console.log("b")

                }
            }

        }
    }

}

function appendToDiv(e, color,  checkFunc){
    if (e.target.classList.contains(color)){
        const pieceAtTarget = e.target
        e.target.parentNode.append(draggedElement)
        e.target.remove()
        startPosition.append(pieceAtTarget)        
    }else if(checkFunc){
        e.target.append(draggedElement)
    }else{
        alert("cannot placed there")
    }
}

function prep(e) {

    if(player=="white" && draggedElement!=undefined){
        appendToDiv(e, "white", e.target.getAttribute('square-id')>44)
    }

    if(player=="black" && draggedElement!=undefined){
        appendToDiv(e, "black", e.target.getAttribute('square-id')<27)
    }

}

var lastMove
var dama

function movePiece(e, yourColor, enemyColor, targetSquare, attackerPiecePosition){
    var attackerPiece = draggedElement.getAttribute('rank')
       
        if(targetSquare-1 == attackerPiecePosition || targetSquare == attackerPiecePosition-1 || targetSquare+9 == attackerPiecePosition || targetSquare-9 == attackerPiecePosition){
            e.target.append(draggedElement)

            if(attackerPiece=="flag" && yourColor=="white" && targetSquare<9){
                lastMove=e.target
                dama="white"
            }else if(attackerPiece=="flag" && yourColor=="black" && targetSquare>62){
                lastMove=e.target
                dama="black"
            }


            if(winner=="none"){
                if(yourColor=="white"){
                    coverWhite()
                }else{
                    coverBlack()
                }
            }
            
        }else if(e.target.classList.contains(enemyColor)){
           
            var defenderPiece = e.target.parentNode.parentNode.firstChild.getAttribute('rank')
            challenge(attackerPiece, defenderPiece, e)
            if(winner=="none"){

                if(yourColor=="white"){
                    coverWhite()
                }else{
                    coverBlack()
                }
            }

            
        }else if(targetSquare == attackerPiecePosition){
            //do nothing
        }else if(e.target.classList.contains(yourColor)){
            alert("Square already occupied by another piece of yours")
        }else{
            alert("Piece can move 1 square up, down, and right only")
        }
}

function game(e) {
  
    
    var attackerPiecePosition = parseInt(draggedElement.parentNode.getAttribute('square-id'))
    var targetSquare = parseInt(e.target.getAttribute('square-id'))


    if(player=="white"){
        movePiece(e, "white", "black", targetSquare, attackerPiecePosition)
    }else if(player=="black"){
        movePiece(e, "black", "white", targetSquare, attackerPiecePosition)
    }
}


function declareWinner(winner1, winner2){

    const whitebacks = document.querySelectorAll('.purewhite')
    const blackbacks = document.querySelectorAll('.pureblack')

    removeBacks(blackbacks)
    removeBacks(whitebacks)

    if(player=="white"){
        winner = winner1
        alert(winner + " Win")
    }else if(player=="black"){
        winner = winner2
        alert(winner + " Win")
    } 
}



function challenge(attacker, defender, e) {

    const rankValue = {
        flag: 1,
        private: 2,
        sergeant: 3,
        secondlieut: 4,
        firstlieut: 5,
        captain: 6,
        major: 7,
        ltcolonel: 8,
        colonel: 9,
        onestar: 10,
        twostar: 11,
        threestar: 12,
        fourstar: 13,
        fivestar: 16,
        spy: 17
    }

    if(attacker==defender){

        if(attacker=="flag"){
            e.target.parentNode.parentNode.append(draggedElement)
            e.target.parentNode.parentNode.firstChild.remove()
            e.target.parentNode.remove()
            declareWinner("White","Black")    
        }else{
            
            e.target.parentNode.parentNode.firstChild.remove()
            e.target.parentNode.remove()
            draggedElement.remove()
        }
    }

    if(attacker=="spy" && defender!="private"){
        e.target.parentNode.parentNode.append(draggedElement)
        e.target.parentNode.parentNode.firstChild.remove()
        e.target.parentNode.remove()
    }else if(attacker=="spy" && defender=="private"){
        draggedElement.remove()
    }else if(attacker=="flag" && defender!="flag"){
        draggedElement.remove()
        declareWinner("Black","White")
    }else if(rankValue[attacker]>rankValue[defender]){
        e.target.parentNode.parentNode.append(draggedElement)
        e.target.parentNode.parentNode.firstChild.remove()
        e.target.parentNode.remove()


        if(defender=="flag"){
            declareWinner("White","Black")
        }
    }else if(rankValue[attacker]<rankValue[defender]){
        draggedElement.remove()
    }

}


function coverWhite() {

    const whitePieces = document.querySelectorAll('.white')
    
    whitePieces.forEach(piece => {

        piece.setAttribute('draggable', false)
        const whiteback = document.createElement('div')
        whiteback.classList.add('purewhite')
        whiteback.innerHTML = purewhite
        piece.parentNode.append(whiteback)
    })

    player = "black"
    playerTurn.textContent = player
    
}

function coverBlack() {

    const blackPieces = document.querySelectorAll('.black')

    makeBackCover(blackPieces)

    
    player = "white"
    playerTurn.textContent = player
    
}


function revealPieces() {

    const blackPieces = document.querySelectorAll('.black')
    const whitePieces = document.querySelectorAll('.white')


        
    
    if(player=="white"){
        const whitebacks = document.querySelectorAll('.purewhite')
        removeBacks(whitebacks)
        whitePieces.forEach(piece => {
            piece.setAttribute('draggable', true)
        })

        playerTurn.style.backgroundColor = "#EEE";
       playerTurn.style.color = "#111"
    }else if(player=="black"){
        const blackbacks = document.querySelectorAll('.pureblack')
        removeBacks(blackbacks)
        blackPieces.forEach(piece => {
            piece.setAttribute('draggable', true)
        })

        playerTurn.style.backgroundColor = "#111";
        playerTurn.style.color = "#EEE";


        
    }  
}


function removeBacks(arrBacks) {
    arrBacks.forEach(backs => {
        backs.remove()
    })
}