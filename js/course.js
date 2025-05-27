document.addEventListener("DOMContentLoaded", function () {
    const loader = document.querySelector(".loader-box")
    const html = document.documentElement
    const body = document.body

    const originalOverflow = html.style.overflow || ""
    html.style.overflow = "hidden"

    setTimeout(() => {
        loader.style.display = "none"
        html.style.overflow = originalOverflow
    }, 2000)
})

// menu icon
document.querySelector(".menu-button").addEventListener("click", function () {
    document.querySelector(".nav-mobile").classList.toggle("active")
    this.classList.toggle("active")
})

// course catalog
const tabs = document.querySelectorAll(".category-tab")
const courses = document.querySelectorAll(".courses")
const mobileCategoriesSelect = document.getElementById(
    "mobile-categories-select"
)

function activateCategory(categoryId) {
    tabs.forEach((t) => t.classList.remove("active"))
    courses.forEach((c) => c.classList.remove("active"))

    const targetTab = document.querySelector(
        `.category-tab[data-category="${categoryId}"]`
    )
    if (targetTab) {
        targetTab.classList.add("active")
    }

    const targetCourses = document.getElementById(categoryId)
    if (targetCourses) {
        targetCourses.classList.add("active")
    }

    if (mobileCategoriesSelect) {
        mobileCategoriesSelect.value = categoryId
    }
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        activateCategory(tab.dataset.category)
    })
})

if (mobileCategoriesSelect) {
    mobileCategoriesSelect.addEventListener("change", (event) => {
        activateCategory(event.target.value)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const activeTab = document.querySelector(".category-tab.active")
    if (activeTab && mobileCategoriesSelect) {
        mobileCategoriesSelect.value = activeTab.dataset.category
    } else if (mobileCategoriesSelect) {
        activateCategory(mobileCategoriesSelect.value)
    }
})

// course card
const BASE_URL = "https://6835984acd78db2058c2556c.mockapi.io"
let allCourses = []
let currentCategory = "all"
let visibleCourses = 6

let filterState = {
    price: {
        min: 24000,
        max: 100000,
        isFree: false,
        isPaid: false,
    },
    schools: {
        Skillbox: false,
        Geekbrains: false,
        IMBA: false,
        LoftSchool: false,
        ConvertMonster: false,
    },
    levels: {
        Начальный: false,
        Средний: false,
        Профессиональный: false,
        "Для детей": false,
    },
    duration: {
        min: 3,
        max: 12,
    },
    features: {
        internship: false,
        certificate: false,
    },
}

function initializeFilterUI() {
    // price range
    const priceRange = document.querySelector(
        '.range-price input[type="range"]'
    )
    priceRange.addEventListener("input", function () {
        filterState.price.max = parseInt(this.value)
        document.querySelector(
            ".range-price-number div:last-child p"
        ).textContent = this.value
        applyFilters()
    })

    // free/paid checkboxes
    document
        .getElementById("free-courses")
        .addEventListener("change", function () {
            filterState.price.isFree = this.checked
            if (this.checked) {
                document.getElementById("paid-courses").checked = false
                filterState.price.isPaid = false
            }
            applyFilters()
        })

    document
        .getElementById("paid-courses")
        .addEventListener("change", function () {
            filterState.price.isPaid = this.checked
            if (this.checked) {
                document.getElementById("free-courses").checked = false
                filterState.price.isFree = false
            }
            applyFilters()
        })

    // school checkboxes
    const schoolCheckboxes = document.querySelectorAll(
        '.main-filter-action-box:nth-child(2) input[type="checkbox"]'
    )
    schoolCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            filterState.schools[this.id] = this.checked
            applyFilters()
        })
    })

    // level checkboxes
    const levelCheckboxes = document.querySelectorAll(
        '.main-filter-action-box:nth-child(3) input[type="checkbox"]'
    )
    levelCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            filterState.levels[this.id] = this.checked
            applyFilters()
        })
    })

    // duration range
    const durationRange = document.querySelector(
        '.main-filter-action-box:nth-child(4) input[type="range"]'
    )
    durationRange.addEventListener("input", function () {
        filterState.duration.max = parseInt(this.value)
        document.querySelector(
            ".main-filter-action-box:nth-child(4) .range-price-number div:last-child p"
        ).textContent = this.value
        applyFilters()
    })

    // feature checkboxes
    document
        .getElementById("стажировки")
        .addEventListener("change", function () {
            filterState.features.internship = this.checked
            applyFilters()
        })

    document
        .getElementById("сертификат")
        .addEventListener("change", function () {
            filterState.features.certificate = this.checked
            applyFilters()
        })

    // reset filters
    document
        .querySelector(".recycle-icon")
        .addEventListener("click", resetFilters)

    // toggle filter
    document
        .querySelector(".filter-button")
        .addEventListener("click", function () {
            document.querySelector(
                ".course-card-container-box-filter"
            ).style.left = "0"
        })

    document
        .querySelector(".course-card-container-box-filter .fa-close")
        .addEventListener("click", function () {
            document.querySelector(
                ".course-card-container-box-filter"
            ).style.left = "-100%"
        })
}

