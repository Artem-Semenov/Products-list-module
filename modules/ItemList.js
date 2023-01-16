// import shop from '/modules/App.js'
import Item from "/modules/Item.js";
class ItemList {
  constructor(id) {
    this.element = document.getElementById(id);
  }
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  productsList = [];
  renderedProducstAmount = 0;

  /*  renderProducts = async () => {
    this.openIDB = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    this.openIDB.onerror = (e) => {
      console.log("error:", e);
    };
    this.openIDB.onsuccess =  (e) => {
      this.db = e.target.result;
      this.transaction =  this.db.transaction("products");
      this.objectStore = this.transaction.objectStore("products");
      this.getRequest = this.objectStore.openCursor(IDBKeyRange.bound(
      this.productsList.length, this.productsList.length + 2, true, false));
      this.getRequest.onerror = () => {
        console.log("error:", e);
      };
      this.getRequest.onsuccess = () => {
        if(this.getRequest.result) {
          let result = this.getRequest.result.value;
          let item =  new Item(result);
          let obj = {};
          obj[result.id] = item;
          this.productsList.push(obj);
          // console.log(item);
          // console.log(this.productsList);
          item.Reload().then((result) => {
            this.element.insertAdjacentHTML("beforeend", result);
           
          });
          this.getRequest.result.continue();
        }
      };
    };
  }
 */

  Init = async (pageSize = 2) => {
    this.request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    this.request.onerror = (e) => {
      console.log("error:", e);
    };
    this.request.onsuccess = (e) => {
      this.db = e.target.result;
      this.transaction = this.db.transaction("products");
      this.objectStore = this.transaction.objectStore("products");
      this.getRequest = this.objectStore.openCursor(
        IDBKeyRange.bound(0, 2, true, false)
      );
      this.getRequest.onerror = () => {
        console.log("error:", e);
      };
      this.getRequest.onsuccess = async () => {
        if (this.getRequest.result) {
          // console.log(this.getRequest.result.value);
          // console.log(this.productsList);
          // console.log(this.productsList[this.getRequest.result.value.id]);
          this.productsList[this.getRequest.result.value.id - 1].Reload();
          this.element.insertAdjacentHTML(
            "beforeend",
            this.productsList[this.getRequest.result.value.id - 1].html
          );
          this.renderedProducstAmount += 1;
          this.getRequest.result.continue();
        } else {
          console.log(this.productsList);
          // console.log('ничего нет(((');
          ////////////////////////////
        }
      };
    };
  };

  addEl = async (data) => {
    let item = new Item(data);
    // console.log(item);
    await item.DOM();
    this.productsList.push(item);
  };
  loadMore() {
    this.openIDB = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    this.openIDB.onerror = (e) => {
      console.log("error:", e);
    };
    this.openIDB.onsuccess = (e) => {
      this.db = e.target.result;
      this.transaction = this.db.transaction("products");
      this.objectStore = this.transaction.objectStore("products");
      this.getRequest = this.objectStore.openCursor(
        IDBKeyRange.bound(
          this.renderedProducstAmount,
          this.renderedProducstAmount + 2,
          true,
          false
        )
      );
      this.getRequest.onsuccess = () => {
        if (this.getRequest.result) {
          console.log(this.getRequest.result.value.id);
          this.productsList[this.getRequest.result.value.id - 1].Reload();
          this.element.insertAdjacentHTML(
            "beforeend",
            this.productsList[this.getRequest.result.value.id - 1].html
          );
          console.log();

          this.renderedProducstAmount += 1;
          this.getRequest.result.continue();
        } else {
          //////////////////////////////
        }
      };
    };
  }
}

export default ItemList;
