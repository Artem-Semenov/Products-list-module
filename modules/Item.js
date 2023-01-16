class Item {
  constructor(data) {
    // console.log(data);
    this.title = data.title;
    this.brand = data.brand;
    this.category = data.category;
    this.id = data.id;
    this.image = data.images[0];
    this.description = data.description;
    this.price = data.price;
    this.rating = data.rating;
  }
  html;
  DB_NAME = "shopIDB";
  DB_VERSION = 1;
  result = null;
  DOM = async () => {
    // let element = document.createElement('div')
    let html = `
    <div class="products__item" id='${this.id}'>
              <div class="item__img">
                <img
                  src="${this.image}"
                  alt="${this.title}"
                  width = '450'
                  height ='300'
                />
              </div>
              <div class="item__description">
                <h3 class="item__title">${this.title}</h3>
                <div class="item__brand-category">
                  <div>brand: ${this.brand}</div>
                  <div>Category: ${this.category}</div>
                </div>
                <div class="item__price-rating">
                  <div>Price: ${this.price}</div>
                  <div>Rating: ${this.rating}</div>
                </div>
                <div class="item__text">
                  ${this.description}
                </div>
              </div>
            </div>
            `;

    this.html = html;
  };

  Reload = async () => {
    await fetch(`https://dummyjson.com/products/${this.id}`)
      .then((data) => data.json())
      .then((data) => {
        this.title = data.title;
        this.brand = data.brand;
        this.category = data.category;
        this.id = data.id;
        this.image = data.images[0];
        this.description = data.description;
        this.price = data.price;
        this.rating = data.rating;
        this.DOM();
      });

    return this.html;
  };

  Get = async () => {
    this.request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    this.request.onerror = (e) => {
      console.log("error:", e);
    };
    this.request.onsuccess = (e) => {
      this.db = e.target.result;
      this.transaction = this.db.transaction("products");
      this.objectStore = this.transaction.objectStore("products");
      this.getRequest = this.objectStore.get(this.id);
      this.getRequest.onerror = (e) => {
        console.log("error:", e);
      };
      this.getRequest.onsuccess = () => {
        this.result = this.getRequest.result;
        console.log(this.result);
        // return this.result;
      };
    };
  };
}

export default Item;
