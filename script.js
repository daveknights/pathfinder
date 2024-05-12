const gridSquares = [
    [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],
    [2,1],[2,2],[2,3],[2,4],[2,5],[2,6],
    [3,1],[3,2],[3,3],[3,4],[3,5],[3,6],
    [4,1],[4,2],[4,3],[4,4],[4,5],[4,6],
    [5,1],[5,2],[5,3],[5,4],[5,5],[5,6],
    [6,1],[6,2],[6,3],[6,4],[6,5],[6,6],
];
const obstacles = [9, 14, 17, 25, 30, 34];
let pathSteps = [];
let startPoint = '';
let startIndex = null;
let endPoint = [6, 6];

const getRowAndColumn = square => {
    const row = Math.ceil(square / 6);

    const column = square - (6 * row) + 6;

    return [row, column];
};

for (let i = 1; i < 37; i++) {
    const square = document.createElement('div');
    square.className = 'square';
    square.id = `pos_${getRowAndColumn(i)[0]}_${getRowAndColumn(i)[1]}`;

    obstacles.includes(i) && square.classList.add('obstacle');

    if (parseInt(getRowAndColumn(i)[0]) === endPoint[0] && parseInt(getRowAndColumn(i)[1]) === endPoint[1]) {
        square.classList.add('end-point');
    }

    document.querySelector('.gridSquares').append(square);
}
// This only worked with no obstacles
const showSquarePositions = () => {
    for (const square of gridSquares) {
        let rowDiff = startPoint[0] - square[0];
        let colDiff = startPoint[1] - square[1]

        if (rowDiff < 0) {
            rowDiff = rowDiff * -1;
        }
        if (colDiff < 0) {
            colDiff = colDiff * -1;
        }

        const distance = rowDiff + colDiff;
        const thisSquare = document.querySelector(`#pos_${square[0]}_${square[1]}`);

        thisSquare.textContent = distance;

        if (thisSquare.textContent !== '0') {
            thisSquare.classList.remove('start-point');
        }
    };
};

const drawPath = () => {
    let i = 0;

    for (const square of gridSquares) {
        document.querySelector(`#pos_${square[0]}_${square[1]}`).classList.remove('path');
    }

    const plotPoint = setInterval(() => {
        if (i === pathSteps.length) {
            clearInterval(plotPoint);
        } else {
            document.querySelector(`#pos_${pathSteps[i][0]}_${pathSteps[i][1]}`).classList.add('path');
            i++;
        }
    }, 100);
};

const makePath = ([startRow, startColumn], currentStartIndex) => {
    if (startRow === endPoint[0] && startColumn === endPoint[1]) {
        drawPath();
    } else {
        const squaresToCheck = [];
        let fScore = null;
        let nextStep = null;
        // look up
        if (startRow !== 1 && !obstacles.includes(currentStartIndex - 5) && gridSquares[currentStartIndex - 6].toString() !== startPoint.toString()
            && !pathSteps.some(elem => elem.toString() === gridSquares[currentStartIndex - 6].toString())) {
                squaresToCheck.push(gridSquares[currentStartIndex - 6]);
        }
        // look down
        if (startRow !== 6 && !obstacles.includes(currentStartIndex + 7) && gridSquares[currentStartIndex + 6].toString() !== startPoint.toString()
            && !pathSteps.some(elem => elem.toString() === gridSquares[currentStartIndex + 6].toString())) {
                squaresToCheck.push(gridSquares[currentStartIndex + 6]);
        }
        // look left
        if (startColumn !== 1 && !obstacles.includes(currentStartIndex) && gridSquares[currentStartIndex - 1].toString() !== startPoint.toString()
            && !pathSteps.some(elem => elem.toString() === gridSquares[currentStartIndex - 1].toString())) {
                squaresToCheck.push(gridSquares[currentStartIndex - 1]);
        }
        // look right
        if (startColumn !== 6 && !obstacles.includes(currentStartIndex + 2) && gridSquares[currentStartIndex + 1].toString() !== startPoint.toString()
            && !pathSteps.some(elem => elem.toString() === gridSquares[currentStartIndex + 1].toString())) {
            squaresToCheck.push(gridSquares[currentStartIndex + 1]);
        }

        for (const square of squaresToCheck) {
                const f = (endPoint[0] - square[0]) + (endPoint[1] - square[1]);

            if (fScore === null) {
                fScore = f;
                nextStep = square;
            } else if (fScore > f) {
                fScore = f;
                nextStep = square;
            }
        }

        pathSteps.push(nextStep);

        makePath(nextStep, gridSquares.findIndex(gridSquare => gridSquare.toString() === nextStep.toString()));
    }
};

const getStartPoint = e => {
    if (e.target.id.startsWith('pos') && !e.target.classList.contains('end-point')) {
        pathSteps = [];
        splitName = e.target.id.split('_');
        startPoint = [parseInt(splitName[1]), parseInt(splitName[2])];

        startIndex = gridSquares.findIndex(gridSquaresSquare => gridSquaresSquare.toString() === startPoint.toString());

        for (const square of gridSquares) {
            document.querySelector(`#pos_${square[0]}_${square[1]}`).classList.remove('start-point');
        }

        document.querySelector(`#pos_${startPoint[0]}_${startPoint[1]}`).classList.add('start-point');

        // showSquarePositions();
        makePath(startPoint, startIndex);
    }
};

document.querySelector('.gridSquares').addEventListener('click', getStartPoint);