// reset all filters
function resetFilters() {
    filterState = {
        price: {
            min: 0,
            max: 100000,
            isFree: false,
            isPaid: false,
        },
        schools: {
            Skillbox: false,
            Geekbrains: false,
            IMBA: false,
            LoftSchool: false,
            ConvertMonster: false,
        },
        levels: {
            Начальный: false,
            Средний: false,
            Профессиональный: false,
            "Для детей": false,
        },
        duration: {
            min: 0,
            max: 12,
        },
        features: {
            internship: false,
            certificate: false,
        },
    }

    document.querySelector(".range-price input").value = 100000
    document.querySelector(".range-price-number div:last-child p").textContent =
        "100000"
    document.getElementById("free-courses").checked = false
    document.getElementById("paid-courses").checked = false

    const schoolCheckboxes = document.querySelectorAll(
        '.main-filter-action-box:nth-child(2) input[type="checkbox"]'
    )
    schoolCheckboxes.forEach((checkbox) => (checkbox.checked = false))

    const levelCheckboxes = document.querySelectorAll(
        '.main-filter-action-box:nth-child(3) input[type="checkbox"]'
    )
    levelCheckboxes.forEach((checkbox) => (checkbox.checked = false))

    document.querySelector(
        '.main-filter-action-box:nth-child(4) input[type="range"]'
    ).value = 12
    document.querySelector(
        ".main-filter-action-box:nth-child(4) .range-price-number div:last-child p"
    ).textContent = "12"

    document.getElementById("стажировки").checked = false
    document.getElementById("сертификат").checked = false

    applyFilters()
}

// apply filters
function applyFilters() {
    let filteredCourses = allCourses.filter((course) => {
        // price filter
        if (filterState.price.isFree && course.price !== 0) return false
        if (filterState.price.isPaid && course.price === 0) return false
        if (course.price > filterState.price.max) return false

        // school filter
        const selectedSchools = Object.keys(filterState.schools).filter(
            (school) => filterState.schools[school]
        )
        if (
            selectedSchools.length > 0 &&
            !selectedSchools.includes(course.school)
        )
            return false

        // level filter
        const selectedLevels = Object.keys(filterState.levels).filter(
            (level) => filterState.levels[level]
        )
        if (selectedLevels.length > 0 && !selectedLevels.includes(course.level))
            return false

        // duration filter
        if (course.duration > filterState.duration.max) return false

        // features filter
        if (filterState.features.internship && !course.intern) return false
        if (filterState.features.certificate && !course.certificate)
            return false

        return true
    })

    // apply category filter
    if (currentCategory !== "all") {
        filteredCourses = filteredCourses.filter(
            (course) => course.category === currentCategory
        )
    }

    renderFilteredCourses(filteredCourses)
}

