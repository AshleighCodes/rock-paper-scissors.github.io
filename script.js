const input = document.getElementById('input');
const output = document.getElementById('output');
let commandHistory = [];
let historyIndex = -1;
let isGameActive = false;
let userWins = 0;
let computerWins = 0;
const options = ["rock", "paper", "scissors"];

const commands = {
    help: () => `Available commands:
- help: Show this help message
- clear: Clear the terminal
- play: Start Rock Paper Scissors game
- print("text"): Print text
- basic Python arithmetic (+, -, /)
Try some Python expressions!`,
    clear: () => {
        output.innerHTML = '';
        return '';
    },
    play: () => {
        isGameActive = true;
        userWins = 0;
        computerWins = 0;
        return "Let's play Rock Paper Scissors!\nType Rock / Paper / Scissors or Q to quit:";
    }
};

function playGame(userInput) {
    if (userInput.toLowerCase() === 'q') {
        isGameActive = false;
        return `Game Over!
You won ${userWins} times.
The computer won ${computerWins} times.
Goodbye!`;
    }

    const normalizedInput = userInput.toLowerCase();
    if (!options.includes(normalizedInput)) {
        return "Sorry, try again";
    }

    const randomNumber = Math.floor(Math.random() * 3);
    const computerPick = options[randomNumber];
    let result = `Computer picked ${computerPick}.\n`;

    if (
        (normalizedInput === "rock" && computerPick === "scissors") ||
        (normalizedInput === "paper" && computerPick === "rock") ||
        (normalizedInput === "scissors" && computerPick === "paper")
    ) {
        result += "Congrats! You won!";
        userWins++;
    } else if (normalizedInput === computerPick) {
        result += "It's a tie!";
    } else {
        result += "Sorry! You lost!";
        computerWins++;
    }

    return result;
}

function evaluateExpression(expr) {
    try {
        if (isGameActive) {
            return playGame(expr);
        }

        // Basic arithmetic evaluation
        if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(expr)) {
            return eval(expr);
        }
        
        // Handle print statements
        if (expr.startsWith('print(') && expr.endsWith(')')) {
            const content = expr.slice(6, -1).trim();
            if (content.startsWith('"') && content.endsWith('"')) {
                return content.slice(1, -1);
            }
        }

        // Handle built-in commands
        if (commands[expr]) {
            return commands[expr]();
        }

        throw new Error('Invalid expression');
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

function addOutput(text, className = 'output') {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value.trim();
        if (command) {
            addOutput(`>>> ${command}`, isGameActive ? 'game-input' : 'output');
            const result = evaluateExpression(command);
            if (result !== undefined && result !== '') {
                addOutput(result, result.toString().startsWith('Error') ? 'error' : 'output');
            }
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            input.value = '';
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    }
});

// Focus input when clicking anywhere in the terminal
document.querySelector('.terminal').addEventListener('click', () => {
    input.focus();
});