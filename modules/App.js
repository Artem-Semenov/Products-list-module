import Item from "/modules/Item.js";
import ItemList from "/modules/ItemList.js";
// import Item from '/modules/Item.js'

class ShopApp {
  constructor() {}
  callbackFn;
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  loadMore = document.getElementById("load-more");
  preloader = document.querySelector(".preloader");
  itemList;

  InitApp = async () => {
    let result = null;
    this.itemList = new ItemList("items-wrapper");
    await this.openIndexedDB(this.checkIDBforProducts);
    await this.addEventListeners();
    this.itemList.Init();
  };

  addEventListeners = () => {
    this.loadMore.addEventListener("click", (e) => {
      console.log(this.itemList.renderedProducstAmount);
      if (this.itemList.renderedProducstAmount >= 30) {
        alert("Finish!");
      } else {
        this.itemList.loadMore();
      }
    });
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
      console.log("on success: ", e);
      // this.checkIDBforProducts();

      await this.callBackFn();
    };
  };

  checkIDBforProducts = async () => {
    this.transaction = this.db.transaction("products");
    this.objectStore = this.transaction.objectStore("products");
    this.getRequest = await this.objectStore.getAll();
    this.getRequest.onerror = (e) => {
      console.log(e);
    };
    this.getRequest.onsuccess = async () => {
      if (this.getRequest.result.length < 1) {
        console.log(
          "товаров в indexedDB нет - запрашиваем товары из базы и добавляем в IndexedDB"
        );

     /*    await fetch("https://dummyjson.com/products")
          .then((data) => data.json())
          .then((data) => {
            this.transaction = this.db.transaction("products", "readwrite");
            this.objectStore = this.transaction.objectStore("products");
            data.products.forEach((el) => {
              this.itemList.addEl(el);
              this.addRequest = this.objectStore.add(el);
            });
          }); */
          
          await fetch("https://dummyjson.com/products")
          .then((data) => data.json())
          .then((data) => {
            data.products.forEach((el) => {
              this.itemList.addEl(el);
            });
          });
        console.log(this.itemList.productsList); 

        console.log(
          "товары в IndexedDB - рендерим первые 2 товара и выключаем прелоадер"
        );
        // console.log(this.itemList.productsList);

        // await this.itemList.renderProducts();
        ////////////////

        this.preloader.classList.add("off");
      } else {
        console.log(`товары в IndexedDB есть - 
        добавляем их в контейнер -
        выключаем прелоадер, переходим к рендеру`);

        this.getRequest.result.forEach(async (el) => {
          let item = new Item(el);
          await item.DOM();
          this.itemList.productsList.push(item);
        });

        this.preloader.classList.add("off");
      }
    };
  };
}

const shop = new ShopApp();

shop.InitApp();
console.log(shop);

//  export default shop
