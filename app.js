//  SELECTORS AND GLOBAL VARIABLE
let mouse = document.querySelector(".cursor");
let mouseText = mouse.querySelector("span");
let burger = document.querySelector(".burger");
let logoBtn = document.querySelector("#logo");
// CONTROLLER AND SCENES
let controller;
let slideScene;
let pageScene;
let detailScene;
// EVENT LISTENERS
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);

// FUNCTIONS
function animatedSlides() {
  // ! INITIALIZE A SCROLL MAGIC `CONTROLLER`:
  controller = new ScrollMagic.Controller();
  // Closed selectors
  let slideContainer = document.querySelectorAll(".slide");
  let nav = document.querySelector(".nav-header");
  // Looping within each html `section`
  slideContainer.forEach((slide, index, slideArray) => {
    const heroImg = slide.querySelector(".hero-img");
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    // ! WITH GSAP `TIMELINE` WE CHAIN MULTIPLE ANIMATION:
    const slideTL = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTL.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTL.fromTo(img, { scale: 2 }, { scale: 1 }, "-=0.5");
    // slideTL.fromTo(
    //   heroImg,
    //   { boxShadow: "0px 0px 0px #ffffff26" },
    //   { boxShadow: "0px 2px 20px #ffffff26" }
    // );
    slideTL.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    // ! INTRODUCING `SLIDE` SCENES:
    // Here we define a ScrollMagic `scene` instance and when to trigger it.
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      // A value of 0 means a scene is 'open ended' and no end will trigger.
      // Pins never unpin and animations play independently of scroll progress.
      // ? https://scrollmagic.io/docs/ScrollMagic.Scene.html#duration
      duration: 0, // And default value is 0!
      reverse: false, // prevent scene from applying backwards on the scroll.
    })
      // A tween can be repeated indefinitely within the scene's duration.
      // Tween's handle a timeline consisting of multiple tween(s)/element(s).
      // And even contain events attached to them. For more information:
      // ? https://scrollmagic.io/docs/animation.GSAP.html#Scene.setTween
      .setTween(slideTL)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);

    // ! WITH GSAP `TIMELINE` WE CAN CHAIN MULTIPLE ANIMATION:
    // Applying additional animation to elements during a above scene duration.
    // Here we animate on an array "child" iterated by our `forEach` method.
    // We also reverse our gsap animation on the { y } axis!
    const pageTL = gsap.timeline();
    // We get the next element here and start animating them downward.
    // Here we get the next element (ahead of time) during our slide animation!
    // To exclude the first slide `section` from the timeline, we `index + 1`.
    // This ternary tells us if we at the end of the array we iterating.
    // Now we push the nextSlide content down 50% before we animate a `section`.
    // Remember to reverse effects at the end to bring the next context back up.
    let nextSlide =
      slideArray.length - 1 === index ? "end" : slideArray[index + 1];
    pageTL.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTL.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTL.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5"); // reverse it!
    // ! INTRODUCING `PAGE` SCENES:
    // Here we define a ScrollMagic `scene` instance and when to trigger it.
    // We use a process called pinning `setPin` along with `duration: 100%`.
    // Our gsap animation stays operational on the whole height of each slide.
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      // Pin an element for the duration of the `scene` instance of `Scene`.
      // If scene `duration: 0`, a element will only unpin, if the scroll is -
      // - back past the pinned element starting position.

      // Make sure only one pin is applied at an element, at the same time.
      // An element can be pinned multiple times, but only successively.
      // The option `pushFollowers` has no effect, when the scene duration is 0.
      // As mentioned, we can define a sticky "pin" location with `setPin`.
      // Below our scene triggers at our pin location `slide`, till it ends.

      // Remember pinned element by default pushes all following elements down.
      // They pushed down by the amount of pin `duration` configured.
      // But `pushFollowers: false`, the pinned element now keeps all followed -
      // - elements in their place and will move past/over them.
      // ? http://scrollmagic.io/docs/ScrollMagic.Scene.html#setPin
      .setPin(slide, { pushFollowers: false }) // toggle to see behaviors!
      .setTween(pageTL)
      .addTo(controller);
  });
}

