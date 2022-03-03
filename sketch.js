// Trying to take in user input and display Google Shopping results for each word, using SerpAPI.
let products = [];
let prompts = [
  'What do you like to do in your free time?',
  'Is there anything I can help you shop for?',
  'Is there anything you need to stock up on?',
  'What do you usually forget to buy?',
  'Where are your favorite places to go for fun?',
  'What music do you like?',
  'What are your favorite foods?',
  'What’s something you recently bought?',
  'Are there any gifts you want to shop for?',
  'What was the last thing you bought for yourself?',
  'What kind of clothes do you like best?',
  'What was the last thing you bought for someone else?',
  'What’s your most valued possession?',
  'What couldn’t you live without?'
];
let currentPrompt;
let currentResults = '';
let notFound = '';
let pSize = 150;
let wheat = '#EDD4B2';
let coffee = '#D0A98F';
let apple = '#DB162F';
let plum = '#4D243D';

let myRec = new p5.SpeechRec(); // create a new speech recognition object
let myVoice = new p5.Speech(); // create a new speech obj
let startRecBttn;
let stopRecBttn;
let listening = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  startRecBttn = createButton("Start");
  startRecBttn.mousePressed(startRec);

  startRecBttn.position(430, 63);
  startRecBttn.style('background-color', coffee);
  startRecBttn.style('font-size', '18px');
  startRecBttn.style('border', 'none');
  startRecBttn.style('font-family', 'Open Sans');
  startRecBttn.style('color', plum);
  startRecBttn.style('padding', '4px 8px');
  startRecBttn.style('border-radius', '5px');

  currentPrompt = 'Q: ' + random(prompts);
  myVoice.speak(currentPrompt);

  // for testing
  // productAsk("oatmeal");
  // productAsk("macaroni");
  // productAsk("notebook");

}

// called when user gives speech input
function productAsk(query) {
  let url = 'proxy.php?query=' + query;
  loadJSON(url, gotData);
}

function gotData(data) {
  console.log('got data');
  console.log(data);
  if (data.shopping_results) {
    let p = new Product(data, random(pSize, width-pSize), random(pSize, height-2.5 * pSize));
    products.push(p);
    currentResults += data.search_parameters.q + ' ';
  } else {
    notFound += data.search_parameters.q + ' ';
    console.log('no results');
  }
}

function draw() {
  background(wheat);
  textAlign(LEFT, CENTER);
  ellipseMode(CENTER);
  textSize(18);
  textFont('Open Sans');
  fill(plum);
  stroke(coffee);

  // header bar
  noStroke();
  rect(0, 0, width, 120);

  // instructions
  fill(coffee);
  let intro = "Hi, I'm a bot that generates product suggestions based on your speech input.";
  text(intro, 25, 40);
  fill(plum);
  //console.log();
  if (myRec.resultString) {
    let resultMsg = "Now showing results for: ";
    text(resultMsg + myRec.resultString, 25, height - 40);
  // }
  // if (currentResults != '') {
  //   let resultMsg = "Now showing results for: ";
  //   text(resultMsg + currentResults, 25, height - 40);
  //   if (notFound != '') {
  //     text(" Not found: " + notFound, 25 + textWidth(resultMsg + currentResults), height - 40);
  //   }
  } else {
    text(" Press the button and try answering my questions, or talk about anything!", 25 + textWidth(intro), 40);
  }

  //if it's listening, show red circle and "I'm listening." in text
  if (listening == true) {
    fill(apple);
    ellipse(40, 80, 30, 30);
    text("I'm listening.", 70, 80);
  }
  //if not, show black circle and "Press button to start speech recognition." in text
  else {
    fill(coffee);
    ellipse(40, 80, 30, 30);
    text("Press button to start speech recognition.", 70, 80);

    // randomly start recording sometimes
    let rand = random();
    if (rand > 0.999) {
      startRec();
    }
  }
  
  // display random prompt
  textAlign(RIGHT, CENTER);
  text(currentPrompt, width - 40, 80);

  // display products
  for (let i = 0; i < products.length; i++) {
    products[i].display();
  }
}

function startRec() {
  myRec.start();
  listening = true;
  myRec.onEnd = function endRec() {
    listening = false;
  };
  myRec.onResult = showResult;
}
function showResult() {
  console.log(myRec.resultString);
  
  // each time the user finishes recording, change the prompt
  currentPrompt = random(prompts);
  myVoice.speak(currentPrompt);

  // for each word the user says, check if it 
  // leads to any product results
  let resultArr = myRec.resultString.split(' ');
  for (let i = 0; i < resultArr.length; i++) {
    productAsk(resultArr[i]);
  }
  currentResults = '';
}

class Product {
  // data is the JSON returned by SerpAPI containing all shopping results
  constructor (data, x, y) {
    this.name = data.shopping_results[0].title;
    this.link = data.shopping_results[0].link;
    this.imgLink = data.shopping_results[0].thumbnail;
    this.price = data.shopping_results[0].price;
    this.x = x;
    this.y = y;
  }

  display() {
    strokeWeight(10);
    stroke(255);
    textSize(14);
    textAlign(LEFT, CENTER);

    // white behind image
    fill(255, 255, 255);
    rect(this.x - pSize/2, this.y - 10, pSize + 10, pSize + 20, 20, 20, 0, 0);

    // product image
    let img = createImg(this.imgLink);
    img.position(this.x - pSize/2 + 5, this.y);
    img.size(pSize, AUTO);
    // img.mouseClicked(window.open(this.imgLink));

    // white rounded border around image
    fill(255, 255, 255, 0);
    rect(this.x - pSize/2, this.y - 10, pSize + 10, pSize + 20, 20, 20, 0, 0);

    // rectangle below image for text
    fill(coffee);
    stroke(coffee);
    rect(this.x - pSize/2, this.y + pSize + 5, pSize + 10, pSize * 0.75, 0, 0, 20, 20);

    // product name
    stroke(0);
    fill(plum);
    noStroke();
    textStyle(BOLD);
    textAlign(CORNER, TOP);
    text(this.name, this.x - pSize/2 + 5, this.y + pSize + 10, pSize);
    let nameHeight = textWidth(this.name) / pSize * 25;
    
    // price
    text(this.price, this.x - pSize/2 + 5, this.y + pSize + 20 + nameHeight, pSize);

    //border over everything
    strokeWeight(3);
    stroke(plum);
    fill(0, 0, 0, 0);
    rect(this.x - pSize/2 - 5, this.y - 10 - 5, pSize + 20, pSize * 1.75 + 25, 20);

  }
}
