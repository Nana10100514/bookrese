const campaignLogo =
  document.querySelector("#campaignLogo");

const logoFallback =
  document.querySelector("#logoFallback");

const bookSlider =
  document.querySelector("#bookSlider");

const bookCards = [
  ...document.querySelectorAll(".book-card")
];

const sliderDots =
  document.querySelector("#sliderDots");

const dateWheel =
  document.querySelector("#dateWheel");

const dateSection =
  document.querySelector(".date-section");

const rouletteStatus =
  document.querySelector("#rouletteStatus");

const searchButton =
  document.querySelector("#searchButton");

const reserveLink =
  document.querySelector("#reserveLink");

const weekdays = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土"
];

let selectedDate;
let rouletteHasRun = false;

function setupLogo() {
  if (!campaignLogo) {
    return;
  }

  const showFallback = () => {
    campaignLogo.hidden = true;

    if (logoFallback) {
      logoFallback.hidden = false;
    }
  };

  campaignLogo.addEventListener(
    "error",
    showFallback
  );

  if (
    campaignLogo.complete &&
    campaignLogo.naturalWidth === 0
  ) {
    showFallback();
  }
}

function setupBookImages() {
  const images = document.querySelectorAll(
    ".cover img, .recommend-cover img"
  );

  images.forEach((image) => {
    const hideBrokenImage = () => {
      image.hidden = true;
    };

    image.addEventListener(
      "error",
      hideBrokenImage
    );

    if (
      image.complete &&
      image.naturalWidth === 0
    ) {
      hideBrokenImage();
    }
  });
}

function setupSlider() {
  if (
    !bookSlider ||
    !sliderDots ||
    bookCards.length === 0
  ) {
    return;
  }

  bookCards.forEach((book, index) => {
    const dot =
      document.createElement("span");

    if (index === 0) {
      dot.classList.add("is-active");
    }

    sliderDots.append(dot);
  });

  const dots = [
    ...sliderDots.children
  ];

  const updateDots = () => {
    const firstCardWidth =
      bookCards[0].getBoundingClientRect().width;

    const cardWidth =
      firstCardWidth + 12;

    const activeIndex = Math.min(
      bookCards.length - 1,
      Math.max(
        0,
        Math.round(
          bookSlider.scrollLeft / cardWidth
        )
      )
    );

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "is-active",
        index === activeIndex
      );
    });
  };

  bookSlider.addEventListener(
    "scroll",
    updateDots,
    { passive: true }
  );
}

function localDateKey(date) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createDateWheel() {
  if (!dateWheel) {
    return;
  }

  const start = new Date();

  start.setHours(12, 0, 0, 0);

  for (
    let offset = 7;
    offset <= 42;
    offset += 1
  ) {
    const date = new Date(start);

    date.setDate(
      start.getDate() + offset
    );

    const option =
      document.createElement("button");

    option.type = "button";
    option.className = "date-option";
    option.dataset.date =
      date.toISOString();

    option.setAttribute(
      "role",
      "option"
    );

    option.setAttribute(
      "aria-selected",
      "false"
    );

    option.innerHTML = `
      <span>${date.getMonth() + 1}</span>
      <span>${date.getDate()}</span>
      <span>${weekdays[date.getDay()]}</span>
    `;

    dateWheel.append(option);
  }

  requestAnimationFrame(() => {
    const initial =
      dateWheel.lastElementChild;

    dateWheel.scrollTop =
      positionFor(initial);

    selectOption(initial);
    setupRouletteObserver();
  });
}

function positionFor(option) {
  return (
    option.offsetTop -
    (
      dateWheel.clientHeight -
      option.offsetHeight
    ) /
    2
  );
}

function selectOption(option) {
  if (!option) {
    return;
  }

  const options = [
    ...dateWheel.children
  ];

  options.forEach((item) => {
    const isSelected =
      item === option;

    item.classList.toggle(
      "is-selected",
      isSelected
    );

    item.setAttribute(
      "aria-selected",
      String(isSelected)
    );
  });

  selectedDate =
    new Date(option.dataset.date);

  if (reserveLink) {
    const date =
      encodeURIComponent(
        localDateKey(selectedDate)
      );

    reserveLink.href =
      `./reservation.htm?date=${date}`;
  }
}

function selectClosestDate() {
  const options = [
    ...dateWheel.children
  ];

  if (options.length === 0) {
    return;
  }

  const rowHeight =
    options[0].offsetHeight;

  const index = Math.min(
    options.length - 1,
    Math.max(
      0,
      Math.round(
        dateWheel.scrollTop / rowHeight
      )
    )
  );

  selectOption(options[index]);
}

function runDateRoulette() {
  if (
    rouletteHasRun ||
    !dateWheel
  ) {
    return;
  }

  rouletteHasRun = true;

  const options = [
    ...dateWheel.children
  ];

  const targetIndex = 7;
  const target =
    options[targetIndex];

  if (!target) {
    return;
  }

  const startPosition =
    dateWheel.scrollTop;

  const endPosition =
    positionFor(target);

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reducedMotion) {
    dateWheel.scrollTop =
      endPosition;

    selectOption(target);
    showRouletteResult();
    return;
  }

  if (rouletteStatus) {
    rouletteStatus.textContent =
      "おすすめ日を選んでいます";
  }

  const startTime =
    performance.now();

  const duration = 2600;

  const animate = (now) => {
    const progress = Math.min(
      1,
      (now - startTime) / duration
    );

    const eased =
      1 - Math.pow(1 - progress, 4);

    dateWheel.scrollTop =
      startPosition +
      (
        endPosition -
        startPosition
      ) *
      eased;

    selectClosestDate();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      dateWheel.scrollTop =
        endPosition;

      selectOption(target);
      showRouletteResult();
    }
  };

  requestAnimationFrame(animate);
}

function showRouletteResult() {
  if (
    !selectedDate ||
    !rouletteStatus
  ) {
    return;
  }

  const month =
    selectedDate.getMonth() + 1;

  const day =
    selectedDate.getDate();

  const week =
    weekdays[selectedDate.getDay()];

  rouletteStatus.textContent =
    `おすすめの次回予約日は` +
    `${month}月${day}日（${week}）です`;
}

function setupRouletteObserver() {
  if (!dateSection) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    runDateRoulette();
    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        const isVisible =
          entries.some(
            (entry) =>
              entry.isIntersecting
          );

        if (isVisible) {
          runDateRoulette();
          observer.disconnect();
        }
      },
      {
        threshold: 0.55
      }
    );

  observer.observe(dateSection);
}

if (searchButton) {
  searchButton.addEventListener(
    "click",
    () => {
      if (!selectedDate) {
        selectClosestDate();
      }

      if (!selectedDate) {
        return;
      }

      const date =
        encodeURIComponent(
          localDateKey(selectedDate)
        );

      window.location.href =
        `./reservation.htm?date=${date}`;
    }
  );
}

setupLogo();
setupBookImages();
setupSlider();
createDateWheel();