function cursor(event) {
  mouse.style.top = event.clientY + "px";
  mouse.style.left = event.clientX + "px";
}

function activeCursor(event) {
  const item = event.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseText.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    mouseText.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(event) {
  if (!event.target.classList.contains("active")) {
    event.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "#17181a" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "#17181a" });
    gsap.to("#logo", 1, { color: "#17181a" });
    gsap.to(".logo-badge", 1, {
      background: "#17181a",
      boxShadow: "0px 2px 20px #17181a",
    });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hide");
  } else {
    event.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".logo-badge", 1, {
      background: "white",
      boxShadow: "0px 2px 20px white",
    });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    document.body.classList.remove("hide");
  }
}
// Ensure that this function is called `beforeEnter` for the fashion container.
function detailAnimation() {
  // ! INITIALIZE A SCROLL MAGIC `CONTROLLER`:
  controller = new ScrollMagic.Controller();
  let slideContainer = document.querySelectorAll(".detail-slide");
  // Looping within each html `section`
  slideContainer.forEach((slide, index, slideArray) => {
    // ! WITH GSAP `TIMELINE` WE CAN CHAIN MULTIPLE ANIMATION:
    const slideTL = gsap.timeline({ defaults: { duration: 1 } });
    // We get the next element here and start animating them downward.
    // Here we get the next element (ahead of time) during our slide animation!
    // To exclude the first slide `section` from the timeline, we `index + 1`.
    // This logic is the same as the one above.
    let nextSlide = slideArray.length === index ? "end" : slideArray[index + 1];
    const img = nextSlide.querySelector("img");
    const nr = nextSlide.querySelector(".fashion-nr");
    slideTL.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTL.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=0.25");
    // ! INTRODUCING `DETAIL` SCENES:
    // Here we define a ScrollMagic `scene` instance and when to trigger it.
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTL)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "detail-slide",
      })
      .addTo(controller);
  });
}

// ! BARBA.JS PAGE TRANSITIONS
// We add an `views` array that holds objects as pages we going to transition.
// We also need to define a `namespace` for our pages.
// these are the two pages that we have, next modify our HTML!
// You need to let `barba` know what pages we have, and their names.
// We need to enclose our content in some kind of data wrapper, that it uses.
// Lets define a `container`, `namespace` and `transition` for our pages.
// The `container` is the element that holds our pages and content that changes.
// Our home `container` will switch with other data-barba="containers".
// Notice our `body` and `main` tags need the HTML `data` attribute.
// We control what function(s) get to run specifically, in each "namespace".
// ? https://barba.js.org/docs/getstarted/intro/
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        console.log("barba: home page");
        animatedSlides();
        // Here we keep index.html location consistent between container change!
        logoBtn.href = "./index.html";
      },
      // We `destroy` instances not need in other containers as we transition.
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        console.log("barba: fashion page");
        logoBtn.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        detailScene.destroy();
        controller.destroy();
      },
    },
  ],
  transitions: [
    {
      // Here we apply affects when we leave or enter a container, for another.
      // The `current, next` reference our containers we transition from/toward.
      leave({ current, next }) {
        // The `async()` utility method can run a function either sync or async.
        // This hook we trigger per `transitions`/`views` does not share state.
        // Our `gsap` supports this callback with an `onComplete` property.
        // You can pass any callback function but `gsap` supports `this.async`.
        let done = this.async();
        // ! WITH GSAP `TIMELINE` WE CAN CHAIN MULTIPLE ANIMATION:
        const leaveTL = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        leaveTL.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        leaveTL.fromTo(
          ".loading",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        window.scrollTo(0, 0); // scroll to top of page.
        // ! WITH GSAP `TIMELINE` WE CAN CHAIN MULTIPLE ANIMATION:
        const enterTL = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        enterTL.fromTo(
          ".loading",
          1,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        enterTL.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        enterTL.fromTo(
          ".nav-header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" },
          "-=1.5"
        );
      },
    },
  ],
});
