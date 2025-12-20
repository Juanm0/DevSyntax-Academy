import { Link } from "react-router-dom";
import "./CourseCard.css";

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <img
        src={course.thumbnail_url || "https://via.placeholder.com/400x200"}
        alt={course.title}
      />

      <div className="course-card-body">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <span className="price">$35.000</span>
      </div>
    </Link>
  );
}
