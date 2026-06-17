const cl = console.log;

const title = document.getElementById("title");
const image = document.getElementById("url");
const summary = document.getElementById("Description");
const rating = document.getElementById("rating");
const movieForm = document.getElementById("movieForm");
const movieContainer = document.getElementById("movieContainer");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const spinner = document.getElementById("spinner");
cl(spinner);

let movieArr = [];

const BaseURL = "https://6a2876274e1e783349a58ab5.mockapi.io/api/v1";

function setMovieRating(rating) {
if (rating >= 8) {
return "bg-success";
} else if (rating >= 6) {
return "bg-warning";
} else {
return "bg-danger";
}
}

function fetchMovies() {
let xhr = new XMLHttpRequest();
xhr.open("GET",`${BaseURL}/Movies`);
xhr.send();
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        movieArr = JSON.parse(xhr.response);
        createMovies(movieArr.reverse());
    }
};
}
fetchMovies();
function createMovies(arr) {
let result = '';
arr.forEach(movie => {
    result += `
    <div class="col-md-6 mt-5" id="${movie.id}">
        <div class="card h-100 shadow">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5>${movie.name}</h5>
                <span class="badge text-white ${setMovieRating(movie.rating)}">
                    ${movie.rating}
                </span>
            </div>
            <div class="card-body">
                <img src="${movie.image ? movie.image : 'https://via.placeholder.com/300x400'}"
                class="img-fluid rounded mb-3 w-100"
                style="height:300px;object-fit:cover;">
                <p>
                ${movie.summary
                    ? movie.summary.slice(0,100) + "..."
                    : "No description available"}
                </p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary btn-sm"
                onclick="onEdit(this)">
                Edit
                </button>
                <button class="btn btn-danger btn-sm"
                onclick="onRemove(this)">
                Delete
                </button>
            </div>
        </div>
    </div>`;
});
movieContainer.innerHTML = result;
}

function onCreate(eve) {
eve.preventDefault();
spinner.classList.remove('d-none');
let newObj = {
    name: title.value,
    image: image.value,
    summary: summary.value,
    rating: +rating.value
};
let xhr = new XMLHttpRequest();
xhr.open("POST", `${BaseURL}/Movies`);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify(newObj));
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        let response = JSON.parse(xhr.response);
        let div = document.createElement("div");
        div.className = "col-md-6 mt-5";
        div.id = response.id;
        div.innerHTML = `
        <div class="card h-100 shadow">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5>${response.name}</h5>
                <span class="badge text-white ${setMovieRating(response.rating)}">
                    ${response.rating}
                </span>
            </div>
            <div class="card-body">
                <img src="${response.image}"
                class="img-fluid rounded mb-3 w-100"
                style="height:300px;object-fit:cover;">
                <p>
                ${response.summary
                    ? response.summary.slice(0,100) + "..."
                    : "No description available"}
                </p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary btn-sm"
                onclick="onEdit(this)">
                Edit
                </button>
                <button class="btn btn-danger btn-sm"
                onclick="onRemove(this)">
                Delete
                </button>
            </div>
        </div>`;
        movieContainer.prepend(div);
        Swal.fire({
            title: "Movie Added Successfully",
            icon: "success"
        });
        spinner.classList.add('d-none');
        movieForm.reset();
    }
};
}
movieForm.addEventListener("submit", onCreate);

function onEdit(ele) {
spinner.classList.remove('d-none');
let editId = ele.closest('.col-md-6').id;
localStorage.setItem('editId', editId);
let xhr = new XMLHttpRequest();
xhr.open("GET", `${BaseURL}/Movies/${editId}`);
xhr.send();
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        let editObj = JSON.parse(xhr.response);
        title.value = editObj.name;
        image.value = editObj.image;
        summary.value = editObj.summary;
        rating.value = editObj.rating;
        addBtn.classList.add('d-none');
        updateBtn.classList.remove('d-none');
        spinner.classList.add('d-none');
    }
};
}

function onUpdate(eve) {
eve.preventDefault();
spinner.classList.remove('d-none');
let updateId = localStorage.getItem('editId');
let updateObj = {
    name: title.value,
    image: image.value,
    summary: summary.value,
    rating: +rating.value
};
let xhr = new XMLHttpRequest();
xhr.open("PUT", `${BaseURL}/Movies/${updateId}`);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify(updateObj));
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        let div = document.getElementById(updateId);
        div.querySelector(".card-header h5").innerText =
        updateObj.name;
        div.querySelector(".card-body img").src = updateObj.image;      
        div.querySelector(".card-body p").innerText =  updateObj.summary;      
        let badge = div.querySelector(".card-header span");
        badge.innerText = updateObj.rating;
        badge.className = `badge text-white ${setMovieRating(updateObj.rating)}`;       
        addBtn.classList.remove('d-none');
        updateBtn.classList.add('d-none');
        movieForm.reset();
        localStorage.removeItem('editId');
        spinner.classList.add('d-none');
        Swal.fire({
            title: "Movie Updated Successfully",
            icon: "success"
        });
    }
};
}

updateBtn.addEventListener("click", onUpdate);

function onRemove(ele) {
 spinner.classList.remove('d-none');
let removeId = ele.closest('.col-md-6').id;
let xhr = new XMLHttpRequest();
xhr.open("DELETE", `${BaseURL}/Movies/${removeId}`);
xhr.send();
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        ele.closest('.col-md-6').remove();
        Swal.fire({
            title: "Movie Deleted Successfully",
            icon: "success"
        });
  spinner.classList.add('d-none');

    }
};
}
