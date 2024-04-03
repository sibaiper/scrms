// Create an array of all letters (uppercase and lowercase)
const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
).concat(Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)));

// Create an array of numbers from 0 to 9
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

// Combine the arrays to get all letters and numbers
const lettersAndNumbers = letters.concat(numbers);

class Utils {
  getRandomLetters(arr, lengthArr) {
    const length = lengthArr.length;

    // Shuffle the array
    const shuffledLetters = arr.slice().sort(() => Math.random() - 0.5);

    // Return a sliced array with the length of lengthArr
    return shuffledLetters.slice(0, length);
  }

  setHTML(el, str) {
    el.textContent = str.join("");
  }

  getElement(el) {
    let element;

    if (typeof el === "string") {
      // If el is a string, assume it's a CSS selector
      element = document.querySelector(el);
    } else if (el instanceof HTMLElement) {
      // If el is an HTMLElement, it's a direct reference to an HTML element
      element = el;
    } else {
      // Handle other cases or throw an error if needed
      throw new Error(
        "Invalid argument. Please provide a valid CSS selector or HTML element."
      );
    }

    return element;
  }
}

export default class Scramble extends Utils {
  constructor(selector, settings = {}) {
    super(); // Call the constructor of the superclass (Utils)
    this.element = this.getElement(selector);
    this.duration = settings.duration || 1;
    this.delay = settings.delay || 0;
    this.progress = settings.progress || 0; // Initialize progress at 0
    this.startTime = null; // Variable to hold the start time of animation
    this.animationFrame = null; // Variable to hold the animation frame reference
    this.originalText = this.element.textContent;

    this.onAnimationEnd = settings.onAnimationEnd || (() => {});
    this.onAnimating = settings.onAnimating || (() => {});

    this.#init();
  }

  #init() {
    let element_splitText = this.originalText.split("");

    // Set initial state to scrambled text
    this.setHTML(
      this.element,
      this.getRandomLetters(lettersAndNumbers, element_splitText)
    );
  }

  #animate() {
    const animateFrame = (currentTime) => {
      if (!this.startTime) this.startTime = currentTime;
      const elapsedTime = currentTime - this.startTime;

      this.progress = Math.min(elapsedTime / (this.duration * 1000), 1); // Update progress

      // Update UI based on progress
      this.#updateUI(this.progress);

      if (this.progress < 1) {
        //call on animation end:
        if (this.onAnimating) {
          this.onAnimating();
        }

        this.animationFrame = requestAnimationFrame(animateFrame);
      } else {
        //reset after the animation ends:
        this.progress = 0;
        this.pause();

        //call on animation end:
        if (this.onAnimationEnd) {
          this.onAnimationEnd();
        }
      }
    };
    this.animationFrame = requestAnimationFrame(animateFrame);
  }

  #animateLetters(originalText, originalElement, index) {
    //store the already animated over letters
    let animatedLetters = originalText.slice(0, index + 1);

    //generate a new random string matching the length of the left over letters.
    let randomize = this.getRandomLetters(
      lettersAndNumbers,
      originalText.slice(index + 1)
    );

    //concat the already looped over letters with the new randomly generated string that matches the length of the left over letters
    let newText = [...animatedLetters, ...randomize];

    //set the textContent of the element to the newText string
    this.setHTML(originalElement, newText);
  }

  #updateUI(progress) {
    const index = Math.floor(progress * this.element.textContent.length);

    this.#animateLetters(this.originalText.split(""), this.element, index);
  }

  // Method to seek to a specific progress in the animation
  seek(progress) {
    this.pause();

    this.progress = progress; // Update progress
    this.startTime = performance.now() - this.progress * (this.duration * 1000); // Update start time
    this.#updateUI(this.progress);
  }

  // Method to pause the animation
  pause() {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
  }

  // Method to resume the animation
  play() {
    setTimeout(() => {
      if (this.animationFrame === null) {
        this.startTime =
          performance.now() - this.progress * (this.duration * 1000);
        this.#animate();
      }
    }, this.delay);
  }

  stop() {
    this.pause();
    this.progress = 0;
  }

  restart() {
    this.stop();
    this.play();
  }
}
