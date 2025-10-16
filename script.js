// Estado Global
let array = [];
let arraySize = 50;
let speed = 50;
let isSorting = false;
let stopRequested = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;

// Elementos do DOM
const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm-select');
const arraySizeInput = document.getElementById('array-size');
const speedInput = document.getElementById('speed');
const generateBtn = document.getElementById('generate-btn');
const sortBtn = document.getElementById('sort-btn');
const stopBtn = document.getElementById('stop-btn');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const comparisonsDisplay = document.getElementById('comparisons');
const swapsDisplay = document.getElementById('swaps');
const timeDisplay = document.getElementById('time');

// Informações dos Algoritmos
const algorithmInfo = {
    bubble: {
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Compara elementos adjacentes e os troca se estiverem na ordem errada. Repete até que nenhuma troca seja necessária.'
    },
    selection: {
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Encontra o menor elemento e o coloca na primeira posição. Repete para as posições restantes.'
    },
    insertion: {
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Constrói o array ordenado um item por vez, inserindo cada elemento na posição correta.'
    },
    merge: {
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        description: 'Divide o array em metades, ordena recursivamente e depois mescla as partes ordenadas.'
    },
    quick: {
        timeComplexity: 'O(n log n) médio, O(n²) pior caso',
        spaceComplexity: 'O(log n)',
        description: 'Escolhe um pivô e particiona o array, colocando elementos menores antes e maiores depois do pivô.'
    }
};

// Event Listeners
arraySizeInput.addEventListener('input', (e) => {
    arraySize = parseInt(e.target.value);
    sizeValue.textContent = arraySize;
    generateArray();
});

speedInput.addEventListener('input', (e) => {
    speed = parseInt(e.target.value);
    speedValue.textContent = `${speed}ms`;
});

generateBtn.addEventListener('click', generateArray);
sortBtn.addEventListener('click', startSorting);
stopBtn.addEventListener('click', stopSorting);
algorithmSelect.addEventListener('change', updateAlgorithmInfo);

// Funções Principais
function generateArray() {
    if (isSorting) return;
    
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 350) + 20);
    }
    
    resetStats();
    renderArray();
}

function renderArray(comparingIndices = [], swappingIndices = [], sortedIndices = []) {
    arrayContainer.innerHTML = '';
    
    const barWidth = Math.max(2, (arrayContainer.offsetWidth / arraySize) - 2);
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth}px`;
        
        if (comparingIndices.includes(index)) {
            bar.classList.add('comparing');
        }
        if (swappingIndices.includes(index)) {
            bar.classList.add('swapping');
        }
        if (sortedIndices.includes(index)) {
            bar.classList.add('sorted');
        }
        
        arrayContainer.appendChild(bar);
    });
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    comparisonsDisplay.textContent = '0';
    swapsDisplay.textContent = '0';
    timeDisplay.textContent = '0s';
}

function updateStats() {
    comparisonsDisplay.textContent = comparisons;
    swapsDisplay.textContent = swaps;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    timeDisplay.textContent = `${elapsed}s`;
}

function updateAlgorithmInfo() {
    const selected = algorithmSelect.value;
    const info = algorithmInfo[selected];
    
    document.getElementById('time-complexity').textContent = info.timeComplexity;
    document.getElementById('space-complexity').textContent = info.spaceComplexity;
    document.getElementById('description').textContent = info.description;
}

async function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    stopRequested = false;
    startTime = Date.now();
    
    sortBtn.disabled = true;
    generateBtn.disabled = true;
    stopBtn.disabled = false;
    algorithmSelect.disabled = true;
    arraySizeInput.disabled = true;
    
    const algorithm = algorithmSelect.value;
    
    switch(algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'merge':
            await mergeSort(0, array.length - 1);
            break;
        case 'quick':
            await quickSort(0, array.length - 1);
            break;
    }
    
    if (!stopRequested) {
        await markAllSorted();
    }
    
    finishSorting();
}

function stopSorting() {
    stopRequested = true;
}

function finishSorting() {
    isSorting = false;
    sortBtn.disabled = false;
    generateBtn.disabled = false;
    stopBtn.disabled = true;
    algorithmSelect.disabled = false;
    arraySizeInput.disabled = false;
}

async function markAllSorted() {
    const sortedIndices = array.map((_, i) => i);
    renderArray([], [], sortedIndices);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Algoritmos de Ordenação

async function bubbleSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        if (stopRequested) return;
        
        for (let j = 0; j < n - i - 1; j++) {
            if (stopRequested) return;
            
            comparisons++;
            renderArray([j, j + 1]);
            updateStats();
            await sleep(speed);
            
            if (array[j] > array[j + 1]) {
                swaps++;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderArray([], [j, j + 1]);
                await sleep(speed);
            }
        }
    }
}

async function selectionSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        if (stopRequested) return;
        
        let minIdx = i;
        
        for (let j = i + 1; j < n; j++) {
            if (stopRequested) return;
            
            comparisons++;
            renderArray([minIdx, j]);
            updateStats();
            await sleep(speed);
            
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        
        if (minIdx !== i) {
            swaps++;
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            renderArray([], [i, minIdx]);
            await sleep(speed);
        }
    }
}

async function insertionSort() {
    const n = array.length;
    
    for (let i = 1; i < n; i++) {
        if (stopRequested) return;
        
        let key = array[i];
        let j = i - 1;
        
        while (j >= 0 && array[j] > key) {
            if (stopRequested) return;
            
            comparisons++;
            swaps++;
            array[j + 1] = array[j];
            renderArray([j, j + 1], [j + 1]);
            updateStats();
            await sleep(speed);
            j--;
        }
        
        array[j + 1] = key;
        renderArray([], [j + 1]);
        await sleep(speed);
    }
}

async function mergeSort(left, right) {
    if (stopRequested || left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
}

async function merge(left, mid, right) {
    if (stopRequested) return;
    
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
        if (stopRequested) return;
        
        comparisons++;
        renderArray([left + i, mid + 1 + j]);
        updateStats();
        await sleep(speed);
        
        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i];
            i++;
        } else {
            array[k] = rightArr[j];
            j++;
        }
        
        swaps++;
        renderArray([], [k]);
        await sleep(speed);
        k++;
    }
    
    while (i < leftArr.length) {
        if (stopRequested) return;
        array[k] = leftArr[i];
        swaps++;
        renderArray([], [k]);
        await sleep(speed);
        i++;
        k++;
    }
    
    while (j < rightArr.length) {
        if (stopRequested) return;
        array[k] = rightArr[j];
        swaps++;
        renderArray([], [k]);
        await sleep(speed);
        j++;
        k++;
    }
}

async function quickSort(low, high) {
    if (stopRequested || low >= high) return;
    
    const pi = await partition(low, high);
    
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (stopRequested) return i + 1;
        
        comparisons++;
        renderArray([j, high]);
        updateStats();
        await sleep(speed);
        
        if (array[j] < pivot) {
            i++;
            swaps++;
            [array[i], array[j]] = [array[j], array[i]];
            renderArray([], [i, j]);
            await sleep(speed);
        }
    }
    
    swaps++;
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    renderArray([], [i + 1, high]);
    await sleep(speed);
    
    return i + 1;
}

// Inicialização
generateArray();
updateAlgorithmInfo();
