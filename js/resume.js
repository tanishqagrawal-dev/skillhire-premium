
function analyzeResume() {
  document.getElementById("resumeScore").innerText = "78 / 100";
  document.getElementById("atsScore").innerText = "82%";

  const skills = ["React.js", "Git", "API Integration"];
  const courses = [
    "React Basics - Coursera",
    "Git & GitHub - FreeCodeCamp",
    "REST APIs - Udemy"
  ];

  let skillList = document.getElementById("skills");
  let courseList = document.getElementById("courses");

  skillList.innerHTML = "";
  courseList.innerHTML = "";

  skills.forEach(skill => {
    let li = document.createElement("li");
    li.textContent = skill;
    skillList.appendChild(li);
  });

  courses.forEach(course => {
    let li = document.createElement("li");
    li.textContent = course;
    courseList.appendChild(li);
  });
}
