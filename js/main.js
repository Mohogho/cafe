  document.addEventListener("DOMContentLoaded", function () {
    const categoryLinks = document.querySelectorAll(".cat a");
    const categoryDivs = document.querySelectorAll(".cat > div > div");
    const products = document.querySelectorAll(".product a[data-category]");
    const searchInput = document.querySelector("#searchInput");
    const suggestionsBox = document.querySelector("#suggestions");
    const noResult = document.getElementById("noResult");

    // نمایش پیش‌فرض فقط محصولات دسته coffee
    function showCategory(category) {
      products.forEach((product) => {
        product.style.display =
          product.dataset.category === category ? "flex" : "none";
      });
      categoryDivs.forEach((div) => div.classList.remove("active"));
      categoryDivs.forEach((div) => {
        if (div.querySelector("a").dataset.cat === category) {
          div.classList.add("active");
        }
      });
      noResult.style.display = "none";
      suggestionsBox.innerHTML = "";
      searchInput.value = "";
    }

    showCategory("coffee");

    categoryLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        showCategory(this.dataset.cat);
      });
    });

    const getSuggestions = (text) => {
      const filter = text.toLowerCase();
      let results = [];
      products.forEach((product) => {
        const name = product.querySelector("p").textContent.toLowerCase();
        if (name.includes(filter)) {
          results.push(name);
        }
      });
      return [...new Set(results)];
    };

    searchInput.addEventListener("input", function () {
      const value = this.value.trim().toLowerCase();
      suggestionsBox.innerHTML = "";

      if (value === "") return;

      const matches = getSuggestions(value);
      matches.forEach((name) => {
        const div = document.createElement("div");
        div.textContent = name;
        div.addEventListener("click", () => {
          filterProducts(name);
          suggestionsBox.innerHTML = "";
          searchInput.value = "";
        });
        suggestionsBox.appendChild(div);
      });
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = this.value.trim().toLowerCase();
        filterProducts(value);
        suggestionsBox.innerHTML = "";
        this.value = "";
      }
    });

    function filterProducts(text) {
      text = text.trim().toLowerCase();

      if (text === "") {
        products.forEach((product) => {
          product.style.display = "none";
        });
        noResult.style.display = "flex"; // یا "block" بسته به CSS
        return;
      }

      let found = false;
      products.forEach((product) => {
        const name = product.querySelector("p").textContent.toLowerCase();
        if (name.includes(text)) {
          product.style.display = "inline-block";
          found = true;
        } else {
          product.style.display = "none";
        }
      });

      noResult.style.display = found ? "none" : "flex";
      categoryDivs.forEach((div) => div.classList.remove("active"));
    }

// جلوگیری از اسکرول کردن صفحه اصلی وقتی داخل suggestion اسکرول می‌کنیم (مخصوص موبایل)
suggestionsBox.addEventListener('touchstart', function (e) {
  if (this.scrollHeight > this.clientHeight) {
    // ثبت موقعیت اولیه اسکرول
    this.startY = e.touches[0].pageY;
    this.startScrollTop = this.scrollTop;
  }
}, { passive: false });

suggestionsBox.addEventListener('touchmove', function (e) {
  if (this.scrollHeight > this.clientHeight) {
    const currentY = e.touches[0].pageY;
    const diff = currentY - this.startY;

    // وقتی به انتهای بالا یا پایین رسیده‌ایم، اجازه نده صفحه اصلی اسکرول شود
    if (
      (this.scrollTop === 0 && diff > 0) || // در بالاترین نقطه و اسکرول به پایین (کشیدن صفحه به پایین)
      (this.scrollTop + this.clientHeight >= this.scrollHeight && diff < 0) // در پایین‌ترین نقطه و اسکرول به بالا (کشیدن صفحه به بالا)
    ) {
      e.preventDefault(); // جلوگیری از اسکرول صفحه اصلی
    }
  }
}, { passive: false });




  });
