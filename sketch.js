let classifier; 
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/SWKjEKNO2/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let confiaza = 0;

// Variable to control the frequency of classification
let classifyInterval = 200;  // Clasificar cada 200 ms (5 clasificaciones por segundo)
let lastClassifyTime = 0;

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);  // Crear un canvas del tamaño de la ventana
    // Create the video
    video = createCapture(VIDEO);
    video.size(windowWidth, windowHeight);  // Redimensiona el video a pantalla completa
    video.hide();
    // Start classifying using requestAnimationFrame
    requestAnimationFrame(classifyVideo);
}

function draw() {
    background(0);
    // Draw the video
    image(video, 0, 0, width, height);

    // Apply filter based on the label
    if (label === "Tata" && confiaza > 0.9) {
        // Apply red filter and show red hearts
        applyRedFilter();
    } else if (label === "Mang" && confiaza > 0.9) {
        // Apply blue and purple filter and show blue/purple hearts
        applyBluePurpleFilter();
    } else if (label === "Cookie" && confiaza > 0.9) {
        // Apply ocre filter and show a rabbit 🐰
        applyOcreFilter();
    } else if (label === "Rj" && confiaza > 0.9) {
        // No filter for "Rj" - normal
        applyNormal();
    }

    // Draw the label for feedback (optional)
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text(label, width / 2, height - 30);

    textSize(16);
    textAlign(LEFT);
    text(confiaza.toFixed(2), 10, height - 10);
}

// Function to apply a red filter with reduced saturation
function applyRedFilter() {
    // Apply a red filter with reduced saturation (tint to a subtle red)
    tint(255, 100, 100);  // Light red filter

    // Draw multiple small red hearts in random positions
    for (let i = 0; i < 10; i++) {  // 10 hearts randomly positioned
        let x = random(width);
        let y = random(height);
        let size = random(20, 40);  // Random size for each heart
        drawHeart(x, y, size, "❤️");  // Red hearts (heart emoji)
    }

}

// Function to apply a blue and purple filter with reduced saturation
function applyBluePurpleFilter() {
    // Apply a blue filter with reduced saturation
    tint(100, 100, 255);  // Light blue filter

    // Draw multiple small blue and purple hearts in random positions
    for (let i = 0; i < 10; i++) {  // 10 hearts randomly positioned
        let x = random(width);
        let y = random(height);
        let size = random(20, 40);  // Random size for each heart
        let heart = random() > 0.5 ? "💙" : "💜";  // Randomly pick between 💙 and 💜
        drawHeart(x, y, size, heart);  // Blue or purple hearts (heart emoji)
    }

}

// Function to apply an ocre filter and show a rabbit 🐰
function applyOcreFilter() {
    // Apply an ocre filter (with reduced saturation)
    tint(204, 204, 102);  // Ocre filter

    // Draw a rabbit emoji 🐰 in the center of the canvas
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("🐰", width / 2, height / 2);


}

// Function to apply no filter for "Rj" (normal)
function applyNormal() {
    // No filter applied, just show the regular video
    noTint();  // Remove any previous tint effect
    image(video, 0, 0, width, height);  // Display the normal video

}

// Function to draw a heart emoji at a given position
function drawHeart(x, y, size, heartEmoji) {
    fill(255);  // White color for the heart emoji
    noStroke();
    textSize(size);
    textAlign(CENTER, CENTER);
    text(heartEmoji, x, y);
}

// Get a prediction for the current video frame
function classifyVideo() {
    // Classify only if enough time has passed
    if (millis() - lastClassifyTime > classifyInterval) {
        classifier.classify(video, gotResult);
        lastClassifyTime = millis();  // Update the time of the last classification
    }

    // Continue classifying at the next available frame
    requestAnimationFrame(classifyVideo);
}

// When we get a result
function gotResult(results, error) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }

    // The results are in an array ordered by confidence.
    label = results[0].label;
    confiaza = results[0].confidence;
}