// render filtered courses
function renderFilteredCourses(filteredCourses) {
    const container = document.getElementById("coursesContainer")
    const showMoreBtn = document.querySelector(".show-more-btn")

    if (filteredCourses.length === 0) {
        container.innerHTML = `
            <div class="loading-message">
                <h3 class="section-title no-course">Курсы не найдены</h3>
            </div>
        `
        showMoreBtn.style.display = "none"
        return
    }

    const coursesToShow = filteredCourses.slice(0, visibleCourses)
    container.innerHTML = coursesToShow
        .map((course) => createCourseCard(course))
        .join("")

    if (filteredCourses.length <= visibleCourses) {
        showMoreBtn.style.display = "none"
    } else {
        showMoreBtn.style.display = "flex"
    }

    // update course count
    document.querySelector(
        ".course-card-container-top h1"
    ).textContent = `Найдено ${filteredCourses.length} курсов`
}

// skeleton loader
function createSkeletonCard() {
    return `
        <div class="skeleton-card">
        </div>
    `
}

// skeleton loader
function showSkeletonLoader() {
    const container = document.getElementById("coursesContainer")
    container.innerHTML = ""
    for (let i = 0; i < 6; i++) {
        container.innerHTML += createSkeletonCard()
    }
}

// create course card HTML
function createCourseCard(course) {
    return `
        <div class="course-card-item" data-aos="fade-up" data-category="${
            course?.category
        }">
            <div class="card-item-title">
                <h1>${course?.title}</h1>
            </div>

            <div class="card-mobile-column">
                <div class="card-mobile">
                    <div class="card-item-school">
                        <h1>${course?.school}</h1>
                        <div>
                            <i class="fa fa-star"></i>
                            <h3>${course?.rate}</h3>
                        </div>
                        <p>Отзывы о школе ${course?.comment}</p>
                    </div>

                    <div class="card-item-price">
                        <p>${course?.oldPrice.toLocaleString()} руб</p>
                        <h1>${course?.price.toLocaleString()} <span>руб</span></h1>
                        <p>от ${Math.round(
                            course?.price / course?.duration / 4
                        )?.toLocaleString()} руб./месяц</p>
                    </div>
                </div>

                <div class="card-mobile">
                    <div class="card-item-date">
                        <i class="fa-regular fa-clock"></i>
                        <p>В любое <br> время</p>
                    </div>

                    <div class="card-item-info">
                        <div>
                            <i class="fa-regular fa-calendar"></i>
                            <p>${course?.duration} месяца</p>
                        </div>

                        <div>
                            <i class='bx bx-signal-5'></i>
                            <p>${course?.level}</p>
                        </div>

                        ${
                            course?.intern
                                ? `
                                <div>
                                    <i class="fa-solid fa-briefcase"></i>
                                    <p>Стажировка</p>
                                </div>
                            `
                                : ""
                        }

                        ${
                            course?.certificate
                                ? `
                                <div>
                                    <i class="fa-regular fa-note-sticky"></i>
                                    <p>Диплом</p>
                                </div>
                            `
                                : ""
                        }
                    </div>
                </div>
            </div>

            <div class="card-item-action">
                <button class="btn btn-primary">На сайт курса</button>
                <button class="btn btn-solid">Подробнее</button>

                <p onclick="addToComparison('${course?.id}')">
                    <i class="fa-solid fa-shuffle"></i>
                    Добавить к сравнению
                </p>
            </div>
        </div>
    `
}

// fetch courses from API
async function loadCourses() {
    showSkeletonLoader()

    try {
        const response = await fetch(`${BASE_URL}/courses`)
        const courses = await response.json()
        allCourses = courses

        setTimeout(() => {
            renderCourses(currentCategory)
        }, 800)
    } catch (error) {
        console.error(error)
    }
}

function renderCourses(category = "all") {
    currentCategory = category
    applyFilters()
}

// show More button
function showMoreCourses() {
    visibleCourses += 6
    applyFilters()
}

// category tab clicks
function initializeCategoryTabs() {
    const tabs = document.querySelectorAll(".course-category-tab")

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            tabs.forEach((t) => t.classList.remove("course-active"))

            this.classList.add("course-active")

            const category = this.getAttribute("data-category")
            currentCategory = category

            showSkeletonLoader()

            setTimeout(() => {
                renderCourses(category)
            }, 300)
        })
    })
}

document.addEventListener("DOMContentLoaded", function () {
    initializeCategoryTabs()
    initializeFilterUI()
    loadCourses()
    document
        .querySelector(".show-more-btn button")
        .addEventListener("click", showMoreCourses)
})
