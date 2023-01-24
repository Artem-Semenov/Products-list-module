export class Item {
  constructor() {}
  DB_NAME = "shopIDB";
  DB_VERSION = 1;

  Get = async () => {
    return fetch(`https://dummyjson.com/products/${this.id}`)
      .then((data) => data.json())
      .then((data) => data)
      .catch((error) => console.log(error));
  };

  DOM = async (data = this) => {
    this.title = data.title;
    this.brand = data.brand;
    this.category = data.category;
    this.id = data.id;
    this.image = data.image || data.images[0];
    this.description = data.description;
    this.price = data.price;
    this.rating = data.rating;
    let element = document.createElement("div");
    let html = `
              <div class="item__img">
                <img
                loading="lazy"
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
            `;
    element.innerHTML = html;
    element.classList.add("products__item");
    element.setAttribute("id", this.id);
    element.addEventListener('click', () => {
      console.log(`clicked on product ${this.id}`);
    })
    this.element = element;
    return this.element;
  };

  Create = async () => {
    this.request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    this.request.onerror = (e) => {
      console.log("error:", e);
    };
    this.request.onsuccess = (e) => {
      this.db = e.target.result;
      this.transaction = this.db.transaction("products", "readwrite");
      this.objectStore = this.transaction.objectStore("products");
      let item = {};
      item.title = this.title;
      item.brand = this.brand;
      item.category = this.category;
      item.id = this.id;
      item.image = this.image;
      item.description = this.description;
      item.price = this.price;
      item.rating = this.rating;
      this.putRequest = this.objectStore.put(item);
      this.putRequest.onerror = (e) => {
        console.log("error:", e);
      };
      this.putRequest.onsuccess = () => {
        // console.log("item succesfully added to IDB");
      };
    };
  };

  Reload = async () => {
    let data = await this.Get();
    await this.DOM(data);
    this.Create();
    return this;
  };
}

