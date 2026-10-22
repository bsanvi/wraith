// ========================================
// CIPHER PUZZLE ENGINE
// Person 2
// ========================================


// CAESAR CIPHER DECODER

export function decodeCaesar(ciphertext, shift) {

    // Validate the input
    if (typeof ciphertext !== "string") {
        throw new TypeError("Ciphertext must be a string");
    }

    if (!Number.isInteger(shift) || shift < 0 || shift > 25) {
        throw new RangeError("Shift must be an integer from 0 to 25");
    }

    let result = "";

    for (let i = 0; i < ciphertext.length; i++) {

        let char = ciphertext[i];

        let code = char.charCodeAt(0);

        // Uppercase letters: A-Z
        if (code >= 65 && code <= 90) {

            let decodedCode =
                ((code - 65 - shift + 26) % 26) + 65;

            result += String.fromCharCode(decodedCode);

        }

        // Lowercase letters: a-z
        else if (code >= 97 && code <= 122) {

            let decodedCode =
                ((code - 97 - shift + 26) % 26) + 97;

            result += String.fromCharCode(decodedCode);

        }

        // Preserve spaces and punctuation
        else {

            result += char;

        }

    }

    return result;
}


// ========================================
// ANSWER VALIDATION
// ========================================

export function validateAnswer(userAnswer, correctAnswer) {

    if (
        typeof userAnswer !== "string" ||
        typeof correctAnswer !== "string"
    ) {
        return false;
    }

    const normalize = (text) => {
        return text
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();
    };

    const user = normalize(userAnswer);

    const correct = normalize(correctAnswer);

    return user.length > 0 && user === correct;
}