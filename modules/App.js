// import { ItemList } from "/modules/ItemList.js";
import { ItemList } from "https://artem-semenov.github.io/Products-list-module/modules/ItemList.js";
class ShopApp {
  constructor() {}
  callBackFn;
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  preloader = document.querySelector(".preloader");
  itemList;

  InitApp = async () => {
    this.itemList = new ItemList("items-wrapper");
    this.itemList.next = document.getElementById("next-btn");
    this.itemList.prev = document.getElementById("prev-btn");
    this.openIndexedDB(this.checkIDBforProducts);
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
        await this.itemList.Init(2);
        console.log(
          "товары в IndexedDB - рендерим первые 2 товара и выключаем прелоадер"
        );

        this.preloader.classList.add("off");
      } else {
        console.log(
          `товары уже есть в IndexedDB - 
обновляем информацию о них,
рендерим первые 2 товара и выключаем прелоадер`
        );
        await this.itemList.Init(2);
        this.preloader.classList.add("off");
      }
    };
  };
}

const shop = new ShopApp();

shop.InitApp();

console.log(shop);

function askNotificationPermission() {
  Notification.requestPermission(function (permission) {
    // If the user accepts, let's create a notification
    if (permission === "granted") {
      worker.port.postMessage({ name: "notification" });
    }
  });
}
/* 
let btn = document.getElementById("notification");

btn.addEventListener("click", askNotificationPermission); */

addEventListener("DOMContentLoaded", askNotificationPermission);

let worker = new SharedWorker(
  "https://artem-semenov.github.io/Products-list-module/modules/Worker.js"
);
worker.port.start();
