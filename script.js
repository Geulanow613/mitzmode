function handleNextMitzvah() {
    currentMitzvahIndex = (currentMitzvahIndex + 1) % mitzvot.length; // Ensure this increments properly
    displayCurrentMitzvah();
} 