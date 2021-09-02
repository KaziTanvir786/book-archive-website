const searchResult = document.getElementById('search-results');
const noResultMessage = document.getElementById('no-result-message');
const resultMessage = document.getElementById('result-message');
const emptyTextMessage = document.getElementById('empty-text-message');
const errorMessage = document.getElementById('error-message');
const searchField = document.getElementById('search-field');
const spinner = document.getElementById('spinner');

const clearFields = () => {
    searchResult.textContent = '';
    noResultMessage.style.display = "none";
    resultMessage.style.display = "none";
    emptyTextMessage.style.display = "none";
    errorMessage.style.display = "none";
    searchField.value = '';
}

const toggleSpinner = displayMode => {
    spinner.style.display = displayMode;
}

const loadBook = async () => {
    // getting the search text
    const searchText = searchField.value;

    //resetting the search box
    clearFields();

    if (searchText.length === 0) {
        emptyTextMessage.innerHTML = `
            <h6 class="text-center">Please write something to search! </h6>
        `;
        emptyTextMessage.style.display = "block";
    }
    else {
        //resetting the search box
        clearFields();

        try {
            toggleSpinner("block");
            //fetching data
            const url = `http://openlibrary.org/search.json?q=${searchText}`;

            const res = await fetch(url);
            const data = await res.json();
            displaySearchResults(data.docs);
        }
        catch (error) {
            //resetting the search box
            clearFields();

            toggleSpinner("none");
            errorMessage.innerHTML = `
                <h6 class="text-center">Something went wrong! Please try again later.</h6>
            `;
            errorMessage.style.display = "block"
        }
    }

}

const displaySearchResults = books => {
    if (books.length === 0) {
        noResultMessage.innerHTML = `
            <h6 class="text-center">Sorry! No result has been found!</h6>
        `;
        noResultMessage.style.display = "block";
    }
    else {
        resultMessage.innerHTML = `
            <h6 class="text-center"> Total ${books.length} results have been found.</h6>
        `;
        resultMessage.style.display = "block";
        books.forEach(book => {
            let authorName = '';
            let publisherName = '';
            let firstPublishYear = '';
            let coverUrl = '';

            if (book.author_name === undefined) {
                authorName = 'No author found'
            }
            else {
                book.author_name.forEach(name => {
                    authorName = `${authorName} &#8226 ${name} <br>`;
                })
            }

            if (book.publisher === undefined) {
                publisherName = 'No publisher found'
            }
            else {
                book.publisher.forEach(name => {
                    publisherName = `${publisherName} &#8226 ${name} <br>`;
                })
            }

            if (book.first_publish_year === undefined) {
                firstPublishYear = 'Not found'
            }
            else {
                firstPublishYear = book.first_publish_year;
            }
            // console.log(book.title, authorName, publisherName, firstPublishYear);

            if (book.cover_i === undefined) {
                coverUrl = 'img/book.jpg';
            }
            else {
                coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            }

            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
            <div class="card h-100 shadow-sm">
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
            searchResult.appendChild(div);
            toggleSpinner("none");

        });
    }


}