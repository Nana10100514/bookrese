const books = {
  "1": {
    title: "四畳半神話大系",
    author: "森見登美彦",
    image: "book-01.jpg",
    color: "cover-indigo",
    purchase: "9月6日",
    reserved: "9月6日"
  },

  "2": {
    title: "夜は短し恋せよ乙女",
    author: "森見登美彦",
    image: "book-02.jpg",
    color: "cover-red",
    purchase: "8月23日",
    reserved: "9月6日"
  },

  "3": {
    title: "推し、燃ゆ",
    author: "宇佐見りん",
    image: "book-03.jpg",
    color: "cover-blue",
    purchase: "8月9日",
    reserved: "8月23日"
  },

  "4": {
    title: "コンビニ人間",
    author: "村田沙耶香",
    image: "book-04.jpg",
    color: "cover-cream",
    purchase: "7月26日",
    reserved: "8月9日"
  }
};

const params =
  new URLSearchParams(
    window.location.search
  );

const requestedId =
  params.get("book") || "1";

const id =
  books[requestedId]
    ? requestedId
    : "1";

const book = books[id];

document.title =
  `${book.title}の購入情報｜本屋にも、次回予約を。`;

document.querySelector(
  "#detailTitle"
).textContent =
  `『${book.title}』`;

document.querySelector(
  "#detailAuthor"
).textContent =
  book.author;

document.querySelector(
  "#purchaseDate"
).textContent =
  book.purchase;

document.querySelector(
  "#bookedDate"
).textContent =
  book.reserved;

document.querySelector(
  "#detailFallback"
).textContent =
  book.title;

document.querySelector(
  "#detailCover"
).className =
  `detail-cover ${book.color}`;

const bookNumber =
  String(Number(id)).padStart(
    2,
    "0"
  );

document.querySelector(
  "#bookIndex"
).textContent =
  `${bookNumber} / 04`;

document.querySelector(
  "#coverNumber"
).textContent =
  String(Number(bookNumber));

const nextId =
  String(
    (Number(id) % 4) + 1
  );

const otherBook =
  document.querySelector(
    "#otherBook"
  );

otherBook.href =
  `./book-detail.htm?book=${nextId}`;

document.querySelector(
  "#otherBookTitle"
).textContent =
  books[nextId].title;

const image =
  document.querySelector(
    "#detailImage"
  );

image.src =
  `./assets/books/${book.image}`;

image.alt =
  `『${book.title}』の表紙`;

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