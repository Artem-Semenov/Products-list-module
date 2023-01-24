import Item from "/modules/Item.js";

class ItemList {
  constructor(id) {
    this.element = document.getElementById(id);
  }
  preloader = document.querySelector(".preloader");
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  productsList = [];
  renderedProducts = [];

  Init = async (pageSize = 2) => {
    this.pageSize = pageSize;
    await fetch("https://dummyjson.com/products?limit=30&skip=0")
      .then((data) => data.json())
      .then(async (data) => {
        console.log(data);
        for (let product of data.products) {
          await this.addEl(product);
        }
      });

    this.productsList.slice(0, this.pageSize).forEach((el) => {
      this.renderedProducts.push(el);
      // console.log(this.renderedProducts);
      el.element.innerHTML = el.html;
      this.element.append(el.element);
    });
  };

  addEl = async (data) => {
    let item = new Item();
    await item.DOM(data);
    this.productsList.push(item);
  };

  RemoveEl = async (id) => {
    document.getElementById(id)?.remove();
  };
  ReloadEl = async (id) => {
    document.getElementById(id)?.Reload();
  };

  Next = async () => {
    // console.log(this.renderedProducts);

    if (
      this.renderedProducts[this.pageSize - 1].id >=
      this.productsList.length - this.pageSize
    ) {
      // console.log("111");
      this.next.disabled = true;
    }

    for (const product of this.renderedProducts) {
      // console.log(product.id);
      await this.RemoveEl(product.id);
    }

    for (const product of this.productsList.slice(
      this.renderedProducts[this.pageSize - 1].id,
      this.renderedProducts[this.pageSize - 1].id + this.pageSize
    )) {
      // console.log(product);
      this.preloader.classList.remove("off");
      await product.Reload();
      this.renderedProducts.push(product);
      product.element.innerHTML = product.html;
      this.element.append(product.element);
      this.preloader.classList.add("off");
    }

    // console.log(this.renderedProducts);

    this.renderedProducts.splice(0, this.pageSize);

    if (this.renderedProducts[0].id >= this.pageSize) {
      this.prev.disabled = false;
    }
    // console.log(this.renderedProducts);
  };
  Prev = async () => {
    if (
      this.renderedProducts[this.pageSize - 1].id <=
      this.productsList.length - this.pageSize
    ) {
      this.next.disabled = false;
    }

    for (const product of this.renderedProducts) {
      // console.log(product.id);
      await this.RemoveEl(product.id);
    }

    for (const product of this.productsList.slice(
      this.renderedProducts[0].id - this.pageSize - 1,
      this.renderedProducts[0].id - 1
    )) {
      // console.log(product);
      this.preloader.classList.remove("off");
      await product.Reload();
      this.renderedProducts.push(product);
      product.element.innerHTML = product.html;
      this.element.append(product.element);
      this.preloader.classList.add("off");
    }

    // console.log(this.renderedProducts);

    this.renderedProducts.splice(0, this.pageSize);
    if (this.renderedProducts[1].id <= 2) {
      this.prev.disabled = true;
    }
    // console.log(this.renderedProducts);
  };
}

export default ItemList;
