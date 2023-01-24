import ItemList from "/modules/ItemList.js";

class ShopApp {
  constructor() {}
  callbackFn;
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  preloader = document.querySelector(".preloader");
  itemList;

  InitApp = async () => {
    this.itemList = new ItemList("items-wrapper");
    this.itemList.next = document.getElementById("next-btn");
    this.itemList.prev = document.getElementById("prev-btn");
    await this.openIndexedDB(this.checkIDBforProducts);
    this.addEventListeners();
  };

  addEventListeners = () => {
    this.itemList.prev.addEventListener("click", this.itemList.Prev);
    this.itemList.next.addEventListener("click", this.itemList.Next);
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
      this.db = e.target.result;
      // console.log("on success: ", e);
      // this.checkIDBforProducts();

      await this.callBackFn();
    };
  };

  checkIDBforProducts = async () => {
    this.transaction = this.db.transaction("products");
    this.objectStore = this.transaction.objectStore("products");
    this.getRequest = this.objectStore.getAll();
    this.getRequest.onerror = (e) => {
      console.log(e);
    };
    this.getRequest.onsuccess = async () => {
      if (this.getRequest.result.length < 1) {
        console.log(
          "товаров в indexedDB нет - запрашиваем товары из базы и добавляем в IndexedDB"
        );
        this.itemList.Init();

        console.log(this.itemList.productsList);

        console.log(
          "товары в IndexedDB - рендерим первые 2 товара и выключаем прелоадер"
        );

        this.preloader.classList.add("off");
      } else {
        // console.log(`товары в IndexedDB есть -
        // добавляем их в контейнер -
        // выключаем прелоадер, переходим к рендеру`);
        this.itemList.Init(2);

        this.preloader.classList.add("off");
      }
    };
  };
}

const shop = new ShopApp();

shop.InitApp();
