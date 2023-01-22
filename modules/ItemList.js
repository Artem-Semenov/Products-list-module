// import shop from '/modules/App.js'
import Item from "/modules/Item.js";
class ItemList {
  constructor(id) {
    this.element = document.getElementById(id);
  }
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  productsList = [];
  renderedProducstIDs = [];

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
      this.renderedProducstIDs.push(el);
      console.log(this.renderedProducstIDs);
      this.element.append(el.element);
    });
  };

  addEl = async (data) => {
    let item = new Item(data);
    await item.Reload();
    this.productsList.push(item);
  };

  RemoveEl = async (id) => {
    document.getElementById(id)?.remove();
  };
  ReloadEl = async (id) => {};

  Next = async () => {
    console.log(this.renderedProducstIDs);

    if (
      this.renderedProducstIDs[1].id >=
      this.productsList.length - this.pageSize
    ) {
      console.log("111");
      this.next.disabled = true;
    }

    for await (const product of this.renderedProducstIDs) {
      console.log(product.id);
      await this.RemoveEl(product.id);
    }

    for await (const product of this.productsList.slice(
      this.renderedProducstIDs[this.pageSize-1].id,
      this.renderedProducstIDs[this.pageSize-1].id + this.pageSize
    )) {
      console.log(product);
      await product.Reload();
      this.renderedProducstIDs.push(product);
      this.element.append(product.element);
    }

    console.log(this.renderedProducstIDs);

    this.renderedProducstIDs.splice(0, this.pageSize);

    if (this.renderedProducstIDs[0].id >= this.pageSize) {
      this.prev.disabled = false;
    }
    console.log(this.renderedProducstIDs);
  };
  Prev = async () => {
   
    if (
      this.renderedProducstIDs[1].id <=
      this.productsList.length - this.pageSize
    ) {
      this.next.disabled = false;
    };

    for await (const product of this.renderedProducstIDs) {
      console.log(product.id);
      await this.RemoveEl(product.id);
    }

    for await (const product of this.productsList.slice(
      this.renderedProducstIDs[0].id - this.pageSize - 1,
      this.renderedProducstIDs[0].id - 1
    )) {
      console.log(product);
      await product.Reload();
      this.renderedProducstIDs.push(product);
      this.element.append(product.element);
    }

    console.log(this.renderedProducstIDs);

    this.renderedProducstIDs.splice(0, this.pageSize);
    if (this.renderedProducstIDs[1].id <= 2) {
      this.prev.disabled = true;
    }
    console.log(this.renderedProducstIDs);
  };
}

export default ItemList;
