(() => {
  // script.js
  var BLACKOUT_SECTION = 50;
  var BLACKOUT_STANDARD = 150;
  var RESET_TO_FEATURES_MAIN = 100;
  var allNavLinks = document.querySelectorAll(".nav_menu_link");
  var blackout = document.querySelector(".blackout");
  var sectionFeatures = document.querySelector(".section_features");
  var sectionComponents = document.querySelector(".section_components");
  var sectionInstructions = document.querySelector(".section_instructions");
  var allSections = [sectionFeatures, sectionComponents, sectionInstructions];
  var ctrlBtnWrapper = document.querySelector(".ctrl-btn-wrapper");
  var allSectionBtnWrappers = document.querySelectorAll(".section-wrap-btns");
  var activeSection = document.querySelector(".section_features");
  var activeSectionName = activeSection.classList[0].slice(8);
  var allVidsFeatures = sectionFeatures.querySelectorAll(".vid");
  var allVidsFeaturesMobileP = sectionFeatures.querySelectorAll(".vid.mobile-p");
  var allSectionVidsFeatures = [...allVidsFeatures, ...allVidsFeaturesMobileP];
  allNavLinks.forEach(function(el) {
    el.addEventListener("click", function(e) {
      const clicked = e.target.closest(".nav_menu_link");
      if (!clicked) return;
      activeSectionName = clicked.classList[1];
      ResetSectionVideos("all");
      ActivateNavLink();
      ActivateSection();
      ActivateSectionButtons();
    });
  });
  var ActivateNavLink = function() {
    allNavLinks.forEach(function(el) {
      el.classList.remove("current");
      if (el.classList.contains(activeSectionName)) el.classList.add("current");
    });
  };
  var ActivateSection = function() {
    allSections.forEach(function(el) {
      el.classList.remove("active");
      if (el.classList[0].slice(8) === activeSectionName) {
        el.classList.add("active");
        activeSection = el;
        FlashBlackout(BLACKOUT_SECTION);
      }
    });
  };
  var FlashBlackout = function(timerVariable) {
    blackout.classList.remove("off");
    setTimeout(function() {
      blackout.classList.add("off");
    }, timerVariable);
  };
  var DeactivateSectionImages = function(sectionName) {
    if (!sectionName) {
      activeSection.querySelectorAll(".section-img").forEach(function(el) {
        el.classList.remove("active");
      });
    } else {
      document.querySelector(`.section_${sectionName}`).querySelectorAll(".section-img").forEach(function(el) {
        el.classList.remove("active");
      });
    }
  };
  var DeactivateSectionVideos = function(sectionName) {
    if (!sectionName) {
      activeSection.querySelectorAll(".video-wrap").forEach(function(el) {
        el.classList.remove("active");
      });
    } else {
      document.querySelector(`.section_${sectionName}`).querySelectorAll(".video-wrapper").forEach(function(el) {
        el.classList.remove("active");
      });
    }
  };
  var ResetSectionVideos = function(sectionName) {
    if (sectionName === "all") {
      document.querySelectorAll(`.vid,.vid-mobile-p`).forEach(function(el) {
        el.currentTime = 0;
        el.pause();
      });
    } else if (!sectionName) {
      activeSection.querySelectorAll(`.vid,.vid-mobile-p`).forEach(function(el) {
        el.currentTime = 0;
        el.pause();
      });
    } else {
      document.querySelector(`.section_${sectionName}`).querySelectorAll(`.vid,.vid-mobile-p`).forEach(function(el) {
        el.currentTime = 0;
        el.pause();
      });
    }
  };
  var ActivateSectionImage = function(imgName) {
    activeSection.querySelector(`.section-wrap-imgs.${imgName}`).querySelectorAll(".section-img").forEach(function(el) {
      el.classList.add("active");
    });
  };
  var ActivateSectionVideo = function(vidName, vidIndex) {
    DeactivateSectionVideos();
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap")[vidIndex].classList.add("active");
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap.mobile-p")[vidIndex].classList.add("active");
  };
  var PlaySectionVideo = function(vidName, vidIndex) {
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap")[vidIndex].querySelector(".vid").play();
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap.mobile-p")[vidIndex].querySelector(".vid.mobile-p").play();
  };
  var ActivateSectionButtons = function() {
    allSectionBtnWrappers.forEach(function(el) {
      el.classList.remove("active");
    });
    ctrlBtnWrapper.querySelector(`.section-wrap-btns.${activeSectionName}`).classList.add("active");
  };
  allVidsFeatures.forEach(function(el) {
    el.addEventListener("ended", function() {
      ResetToMainScreen();
    });
  });
  ctrlBtnWrapper.addEventListener("click", function(e) {
    const clicked = e.target.closest(".ctrl-btn.features");
    if (!clicked) return;
    const parentElement = clicked.parentElement;
    const clickedIndex = Array.prototype.indexOf.call(
      parentElement.children,
      clicked
    );
    FlashBlackout(BLACKOUT_STANDARD);
    DeactivateSectionImages();
    ResetSectionVideos();
    ActivateSectionVideo("features", clickedIndex);
    PlaySectionVideo("features", clickedIndex);
  });
  var ResetToMainScreen = function() {
    setTimeout(function() {
      DeactivateSectionVideos();
      ActivateSectionImage("main");
    }, RESET_TO_FEATURES_MAIN);
  };
  ctrlBtnWrapper.addEventListener("click", function(e) {
    const clicked = e.target.closest(".ctrl-btn.components");
    if (!clicked) return;
    const parentElement = clicked.parentElement;
    const clickedIndex = Array.prototype.indexOf.call(
      parentElement.children,
      clicked
    );
    FlashBlackout(BLACKOUT_STANDARD);
    DeactivateSectionImages();
    ResetSectionVideos();
    ActivateSectionVideo("components", clickedIndex);
    PlaySectionVideo("datasheets", clickedIndex);
  });
})();
