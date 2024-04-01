<template>
  <div id="app" style="height: 100%; width: 100%">
    <!-- The div below is for navigation. The top part of the website -->
    <div class="navigation">
      <img src="Images/athlon.png" width="100" height="50" alt="" />
      <p style="color: aliceblue; margin-left: 2%">Ahtisham's Courses</p>
      <button
        v-on:click="showCheckout"
        v-if="cartItemCount > 0"
        style="cursor: pointer"
      >
        <span>{{ cartItemCount }}</span>
        <span class="fas fa-cart-plus"></span>
      </button>
      <button v-else>
        <span class="fas fa-cart-plus"></span>
      </button>
    </div>
    <!-- The div below is for the content of the website that is below the navigation. This div is further divided in 2 divs -->
    <div class="content">
      <!-- The div below is the first div of the content div and it is for the left side of the website -->
      <div class="left" style="padding: 2%">
        <input v-model="search" placeholder="Search" />
        <p><strong>Sort By:</strong></p>
        <p>
          <input type="radio" id="title" value="Title" v-model="sort" />
          <label for="title">Title</label>
        </p>
        <p>
          <input type="radio" id="location" value="Location" v-model="sort" />
          <label for="location">Location</label>
        </p>
        <p>
          <input type="radio" id="price" value="Price" v-model="sort" />
          <label for="price">Price</label>
        </p>
        <p>
          <input
            type="radio"
            id="availability"
            value="Availability"
            v-model="sort"
          />
          <label for="availability">Availability</label>
        </p>
        <p><strong>Price Order:</strong></p>
        <p>
          <input
            type="radio"
            id="ascending"
            value="Ascending"
            v-model="sortOrder"
          />
          <label for="ascending">Ascending</label>
        </p>
        <p>
          <input
            type="radio"
            id="descending"
            value="Descending"
            v-model="sortOrder"
          />
          <label for="descending">Descending</label>
        </p>
      </div>
      <!-- The div below is the first div of the content div and it is for the right side of the website -->
      <div class="right" style="padding: 2%">
        <!-- The main tag below is where all the content of the right side div be. Which includes 2 divs. The first one
                    is for displaying the order confirmation if the order is confirmed and the other one for displaying
                    the products and the cart.  -->
        <main>
          <div v-if="showProduct">
            <product-list
              :products="sortedProducts"
              @addProduct="addToCart"
              :cart="cartProducts"
              :fullCart="cartItemCount"
              :cartArray="cart"
              v-if="showProduct && search == ''"
            ></product-list>
            <product-list
              :products="searchedProducts"
              @addProduct="addToCart"
              :cart="cartProducts"
              :fullCart="cartItemCount"
              :cartArray="cart"
              v-if="showProduct && search != ''"
            ></product-list>
          </div>
          <checkout
            :cart="cartProducts"
            :fullCart="cartItemCount"
            :cartArray="cart"
            :orderedChoice="ordered"
            @removeSingle="removeOne"
            @removeFull="removeAll"
            @orderedState="orderedState"
            @showCheckout="showCheckout"
            @emptyCart="emptyCart"
            v-else
          ></checkout>
        </main>
      </div>
    </div>
  </div>
</template>
<script>

import productList from "./components/products.vue";
import checkout from "./components/orders.vue";

