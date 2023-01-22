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

  Init = async (pageSize = 2) => {
    this.pageSize = pageSize;
    await fetch("https://dummyjson.com/products")
      .then((data) => data.json())
      .then(async (data) => {
        console.log(data);
        for await (let product of data.products) {
          await this.addEl(product);
        }
      });

    // console.log(this.productsList.slice(0, this.pageSize));
    this.productsList.slice(0, this.pageSize).forEach((el) => {
      this.element.append(el.element);
    });
  };

  addEl = async (data) => {
    let item = new Item(data);
    await item.Reload();
    this.productsList.push(item);
  };

  RemoveEl = async (id) => {};
  ReloadEl = async (id) => {};

  Next = async () => {
    console.log("next");
  };
  Prev = async () => {
    console.log("prev");
  };
}

export default ItemList;
