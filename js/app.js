// getting html components
const searchResult = document.getElementById('search-results');
const noResultMessage = document.getElementById('no-result-message');
const resultMessage = document.getElementById('result-message');
const emptyTextMessage = document.getElementById('empty-text-message');
const errorMessage = document.getElementById('error-message');
const searchField = document.getElementById('search-field');
const spinner = document.getElementById('spinner');

//function for clear all fields
const clearFields = () => {
    searchResult.textContent = '';
    noResultMessage.style.display = "none";
    resultMessage.style.display = "none";
    emptyTextMessage.style.display = "none";
    errorMessage.style.display = "none";
    searchField.value = '';
}

//function for show or hide the spinner
const toggleSpinner = displayMode => {
    spinner.style.display = displayMode;
}

//function for loading the data
const loadBook = async () => {
    // getting the search text
    const searchText = searchField.value;

    //resetting the search box
    clearFields();

    //checcking whether the search field is empty or not
    if (searchText.length === 0) {
        //if empty, show warning message
        emptyTextMessage.style.display = "block";
    }
    //otherwise load data
    else {
        //resetting the search box
        clearFields();

        //trying to load data from api
        try {
            //showing spinner
            toggleSpinner("block");

            //fetching data
            const url = `http://openlibrary.org/search.json?q=${searchText}`;
            const res = await fetch(url);
            const data = await res.json();
            displaySearchResults(data.docs);
        }
        //if error occurs, showing error message
        catch (error) {
            //resetting the search box
            clearFields();

            //hiding spinner
            toggleSpinner("none");

            //showing error message
            errorMessage.style.display = "block"
        }
    }
}

//function for displaying results on UI
const displaySearchResults = books => {
    //checking whether any search result found or not
    if (books.length === 0) {
        //if no result found, showing message
        noResultMessage.style.display = "block";
    }
    else {
        //if found, showing the number of results found
        resultMessage.innerHTML = `
            <h6 class="text-center"> Total ${books.length} results have been found.</h6>
        `;
        resultMessage.style.display = "block";
        //looping the array to access each results individually
        books.forEach(book => {
            let authorName = '';
            let publisherName = '';
            let firstPublishYear = '';
            let coverUrl = '';

            //checking whether author name is present or not
            if (book.author_name === undefined) {
                authorName = 'No author found'
            }
            else {
                book.author_name.forEach(name => {
                    authorName = `${authorName} &#8226 ${name} <br>`;
                })
            }

            //checking whether publisher present or not
            if (book.publisher === undefined) {
                publisherName = 'No publisher found'
            }
            else {
                book.publisher.forEach(name => {
                    publisherName = `${publisherName} &#8226 ${name} <br>`;
                })
            }

            //checking whether first publish year is present or not
            if (book.first_publish_year === undefined) {
                firstPublishYear = 'Not found'
            }
            else {
                firstPublishYear = book.first_publish_year;
            }

            //checking whether book cover id is present or not
            if (book.cover_i === undefined) {
                coverUrl = 'img/book.jpg';
            }
            else {
                coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            }

            //creating the card element
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
            <div class="card h-100 shadow-lg">
                <img src=${coverUrl} class="card-img-top w-75 mx-auto mt-5" alt="Book image">
                <div class="card-body">
                    <h5 class="card-title text-success">${book.title} <hr> </h5>
                    <p class="card-text">
                        <strong>Author(s):</strong> <br>
                        ${authorName} <br>
                        <strong>Publisher(s):</strong> <br>
                        ${publisherName} <br>
                        <strong>First Publish Year:</strong> <br>
                        ${firstPublishYear} <br>
                    </p>
                </div>
            </div>
            `;
            //appending to the search result container
            searchResult.appendChild(div);

            //hiding the spinner
            toggleSpinner("none");
        });
    }
}