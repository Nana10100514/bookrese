const bookData = {
  "イン・ザ・メガチャーチ": {
    author: "朝井リョウ",
    image: "reserve-01.jpg",
    color: "cover-indigo"
  },

  "熟柿": {
    author: "佐藤正午",
    image: "reserve-02.jpg",
    color: "cover-red"
  },

  "PRIZE―プライズ―": {
    author: "村山由佳",
    image: "reserve-03.jpg",
    color: "cover-blue"
  },

  "カフネ": {
    author: "阿部暁子",
    image: "reserve-04.jpg",
    color: "cover-cream"
  }
};

const params =
  new URLSearchParams(
    window.location.search
  );

const visitDate =
  document.querySelector(
    "#visitDate"
  );

const bookChoice =
  document.querySelector(
    "#bookChoice"
  );

const bookingCover =
  document.querySelector(
    "#bookingCover"
  );

const bookingCoverWrap =
  document.querySelector(
    "#bookingCoverWrap"
  );

const reservationLogo =
  document.querySelector(
    "#reservationLogo"
  );

const reservationLogoFallback =
  document.querySelector(
    "#reservationLogoFallback"
  );

const weekdays = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土"
];

function setupReservationLogo() {
  if (!reservationLogo) {
    return;
  }

  const showFallback = () => {
    reservationLogo.hidden = true;

    if (reservationLogoFallback) {
      reservationLogoFallback.hidden =
        false;
    }
  };

  reservationLogo.addEventListener(
    "error",
    showFallback
  );

  if (
    reservationLogo.complete &&
    reservationLogo.naturalWidth === 0
  ) {
    showFallback();
  }
}

const today = new Date();

function localKey(date) {
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

const suggested =
  new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 14
  );

const incomingDate =
  params.get("date");

visitDate.min =
  localKey(today);

const incomingDateIsValid =
  /^\d{4}-\d{2}-\d{2}$/.test(
    incomingDate || ""
  ) &&
  incomingDate >= visitDate.min;

visitDate.value =
  incomingDateIsValid
    ? incomingDate
    : localKey(suggested);

function formatDate(value) {
  const dateParts =
    value.split("-").map(Number);

  const year =
    dateParts[0];

  const month =
    dateParts[1];

  const day =
    dateParts[2];

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  const week =
    weekdays[date.getDay()];

  return (
    `${year}年` +
    `${month}月` +
    `${day}日` +
    `（${week}）`
  );
}

function updateBook() {
  const title =
    bookChoice.value;

  const book =
    bookData[title];

  document.querySelector(
    "#bookingTitle"
  ).textContent =
    `『${title}』`;

  document.querySelector(
    "#bookingAuthor"
  ).textContent =
    book.author;

  document.querySelector(
    "#bookingFallback"
  ).textContent =
    title;

  bookingCoverWrap.className =
    `booking-book-cover ${book.color}`;

  bookingCover.hidden = false;

  bookingCover.src =
    `./assets/books/${book.image}`;

  bookingCover.alt =
    `『${title}』の表紙`;
}

bookingCover.addEventListener(
  "error",
  () => {
    bookingCover.hidden = true;
  }
);

bookChoice.addEventListener(
  "change",
  updateBook
);

document.querySelector(
  "#reservationForm"
).addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    if (!visitDate.reportValidity()) {
      return;
    }

    const reservation = {
      date: visitDate.value,
      book: bookChoice.value
    };

    try {
      localStorage.setItem(
        "bookstoreNextVisit",
        JSON.stringify(reservation)
      );
    } catch (error) {
      console.log(
        "予約情報を保存できませんでした。"
      );
    }

    document.querySelector(
      "#reservationForm"
    ).hidden = true;

    document.querySelector(
      "#confirmationText"
    ).innerHTML =
      `${formatDate(reservation.date)}に、<br>` +
      `花山書店で<br>` +
      `『${reservation.book}』に会いましょう。`;

    document.querySelector(
      "#confirmation"
    ).hidden = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);

setupReservationLogo();
updateBook();