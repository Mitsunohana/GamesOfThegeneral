const board = document.getElementById('board')
const playerTurn = document.querySelector('#playerTurn')
const nextTurnButton = document.querySelector('#nextTurn')
const finishedPrepButton = document.querySelector('#finishedPrep')

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
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id',i)
        board.append(square)
    });
}


function checkMode(){
        
        const blackPieces = document.querySelectorAll('.black')
        const whitePieces = document.querySelectorAll('.white')

        if(player=="white"){
            
            blackPieces.forEach(piece => {
                piece.classList.add('invisible')
            })
    
        }else if( player=="black"){
            blackPieces.forEach(piece => {
                piece.classList.remove('invisible')
            })
            whitePieces.forEach(piece => {
                piece.classList.add('invisible')
            })
        }else{
            const allPiece = document.querySelectorAll('.piece')
            
            allPiece.forEach(piece => {
                piece.classList.add('invisible')
            })

        }
}


function startGame(){
    const allPiece = document.querySelectorAll('.piece')

    finishedPrepButton.classList.add('invisible')

    playerTurn.classList.remove('invisible')
    nextTurnButton.classList.remove('invisible')
   

    allPiece.forEach(piece => { 
         piece.classList.remove('invisible')
    })
      
    const blackPieces = document.querySelectorAll('.black')
    
    blackPieces.forEach(piece => {
        const blackback = document.createElement('div')
        blackback.innerHTML = pureblack
        piece.parentNode.append(blackback)
    })

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
    draggedElement = e.target
    startPosition = e.target.parentNode
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
    }

}

function prep(e) {

    if(player=="white"){
        if (e.target.classList.contains('white')){
            const pieceAtTarget = e.target
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            startPosition.append(pieceAtTarget)        
        }else if(e.target.getAttribute('square-id')>44){
            e.target.append(draggedElement)
        }else{
            alert("cannot placed there")
        }
    }

    if(player=="black"){
        if (e.target.classList.contains('black')){
            const pieceAtTarget = e.target
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            startPosition.append(pieceAtTarget)
        }else if(e.target.getAttribute('square-id')<28){
            e.target.append(draggedElement)
        }else{
            alert("cannot placed there")
        }
    }

}

function game(e) {
    
    var attackerPiece
    var defenderPiece
    var attackerPiecePosition = parseInt(draggedElement.parentNode.getAttribute('square-id'))
    var targetSquare = parseInt(e.target.getAttribute('square-id'))


    if(player=="white"){
        attackerPiece = draggedElement.getAttribute('rank')
       
        if(targetSquare-1 == attackerPiecePosition || targetSquare == attackerPiecePosition-1 || targetSquare+9 == attackerPiecePosition || targetSquare-9 == attackerPiecePosition){
            e.target.append(draggedElement)
            coverWhite()
        }else if(e.target.classList.contains('black')){
           
            defenderPiece = e.target.parentNode.parentNode.firstChild.getAttribute('rank')
            challenge(attackerPiece, defenderPiece, e)
            coverWhite()
        }else if(targetSquare == attackerPiecePosition){
            //do nothing
        }else if(e.target.classList.contains('white')){
            alert("Square already occupied by another piece of yours")
        }else{
            alert("Piece can move 1 square up, down, and right only")
        }

    }else if(player=="black"){
        attackerPiece = draggedElement.getAttribute('rank')
       
        if(targetSquare-1 == attackerPiecePosition || targetSquare == attackerPiecePosition-1 || targetSquare+9 == attackerPiecePosition || targetSquare-9 == attackerPiecePosition){
            e.target.append(draggedElement)
            coverBlack()
        }else if(e.target.classList.contains('white')){
           
            defenderPiece = e.target.parentNode.parentNode.firstChild.getAttribute('rank')
            challenge(attackerPiece, defenderPiece, e)
            coverBlack()
        }else if(targetSquare == attackerPiecePosition){
            //do nothing
        }else if(e.target.classList.contains('white')){
            alert("Square already occupied by another piece of yours")
        }else{
            alert("Piece can move 1 square up, down, and right only")
        }

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
            e.target.remove()
            if(player=="white"){
                const blackbacks = document.querySelectorAll('.pureblack')
                blackbacks.forEach(blackback => {
                    blackback.remove()
                })
                alert("Player1 Win")
            }else if(player=="black"){
                const whitebacks = document.querySelectorAll('.purewhite')
                whitebacks.forEach(whiteback => {
                    whiteback.remove()
                })
                alert("Player1 Win")
            }     
        }else{
            
            e.target.parentNode.parentNode.firstChild.remove()
            e.target.remove()
            draggedElement.remove()
        }
    }

    if(attacker=="spy" && defender!="private"){
        e.target.parentNode.parentNode.append(draggedElement)
        e.target.parentNode.parentNode.firstChild.remove()
        e.target.remove()
    }else if(attacker=="spy" && defender=="private"){
        draggedElement.remove()

    }else if(rankValue[attacker]>rankValue[defender]){
        e.target.parentNode.parentNode.append(draggedElement)
        e.target.parentNode.parentNode.firstChild.remove()
        e.target.remove()

        if(defender=="flag"){
            if(player=="white"){
                const blackbacks = document.querySelectorAll('.pureblack')
                blackbacks.forEach(blackback => {
                    blackback.remove()
                })
                alert("Player1 Win")
            }else if(player=="black"){
                const whitebacks = document.querySelectorAll('.purewhite')
                whitebacks.forEach(whiteback => {
                    whiteback.remove()
                })
                alert("Player1 Win")
            }  
        }
    }else if(rankValue[attacker]<rankValue[defender]){
        draggedElement.remove()
    }

}


function coverWhite() {

    const whitePieces = document.querySelectorAll('.white')
    
    whitePieces.forEach(piece => {
        const whiteback = document.createElement('div')
        whiteback.innerHTML = purewhite
        piece.parentNode.append(whiteback)
    })

    player = "black"
    playerTurn.textContent = player
    
}

function coverBlack() {

    const blackPieces = document.querySelectorAll('.black')
    
    blackPieces.forEach(piece => {
        const blackback = document.createElement('div')
        blackback.innerHTML = pureblack
        piece.parentNode.append(blackback)
    })

    player = "white"
    playerTurn.textContent = player
    
}


function revealPieces() {
    
    if(player=="white"){
        const whitebacks = document.querySelectorAll('.purewhite')
        whitebacks.forEach(whiteback => {
            whiteback.remove()
        })
        
    
    }else if(player=="black"){
        const blackbacks = document.querySelectorAll('.pureblack')
        blackbacks.forEach(blackback => {
            blackback.remove()
        })
        
    }  
}