export default {
  name: "App",
  components: {
    productList,
    checkout,
  },
  data() {
    return {
      sitename: "Ahtisham's Classes",
      products: [],
      showProduct: true,
      cart: [],
      sort: "",
      sortOrder: "Ascending",
      search: "",
      ordered: false,
    };
  },
  created: function () {
    fetch("http://localhost:3000/collection/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(products)
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        // console.log(responseJSON);
        this.products = responseJSON;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    addToCart: function (product) {
      this.cart.push(product.id);
    },
    showCheckout() {
      this.showProduct = this.showProduct ? false : true;
    },
    /* eslint-disable */
    removeOne(id) {
      let counter = 0;
      function removing(product) {
        if (product !== id) {
          return product;
        } else {
          if (counter === 0) {
          } else {
            return product;
          }
          counter = counter + 1;
        }
      }
      this.cart = this.cart.filter(removing);
    },
    // The method below is to remove all the spaces of a single product
    removeAll(id) {
      function removing(product) {
        if (product !== id) {
          return product;
        }
      }
      this.cart = this.cart.filter(removing);
    },
    orderedState() {
      this.ordered = this.ordered ? false : true;
    },
    emptyCart() {
      this.cart.splice(0, this.cart.length);
    },
  },
  computed: {
    cartItemCount: function () {
      return this.cart.length || "";
    },
    cartProducts() {
      const allProducts = (product) => {
        return this.cart.includes(product.id);
      };
      return this.products.filter(allProducts);
    },
    // The method below is to sort the products
    sortedProducts() {
      let sortCart = this.cart;
      function compareTitle(a, b) {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
      }
      function compareLocation(a, b) {
        if (a.Location > b.Location) return 1;
        if (a.Location < b.Location) return -1;
        return 0;
      }
      function comparePrice(a, b) {
        if (a.price > b.price) return 1;
        if (a.price < b.price) return -1;
        return 0;
      }
      function cartCount(id) {
        let count = 0;
        for (let i = 0; i < sortCart.length; i++) {
          if (sortCart[i] === id) {
            count++;
          }
        }
        return count;
      }
      function compareAvailability(a, b) {
        console.log(a.availableInventory - cartCount(a.id));
        if (
          a.availableInventory - cartCount(a.id) >
          b.availableInventory - cartCount(b.id)
        )
          return 1;
        if (
          a.availableInventory - cartCount(a.id) <
          b.availableInventory - cartCount(b.id)
        )
          return -1;
        return 0;
      }
      switch (true) {
        case this.sort === "Title" && this.sortOrder === "Ascending":
          return this.products.sort(compareTitle);
          break;
        case this.sort === "Title" && this.sortOrder === "Descending":
          return this.products.sort(compareTitle).reverse();
          break;
        case this.sort === "Location" && this.sortOrder === "Ascending":
          return this.products.sort(compareLocation);
          break;
        case this.sort === "Location" && this.sortOrder === "Descending":
          return this.products.sort(compareLocation).reverse();
          break;
        case this.sort === "Price" && this.sortOrder === "Ascending":
          return this.products.sort(comparePrice);
          break;
        case this.sort === "Price" && this.sortOrder === "Descending":
          return this.products.sort(comparePrice).reverse();
          break;
        case this.sort === "Availability" && this.sortOrder === "Ascending":
          return this.products.sort(compareAvailability);
          break;
        case this.sort === "Availability" && this.sortOrder === "Descending":
          return this.products.sort(compareAvailability).reverse();
          break;
        default:
          return this.products;
          break;
      }
    },
    searchedProducts() {
      fetch("http://localhost:3000/products/" + this.search, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(products)
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          console.log(responseJSON);
        })
        .catch((error) => {
          console.log(error);
        });
      const search = (product) => {
        return (
          product.title.toLowerCase().includes(this.search.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.search.toLowerCase()) ||
          product.Location.toLowerCase().includes(this.search.toLowerCase())
        );
      };
      return this.products.filter(search);
    },
  },
};
</script>
<style>
html,
body {
  height: 100%;
  margin: 0%;
}

.navigation {
  height: 5%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: rgb(54, 69, 79);
}
.content {
  height: 100%;
  width: 100%;
  display: flex;
}
.left {
  height: 100%;
  width: 15%;
  background-color: rgb(229, 228, 226);
  overflow: auto;
}
.right {
  height: 100%;
  width: 85%;
  background-color: rgb(211, 211, 211);
  overflow: auto;
}
</style>
