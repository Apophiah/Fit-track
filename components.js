document.addEventListener("DOMContentLoaded", () => {
  const styles = `
    <style>
      .navbar-nav .nav-link:hover {
        color: #0d6efd !important; /* Bootstrap primary blue */
      }
    </style>
  `;
  document.head.insertAdjacentHTML("beforeend", styles);

  const resetSpacing = `
  <style>
    body, html {
      margin: 0;
      padding: 0;
    }
  </style>
`;
  document.head.insertAdjacentHTML("beforeend", resetSpacing);

  const navbar = `
    <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top px-4 py-2">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="index.html">
          <img src="fit.png" alt="FitTrack Logo" width="55" height="55" class="me-2 rounded-circle shadow-sm">
          <span class="text-primary">FitTrack</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-center position-relative" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="dashboard.html">Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="workouts.html">Workouts</a></li>
            <li class="nav-item"><a class="nav-link" href="nutrition.html">Nutrition</a></li>
            <li class="nav-item"><a class="nav-link" href="progress.html">Progress</a></li>
            <li class="nav-item"><a class="nav-link" href="community.html">Community</a></li>
            <li class="nav-item"><a class="nav-link" href="profile.html">Profile</a></li>
          </ul>
          <button id="toggleDarkMode" class="btn btn-outline-dark btn-sm position-absolute end-0 me-3">🌙</button>
        </div>
      </div>
    </nav>`;

  const footer = `
    <footer class="text-center py-3 bg-light border-top mt-5">
      <small class="text-muted">&copy; 2025 FitTrack. All rights reserved | Built by Appo</small>
    </footer>`;

  document.body.insertAdjacentHTML("afterbegin", navbar);
  document.body.insertAdjacentHTML("beforeend", footer);

  // Dark mode toggle
  const darkToggle = document.getElementById("toggleDarkMode");
  const prefersDark = localStorage.getItem("fittrack_dark") === "true";

  if (prefersDark) {
    document.body.classList.add("bg-dark", "text-light");
    document.querySelector("footer").classList.replace("bg-light", "bg-dark");
    document.querySelector("footer small").classList.remove("text-muted");
    document.querySelector("footer small").classList.add("text-white");
  }

  darkToggle?.addEventListener("click", () => {
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-light");
    const footer = document.querySelector("footer");
    footer.classList.toggle("bg-dark");
    footer.classList.toggle("bg-light");

    const footerText = footer.querySelector("small");
    footerText.classList.toggle("text-muted");
    footerText.classList.toggle("text-white");

    localStorage.setItem(
      "fittrack_dark",
      document.body.classList.contains("bg-dark")
    );
  });
});
