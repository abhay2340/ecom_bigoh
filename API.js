class API {
  //Private api url
  #baseURL = "https://fakestoreapi.com/products/";

  async get() {
    let response = await fetch(this.#baseURL);
    console.log(this.#baseURL.slice());
    let items = await response.json();

    console.log(items);
    return items;
  }

  async limitedGet(limit) {
    let api = this.#baseURL.slice(0, -1) + `?limit=${limit}`;
    console.log(api);
    let response = await fetch(api);
    let items = await response.json();
    console.log(items);
    return items;
  }

  async searchByCategory(category) {
    let response = await fetch(`${this.#baseURL}?category=${category}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let items = await response.json();
    console.log(items);
    return items;
  }



  //Post method to post data based on the object pas
  async post(postObject) {
    let res = await fetch(this.#baseURL, {
      method: "POST",
      body: JSON.stringify(postObject),
    });
    let resData = await res.json();
    // console.log("OK " + res.ok);
    // console.log("Status Code" + res.status);
    console.log(resData);
    return resData;
  }
}

let api = new API();

export default api;
