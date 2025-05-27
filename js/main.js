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
let visibleCourses = 5 

// Skeleton loader HTML
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
        <div class="course-card-item" data-category="${course?.category.toLowerCase()}">
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

// Fetch courses from API
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
    const container = document.getElementById("coursesContainer")
    const showMoreBtn = document.querySelector(".show-more-btn")

    let filteredCourses = allCourses
    if (category !== "all") {
        filteredCourses = allCourses.filter((course) =>
            course?.category === category
        )
    }

    if (filteredCourses.length === 0) {
        container.innerHTML = `
            <div class="loading-message">
                <h3 class="section-title no-course">Курсы не найдены</h3>
            </div>
        `
        showMoreBtn.style.display = "none"
        return
    }

    if (category !== currentCategory) {
        visibleCourses = 5
        currentCategory = category
    }

    const coursesToShow = filteredCourses.slice(0, visibleCourses)
    container.innerHTML = coursesToShow.map((course) => createCourseCard(course)).join("")

    if (filteredCourses.length <= visibleCourses) {
        showMoreBtn.style.display = "none"
    } else {
        showMoreBtn.style.display = "flex"
    }
}

// Show More button
function showMoreCourses() {
    visibleCourses += 5
    renderCourses(currentCategory)
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
    loadCourses()
    document.querySelector(".show-more-btn button").addEventListener("click", showMoreCourses)
})

