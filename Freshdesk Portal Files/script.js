document.querySelector(".carousel").addEventListener("slid.bs.carousel", function() {
  setCarouselControlVisibility();
});

const transitionWidth = 1302;

function setCarouselControlVisibility() {
  let carousels = document.querySelectorAll(".carousel");
  for (var carousel of carousels) {
    let prevControl = carousel.querySelector(".carousel-control-prev");
    let nextControl = carousel.querySelector(".carousel-control-next");
    let carouselItems = carousel.querySelectorAll(".carousel-item");
    let width = window.innerWidth;
    if(carouselItems[0].classList.contains("active")) {
  		prevControl.style.visibility = "hidden";
    } else {
      prevControl.style.visibility = "visible";
    }
    let numItems = carouselItems.length;
    console.log(numItems);
    if (width >= transitionWidth && (numItems <= 4 || carouselItems[numItems - 4].classList.contains("active"))) {
      nextControl.style.visibility = "hidden";
    } else if (width < transitionWidth && carouselItems[numItems - 1].classList.contains("active")) {
      nextControl.style.visibility = "hidden";
    } else {
      nextControl.style.visibility = "visible";
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  
  const SERP_URL = "REPLACE_ME_WITH_SEARCH_RESULTS_PAGE_URL";
  const QUERY = "REPLACE_ME_WITH_PROMOTED_CONTENT_QUERY";
  
  function initCarousel() {
    let viewAllLink = document.querySelector('.view-all a');
    viewAllLink.setAttribute("href", SERP_URL + QUERY);
    let items = document.querySelectorAll('.carousel .carousel-item')
    items[0].className = items[0].className + " active";
    items.forEach((el) => {
        const minPerSlide = 4
        let next = el.nextElementSibling
        for (var i=1; i<minPerSlide; i++) {
            if (!next) {
                // wrap carousel by using first child
              next = items[0]
            }
            let cloneChild = next.cloneNode(true)
            el.appendChild(cloneChild.children[0])
            next = next.nextElementSibling
        }
    })
    setCarouselControlVisibility();
  }
    
  function addCarouselCard(title, subtitle, content, url) {
  	parent = document.querySelector("#trendingCarousel .carousel-inner");
    let carouselItem = document.createElement('div');
    carouselItem.className = "carousel-item";
    let col = document.createElement('div');
    col.className = "col-lg-3";
    let card = document.createElement('div');
    card.className = "card";
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";
    let cardTitle = document.createElement('a');
    cardTitle.className = "card-title";
    cardTitle.innerText = title;
    cardTitle.href = url;
    let cardSubtitle = document.createElement('p');
    cardSubtitle.className = "card-subtitle";
    cardSubtitle.innerText = subtitle;
    let cardText = document.createElement('p');
    cardText.className = "card-text";
    cardText.innerText = content;
    let cardFooter = document.createElement('div');
    cardFooter.className = "card-footer";
    let cardLinkContainer = document.createElement('div');
    cardLinkContainer.className = "card-link";
    let cardLink = document.createElement('a');
    cardLink.className = "card-link";
    cardLink.innerText = "READ MORE ";
    cardLink.href = url;
    let cardLinkIcon = document.createElement('span');
    cardLinkIcon.className = "bi-chevron-right";
    
    cardLink.appendChild(cardLinkIcon);
    cardLinkContainer.appendChild(cardLink);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardSubtitle);
    cardBody.appendChild(cardText);
    cardFooter.appendChild(cardLinkContainer);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    col.appendChild(card);
    carouselItem.appendChild(col);
    
    viewAllCarouselItem = document.querySelector("#trendingCarousel .end-card");
    parent.insertBefore(carouselItem, viewAllCarouselItem);
  }
  
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        var modules = response.response.modules;
        var data = [];
        for (var module of modules) {
          data = data.concat(module.results);
        }
        for (let i = 0; i < Math.min(10, data.length); i++) {
          //This provides default mappings for common entity types however they may need to be changed
          var d = data[i].data;
          var title = d.name ? d.name : (d.question ? d.question : d.c_answersCardTitle);
          var subtitle = d.type + " | " + d.c_createdAt;
          var content = d.description ? d.description : (d.richTextDescription ? d.richTextDescription : (d.shortDescription ? d.shortDescription : d.s_snippet));
          var url = d.website ? d.website : (d.landingPageUrl ? d.landingPageUrl : d.url);
          addCarouselCard(title, subtitle, content, url);
        }
        initCarousel();
     }
  };
  
  httpRequest.open("GET","https://liveapi.yext.com/v2/accounts/me/answers/query?v=20220202&experienceKey=REPLACE_ME&api_key=REPLACE_ME&locale=en&input=" + QUERY, true);
  httpRequest.send();
}
