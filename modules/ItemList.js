import Item from '/modules/Item.js'

class ItemList {
  constructor(id) {
    this.element = document.getElementById(id);
  }
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  productsList = [];

  renderProducts = async () => {
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

  loadMore() {
    this.renderedAmount = this.productsList.length;
    this.openIDB = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    this.openIDB.onerror = (e) => {
      console.log("error:", e);
    };
    this.openIDB.onsuccess = (e) => {
      this.db = e.target.result;
      this.transaction = this.db.transaction("products");
      this.objectStore = this.transaction.objectStore("products");
      this.getRequest = this.objectStore.openCursor(IDBKeyRange.bound(
      this.productsList.length, this.productsList.length + 2, true, false));
      this.getRequest.onsuccess = () => {
        if (this.getRequest.result) {
          console.log(this.getRequest.result);
        this.getRequest.result.continue();
        }
      };
    };
  }
}


export default ItemList