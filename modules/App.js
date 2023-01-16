import ItemList from "/modules/ItemList.js";
// import Item from '/modules/Item.js'

class ShopApp {
  constructor() {
    console.log("created");
  }
  callbackFn;
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  loadMore = document.getElementById("load-more");
  preloader = document.querySelector(".preloader");
  itemList;

  InitApp = async () => {
    let result = null;
    this.itemList = new ItemList("items-wrapper");
    await this.openIndexedDB(() => console.log("IDB ready to work"));

    await this.addEventListeners();

    console.log("finish initing");
  };

  addEventListeners = async () => {
    this.loadMore.addEventListener("click", (e) => {
      if (this.itemList.productsList.length >= 20) {
        alert("Finish!");
      } else {
        this.itemList.renderProducts();
      }
    });
    console.log("started");
  };

  openIndexedDB = async (callBackFn) => {
    this.callBackFn = callBackFn;
    this.request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

    this.request.onerror = (e) => {
      console.log("error with opening database: ", e);
    };

    this.request.onupgradeneeded = (e) => {
      this.db = e.target.result;
      console.log("onUpgradeNeeded: ", this.db, e);
      if (!this.db.objectStoreNames.contains("products")) {
        this.objectStore = this.db.createObjectStore("products", {
          keyPath: "id",
        });
      }
    };

    this.request.onsuccess = async (e) => {
      this.db = await e.target.result;
      console.log("on success: ", e);
      // await this.checkforProducts();

      this.callBackFn();
      return 1;
    };
  };

  checkforProducts = async () => {
    this.transaction = this.db.transaction("products");
    this.objectStore = this.transaction.objectStore("products");
    this.getRequest = this.objectStore.getAll();
    this.getRequest.onerror = (e) => {
      console.log(e);
    };
    this.getRequest.onsuccess = async () => {
      if (this.getRequest.result.length < 1) {
        console.log(
          "товаров в базе нет - запрашиваем товары из базы и добавляем в IndexedDB"
        );
        await fetch("https://dummyjson.com/products?skip=0&limit=20")
          .then((data) => data.json())
          .then((data) => {
            this.transaction = this.db.transaction("products", "readwrite");
            this.objectStore = this.transaction.objectStore("products");
            data.products.forEach((el) => {
              this.addRequest = this.objectStore.add(el);
            });
          });
        console.log(
          "товары в IndexedDB - инициализируем обертку для товаров, рендерим первые 2 товара и выключаем прелоадер"
        );

        await itemList.renderProducts();

        this.preloader.classList.add("off");
      } else {
        console.log("товары в базе есть -");

        await this.itemList.renderProducts();
        this.preloader.classList.add("off");
      }
    };
  };
}

const shop = new ShopApp();

shop.InitApp().then((result) => {
  shop.itemList.productsList[0];
});

// export default ShopApp
