import ShopApp from '/modules/App.js'
import ItemList from '/modules/ItemList.js'
import Item from '/modules/Item.js'

const shop = new ShopApp();
const itemList = new ItemList("items-wrapper");

shop.openIndexedDB(() => {
  console.log("IDB ready to work");
  
});

document.getElementById("load-more").addEventListener("click", function (e) {
  if (itemList.productsList.length === 20) {
    alert("Finish!");
  } else {
    itemList.renderProducts();
  }
});


/* setTimeout(() => {
  console.log(document.getElementById('1').outerHTML)
}, 100) */


/* document.onclick = (e) => {
  console.log(e.target);
} */


document.addEventListener('click', function(e) {
  if (e.target.closest('[id]') && e.target.closest('[id]').classList.contains('products__item')) {
    console.log(`You clicked on ${e.target.closest('[id]').id} item`);
  }
})


async function test () {
  try {
  let result = await itemList.productsList[0][1].Get();
  console.log(result);
  } catch (error) {
    console.log(error)
  }
}
test()



export default itemList